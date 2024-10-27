import * as THREE from "three";
import { useState, useEffect, useRef } from 'react';
import { Canvas, extend, useLoader } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import Controls from './Controls';
import volumeFragment from './volume.glsl';
import textureViridis from './textures/cm_viridis.png';
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";

type Props = {
  data: { nrrdSrc: string };
};

const FullScreenMaterial = shaderMaterial(
  {
    align: 3, // 0: not align, 1: x, 2: y, 3: z
    cmdata: null,
    colorful: true,
    size: new THREE.Vector3(),
    slice: new THREE.Vector3(),
    clim: new THREE.Vector2(0.0, 1.0),
    projectionInverse: new THREE.Matrix4(),
    transformInverse: new THREE.Matrix4(),
    volumeTex: targetFloat().texture,
  },
  `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
  `,
  volumeFragment,
);
extend({ FullScreenMaterial });

export function targetFloat() {
  const texture = new THREE.Data3DTexture(new Uint8Array([0]), 1, 1, 1);
  texture.format = THREE.RedFormat;
  texture.type = THREE.UnsignedByteType;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;

  const render3DTarget = new THREE.WebGL3DRenderTarget(1, 1, 1);
  render3DTarget.texture = texture;
  return render3DTarget;
}

export default function NrrdRenderer({ data }) {
  const gl = {};
  gl.alpha = true;
  gl.antialias = true;
  gl.outputEncoding = THREE?.sRGBEncoding;

  const camera = {};
  camera.fov = 75;
  camera.far = 50;
  camera.near = 0.01;
  camera.up = [0, -1, 0];
  camera.position = [0, 0, -1.5];

  const style = {};
  style.backgroundColor = 'rgba(1, 1, 1, 0.3)';

  if (data?.nrrdSrc) {
    return (
      <Canvas frameloop="demand" camera={camera} gl={gl} style={style}>
        <Controls />
        <Volume nrrdSrc={data.nrrdSrc} />
      </Canvas>
    );
  }
  return null;
}

function getRender3DTarget(nrrdSrc) {
  const nrrd = useLoader(NRRDLoader, nrrdSrc);

  const { xLength: w, yLength: h, zLength: d } = nrrd;

  const volumeTex = new THREE.Data3DTexture(nrrd.data, w, h, d);
  volumeTex.format = THREE.RedFormat;
  volumeTex.type = THREE.UnsignedByteType;
  volumeTex.minFilter = THREE.NearestFilter;
  volumeTex.magFilter = THREE.NearestFilter;
  volumeTex.needsUpdate = true;

  const render3DTarget = new THREE.WebGL3DRenderTarget(w, h, d);
  render3DTarget.texture = volumeTex;

  return render3DTarget
}

function Volume({ nrrdSrc }) {
  const fullScreenMaterialRef = useRef();
  const [inverseBoundsMatrix, setInverseBoundsMatrix] = useState(null);

  useEffect(() => {
    process();

    async function process() {
      console.log('process volume & mask');

      const matrix = new THREE.Matrix4();
      const center = new THREE.Vector3();
      const quat = new THREE.Quaternion();
      const scaling = new THREE.Vector3();

      const volume = {};
      volume.target = getRender3DTarget(nrrdSrc);

      const { width: w, height: h, depth: d } = volume.target;
      const s = 1 / Math.max(w, h, d);

      const inverseBoundsMatrix = new THREE.Matrix4();
      scaling.set(w * s, h * s, d * s);
      matrix.compose(center, quat, scaling);
      inverseBoundsMatrix.copy(matrix).invert();
      setInverseBoundsMatrix(inverseBoundsMatrix);

      const cmtextures = await new THREE.TextureLoader().loadAsync(
        textureViridis,
      );
      fullScreenMaterialRef.current.size.set(w, h, d);
      fullScreenMaterialRef.current.cmdata = cmtextures;
      fullScreenMaterialRef.current.volumeTex = volume.target.texture;

      setTimeout(() => {
        invalidate();
      }, 500);
    }
  }, []);

  return (
    <mesh>
      <planeGeometry args={[2, 2, 1, 1]} />
      <fullScreenMaterial
        ref={fullScreenMaterialRef}
        clim={[0, 1]}
        colorful={true}
      />
    </mesh>
  );
}

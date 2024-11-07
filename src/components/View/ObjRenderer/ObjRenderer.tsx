import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Controls from "./Controls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

type Props = {
  data: { objs: { url: string }[] };
};

export default function ObjRenderer({ data }: Props) {
  // Initial camera configuration
  const cameraPosition = new THREE.Vector3(0, 0, -1.5);

  return (
    <Canvas
      frameloop="demand"
      camera={{ fov: 75, near: 0.01, far: 50, position: cameraPosition }}
      // style={{ backgroundColor: "rgba(1, 1, 1, 0.3)" }}
    >
      {/* OrbitControls to stabilize the camera */}
      <OrbitControls />
      <Controls />
      {data?.objs?.length > 0 && <Model objSrc={data.objs[0].url} />}
    </Canvas>
  );
}

function Model({ objSrc }: { objSrc: string }) {
  const obj = useLoader(OBJLoader, objSrc) as THREE.Group;

  // Center and scale the model based on its bounding box
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const scale = 1 / Math.max(size.x, size.y, size.z);

    obj.scale.set(scale, scale, scale);
    obj.position.sub(center.multiplyScalar(scale));

    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshNormalMaterial({
          side: THREE.DoubleSide,
        });
        (child as THREE.Mesh).geometry.computeVertexNormals();
      }
    });
  }, [obj]);

  return <primitive object={obj} />;
}

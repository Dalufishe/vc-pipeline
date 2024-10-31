import * as THREE from 'three';
import React from "react";
import { useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import Controls from './Controls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

type Props = {
  data: { objSrc: string };
};


export default function ObjRenderer({ data }) {
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

  console.log(data)

  if (data?.objs.length) {
    return (
      <Canvas frameloop="demand" camera={camera} gl={gl} style={style}>
        <Controls />
        <Model objSrc={data.objs[0].url} />
      </Canvas>
    );
  }
  return null;
}

function Model({ objSrc }) {
  const obj = useLoader(OBJLoader, objSrc);

  const box = new THREE.Box3().setFromObject(obj);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const scale = 1 / Math.max(size.x, size.y, size.z);

  obj.scale.set(scale, scale, scale);
  obj.position.sub(center.clone().multiplyScalar(scale));

  obj.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
      child.geometry.computeVertexNormals();
    }
  });

  return <primitive object={obj} />;
}


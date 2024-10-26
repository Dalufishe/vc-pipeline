import * as THREE from 'three';
import React from "react";
import { useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

type Props = {
  data: { objSrc: string };
};


export default function ObjRenderer({ data }) {
  if (data?.objSrc) {
    return (
      <Canvas>
        <OrbitControls makeDefault />
          <Model objSrc={data.objSrc} />
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

  obj.position.sub(center);
  obj.scale.set(scale, scale, scale);

  obj.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshNormalMaterial();
      child.geometry.computeVertexNormals();
    }
  });

  return <primitive object={obj} />;
}


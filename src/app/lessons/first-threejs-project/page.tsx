'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeJSBox = () => {
  const canvasRef = useRef();

  useEffect(() => {
    // [ Scene 공간, 하나의 인스턴스 ]
    const scene = new THREE.Scene();

    // [ Object 가장 기본적인 객체 ]
    // 모양
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 색상
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // [Sizes]
    const sizes = {
      width: 800,
      height: 600
    };

    // [ Camera ] 
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    // [ Renderer 출력 ]
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

    // 오일러 각 -> 쿼터니언
    // Clean up on unmount
    return () => {
      renderer.dispose();
      canvasRef.current = null || undefined;

    };
  }, []);

  return (
    <canvas ref={canvasRef as any} className="webgl"></canvas>
  );
};

export default ThreeJSBox;

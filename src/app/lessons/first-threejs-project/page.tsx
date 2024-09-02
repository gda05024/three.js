'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeJSBox = () => {
  const canvasRef = useRef();

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();

    // Object
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Sizes
    const sizes = {
      width: 800,
      height: 600
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);

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

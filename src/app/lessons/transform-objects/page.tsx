"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";

    // Scene
    const scene = new THREE.Scene();

    // Object

    const group = new THREE.Group();
    group.position.y = 1;
    group.scale.y = 2;
    group.rotation.y = 1;

    scene.add(group);

    const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
      })
    );
    group.add(cube1);

    const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      })
    );
    cube2.position.x = 2;
    group.add(cube2);

    const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x0000ff,
      })
    );
    cube3.position.x = -2;
    group.add(cube3);

    // // Position
    // // mesh.position.x = 1;
    // // mesh.position.y = -0.6;
    // // mesh.position.z = 1;
    // mesh.position.set(0.7, -0.6, 1);

    // // Scale
    // // mesh.scale.x = 2;
    // // mesh.scale.y = 0.5;
    // // mesh.scale.z = 0.5;
    // mesh.scale.set(2, 0.5, 0.5);

    // // Rotation, Quaternion
    // mesh.rotation.x = Math.PI * 0.25;
    // mesh.rotation.y = Math.PI * 0.25;
    // mesh.rotation.reorder("YXZ");

    const sizes = {
      width: 800,
      height: 600,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

    camera.position.z = 3;
    // camera.position.y = 0.5;
    // camera.position.x = 1;

    // camera.lookAt(mesh.position);

    scene.add(camera);

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
  }, []);

  return <canvas ref={el}></canvas>;
}

export default Page;

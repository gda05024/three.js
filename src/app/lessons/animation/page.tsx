"use client";
import gsap from "gsap";
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
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    const sizes = {
      width: 800,
      height: 600,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let requestId: number;

    // Animation
    // let time = Date.now();

    // Clock
    const clock = new THREE.Clock();

    // gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
    // gsap.to(mesh.position, { x: 0, duration: 1, delay: 2 });

    function tick() {
      // Clock
      const eslapsedTime = clock.getElapsedTime();

      // Time
      // const currentTime = Date.now();
      // const deltaTime = currentTime - time;
      // time = currentTime;

      // Update Objects
      // mesh.rotation.y += 0.002 * deltaTime;
      mesh.rotation.y = eslapsedTime * (Math.PI * 2);

      console.log("y", camera.position.y);
      camera.position.y = Math.sin(eslapsedTime);
      camera.position.x = Math.cos(eslapsedTime);

      // Render
      renderer.render(scene, camera);

      requestId = window.requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);

  return <canvas ref={el}></canvas>;
}

export default Page;

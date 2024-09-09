"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

    // const aspectRatio = sizes.width / sizes.height;
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspectRatio,
    //   1 * aspectRatio,
    //   1,
    //   -1,
    //   0.1,
    //   100
    // );
    // camera.position.x = 3;
    // camera.position.y = 3;
    camera.position.z = 3;
    camera.lookAt(mesh.position);

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

    const controls = new OrbitControls(camera, el!.current);
    controls.enableDamping = true;
    // if (el.current) {
    // }

    function tick() {
      controls.update();

      // Clock
      const eslapsedTime = clock.getElapsedTime();
      // mesh.rotation.y = eslapsedTime * (Math.PI * 2);

      // Time
      // const currentTime = Date.now();
      // const deltaTime = currentTime - time;
      // time = currentTime;

      // Update Objects
      // mesh.rotation.y += 0.002 * deltaTime;
      // mesh.rotation.y = eslapsedTime * (Math.PI * 2);
      // camera.position.y = Math.sin(eslapsedTime);
      // camera.position.x = Math.cos(eslapsedTime);

      // Camera
      // camera.position.x = cursor.x * 3;
      // camera.position.y = cursor.y * 3;
      // camera.lookAt(mesh.position);

      // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
      // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
      // camera.position.y = cursor.y * 3;
      camera.lookAt(mesh.position);

      // Controls

      // Render
      renderer.render(scene, camera);

      requestId = window.requestAnimationFrame(tick);
    }

    const cursor = {
      x: 0,
      y: 0,
    };

    window.addEventListener("mousemove", (event) => {
      cursor.x = event.clientX / sizes.width - 0.5;
      cursor.y = -(event.clientY / sizes.height - 0.5);
    });

    tick();

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, []);

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;

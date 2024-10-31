/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import GUI from "lil-gui";
import gsap from "gsap";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);
  const debugObject = useRef<any>({});

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";
    // Scene
    const scene = new THREE.Scene();

    /**
     * Object
     */
    debugObject.current.color = "#3a6ea6";

    const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
    const material = new THREE.MeshBasicMaterial({
      color: debugObject.current.color,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /**
     * Debug
     */
    const gui = new GUI({
      width: 300,
      title: "Awesome debug UI",
      closeFolders: true,
    });
    // gui.close();
    gui.hide();

    window.addEventListener("keydown", (e) => {
      if (e.key === "h") {
        gui.show(gui._hidden);
      }
    });
    const cubeTweaks = gui.addFolder("Awesome cube");
    cubeTweaks.close();

    cubeTweaks
      .add(mesh.position, "y")
      .min(-3)
      .max(3)
      .step(0.01)
      .name("elevation");

    cubeTweaks.add(mesh, "visible");

    cubeTweaks.add(material, "wireframe");

    cubeTweaks.addColor(debugObject.current, "color").onChange((value:any) => {
      material.color.set(value);
    });

    debugObject.current.spin = () => {
      gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
    };
    cubeTweaks.add(debugObject.current, "spin");

    debugObject.current.subdivision = 2;
    cubeTweaks
      .add(debugObject.current, "subdivision")
      .min(1)
      .max(20)
      .step(1)
      .onFinishChange(() => {
        mesh.geometry.dispose();
        const subdivision = debugObject.current.subdivision;
        mesh.geometry = new THREE.BoxGeometry(
          1,
          1,
          1,
          subdivision,
          subdivision,
          subdivision
        );
      });

    // gui
    //   .add(geometry, "widthSegments")
    //   .min(1)
    //   .max(10)
    //   .step(1)
    //   .name("widthSegments");

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, el.current);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let requestId = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      requestId = window.requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;

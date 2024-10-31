/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import colorSrc from "./assets/door/color.jpg";
import GUI from "lil-gui";
import { color } from "three/examples/jsm/nodes/Nodes.js";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";
      // Scene
      const scene = new THREE.Scene();

      const geometry = new THREE.BoxGeometry(1, 1, 1, 2);
      console.log(geometry.attributes.uv);
      //   const geometry = new THREE.SphereGeometry(1, 32, 32);
      //   const geometry = new THREE.TorusKnotGeometry(0.7, 0.2, 64, 16);

      const loadingManager = new THREE.LoadingManager();
      const textureLoader = new THREE.TextureLoader(loadingManager);
      const colorTexture = textureLoader.load(
        // new URL("./assets/checkerboard-1024x1024.png", import.meta.url).href
        new URL("./assets/minecraft.png", import.meta.url).href
        // new URL("./assets/door/color.jpg", import.meta.url).href
      );

      const gui = new GUI({
        width: 300,
        title: "Awesome debug UI",
        closeFolders: true,
      });

      colorTexture.colorSpace = THREE.SRGBColorSpace;

      gui.add(colorTexture.repeat, "x").min(1).max(10).step(1).name("repeat x");
      gui.add(colorTexture.repeat, "y").min(1).max(10).step(1).name("repeat y");

      gui
        .add(colorTexture.offset, "x")
        .min(0)
        .max(1)
        .step(0.01)
        .name("offset x");
      gui
        .add(colorTexture.offset, "y")
        .min(0)
        .max(1)
        .step(0.01)
        .name("offset y");

      gui
        .add(colorTexture, "rotation")
        .min(0)
        .max(2 * Math.PI)
        .step(0.01)
        .name("rotation");

      gui
        .add(colorTexture.center, "x")
        .min(0)
        .max(1)
        .step(0.1)

        .name("center x");
      gui
        .add(colorTexture.center, "y")
        .min(0)
        .max(1)
        .step(0.1)
        .name("center y");

      gui
        .add(colorTexture, "magFilter")
        .options({
          NearestFilter: THREE.NearestFilter,
          LinearFilter: THREE.LinearFilter,
        })
        .onChange(() => {
          colorTexture.needsUpdate = true;
        });
      colorTexture.minFilter = THREE.LinearMipmapLinearFilter;
      //   colorTexture.magFilter = THREE.NearestFilter;
      colorTexture.generateMipmaps = false;

      //   gui
      //     .add(colorTexture, "wrapS")
      //     .options({
      //       ClampToEdgeWrapping: THREE.ClampToEdgeWrapping,
      //       RepeatWrapping: THREE.RepeatWrapping,
      //       MirroredRepeatWrapping: THREE.MirroredRepeatWrapping,
      //     })
      //     .name("wrap s");

      colorTexture.wrapS = THREE.RepeatWrapping;
      colorTexture.wrapT = THREE.RepeatWrapping;

      const alphaTexture = textureLoader.load(
        new URL("./assets/door/alpha.jpg", import.meta.url).href
      );
      const heightTexture = textureLoader.load(
        new URL("./assets/door/height.jpg", import.meta.url).href
      );
      const normalTexture = textureLoader.load(
        new URL("./assets/door/normal.jpg", import.meta.url).href
      );
      const ambientOcclusionTexture = textureLoader.load(
        new URL("./assets/door/ambientOcclusion.jpg", import.meta.url).href
      );
      const metalnessTexture = textureLoader.load(
        new URL("./assets/door/metalness.jpg", import.meta.url).href
      );
      const roughnessTexture = textureLoader.load(
        new URL("./assets/door/roughness.jpg", import.meta.url).href
      );

      //   colorTexture.minFilter = THREE.LinearFilter;
      const material = new THREE.MeshBasicMaterial({
        //   co lor: 0xff0000,
        map: colorTexture,
        // alphaMap: alphaTexture,
        // displacementMap: heightTexture,
        // normalMap: normalTexture,
        // aoMap: ambientOcclusionTexture,
        // metalnessMap: metalnessTexture,
        // roughnessMap: roughnessTexture,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Sizes
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

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100
      );
      camera.position.z = 3;
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, el.current);
      controls.enableDamping = true;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: el.current,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Animate
      const clock = new THREE.Clock();

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
    }
    main();

    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;

/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  FontLoader,
  RGBELoader,
  TextGeometry,
} from 'three/examples/jsm/Addons.js';

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = '';

      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      /**
       * Textures
       */
      const textureLoader = new THREE.TextureLoader();
      const matcapTexture = textureLoader.load(new URL('./textures/matcaps/3.png', import.meta.url).href)
      matcapTexture.colorSpace = THREE.SRGBColorSpace;

      const fontLoader = new FontLoader();

      fontLoader.load( new URL('./Jersey_10_Regular.json', import.meta.url).href, font => {
        // Material
        const material = new THREE.MeshMatcapMaterial({
          matcap: matcapTexture,
        });

        // Text
        const textGeometry = new TextGeometry('스무스하게~', {
          font: font,
          size: 0.5,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        });
        textGeometry.center();

        
        // const textMaterial = new THREE.MeshBasicMaterial()
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        const geometry = new THREE.TorusGeometry(0.5, 0.3, 20, 50);

        for (let i = 0; i < 60; i++) {
          const torus = new THREE.Mesh(geometry, material);

          torus.position.x = (Math.random() - 0.5) * 20;
          torus.position.y = (Math.random() - 0.5) * 20;
          torus.position.z = (Math.random() - 0.5) * 20;

          torus.rotation.x = Math.random() * Math.PI;
          torus.rotation.y = Math.random() * Math.PI;
          torus.rotation.z = Math.random() * Math.PI;

          scene.add(torus);
        }
    
      });

      /**
       * Sizes
       */
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      window.addEventListener('resize', () => {
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
        100,
      );
      camera.position.x = 1;
      camera.position.y = 1;
      camera.position.z = 2;
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /**
       * Animate
       */
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // sphere.rotation.y = elapsedTime * 0.1;
        // plane.rotation.y = elapsedTime * 0.1;
        // torus.rotation.y = elapsedTime * 0.1;

        // sphere.rotation.x = elapsedTime * -0.15;
        // plane.rotation.x = elapsedTime * -0.15;

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

  return <canvas style={{ display: 'block' }} ref={el}></canvas>;
}

export default Page;
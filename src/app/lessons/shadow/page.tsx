'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = '';

      const gui = new GUI();

      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      /**
       * Lights
       */
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001);
      scene.add(ambientLight);

      // Directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      // directionalLight.castShadow = true
      
      directionalLight.position.set(2, 2, -1);
      gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001);
      gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
      gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
      gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
      scene.add(directionalLight);

      /**
       * Materials
       */
      const material = new THREE.MeshStandardMaterial();
      material.roughness = 0.7;
      gui.add(material, 'metalness').min(0).max(1).step(0.001);
      gui.add(material, 'roughness').min(0).max(1).step(0.001);

      /**
       * Objects
       */
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        material,
      );

      const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
      plane.rotation.x = -Math.PI * 0.5;
      plane.position.y = -0.5;

      const textureLoader = new THREE.TextureLoader()
      const simpleShadow = textureLoader.load(
        new URL('./textures/simpleShadow.jpg', import.meta.url).href,
        )

      const sphereShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1.5),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            alphaMap: simpleShadow
        })
    )
    sphereShadow.rotation.x = - Math.PI * 0.5
    sphereShadow.position.y = plane.position.y + 0.01
    
    scene.add(sphere, sphereShadow, plane)

      scene.add(sphere, plane);

      /**
       * Sizes
       */
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

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

      renderer.shadowMap.enabled = true

      // sphere.castShadow = true

      plane.receiveShadow = true

      const pointLight = new THREE.PointLight(0xffffff, 2.7)
      // pointLight.castShadow = true
      pointLight.position.set(- 1, 1, 0)
      scene.add(pointLight)

      directionalLight.shadow.camera.near = 1
      directionalLight.shadow.camera.far = 4

      directionalLight.shadow.camera.top = 2
      directionalLight.shadow.camera.right = 2
      directionalLight.shadow.camera.bottom = - 2
      directionalLight.shadow.camera.left = - 2
      // ...   

      /**
       * Animate
       */
      const clock = new THREE.Clock();

      const tick = () => {
        const elapsedTime = clock.getElapsedTime()

        // Update the sphere
        sphere.position.x = Math.cos(elapsedTime) * 1.5
        sphere.position.z = Math.sin(elapsedTime) * 1.5
        sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
    
        // Update the shadow
        sphereShadow.position.x = sphere.position.x
        sphereShadow.position.z = sphere.position.z
        sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3
    
        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
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
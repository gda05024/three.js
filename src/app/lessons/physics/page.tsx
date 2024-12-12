'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import CANNON from 'cannon'


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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

      /**
       * Base
       */
      // Canvas
      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      /**
       * Textures
       */
    //   @/assets/physics/textures/environmentMaps/0/px.png
      const textureLoader = new THREE.TextureLoader();
      const cubeTextureLoader = new THREE.CubeTextureLoader();

      const environmentMapTexture = cubeTextureLoader.load([
        new URL(
          './assets/textures/environmentMaps/0/px.png',
          import.meta.url,
        ).href,
        new URL(
          './assets/textures/environmentMaps/0/nx.png',
          import.meta.url,
        ).href,
        new URL(
          './assets/textures/environmentMaps/0/py.png',
          import.meta.url,
        ).href,
        new URL(
          './assets/textures/environmentMaps/0/ny.png',
          import.meta.url,
        ).href,
        new URL(
          './assets/textures/environmentMaps/0/pz.png',
          import.meta.url,
        ).href,
        new URL(
          './assets/textures/environmentMaps/0/nz.png',
          import.meta.url,
        ).href,
      ]);

      /**
       * Test sphere
       */
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshStandardMaterial({
          metalness: 0.3,
          roughness: 0.4,
          envMap: environmentMapTexture,
          envMapIntensity: 0.5,
        }),
      );
      sphere.castShadow = true;
      sphere.position.y = 0.5;
      scene.add(sphere);

      /**
       * Floor
       */
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
          color: '#777777',
          metalness: 0.3,
          roughness: 0.4,
          envMap: environmentMapTexture,
          envMapIntensity: 0.5,
        }),
      );
      floor.receiveShadow = true;
      floor.rotation.x = -Math.PI * 0.5;
      scene.add(floor);

      /**
       * Lights
       */
      const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.camera.far = 15;
      directionalLight.shadow.camera.left = -7;
      directionalLight.shadow.camera.top = 7;
      directionalLight.shadow.camera.right = 7;
      directionalLight.shadow.camera.bottom = -7;
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      /**
       * Physics
       */
      const world = new CANNON.World();

      world.gravity.set(0, -9.82, 0);

      const sphereShape = new CANNON.Sphere(0.5);

      const sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: sphereShape,
      });

      world.addBody(sphereBody);

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
      camera.position.set(-3, 3, 3);
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
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      /**
       * Animate
       */
      const clock = new THREE.Clock();
      let oldElapsedTime = 0;

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;

        // Update physics
        world.step(1 / 60, deltaTime, 3);

        sphere.position.x = sphereBody.position.x;
        sphere.position.y = sphereBody.position.y;
        sphere.position.z = sphereBody.position.z;

        sphere.position.copy(sphereBody.position)

        const floorShape = new CANNON.Plane()
        const floorBody = new CANNON.Body()
        floorBody.mass = 0
        floorBody.addShape(floorShape)
        world.addBody(floorBody)

        floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5)

        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // @ts-ignore
        // Call tick again on the next frame
        requestId = window?.requestAnimationFrame(tick);
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
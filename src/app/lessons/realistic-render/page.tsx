"use client";

import { useEffect, useRef } from "react";
import { GroundedSkybox } from "three/addons/objects/GroundedSkybox.js";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// @ts-ignore
import CANNON from "cannon";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;
    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";

      const gui = new GUI();

      /**
       * Base
       */
      // Canvas
      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      // ...
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = environmentMap;
        scene.environment = environmentMap;
      });

      /**
       * Loaders
       */
      const gltfLoader = new GLTFLoader();

      gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
        gltf.scene.scale.set(10, 10, 10);
        scene.add(gltf.scene);
        updateAllMaterials();
      });

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
      camera.position.set(4, 5, 4);
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
      });

      // Tone mapping
      // renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.toneMappingExposure = 3;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      gui.add(renderer, "toneMapping", {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
      });
      gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

      /**
       * Directional light
       */
      const directionalLight = new THREE.DirectionalLight("#ffffff", 6);
      directionalLight.position.set(-4, 6.5, 2.5);
      scene.add(directionalLight);

      // Shadows
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Shadows
      directionalLight.castShadow = true;
      gui.add(directionalLight, "castShadow");

      //   // Helper
      //   const directionalLightCameraHelper = new THREE.CameraHelper(
      //     directionalLight.shadow.camera
      //   );
      //   scene.add(directionalLightCameraHelper);

      // Target
      directionalLight.target.position.set(0, 4, 0);
      directionalLight.target.updateMatrixWorld();
      scene.add(directionalLight.target);

      directionalLight.shadow.camera.far = 25;
      directionalLight.shadow.mapSize.set(512, 512);

      const updateAllMaterials = () => {
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      };

      gui
        .add(directionalLight, "intensity")
        .min(0)
        .max(10)
        .step(0.001)
        .name("lightIntensity");
      gui
        .add(directionalLight.position, "x")
        .min(-10)
        .max(10)
        .step(0.001)
        .name("lightX");
      gui
        .add(directionalLight.position, "y")
        .min(-10)
        .max(10)
        .step(0.001)
        .name("lightY");
      gui
        .add(directionalLight.position, "z")
        .min(-10)
        .max(10)
        .step(0.001)
        .name("lightZ");

      /**
       * Loaders
       */
      // ...
      const textureLoader = new THREE.TextureLoader();

      /**
       * Floor
       */
      const floorColorTexture = textureLoader.load(
        "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg"
      );
      const floorNormalTexture = textureLoader.load(
        "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png"
      );
      const floorAORoughnessMetalnessTexture = textureLoader.load(
        "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg"
      );

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshStandardMaterial({
          map: floorColorTexture,
          normalMap: floorNormalTexture,
          aoMap: floorAORoughnessMetalnessTexture,
          roughnessMap: floorAORoughnessMetalnessTexture,
          metalnessMap: floorAORoughnessMetalnessTexture,
        })
      );

      floor.rotation.x = -Math.PI * 0.5;
      floorColorTexture.colorSpace = THREE.SRGBColorSpace

      scene.add(floor);

      /**
       * Wall
       */
      const wallColorTexture = textureLoader.load(
        "/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg"
      );
      const wallNormalTexture = textureLoader.load(
        "/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png"
      );
      const wallAORoughnessMetalnessTexture = textureLoader.load(
        "/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg"
      );

      const wall = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshStandardMaterial({
          map: wallColorTexture,
          normalMap: wallNormalTexture,
          aoMap: wallAORoughnessMetalnessTexture,
          roughnessMap: wallAORoughnessMetalnessTexture,
          metalnessMap: wallAORoughnessMetalnessTexture,
        })
      );
      wall.position.y = 4;
      wall.position.z = -4;

      wallColorTexture.colorSpace = THREE.SRGBColorSpace

      scene.add(wall);

      /**
       * Animate
       */
      const clock = new THREE.Clock();
      let oldElapsedTime = 0;

      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - oldElapsedTime;
        oldElapsedTime = elapsedTime;

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

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;

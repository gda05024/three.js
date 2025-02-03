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

      /**    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap

            //  * Loaders
            //  */
      // // ...
      // const rgbeLoader = new RGBELoader()
      // // HDR (RGBE) equirectangular
      // // public/
      // rgbeLoader.load('/environmentMaps/2/2k.hdr', (environmentMap) => {
      //     environmentMap.mapping = THREE.EquirectangularReflectionMapping
      //     // environmentMap.colorSpace = THREE.SRGBColorSpace
      //     scene.background = environmentMap
      //     // scene.environment = environmentMap

      //     // const skybox = new GroundedSkybox(environmentMap, 15, 70)
      //     // skybox.position.y = 15
      //     // skybox.material.wireframe = true
      //     // scene.add(skybox)

      // })

      /**

         * Loaders
         */
      // ...
      const textureLoader = new THREE.TextureLoader();
      // Base environment map
      const environmentMap = textureLoader.load(
        "/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg"
      );
      environmentMap.mapping = THREE.EquirectangularReflectionMapping;
      environmentMap.colorSpace = THREE.SRGBColorSpace;

      scene.background = environmentMap;
      /**
       * Loaders
       */
      // ...
      //   const cubeTextureLoader = new THREE.CubeTextureLoader();
      // const environmentMap = cubeTextureLoader.load([
      //     '/environmentMaps/1/px.png',
      //     '/environmentMaps/1/nx.png',
      //     '/environmentMaps/1/py.png',
      //     '/environmentMaps/1/ny.png',
      //     '/environmentMaps/1/pz.png',
      //     '/environmentMaps/1/nz.png'
      // ])
      // environmentMap.
      // scene.background = environmentMap
      // scene.environment = environmentMap

      scene.environmentIntensity = 1;
      scene.backgroundBlurriness = 0;
      scene.backgroundIntensity = 1;

      gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);
      gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
      gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);
      gui
        .add(scene.backgroundRotation, "y")
        .min(0)
        .max(Math.PI * 2)
        .step(0.001)
        .name("backgroundRotationY");
      gui
        .add(scene.environmentRotation, "y")
        .min(0)
        .max(Math.PI * 2)
        .step(0.001)
        .name("environmentRotationY");
        
        // Holy donut
        const holyDonut = new THREE.Mesh(
            new THREE.TorusGeometry(8, 0.5),
            new THREE.MeshBasicMaterial({ color: new THREE.Color(10, 4, 2) })
        )
        holyDonut.layers.enable(1)
        holyDonut.position.y = 3.5;
        scene.add(holyDonut);
        
        // Cube render target
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
            type: THREE.FloatType,
        });
        scene.environment = cubeRenderTarget.texture;
        
      // Cube camera
      const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

      cubeCamera.layers.set(1)
      /**
       * Loaders
       */
      const gltfLoader = new GLTFLoader();

      gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
        gltf.scene.scale.set(10, 10, 10);
        scene.add(gltf.scene);
      });

      /**
       * Torus Knot
       */
      const torusKnot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
        new THREE.MeshStandardMaterial({
          roughness: 0,
          metalness: 1,
          color: 0xaaaaaa,
        }),
        // new THREE.MeshStandardMaterial({ roughness: 0, metalness: 1, color: 0xaaaaaa })
      );
      torusKnot.position.x = -4;
      torusKnot.position.y = 4;
      scene.add(torusKnot);

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

        // Real time environment map
        if (holyDonut) {
            holyDonut.rotation.x = Math.sin(elapsedTime) * 2

            cubeCamera.update(renderer, scene)
        }

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

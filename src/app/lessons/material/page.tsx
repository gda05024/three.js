/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let requestId: number;

    async function main() {
      if (!el.current) {
        return;
      }
      el.current.innerHTML = "";

      const canvas = el.current;
      // Scene
      const scene = new THREE.Scene();

      // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      // scene.add(ambientLight);

      // const pointLight = new THREE.PointLight(0xffffff, 30);
      // pointLight.position.set(2, 3, 4);
      // scene.add(pointLight);

      const rgbeLoader = new RGBELoader();

      //../3d-text/textures/environmentMap/2k.hdr 
      try {
        rgbeLoader.load(
          new URL(
            "../3d-text/textures/environmentMap/2k.hdr",
            import.meta.url
          ).href,
          (envMap) => {
            envMap.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = envMap;
            scene.environment = envMap;
          }
        );
      } catch (error) {
        // console.error(error);
      }

      const textureLoader = new THREE.TextureLoader();

      const doorColorTexture = textureLoader.load(
        new URL("../3d-text/textures/door/color.jpg", import.meta.url).href
      );
      const doorAlphaTexture = textureLoader.load(
        new URL("../3d-text/textures/door/alpha.jpg", import.meta.url).href
      );
      const doorAmbientOcclusionTexture = textureLoader.load(
        new URL("../3d-text/textures/door/ambientOcclusion.jpg", import.meta.url).href
      );
      const doorHeightTexture = textureLoader.load(
        new URL("../3d-text/textures/door/height.jpg", import.meta.url).href
      );
      const doorNormalTexture = textureLoader.load(
        new URL("../3d-text/textures/door/normal.jpg", import.meta.url).href
      );
      const doorMetalnessTexture = textureLoader.load(
        new URL("../3d-text/textures/door/metalness.jpg", import.meta.url).href
      );
      const doorRoughnessTexture = textureLoader.load(
        new URL("../3d-text/textures/door/roughness.jpg", import.meta.url).href
      );
      const matcapTexture = textureLoader.load(
        new URL("../3d-text/textures/matcaps/7.png", import.meta.url).href
      );
      const gradientTexture = textureLoader.load(
        new URL("../3d-text/textures/gradients/5.jpg", import.meta.url).href
      );

      doorColorTexture.colorSpace = THREE.SRGBColorSpace;
      matcapTexture.colorSpace = THREE.SRGBColorSpace;

      // const material = new THREE.MeshBasicMaterial({
      //   map: doorColorTexture,
      // // });
      // material.map = doorColorTexture;
      // material.color = new THREE.Color(0xff0000);
      // material.wireframe = true;
      // material.transparent = true;
      // material.opacity = 0.5;
      // material.alphaMap = doorAlphaTexture;
      // material.side = THREE.DoubleSide;

      // const material = new THREE.MeshNormalMaterial();
      // material.flatShading = true;

      // const material = new THREE.MeshMatcapMaterial();
      // material.matcap = matcapTexture;

      
      // const material = new THREE.MeshDepthMaterial();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 30);
      pointLight.position.x = 0;
      pointLight.position.y = 3;
      pointLight.position.z = 4;
      scene.add(pointLight);

    //  const material = new THREE.MeshLambertMaterial();

    //   const material = new THREE.MeshPhongMaterial();
    //   material.shininess = 100;
    //   material.specular = new THREE.Color(0xff0000);

    //   const material = new THREE.MeshToonMaterial();
    //   gradientTexture.minFilter = THREE.NearestFilter;
    //   gradientTexture.magFilter = THREE.NearestFilter;
    //   gradientTexture.generateMipmaps = false;
    //   material.gradientMap = gradientTexture;

    //   const material = new THREE.MeshStandardMaterial();
    //   material.wireframe = true;
    //   material.metalness = 0.7;
    //   material.roughness = 0.2;
    //   const gui = new GUI();

      // gui.add(material, "metalness").min(0).max(1).step(0.0001);
      // gui.add(material, "roughness").min(0).max(1).step(0.0001);
      // // material.roughness = 1;
      //  material.map = doorColorTexture;
      //  material.aoMap = doorAmbientOcclusionTexture;
      //  material.aoMapIntensity = 1;
      //  material.displacementMap = doorHeightTexture;
      //  material.displacementScale = 0.07;
      //  material.metalnessMap = doorMetalnessTexture;
      //  material.roughnessMap = doorRoughnessTexture;
      //  material.normalMap = doorNormalTexture;
      //  material.normalScale.set(0.5, 0.5);
      //  material.transparent = true;
      //  material.alphaMap = doorAlphaTexture;

       const gui = new GUI();

      const material = new THREE.MeshPhysicalMaterial();
      material.metalness = 0;
      material.roughness = 0;
      material.map = doorColorTexture;
      material.aoMap = doorAmbientOcclusionTexture;
      material.aoMapIntensity = 1;
      material.displacementMap = doorHeightTexture;
      material.displacementScale = 0.01;
      material.metalnessMap = doorMetalnessTexture;
      material.roughnessMap = doorRoughnessTexture;
      material.normalMap = doorNormalTexture;
      material.normalScale.set(0.5, 0.5);
      material.transparent = true;
      material.alphaMap = doorAlphaTexture;

      gui.add(material, "metalness").min(0).max(1).step(0.0001);
      gui.add(material, "roughness").min(0).max(1).step(0.0001);

      // clearcoat
      material.clearcoat = 1;
      material.clearcoatRoughness = 0;
      gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
      gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);

      // Sheen
      material.sheen = 1;
      material.sheenRoughness = 0.25;
      material.sheenColor.set(1, 1, 1);

      gui.add(material, "sheen").min(0).max(1).step(0.0001);
      gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
      gui.addColor(material, "sheenColor");

      // Iridescent
      material.iridescence = 1;
      material.iridescenceIOR = 1;
      material.iridescenceThicknessRange = [100, 800];

      gui.add(material, "iridescence").min(0).max(1).step(0.0001);
      gui.add(material, "iridescenceIOR").min(0).max(1).step(0.0001);
      gui.add(material.iridescenceThicknessRange, "0", 0, 1000);
      gui.add(material.iridescenceThicknessRange, "1", 0, 1000);

      // Transmission
      material.transmission = 1;
      material.ior = 1.5;
      material.thickness = 0.5;

      gui.add(material, "transmission").min(0).max(1).step(0.0001);
      gui.add(material, "ior").min(1).max(10).step(0.0001);
      gui.add(material, "thickness").min(0).max(1).step(0.0001);

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        material
      );
      sphere.position.x = -1.5;

      // plane
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

      // torus

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.2, 16, 32),
        material
      );
      torus.position.x = 1.5;

      scene.add(sphere, plane, torus);

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

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;

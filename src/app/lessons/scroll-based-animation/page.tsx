/*eslint array-bracket-newline: ["error", { "multiline": true }]*/

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import GUI from "lil-gui";
import gsap from 'gsap'
import "./style.css";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";
    // Scene
    const scene = new THREE.Scene();

    const gui = new GUI();

    const parameters = {
      materialColor: "#ffeded",
    };

    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load(
      new URL("./textures/gradients/3.jpg", import.meta.url).href
    );
    gradientTexture.magFilter = THREE.NearestFilter;

    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture,
    });

    gui.addColor(parameters, "materialColor").onChange(() => {
      material.color.set(parameters.materialColor);
    });

    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
    );
    const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
    );

    scene.add(mesh1, mesh2, mesh3);

    const sectionMeshes = [mesh1, mesh2, mesh3];

    const objectsDistance = 4;
    mesh1.position.y = -objectsDistance * 0;
    mesh2.position.y = -objectsDistance * 1;
    mesh3.position.y = -objectsDistance * 2;

    mesh1.position.x = 2;
    mesh2.position.x = -2;
    mesh3.position.x = 2;

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

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

    /**
     * Camera
     */
    // Group
    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);

    // Base camera
    const camera = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.z = 6;
    cameraGroup.add(camera);

    /**
     * Scroll
     */
    let scrollY = window.scrollY;
    let currentSection = 0;

    window.addEventListener('scroll', () =>
        {
            scrollY = window.scrollY
            const newSection = Math.round(scrollY / sizes.height)
        
            if(newSection != currentSection)
            {
                currentSection = newSection
        
                console.log('changed', currentSection)
            }

            if(newSection != currentSection)
                {
                    // ...
            
                    gsap.to(
                        sectionMeshes[currentSection].rotation,
                        {
                            duration: 1.5,
                            ease: 'power2.inOut',
                            x: '+=6',
                            y: '+=3',
                            z: '+=1.5'
                        }
                    )
                }
        })
    /**
     * Cursor
     */
    const cursor = {
      x: 0,
      y: 0,
    };
    cursor.x = 0;
    cursor.y = 0;

    window.addEventListener("mousemove", (event) => {
      cursor.x = event.clientX / sizes.width - 0.5;
      cursor.y = -(event.clientY / sizes.height - 0.5);

      console.log(cursor);
    });

    /**
     * Particles
     */
    // Geometry
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount; i++)
    {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      sizeAttenuation: true,
      size: 0.03,
    });

    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let previousTime = 0;
    let requestId = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      // Animate meshes
      for(const mesh of sectionMeshes)
        {
            mesh.rotation.x += deltaTime * 0.1
            mesh.rotation.y += deltaTime * 0.12
        }

        // Animate camera
        const scrollPosition = (-scrollY / sizes.height) * objectsDistance;
        camera.position.y = scrollPosition; 
      

      const parallaxX = cursor.x;
      const parallaxY = cursor.y;

      cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
      cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

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

  return (
    <>
      <canvas className="webgl" style={{ display: "block" }} ref={el}></canvas>
      <section className="section">
        <h1>My Portfolio</h1>
      </section>
      <section className="section">
        <h2>My projects</h2>
      </section>
      <section className="section">
        <h2>Contact me</h2>
      </section>
    </>
  );
}

export default Page;

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from "lil-gui";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Debug
    const gui = new GUI();

    // Scene
    const scene = new THREE.Scene();

    // Objects
    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );
    object1.position.x = -2;

    const object2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );

    const object3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );
    object3.position.x = 2;

    scene.add(object1, object2, object3);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

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
    // @ts-ignore
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      // @ts-ignore
      canvas: canvasRef.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Resize handler
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    /**
     * Raycaster
     */
    const raycaster = new THREE.Raycaster();

    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(10, 0, 0);
    // rayDirection.normalize();

    // raycaster.set(rayOrigin, rayDirection);

    const intersect = raycaster.intersectObject(object2);
    console.log(intersect);

    const intersects = raycaster.intersectObjects([object1, object2, object3]);
    console.log(intersects);


    /**
     * Mouse
     */
    const mouse = new THREE.Vector2()

    window.addEventListener('mousemove', (event) =>
    {
        mouse.x = event.clientX / sizes.width * 2 - 1
        mouse.y = - (event.clientY / sizes.height) * 2 + 1

        console.log(mouse)
    })

    /**
     * Lights
     */
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.9)
    scene.add(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1)
    directionalLight.position.set(1, 2, 3)
    scene.add(directionalLight)

    /**
     * Model
     */
    const gltfLoader = new GLTFLoader()

    let model: any = null
    gltfLoader.load(
        '/models/Duck/glTF-Binary/Duck.glb',
        (gltf) =>
        {
            model = gltf.scene
            console.log(model)
            model.position.y = - 1.2
            scene.add(model)
        
        }
    )

    // Animation
    const clock = new THREE.Clock();


    let currentIntersect: any = null;

    window.addEventListener('click', () =>
        {
            if(currentIntersect)
            {
                switch(currentIntersect.object)
                {
                    case object1:
                        console.log('click on object 1')
                        break
        
                    case object2:
                        console.log('click on object 2')
                        break
        
                    case object3:
                        console.log('click on object 3')
                        break
                }
            }
        })

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Animate objects
      object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
      object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
      object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

      // Cast a ray
      const rayOrigin = new THREE.Vector3(-3, 0, 0);
      const rayDirection = new THREE.Vector3(1, 0, 0);
      rayDirection.normalize();

      raycaster.set(rayOrigin, rayDirection);

      const objectsToTest = [object1, object2, object3];
      const intersects = raycaster.intersectObjects(objectsToTest);
      console.log(intersects);

      if(intersects.length)
        {
            if(!currentIntersect)
            {
                console.log('mouse enter')
            }
    
            currentIntersect = intersects[0]
        }
        else
        {
            if(currentIntersect)
            {
                console.log('mouse leave')
            }
            
            currentIntersect = null
        }

    
      for(const intersect of intersects)
        {
            // @ts-ignore
            intersect.object.material.color.set('#0000ff')
        }
    
        for(const object of objectsToTest)
        {
            if(!intersects.find(intersect => intersect.object === object))
            {
                object.material.color.set('#ff0000')
            }
        }
        if(model)
            {
                const modelIntersects = raycaster.intersectObject(model)
                
                if(modelIntersects.length)
                {
                    model.scale.set(1.2, 1.2, 1.2)
                }
                else
                {
                    model.scale.set(1, 1, 1)
                }
            }
        
    
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };

    tick();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      gui.destroy();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" />;
}

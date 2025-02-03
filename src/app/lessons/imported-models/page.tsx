'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'

export default function ImportedModelsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return


    /**
     * Models
     */
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)


        let mixer: any = null

    gltfLoader.load(
        // '/models/Duck/glTF/Duck.gltf',
        // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
        // '/models/Duck/glTF-Draco/Duck.gltf',
        // '/models/Fox/glTF/Fox.gltf',
        '/models/Rabbit/rabbit.glb',
        (gltf) =>
        {

            // scene.add(gltf.scene.children[0])
            // gltf.scene.scale.set(0.03, 0.03, 0.03)
            gltf.scene.position.set(0, 0.53, 0) 
            scene.add(gltf.scene)

            // mixer = new THREE.AnimationMixer(gltf.scene)
            // const action = mixer.clipAction(gltf.animations[2])

            // action.play()
        }
    )

    // Debug
    const gui = new GUI()

    // Scene
    const scene = new THREE.Scene()

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
      })
    )
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    scene.add(floor)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = - 7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = - 7
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(2, 2, 2)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current)
    controls.target.set(0, 0.75, 0)
    controls.enableDamping = true

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Resize handler
    const handleResize = () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)

    // Animation
    const clock = new THREE.Clock()
    let previousTime = 0

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime

      //@ts-ignore
      if(mixer) {
        mixer.update(deltaTime)
      }

      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      gui.destroy()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="webgl" />
  )
}
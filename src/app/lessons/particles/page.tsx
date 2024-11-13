'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

export default function ParticlesPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Debug
    const gui = new GUI()

    // Scene
    const scene = new THREE.Scene()

    /**
         * Textures
         */
    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load(new URL('./assets/circle_02.png', import.meta.url).href)

    // Test cube
    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial()
    // )
    // scene.add(cube)

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 3
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current)
    controls.enableDamping = true

    /**
     * Particles
     */
    // Geometry
    // const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)

    // Material
    const particlesMaterial = new THREE.PointsMaterial()
    // particlesMaterial.color = new THREE.Color('#ff88cc')
    particlesMaterial.size = 0.02
    particlesMaterial.sizeAttenuation = true
    // particlesMaterial.map = particleTexture
    particlesMaterial.transparent = true
    particlesMaterial.alphaMap = particleTexture
    // particlesMaterial.alphaTest = 0.001
    // particlesMaterial.depthTest = false
    particlesMaterial.depthWrite = false
    particlesMaterial.blending = THREE.AdditiveBlending

    // const cube = new THREE.Mesh(
    //     new THREE.BoxGeometry(),
    //     new THREE.MeshBasicMaterial()
    // )
    // scene.add(cube)
    

    // Geometry
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 5000

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for(let i = 0; i < count * 3; i++)
    {
        positions[i] = (Math.random() - 0.5) * 10
        colors[i] = Math.random()
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    particlesMaterial.size = 0.1
    particlesMaterial.vertexColors = true

    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    })
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

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

    // // Update particles
    // particles.rotation.y = elapsedTime * 0.2

    for(let i = 0; i < count; i++)
        {
            let i3 = i * 3
    
            const x = particlesGeometry.attributes.position.array[i3]
            particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        }
        particlesGeometry.attributes.position.needsUpdate = true

      controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }

    tick()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      gui.destroy()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="webgl" />
}
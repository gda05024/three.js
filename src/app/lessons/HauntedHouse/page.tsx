'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

const HauntedHouse = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (!canvasRef.current) return

        // Debug
        const gui = new GUI()

        // Scene
        const scene = new THREE.Scene()

        // House
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, 32, 32),
            new THREE.MeshStandardMaterial({ roughness: 0.7 })
        )
        scene.add(sphere)

        // Lights
        const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
        directionalLight.position.set(3, 2, -8)
        scene.add(directionalLight)

        // Sizes
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.set(4, 2, 5)
        scene.add(camera)

        // Controls
        const controls = new OrbitControls(camera, canvasRef.current)
        controls.enableDamping = true

         /**
         * Textures
         */
         const textureLoader = new THREE.TextureLoader()  
         
        // Floor
        const floorAlphaTexture = textureLoader.load(new URL('./assets/floor/alpha.jpg', import.meta.url).href)
        const floorColorTexture = textureLoader.load(new URL('./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg', import.meta.url).href)
        const floorARMTexture = textureLoader.load(new URL('./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg', import.meta.url).href)
        const floorNormalTexture = textureLoader.load(new URL('./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg', import.meta.url).href)
        const floorDisplacementTexture = textureLoader.load(new URL('./assets/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg', import.meta.url).href)

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshStandardMaterial({
                alphaMap: floorAlphaTexture,
                //transparent: true,
                map: floorColorTexture
            })
        )

        floorColorTexture.repeat.set(8, 8)
        floorARMTexture.repeat.set(8, 8)
        floorNormalTexture.repeat.set(8, 8)
        floorDisplacementTexture.repeat.set(8, 8)

        
        floor.rotation.x = - Math.PI * 0.5
        scene.add(floor)

        // House container
        const house = new THREE.Group()
        scene.add(house)

        // Walls
        const walls = new THREE.Mesh(
            new THREE.BoxGeometry(4, 2.5, 4),
            new THREE.MeshStandardMaterial()
        )
        walls.position.y += 1.25
        house.add(walls)

        // Roof
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(3.5, 1.5, 4),
            new THREE.MeshStandardMaterial()
        )
        roof.position.y = 2.5 + 0.75
        roof.rotation.y = Math.PI * 0.25
        house.add(roof)

        // Door
        const door = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 2.2),
            new THREE.MeshStandardMaterial()
        )
        door.position.y = 1
        door.position.z = 2 + 0.01
        house.add(door)

        // Bushes
        const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
        const bushMaterial = new THREE.MeshStandardMaterial()

        const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush1.scale.set(0.5, 0.5, 0.5)
        bush1.position.set(0.8, 0.2, 2.2)

        const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush2.scale.set(0.25, 0.25, 0.25)
        bush2.position.set(1.4, 0.1, 2.1)

        const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush3.scale.set(0.4, 0.4, 0.4)
        bush3.position.set(- 0.8, 0.1, 2.2)

        const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
        bush4.scale.set(0.15, 0.15, 0.15)
        bush4.position.set(- 1, 0.05, 2.6)

        house.add(bush1, bush2, bush3, bush4)


        // Graves
        const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
        const graveMaterial = new THREE.MeshStandardMaterial()

        const graves = new THREE.Group()
        scene.add(graves)

        for(let i = 0; i < 30; i++)
            {
                 // Coordinates
                 const angle = Math.random() * Math.PI * 2
                 const radius = 3 + Math.random() * 4
                 const x = Math.sin(angle) * radius
                 const z = Math.cos(angle) * radius
             
                 // Mesh
                 const grave = new THREE.Mesh(graveGeometry, graveMaterial)
                 grave.position.x = x
                 grave.position.z = z

                 grave.rotation.x = (Math.random() - 0.5) * 0.4
                 grave.rotation.y = (Math.random() - 0.5) * 0.4
                 grave.rotation.z = (Math.random() - 0.5) * 0.4
             
                 // Add to the graves group
                 graves.add(grave)
            }

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current
        })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Animation
        const timer = new Timer()

        const tick = () => {
            timer.update()
            controls.update()
            renderer.render(scene, camera)
            window.requestAnimationFrame(tick)
        }

        const handleResize = () => {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }

        window.addEventListener('resize', handleResize)
        tick()

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
            gui.destroy()
            renderer.dispose()
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose()
                    object.material.dispose()
                }
            })
        }
    }, [])

    return <canvas ref={canvasRef} className="webgl" />
}

export default HauntedHouse
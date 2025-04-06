'use client'
import './style.css'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

export default function Page() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ fov: 45, near: 0.1, far: 200, position: [ 4, - 2, 6 ] }}>
                <Experience />
            </Canvas>
        </div>
    )
}
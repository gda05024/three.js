import { useState, useRef } from "react";
import {
  useMatcapTexture,
  Text3D,
  OrbitControls,
  Center,
} from "@react-three/drei";
import { useFrame } from '@react-three/fiber'
import { Perf } from "r3f-perf";
import * as THREE from "three";



export default function Experience() {
  const [matcapTexture] = useMatcapTexture("787165_DAD9CD_9DC0CE_36302A", 256);

   

  const tempArray = Array(100)

  const donuts = useRef([])

  useFrame((state, delta) => {
       for(const donut of donuts.current) {
        donut.rotation.y += delta * 0.2
        donut.rotation.x += delta * 3
        donut.rotation.z += delta * 0.2
       }
    })
  

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <Center>
        <Text3D
          font="/fonts/hello.json"
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Hello
        </Text3D>
      </Center>
      
       {([...tempArray]).map((_, index) => (
        <mesh
          scale={[0.3, 0.3, 0.3]}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          
          ]}
          
          ref={ (element) => {
            donuts.current[index] = (element)
          } }
        >
         
          <torusGeometry   />
          <meshMatcapMaterial matcap={matcapTexture} />
        </mesh> 
      ))} 
    </>
  );
}

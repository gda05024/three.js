import { useThree, extend, useFrame } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CustomObject from "./CustomObject";

import { useRef } from "react";

extend({ OrbitControls });

export default function Experience() {
  const cubeRef = useRef();
  const groupRef = useRef();

  const { camera, gl } = useThree();

  useFrame((state, delta) => {
    // @ts-ignore
    cubeRef.current.rotation.y += delta;
        // @ts-ignore
     groupRef.current.rotation.y += delta
  });

  return (
    <>
      {/* @ts-ignore */}
      <orbitControls args={[camera, gl.domElement]} />
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />
      {/* @ts-ignore */}
      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <mesh
          // @ts-ignore
          ref={cubeRef}
          rotation-y={Math.PI * 0.25}
          position-x={2}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </group>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <CustomObject />
    </>
  );
}

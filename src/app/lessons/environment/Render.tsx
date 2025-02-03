import { useRef } from "react";
import * as THREE from "three";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

extend({ OrbitControls: OrbitControls });

import CustomObject from "../fiber/CustomObject";

function Render() {
  const cubeRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const three = useThree();
  const { camera, gl } = three;

  useFrame((state, delta) => {
    // const angle = state.clock.elapsedTime


    const angle = state.clock.elapsedTime
    state.camera.position.x = Math.sin(angle) * 8
    state.camera.position.z = Math.cos(angle) * 8
    state.camera.lookAt(0, 0, 0)

    if (!cubeRef.current || !groupRef.current) {
      return;
    }
    // cubeRef.current.rotation.y += 0.01;
    //delta is the time between the last frame and the current frame
    cubeRef.current.rotation.y += delta;
    groupRef.current.rotation.y += delta;
  });

  return (
    <>
      {/* @ts-ignore */}
      <orbitControls args={[camera, gl.domElement]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <group ref={groupRef}>
        <mesh
          position-x={-5}
          scale={1.5}
          rotation-y={Math.PI * 0.5}
          ref={cubeRef}
        >
          <boxGeometry />
          {/* <meshBasicMaterial color="orange" /> */}
          <meshStandardMaterial color="orange" />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="mediumpurple" wireframe />
        </mesh>
      </group>
      <mesh position={[5, 0, 0]} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" wireframe />
      </mesh>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <CustomObject />
    </>
  );
}

export default Render;

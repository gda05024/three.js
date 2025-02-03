import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  useHelper,
  OrbitControls,
  BakeShadows,
  SoftShadows,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  Sky
} from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";
import { useControls } from "leva";

export default function Experience() {
  const cube = useRef();

  const directionalLight = useRef<any>();

  useHelper(directionalLight, THREE.DirectionalLightHelper, 1);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    //@ts-ignore
    cube.current.position.x = 2 + Math.sin(time);
  });

  const { sunPosition } = useControls('sky', {
    sunPosition: { value: [ 1, 2, 3 ] }
})


  return (
    <>
      {/* <BakeShadows /> */}
      {/* <SoftShadows size={ 25 } samples={ 10 } focus={ 0 } /> */}
      {/* <AccumulativeShadows
        position={ [ 0, - 0.99, 0 ] }
        scale={ 10 }
        color="#316d39"
        opacity={ 0.8 }
        frames={ Infinity }
        temporal
        blend={ 100 }
      >
        <directionalLight position={[1, 2, 3]} castShadow />
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={3}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows> */}
      <Sky sunPosition={ sunPosition } />

      <ContactShadows
        position={[0, -0.99, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={"#1d8f75"}
        opacity={0.4}
        blur={2.8}
        frames={ 1 }
      />

      <color args={["ivory"]} attach="background" />

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight
        ref={ directionalLight }
        position={ sunPosition }
        intensity={ 4.5 }
        castShadow
        shadow-mapSize={ [ 1024, 1024 ] }
        shadow-camera-near={ 1 }
        shadow-camera-far={ 10 }
        shadow-camera-top={ 5 }
        shadow-camera-right={ 5 }
        shadow-camera-bottom={ - 5 }
        shadow-camera-left={ - 5 }
      />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* @ts-ignore */}
      <mesh castShadow ref={cube} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}

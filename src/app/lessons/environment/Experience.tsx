import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  useHelper,
  OrbitControls,
  BakeShadows,
  SoftShadows,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  Sky,
  Environment,
  Lightformer,
  Stage,
} from "@react-three/drei";
import { useRef, useEffect } from "react";
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

  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  const { envMapIntensity } = useControls("environment map", {
    envMapIntensity: { value: 3.5, min: 0, max: 12 },
  });

  const scene = useThree((state) => state.scene);

  useEffect(() => {
    scene.environmentIntensity = envMapIntensity;
  }, [envMapIntensity]);

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
      {/* <Sky sunPosition={ sunPosition } /> */}
      {/* 전체 공간의 배경 */}
      {/* <Environment background preset="sunset" resolution={ 100 }  ground={ {
        height: 7,
        radius: 28,
        scale: 100
    } } >
        <color args={["#000000"]} attach="background" />
        <Lightformer
          position-z={-5}
          scale={5}
          color="red"
          intensity={10}
          form="ring"
        />
      </Environment>
      <ContactShadows
        position={[0, -0.99, 0]}
        scale={10}
        resolution={512}
        far={5}
        color={"#1d8f75"}
        opacity={0.4}
        blur={2.8}
        frames={1}
      />

      <color args={["ivory"]} attach="background" /> */}

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      {/* 
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
      <ambientLight intensity={1.5} /> */}

      <Stage shadows={ { type: 'contact', opacity: 0.2, blur: 3 } }>
        <mesh position-y={1} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* @ts-ignore */}
        <mesh ref={cube} position-y={1} position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </Stage>
    </>
  );
}

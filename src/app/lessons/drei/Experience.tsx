import { useThree, extend } from "@react-three/fiber";
import {
  Float,
  Html,
  TransformControls,
  OrbitControls,
  PivotControls,
  MeshReflectorMaterial
} from "@react-three/drei";
import { useRef } from "react";
import { useControls } from "leva";
import { Perf } from 'r3f-perf'

export default function Experience() {
  const cube = useRef();
  const sphere = useRef();

  // @ts-ignore
  const { position, perfVisible } = useControls({
    position:
    {
      value: {x: -2, y:0},
      step: 0.01
    }
})


  return (
    <>
      {perfVisible && <Perf position="top-left" />}
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        lineWidth={4}
        axisColors={["#9381ff", "#ff4d6d", "#7ae582"]}
        scale={100}
        fixed
      >
        {/* @ts-ignore */}
        <mesh ref={sphere} position={[position.x, position.y, 0]} scale={2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
          <Html
            // @ts-ignore
            occlude={[sphere, cube]}
            distanceFactor={8}
            center
            wrapperClass="label"
            position={[1, 1, 0]}
          >
            That's a sphere 👍
          </Html>
        </mesh>
      </PivotControls>

      <Float speed={50}>
        {/* @ts-ignore */}
        <mesh ref={cube} position-x={2} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </Float>
      {/* @ts-ignore */}
      <TransformControls object={cube} />
      {/* @ts-ignore */}
      <mesh ref={sphere} position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        {/* <meshStandardMaterial color="greenyellow" /> */}
        <MeshReflectorMaterial color="greenyellow" mirror={0.5} />
      </mesh>
    </>
  );
}

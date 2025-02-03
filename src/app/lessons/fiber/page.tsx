"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import Experience from "./Experience";
import "./style.css";

function page() {
  return (
    <>
      {/* @ts-ignore */}
      <Canvas>
        <Experience />
      </Canvas>
    </>
  );
}

export default page;

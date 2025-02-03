"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import styles from "../../page.module.css";
import "./style.css";
// import HomeButton from "@/app/components/HomeButton";
// import PageTitle from "@/app/components/PageTitle";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";

function Page() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* <HomeButton />
      <PageTitle title="first-three-fiber" /> */}
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [- 4, 3, 6]
        }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}

export default Page;

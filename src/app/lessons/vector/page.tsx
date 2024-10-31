"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function Page() {
  const el = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!el.current) {
      return;
    }

    el.current.innerHTML = "";

    const scene = new THREE.Scene();

    // xBasis
    const xBasis = new THREE.Vector3(1, 0, 0);
    const xScalar = 2;
    const xArrowHelper = new THREE.ArrowHelper(
      xBasis,
      new THREE.Vector3(0, 0, 0),
      xScalar
    );
    scene.add(xArrowHelper);

    // yBasis
    const yBasis = new THREE.Vector3(0, 1, 0);
    const yScalar = 3;
    const yArrowHelper = new THREE.ArrowHelper(
      yBasis,
      xBasis.clone().multiplyScalar(xScalar),
      yScalar
    );
    scene.add(yArrowHelper);

    // zBasis
    const zBasis = new THREE.Vector3(0, 0, 1);
    const zScalar = 4;
    const zArrowHelper = new THREE.ArrowHelper(
      zBasis,
      yBasis
        .clone()
        .multiplyScalar(yScalar)
        .add(xBasis.clone().multiplyScalar(xScalar)),
      zScalar
    );
    scene.add(zArrowHelper);

    const vector = xBasis
      .multiplyScalar(xScalar)
      .add(yBasis.multiplyScalar(yScalar))
      .add(zBasis.multiplyScalar(zScalar));

    const arrowHelper = new THREE.ArrowHelper(
      vector.clone().normalize(),
      new THREE.Vector3(0, 0, 0),
      vector.length(),
      0xff0000
    );

    console.log(arrowHelper);
    scene.add(arrowHelper);

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 5;
    scene.add(camera);

    const controls = new OrbitControls(camera, el!.current);
    controls.enableDamping = true;

    const axesHelper = new THREE.AxesHelper(4);
    scene.add(axesHelper);

    const renderer = new THREE.WebGLRenderer({
      canvas: el.current,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let requestId: number;

    function tick() {
      renderer.render(scene, camera);
      controls.update();
      camera.lookAt(arrowHelper.position);
      requestId = window.requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(requestId);
    };
  });

  return <canvas style={{ display: "block" }} ref={el}></canvas>;
}

export default Page;

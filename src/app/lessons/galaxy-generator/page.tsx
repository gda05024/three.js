"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { TextureLoader } from "three";

export default function GalaxyGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const gui = new GUI();

    const parameters = {
      count: 210000, // 더 많은 입자 수
      centerSizeMultiplier: 3, // 중심부 입자 크기 배율
      size: 0.002, // 약간 더 큰 입자
      radius: 18, // 전체 반경
      height: 6.0, // 수직 높이
      bulgeSize: 0.01, // 더 큰 중심부
      bulgeIntensity: 0.1, // 중심부 밀도
      ellipticalRatio: 0.5, // 타원 비율
      irregularity: 0.4, // 불규칙성
      insideColor: "#e6d3bc", // 따뜻한 중심부 색상
      outsideColor: "#2550a7", // 차가운 외곽 색상
      opacity: 0.6, // 투명도
      scatter: 0.3, // 산포도
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");

    // 텍스처 로더 추가
    const textureLoader = new TextureLoader();
    const particleTexture = textureLoader.load(new URL('./star.png', import.meta.url).href);
      

    // 배경 별들 생성 함수
    const createBackgroundStars = () => {
      const starsCount = 2000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starsCount * 3);
      const colors = new Float32Array(starsCount * 3);
      const sizes = new Float32Array(starsCount);

      const starColors = [
        new THREE.Color("#FFFFFF"),
        new THREE.Color("#FFE4B5"),
        new THREE.Color("#FFB6C1"),
        new THREE.Color("#E6E6FA"),
        new THREE.Color("#FFD700"),
        new THREE.Color("#ADFF2F"),
        new THREE.Color("#00CED1"),
      ];

      for (let i = 0; i < starsCount * 3; i += 3) {
        const radius = 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);

        const color = starColors[Math.floor(Math.random() * starColors.length)];
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
        // 랜덤한 크기 설정
        sizes[i / 3] = Math.random() * 0.5 + 0.2; // 크기 증가
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.2,
        depthWrite: false,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,

        map: particleTexture,
        alphaMap: particleTexture, // alphaMap 추가
        alphaTest: 0.001   
      });

      const stars = new THREE.Points(geometry, material);
      scene.add(stars);

      return stars;
    };

    // 여러 레이어의 배경 별들 생성
    const backgroundStarsLayers: THREE.Points[] = [];   
    for (let i = 0; i < 3; i++) {
      backgroundStarsLayers.push(createBackgroundStars());
    }

    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.PointsMaterial | null = null;
    let points: THREE.Points | null = null;

    const generateGalaxy = () => {
      if (points && geometry && material) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }

      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);
      const sizes = new Float32Array(parameters.count); // 크기를 위한 새로운 배열

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // 3D 가우시안 분포 사용
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        // Box-Muller 변환을 사용한 가우시안 분포
        const u1 = Math.random();
        const u2 = Math.random();
        const radius =
          Math.abs(
            Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
          ) * parameters.radius;

        // 불규칙성 추가
        const irregularOffset = (Math.random() - 0.5) * parameters.irregularity;

        let x = radius * Math.sin(phi) * Math.sin(theta);
        let y =
          -radius *
          Math.sin(phi) *
          Math.cos(theta) *
          parameters.ellipticalRatio;
        let z = -radius * Math.cos(phi) * parameters.ellipticalRatio;

        // 불규칙성 적용
        x += irregularOffset * parameters.radius;
        y += irregularOffset * parameters.radius;
        z += irregularOffset * parameters.radius;

        // 산포도 적용
        const scatter = parameters.scatter * parameters.radius;
        x += (Math.random() - 0.5) * scatter;
        y += (Math.random() - 0.5) * scatter;
        z += (Math.random() - 0.5) * scatter;

        // 중심부 밀도 증가
        const distFromCenter = Math.sqrt(x * x + y * y + z * z);
        if (distFromCenter < parameters.bulgeSize) {
          const scale = Math.pow(
            distFromCenter / parameters.bulgeSize,
            parameters.bulgeIntensity
          );
          x *= scale;
          y *= scale;
          z *= scale;
        }

        // 색상 계산
        const t = Math.min(distFromCenter / parameters.radius, 1);

        let color;
        let particleSize = parameters.size;

        // generateGalaxy 함수 내부의 색상 계산 부분 수정
        if (distFromCenter < parameters.bulgeSize) {
          // 중심부 색상 다양화 (30% 확률로 특별한 색상 적용)
          if (Math.random() < 0.3) {
            const colorType = Math.random();
            if (colorType < 0.33) {
              // 청백색 계열
              color = new THREE.Color(
                0.8 + Math.random() * 0.2, // R
                0.8 + Math.random() * 0.2, // G
                0.9 + Math.random() * 0.1 // B
              );
            } else if (colorType < 0.66) {
              // 연한 녹색 계열
              color = new THREE.Color(
                0.7 + Math.random() * 0.2, // R
                0.9 + Math.random() * 0.1, // G
                0.7 + Math.random() * 0.2 // B
              );
            } else {
              // 살구색 계열
              color = new THREE.Color(
                0.95 + Math.random() * 0.05, // R
                0.85 + Math.random() * 0.1, // G
                0.7 + Math.random() * 0.2 // B
              );
            }
            // 특별한 색상을 가진 입자는 크기도 더 크게
            particleSize =
              (parameters.size +
                Math.random() * (parameters.size - parameters.size)) *
              parameters.centerSizeMultiplier;
          } else {
            // 기본 중심부 색상
            color = new THREE.Color(parameters.insideColor);
            // 기본 입자도 약간의 크기 변화
            particleSize =
            parameters.size +
              Math.random() * (parameters.size);
          }
        } else {
          // 외곽 부분 색상

          const radiusRatio = distFromCenter / parameters.radius;
          particleSize *= 1 - radiusRatio * 0.5; // 가장 외곽은 50%까지 작아짐

          color = new THREE.Color(parameters.insideColor).lerp(
            new THREE.Color(parameters.outsideColor),
            Math.pow(t, 0.5)
          );
          // 외곽 입자 크기도 랜덤하게
          particleSize *= 0.5 + Math.random() * 0.5;
        }

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        sizes[i] = particleSize;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: parameters.opacity,
        map: particleTexture,
        alphaMap: particleTexture, // alphaMap 추가
        alphaTest: 0.001
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    // GUI 컨트롤
    gui
      .add(parameters, "count", 100000, 1000000, 10000)
      .name("입자 수")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "size", 0.001, 0.01, 0.001)
      .name("입자 크기")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "radius", 1, 20, 0.1)
      .name("반경")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "bulgeSize", 0.1, 5, 0.1)
      .name("중심부 크기")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "bulgeIntensity", 1, 5, 0.1)
      .name("중심부 밀도")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "ellipticalRatio", 0.1, 1, 0.1)
      .name("타원 비율")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "irregularity", 0, 1, 0.1)
      .name("불규칙성")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "scatter", 0, 1, 0.1)
      .name("산포도")
      .onFinishChange(generateGalaxy);
    gui
      .add(parameters, "opacity", 0, 1, 0.1)
      .name("투명도")
      .onFinishChange(generateGalaxy);
    gui
      .addColor(parameters, "insideColor")
      .name("중심부 색상")
      .onFinishChange(generateGalaxy);
    gui
      .addColor(parameters, "outsideColor")
      .name("외곽 색상")
      .onFinishChange(generateGalaxy);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    );
    camera.position.set(15, 8, 15);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controls.minPolarAngle = Math.PI / 4; // 상단 제한
    controls.maxPolarAngle = (Math.PI * 3) / 4; // 하단 제한

    // Resize handler
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (points) {
        points.rotation.y = elapsedTime * 0.05;
      }

      backgroundStarsLayers.forEach((stars, index)  => {
        stars.rotation.y = elapsedTime * 0.01 * (index + 1);
        stars.rotation.x = elapsedTime * 0.005 * (index + 1);

        const material = stars.material as THREE.PointsMaterial;
        material.opacity = 0.6 + Math.sin(elapsedTime * (index + 1)) * 0.2;
      });

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    generateGalaxy();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      gui.destroy();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" />;
}

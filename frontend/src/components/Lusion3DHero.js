'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { useTheme } from './ThemeContext';

// Clean, high-precision SVG vector paths for letters A-Z and digits 0-9
const GLYPH_PATHS = {
  A: 'M 50 14 L 84 86 H 64 L 56 68 H 44 L 36 86 H 16 Z M 50 34 L 46 54 H 54 Z',
  B: 'M 20 14 H 58 C 72 14 80 22 80 34 C 80 43 73 49 64 51 C 75 53 82 60 82 72 C 82 82 72 86 58 86 H 20 Z M 40 28 H 54 C 60 28 64 30 64 36 C 64 42 60 44 54 44 H 40 Z M 40 56 H 55 C 61 56 65 59 65 65 C 65 71 61 74 55 74 H 40 Z',
  C: 'M 78 30 L 63 39 C 60 33 55 28 48 28 C 36 28 28 38 28 50 C 28 62 36 72 48 72 C 55 72 60 67 63 61 L 78 70 C 73 80 62 86 48 86 C 26 86 10 70 10 50 C 10 30 26 14 48 14 C 62 14 73 20 78 30 Z',
  D: 'M 20 14 H 54 C 72 14 84 27 84 50 C 84 73 72 86 54 86 H 20 Z M 40 30 H 52 C 61 30 66 38 66 50 C 66 62 61 70 52 70 H 40 Z',
  E: 'M 22 14 H 78 V 30 H 42 V 42 H 72 V 56 H 42 V 70 H 78 V 86 H 22 Z',
  F: 'M 22 14 H 78 V 30 H 42 V 44 H 72 V 60 H 42 V 86 H 22 Z',
  G: 'M 78 30 L 63 39 C 60 33 55 28 48 28 C 36 28 28 38 28 50 C 28 62 36 72 48 72 C 55 72 60 67 63 61 H 50 V 47 H 80 V 73 C 73 81 62 86 48 86 C 26 86 10 70 10 50 C 10 30 26 14 48 14 C 62 14 73 20 78 30 Z',
  H: 'M 22 14 H 42 V 42 H 58 V 14 H 78 V 86 H 58 V 58 H 42 V 86 H 22 Z',
  I: 'M 24 14 H 76 V 30 H 60 V 70 H 76 V 86 H 24 V 70 H 40 V 30 H 24 Z',
  J: 'M 74 14 V 62 C 74 77 63 86 48 86 C 34 86 24 78 20 68 L 35 60 C 37 66 41 71 48 71 C 54 71 57 67 57 60 V 14 Z',
  K: 'M 22 14 H 42 V 44 L 62 14 H 84 L 56 49 L 86 86 H 64 L 42 56 V 86 H 22 Z',
  L: 'M 22 14 H 42 V 70 H 78 V 86 H 22 Z',
  M: 'M 18 14 H 36 L 50 48 L 64 14 H 82 V 86 H 65 V 42 L 53 66 H 47 L 35 42 V 86 H 18 Z',
  N: 'M 22 14 H 42 L 60 56 V 14 H 78 V 86 H 58 L 40 44 V 86 H 22 Z',
  O: 'M 50 14 C 70 14 84 29 84 50 C 84 71 70 86 50 86 C 30 86 16 71 16 50 C 16 29 30 14 50 14 Z M 50 30 C 39 30 34 38 34 50 C 34 62 39 70 50 70 C 61 70 66 62 66 50 C 66 38 61 30 50 30 Z',
  P: 'M 22 14 H 56 C 72 14 80 23 80 37 C 80 51 72 60 56 60 H 42 V 86 H 22 Z M 42 28 H 54 C 60 28 63 31 63 37 C 63 43 60 46 54 46 H 42 Z',
  Q: 'M 50 14 C 70 14 84 29 84 50 C 84 59 81 67 76 72 L 84 80 L 72 90 L 65 82 C 61 85 56 86 50 86 C 30 86 16 71 16 50 C 16 29 30 14 50 14 Z M 50 30 C 39 30 34 38 34 50 C 34 62 39 70 50 70 C 61 70 66 62 66 50 C 66 38 61 30 50 30 Z',
  R: 'M 22 14 H 56 C 72 14 80 23 80 36 C 80 47 73 54 62 57 L 82 86 H 60 L 44 60 H 42 V 86 H 22 Z M 42 28 H 54 C 60 28 63 30 63 36 C 63 42 60 45 54 45 H 42 Z',
  S: 'M 76 30 L 62 37 C 60 31 55 27 48 27 C 42 27 38 30 38 35 C 38 40 43 42 52 45 C 67 49 78 55 78 67 C 78 79 67 86 50 86 C 34 86 23 79 20 67 L 35 60 C 38 67 43 72 50 72 C 57 72 62 69 62 64 C 62 59 56 56 47 53 C 32 48 22 43 22 32 C 22 20 34 14 49 14 C 64 14 73 21 76 30 Z',
  T: 'M 14 14 H 86 V 32 H 59 V 86 H 41 V 32 H 14 Z',
  U: 'M 22 14 H 42 V 58 C 42 67 46 72 52 72 C 58 72 62 67 62 58 V 14 H 82 V 58 C 82 76 71 86 52 86 C 33 86 22 76 22 58 Z',
  V: 'M 18 14 H 38 L 50 64 L 62 14 H 82 L 61 86 H 39 Z',
  W: 'M 14 14 H 31 L 42 56 L 50 28 H 58 L 66 56 L 77 14 H 94 L 78 86 H 61 L 54 55 L 47 86 H 30 Z',
  X: 'M 20 14 H 40 L 53 38 L 66 14 H 86 L 66 50 L 88 86 H 68 L 53 60 L 38 86 H 18 L 40 50 Z',
  Y: 'M 18 14 H 38 L 53 43 L 68 14 H 88 L 63 53 V 86 H 43 V 53 Z',
  Z: 'M 20 14 H 82 V 30 L 46 70 H 82 V 86 H 18 V 70 L 54 30 H 20 Z',
  0: 'M 50 14 C 70 14 84 29 84 50 C 84 71 70 86 50 86 C 30 86 16 71 16 50 C 16 29 30 14 50 14 Z M 50 30 C 39 30 34 38 34 50 C 34 62 39 70 50 70 C 61 70 66 62 66 50 C 66 38 61 30 50 30 Z',
  1: 'M 35 14 H 55 V 86 H 35 Z',
  2: 'M 20 14 H 80 V 30 L 46 66 H 80 V 86 H 20 V 70 L 54 34 H 20 Z',
  3: 'M 20 14 H 80 V 42 H 48 V 54 H 80 V 86 H 20 V 70 H 60 V 58 H 36 V 42 H 60 V 30 H 20 Z',
  4: 'M 54 14 H 74 V 86 H 54 V 68 H 20 V 52 L 54 14 Z M 38 52 H 54 V 30 Z',
  5: 'M 20 14 H 80 V 30 H 42 V 46 H 80 V 86 H 20 V 70 H 60 V 62 H 20 Z',
  6: 'M 50 14 C 30 14 20 29 20 50 C 20 71 30 86 50 86 C 70 86 80 71 80 50 C 80 29 70 14 50 14 Z M 50 54 C 42 54 38 58 38 66 C 38 74 42 78 50 78 C 58 78 62 74 62 66 C 62 58 58 54 50 54 Z',
  7: 'M 20 14 H 80 V 32 L 48 86 H 28 L 60 32 H 20 Z',
  8: 'M 50 14 C 70 14 80 23 80 34 C 80 43 73 49 64 51 C 75 53 82 60 82 72 C 82 86 70 86 50 86 C 30 86 18 86 18 72 C 18 60 25 53 36 51 C 27 49 20 43 20 34 C 20 23 30 14 50 14 Z M 50 30 C 44 30 40 33 40 38 C 40 43 44 46 50 46 C 56 46 60 43 60 38 C 60 33 56 30 50 30 Z M 50 54 C 42 54 38 58 38 66 C 38 74 42 78 50 78 C 58 78 62 74 62 66 C 62 58 58 54 50 54 Z',
  9: 'M 50 14 C 30 14 20 29 20 50 C 20 71 30 86 50 86 C 70 86 80 71 80 50 C 80 29 70 14 50 14 Z M 50 22 C 42 22 38 26 38 34 C 38 42 42 46 50 46 C 58 46 62 42 62 34 C 62 26 58 22 50 22 Z',
};

// Extrude 3D letter geometry with beveled edges
function createLetterGeometry(letter) {
  const char = (letter || 'T').toUpperCase().charAt(0);
  const pathD = GLYPH_PATHS[char] || GLYPH_PATHS['T'];

  const svgLoader = new SVGLoader();
  const parsed = svgLoader.parse(`<svg viewBox="0 0 100 100"><path d="${pathD}" /></svg>`);

  const shapes = [];
  parsed.paths.forEach((p) => {
    shapes.push(...p.toShapes(true));
  });

  const extrudeSettings = {
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 3.5,
    bevelSize: 2.2,
    bevelSegments: 4,
    curveSegments: 16,
  };

  const geometry = new THREE.ExtrudeGeometry(shapes, extrudeSettings);
  geometry.center();
  geometry.scale(0.068, -0.068, 0.068);
  geometry.computeVertexNormals();
  return geometry;
}

export default function Lusion3DHero({ initialLetter = 'T', userName = 'Tintin' }) {
  const mountRef = useRef(null);
  const { theme, studioTheme, setStudioTheme, currentPreset } = useTheme();
  const isDark = theme === 'dark';

  // Letter according to user avatar
  const userChar = (initialLetter || 'T').toUpperCase().charAt(0);

  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  // References to communicate with Three.js loop
  const studioThemeRef = useRef(studioTheme);
  const autoRotateRef = useRef(isAutoRotate);
  const charRef = useRef(userChar);
  const updateGeometryRef = useRef(null);
  const updateLightsRef = useRef(null);

  useEffect(() => {
    studioThemeRef.current = studioTheme;
    if (updateLightsRef.current) {
      updateLightsRef.current(currentPreset);
    }
  }, [studioTheme, currentPreset]);

  useEffect(() => {
    autoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  useEffect(() => {
    charRef.current = userChar;
    if (updateGeometryRef.current) {
      updateGeometryRef.current(userChar);
    }
  }, [userChar]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 380;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Dynamic Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.7 : 1.1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.6 : 2.0);
    dirLight.position.set(6, 9, 12);
    scene.add(dirLight);

    const light1 = new THREE.PointLight(currentPreset?.lightColors?.[0] || 0x06b6d4, 4.5, 30);
    scene.add(light1);

    const light2 = new THREE.PointLight(currentPreset?.lightColors?.[1] || 0xa855f7, 4.5, 30);
    scene.add(light2);

    const light3 = new THREE.PointLight(currentPreset?.lightColors?.[2] || 0xf43f5e, 3.8, 30);
    scene.add(light3);

    updateLightsRef.current = (preset) => {
      if (!preset) return;
      light1.color.setHex(preset.lightColors[0]);
      light2.color.setHex(preset.lightColors[1]);
      light3.color.setHex(preset.lightColors[2]);
    };

    // 3. Main 3D Model Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 3D Letter Geometry according to User
    let currentGeo = createLetterGeometry(charRef.current);

    // Mode 1: Chrome Material
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      emissive: 0x0f172a,
      roughness: 0.12,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
    });
    const chromeMesh = new THREE.Mesh(currentGeo, chromeMat);
    mainGroup.add(chromeMesh);

    // Outer wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const wireMesh = new THREE.Mesh(currentGeo, wireMat);
    wireMesh.scale.set(1.025, 1.025, 1.025);
    mainGroup.add(wireMesh);

    // Mode 2: Cyber Core (Holographic Wireframe)
    const holoMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const holoMesh = new THREE.Mesh(currentGeo, holoMat);
    holoMesh.visible = false;
    mainGroup.add(holoMesh);

    // Inner glowing core
    const innerCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 0.95,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
      })
    );
    innerCore.visible = false;
    mainGroup.add(innerCore);

    // Mode 3: Quantum Crystal
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x047857,
      transmission: 0.78,
      opacity: 0.95,
      transparent: true,
      roughness: 0.08,
      metalness: 0.25,
      ior: 1.6,
    });
    const crystalMesh = new THREE.Mesh(currentGeo, crystalMat);
    crystalMesh.visible = false;
    mainGroup.add(crystalMesh);

    // Mode 4: Gyroscope Concentric Planetary Rings
    const gyroRings = new THREE.Group();
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.08, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.9, roughness: 0.2 })
    );
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.0, 0.08, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, metalness: 0.9, roughness: 0.2 })
    );
    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(2.3, 0.08, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.9, roughness: 0.2 })
    );
    gyroRings.add(ring1);
    gyroRings.add(ring2);
    gyroRings.add(ring3);
    gyroRings.visible = false;
    mainGroup.add(gyroRings);

    // Function to swap geometry when user changes
    updateGeometryRef.current = (newChar) => {
      const nextGeo = createLetterGeometry(newChar);
      chromeMesh.geometry.dispose();
      chromeMesh.geometry = nextGeo;
      wireMesh.geometry = nextGeo;
      holoMesh.geometry = nextGeo;
      crystalMesh.geometry = nextGeo;
      currentGeo = nextGeo;
    };

    // 4. Orbiting Satellite Nodes
    const satCount = 20;
    const satellites = [];
    const satGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    for (let i = 0; i < satCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.userData = {
        radius: 3.5 + (i % 3) * 0.6,
        speed: 0.6 + Math.random() * 0.7,
        offset: (i / satCount) * Math.PI * 2,
      };
      mainGroup.add(sat);
      satellites.push(sat);
    }

    // 5. Stardust Particle Cloud
    const particleCount = 450;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 5 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      pPos[i] = radius * Math.cos(theta) * Math.cos(phi);
      pPos[i + 1] = radius * Math.sin(phi);
      pPos[i + 2] = radius * Math.sin(theta) * Math.cos(phi);

      pColors[i] = Math.random() > 0.5 ? 0.38 : 0.65;
      pColors[i + 1] = Math.random() > 0.5 ? 0.74 : 0.36;
      pColors[i + 2] = 0.97;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.45,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);

    // 6. Interactive Drag & Mouse Physics
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    let mouseNormX = 0;
    let mouseNormY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseNormX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNormY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.009;
      targetRotationX += deltaY * 0.009;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      const currentTheme = studioThemeRef.current;
      chromeMesh.visible = currentTheme === 'chrome' || currentTheme === 'gyro';
      wireMesh.visible = currentTheme === 'chrome';
      holoMesh.visible = currentTheme === 'cyber';
      innerCore.visible = currentTheme === 'cyber';
      crystalMesh.visible = currentTheme === 'crystal';
      gyroRings.visible = currentTheme === 'gyro';

      // Light orbit motion
      light1.position.x = Math.sin(elapsedTime * 1.2) * 7;
      light1.position.z = Math.cos(elapsedTime * 1.2) * 7;
      light1.position.y = Math.sin(elapsedTime * 0.8) * 3;

      light2.position.x = Math.cos(elapsedTime * 1.0) * 8;
      light2.position.y = Math.sin(elapsedTime * 1.5) * 6;
      light2.position.z = Math.sin(elapsedTime * 1.0) * 8;

      light3.position.y = Math.cos(elapsedTime * 1.1) * 7;
      light3.position.x = Math.sin(elapsedTime * 0.9) * 6;

      // Auto rotation drift if enabled
      if (autoRotateRef.current && !isDragging) {
        targetRotationY += 0.008;
        targetRotationX = Math.sin(elapsedTime * 0.6) * 0.2;
      }

      // Cursor tilt influence
      const hoverTiltX = mouseNormY * 0.35;
      const hoverTiltY = mouseNormX * 0.35;

      // Smooth lerp damping
      currentRotationX += (targetRotationX + hoverTiltX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY + hoverTiltY - currentRotationY) * 0.08;

      mainGroup.rotation.x = currentRotationX;
      mainGroup.rotation.y = currentRotationY;

      // Gyro rings internal motion
      if (currentTheme === 'gyro') {
        ring1.rotation.x = elapsedTime * 0.8;
        ring2.rotation.y = elapsedTime * 1.1;
        ring3.rotation.z = elapsedTime * 1.4;
      } else if (currentTheme === 'cyber') {
        innerCore.rotation.x = elapsedTime * 0.8;
        innerCore.rotation.y = -elapsedTime * 0.6;
      }

      // Orbiting satellites
      satellites.forEach((sat) => {
        const u = sat.userData;
        const angle = elapsedTime * u.speed + u.offset;
        sat.position.x = Math.cos(angle) * u.radius;
        sat.position.y = Math.sin(angle * 1.4) * (u.radius * 0.45);
        sat.position.z = Math.sin(angle) * u.radius;
      });

      // Background particle drift
      particleSystem.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      currentGeo.dispose();
      chromeMat.dispose();
      wireMat.dispose();
      holoMat.dispose();
      crystalMat.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, [theme, isDark]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950/20 via-slate-900/30 to-violet-950/20 dark:from-white/[0.02] dark:via-indigo-950/30 dark:to-cyan-950/20 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-2xl p-6 sm:p-8 mb-10 transition-all duration-500 shadow-xl group">
      {/* Dynamic Background Neon Glow Aura based on theme */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-50 transition-all duration-700 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${currentPreset.accentColor} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${currentPreset.secondaryColor} 0%, transparent 70%)`,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Information Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-white/[0.05] border border-indigo-500/20 dark:border-white/10 text-[10px] font-mono tracking-widest uppercase text-indigo-600 dark:text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            WORKSPACE 3D STAGE • INITIAL MONOGRAM
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Interactive <span className={`bg-gradient-to-r ${isDark ? currentPreset.primaryGradientText : currentPreset.textGradientLight} bg-clip-text text-transparent transition-all duration-500`}>Workspace</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-white/60 font-light leading-relaxed">
            Interactive 3D initial for your workspace. Rotate the 3D model or select a theme preset below to customize your project management environment.
          </p>

          {/* Theme & Shader Selection */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-white/40 uppercase">
                WORKSPACE THEME PRESETS
              </span>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                {currentPreset.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'chrome', label: `• Chrome ${userChar}`, color: 'from-violet-600 to-indigo-600', ring: 'ring-indigo-400' },
                { id: 'cyber', label: '⚡ Cyber Core', color: 'from-cyan-500 via-teal-500 to-emerald-400', ring: 'ring-cyan-400' },
                { id: 'crystal', label: '💎 Quantum Crystal', color: 'from-emerald-500 via-teal-500 to-amber-400', ring: 'ring-emerald-400' },
                { id: 'gyro', label: '🪐 Gyroscope', color: 'from-pink-500 via-purple-600 to-rose-400', ring: 'ring-pink-400' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setStudioTheme(mode.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 border ${
                    studioTheme === mode.id
                      ? `bg-gradient-to-r ${mode.color} text-white font-bold border-transparent shadow-lg scale-105 ring-2 ${mode.ring}`
                      : 'bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-white/60 border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Footer */}
          <div className="flex items-center gap-3 pt-3 text-[11px] font-mono text-slate-500 dark:text-white/40">
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-white/70 transition-colors border border-slate-200 dark:border-white/10"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isAutoRotate ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              Auto-Rotate: {isAutoRotate ? 'ON' : 'OFF'}
            </button>
            <span className="hidden sm:inline text-slate-300 dark:text-white/20">•</span>
            <span className="hidden sm:inline">Click & drag canvas to spin</span>
          </div>
        </div>

        {/* Right 3D Viewport with interactive canvas */}
        <div className="lg:col-span-7 relative h-[320px] sm:h-[380px] w-full rounded-2xl overflow-hidden bg-slate-950/20 dark:bg-black/40 border border-slate-200/50 dark:border-white/[0.06] shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing">
          {/* Canvas Mount */}
          <div ref={mountRef} className="w-full h-full" />

          {/* Top-Right HUD Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/70 pointer-events-none">
            <span className={`w-2 h-2 rounded-full ${isInteracting ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
            {isInteracting ? 'USER INTERACTION' : `60 FPS • ${currentPreset.name.toUpperCase()}`}
          </div>

          {/* Bottom-Left Instruction Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-white/40 bg-white/70 dark:bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-white/10 pointer-events-none">
            <svg className="w-3.5 h-3.5 text-cyan-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
            Drag to Rotate • 360° Physics
          </div>
        </div>
      </div>
    </div>
  );
}
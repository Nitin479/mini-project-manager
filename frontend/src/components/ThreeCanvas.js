'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeContext';

export default function ThreeCanvas() {
  const mountRef = useRef(null);
  const { theme, studioTheme, currentPreset } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const isDark = theme === 'dark';

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.7 : 1.2);
    scene.add(ambientLight);

    // Dynamic point lights for materials
    const pLight1 = new THREE.PointLight(currentPreset?.lightColors?.[0] || 0x6366f1, isDark ? 3 : 2, 80);
    pLight1.position.set(15, 12, 10);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(currentPreset?.lightColors?.[1] || 0x06b6d4, isDark ? 3 : 2, 80);
    pLight2.position.set(-15, -12, 10);
    scene.add(pLight2);

    // Root theme environment group
    const themeWorldGroup = new THREE.Group();
    scene.add(themeWorldGroup);

    // Track all disposable resources
    const disposables = [ambientLight, pLight1, pLight2];
    const registerDisposable = (item) => {
      if (item) disposables.push(item);
    };

    // Updaters called inside requestAnimationFrame
    const updateCallbacks = [];

    // =========================================================================
    // 🌐 THEME 1: CHROME — Architectural Polyhedra & Interactive Node Constellation
    // =========================================================================
    if (studioTheme === 'chrome') {
      // 1. Floating Corner Dodecahedron & Octahedron
      const dodecaGeo = new THREE.DodecahedronGeometry(6.5, 0);
      const dodecaMat = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.35 : 0.2,
      });
      const dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
      dodecaMesh.position.set(20, 11, -6);
      themeWorldGroup.add(dodecaMesh);
      registerDisposable(dodecaGeo);
      registerDisposable(dodecaMat);

      // Inner glowing core
      const coreGeo = new THREE.OctahedronGeometry(3.5, 0);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.45 : 0.25,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      dodecaMesh.add(coreMesh);
      registerDisposable(coreGeo);
      registerDisposable(coreMat);

      // Bottom-left inverted polyhedron
      const octGeo = new THREE.OctahedronGeometry(6, 0);
      const octMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.3 : 0.18,
      });
      const octMesh = new THREE.Mesh(octGeo, octMat);
      octMesh.position.set(-20, -11, -8);
      themeWorldGroup.add(octMesh);
      registerDisposable(octGeo);
      registerDisposable(octMat);

      // 2. Constellation Network Nodes + Dynamic Linking Lines
      const nodeCount = 90;
      const nodePositions = [];
      const nodeVelocities = [];

      for (let i = 0; i < nodeCount; i++) {
        nodePositions.push({
          x: (Math.random() - 0.5) * 65,
          y: (Math.random() - 0.5) * 45,
          z: (Math.random() - 0.5) * 30,
        });
        nodeVelocities.push({
          vx: (Math.random() - 0.5) * 0.04,
          vy: (Math.random() - 0.5) * 0.04,
          vz: (Math.random() - 0.5) * 0.03,
        });
      }

      const pGeo = new THREE.BufferGeometry();
      const pPosArray = new Float32Array(nodeCount * 3);
      for (let i = 0; i < nodeCount; i++) {
        pPosArray[i * 3] = nodePositions[i].x;
        pPosArray[i * 3 + 1] = nodePositions[i].y;
        pPosArray[i * 3 + 2] = nodePositions[i].z;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPosArray, 3));

      const pMat = new THREE.PointsMaterial({
        color: isDark ? 0x818cf8 : 0x4f46e5,
        size: isDark ? 0.35 : 0.28,
        transparent: true,
        opacity: isDark ? 0.9 : 0.6,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      const nodeParticles = new THREE.Points(pGeo, pMat);
      themeWorldGroup.add(nodeParticles);
      registerDisposable(pGeo);
      registerDisposable(pMat);

      // Connecting line segments
      const maxLines = nodeCount * 4;
      const linePositions = new Float32Array(maxLines * 6);
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: isDark ? 0.18 : 0.1,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
      themeWorldGroup.add(lineMesh);
      registerDisposable(lineGeo);
      registerDisposable(lineMat);

      updateCallbacks.push((elapsed, targetX, targetY) => {
        dodecaMesh.rotation.x = elapsed * 0.15 + targetY;
        dodecaMesh.rotation.y = elapsed * 0.2 + targetX;
        coreMesh.rotation.x = -elapsed * 0.3;
        coreMesh.rotation.y = elapsed * 0.4;

        octMesh.rotation.x = elapsed * 0.12 - targetY;
        octMesh.rotation.y = -elapsed * 0.18 + targetX;

        // Drift nodes
        let lineIdx = 0;
        const posAttr = pGeo.attributes.position;
        const linePosAttr = lineGeo.attributes.position;

        for (let i = 0; i < nodeCount; i++) {
          const np = nodePositions[i];
          const nv = nodeVelocities[i];

          np.x += nv.vx;
          np.y += nv.vy;
          np.z += nv.vz;

          if (np.x < -35 || np.x > 35) nv.vx *= -1;
          if (np.y < -25 || np.y > 25) nv.vy *= -1;
          if (np.z < -20 || np.z > 20) nv.vz *= -1;

          posAttr.setXYZ(i, np.x, np.y, np.z);

          // Find nearby neighbors to draw dynamic links
          for (let j = i + 1; j < nodeCount; j++) {
            if (lineIdx >= maxLines) break;
            const np2 = nodePositions[j];
            const dist = Math.hypot(np.x - np2.x, np.y - np2.y, np.z - np2.z);
            if (dist < 11) {
              linePosAttr.setXYZ(lineIdx * 2, np.x, np.y, np.z);
              linePosAttr.setXYZ(lineIdx * 2 + 1, np2.x, np2.y, np2.z);
              lineIdx++;
            }
          }
        }
        posAttr.needsUpdate = true;
        linePosAttr.needsUpdate = true;
        lineGeo.setDrawRange(0, lineIdx * 2);
      });
    }

    // =========================================================================
    // ⚡ THEME 2: CYBER — Tron Horizon Wave Grid & Digital Matrix Beams
    // =========================================================================
    else if (studioTheme === 'cyber') {
      // 1. Rolling Tron Perspective Wave Grid
      const gridW = 150;
      const gridH = 130;
      const segW = 42;
      const segH = 36;
      const tronGeo = new THREE.PlaneGeometry(gridW, gridH, segW, segH);
      const tronMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.38 : 0.22,
      });
      const tronMesh = new THREE.Mesh(tronGeo, tronMat);
      tronMesh.position.set(0, -15, -12);
      tronMesh.rotation.x = -Math.PI / 2 + 0.16;
      themeWorldGroup.add(tronMesh);
      registerDisposable(tronGeo);
      registerDisposable(tronMat);

      // Save initial vertices
      const posArray = tronGeo.attributes.position.array;
      const originalZ = new Float32Array(posArray.length / 3);
      for (let i = 0; i < originalZ.length; i++) {
        originalZ[i] = posArray[i * 3 + 2];
      }

      // 2. Vertical Digital Matrix Neon Data Beams
      const beamCount = 45;
      const beams = [];
      const beamGeo = new THREE.CylinderGeometry(0.06, 0.06, 7, 6);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: isDark ? 0.65 : 0.35,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });
      registerDisposable(beamGeo);
      registerDisposable(beamMat);

      for (let i = 0; i < beamCount; i++) {
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.set(
          (Math.random() - 0.5) * 70,
          Math.random() * 60 - 30,
          (Math.random() - 0.5) * 35 - 5
        );
        beam.userData = {
          speed: 0.35 + Math.random() * 0.45,
          topY: 32,
          bottomY: -32,
        };
        themeWorldGroup.add(beam);
        beams.push(beam);
      }

      // 3. Floating Holographic Cyber Data Cubes
      const cubeCount = 7;
      const cubes = [];
      const cGeo = new THREE.BoxGeometry(2.8, 2.8, 2.8);
      const cMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.35 : 0.2,
      });
      registerDisposable(cGeo);
      registerDisposable(cMat);

      for (let i = 0; i < cubeCount; i++) {
        const c = new THREE.Mesh(cGeo, cMat);
        const side = i % 2 === 0 ? 1 : -1;
        c.position.set(
          side * (18 + Math.random() * 10),
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 20 - 5
        );
        c.userData = {
          rotSpeedX: (Math.random() - 0.5) * 0.03,
          rotSpeedY: (Math.random() - 0.5) * 0.03,
        };
        themeWorldGroup.add(c);
        cubes.push(c);
      }

      updateCallbacks.push((elapsed, targetX, targetY) => {
        // Tron ground plane wave displacement
        const pos = tronGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const wave = Math.sin(vx * 0.12 + elapsed * 2.5) * Math.cos(vy * 0.14 + elapsed * 2.0) * 1.8;
          pos.setZ(i, wave);
        }
        pos.needsUpdate = true;
        tronMesh.position.x = targetX * 10;

        // Falling matrix beams
        beams.forEach((beam) => {
          beam.position.y -= beam.userData.speed;
          if (beam.position.y < beam.userData.bottomY) {
            beam.position.y = beam.userData.topY;
            beam.position.x = (Math.random() - 0.5) * 70;
            beam.position.z = (Math.random() - 0.5) * 35 - 5;
          }
        });

        // Rotate cyber cubes
        cubes.forEach((c) => {
          c.rotation.x += c.userData.rotSpeedX;
          c.rotation.y += c.userData.rotSpeedY;
        });
      });
    }

    // =========================================================================
    // 💎 THEME 3: CRYSTAL — Multifaceted Gem Shards & Swirling Firefly Vortex
    // =========================================================================
    else if (studioTheme === 'crystal') {
      // 1. Floating Faceted Gem Shards at Peripheral Depths
      const shardCount = 12;
      const shards = [];

      for (let i = 0; i < shardCount; i++) {
        // Alternating between double-pointed hexagonal crystals and octahedrons
        const isPrism = i % 2 === 0;
        const sGeo = isPrism
          ? new THREE.ConeGeometry(1.6 + (i % 3) * 0.4, 5 + (i % 2) * 2, 6)
          : new THREE.OctahedronGeometry(2.2 + (i % 3) * 0.5, 0);

        const sColor = i % 3 === 0 ? 0x10b981 : i % 3 === 1 ? 0x14b8a6 : 0xf59e0b;
        const sMat = new THREE.MeshLambertMaterial({
          color: sColor,
          emissive: isDark ? (i % 3 === 0 ? 0x064e3b : 0x042f2e) : 0x000000,
          transparent: true,
          opacity: isDark ? 0.65 : 0.45,
          wireframe: i % 4 === 0,
        });

        registerDisposable(sGeo);
        registerDisposable(sMat);

        const sMesh = new THREE.Mesh(sGeo, sMat);
        const side = i % 2 === 0 ? 1 : -1;
        const posX = side * (16 + Math.random() * 12);
        const posY = (Math.random() - 0.5) * 32;
        const posZ = (Math.random() - 0.5) * 20 - 5;

        sMesh.position.set(posX, posY, posZ);
        sMesh.userData = {
          baseY: posY,
          bobSpeed: 0.8 + Math.random() * 0.8,
          rotX: (Math.random() - 0.5) * 0.02,
          rotY: (Math.random() - 0.5) * 0.025,
          rotZ: (Math.random() - 0.5) * 0.015,
          offset: Math.random() * Math.PI * 2,
        };

        themeWorldGroup.add(sMesh);
        shards.push(sMesh);
      }

      // 2. Swirling Firefly Bioluminescent Particle Vortex
      const fireflyCount = 750;
      const fGeo = new THREE.BufferGeometry();
      const fPos = new Float32Array(fireflyCount * 3);
      const fColors = new Float32Array(fireflyCount * 3);

      const fc1 = new THREE.Color(0x10b981);
      const fc2 = new THREE.Color(0x34d399);
      const fc3 = new THREE.Color(0xfbbf24);

      const fParams = [];

      for (let i = 0; i < fireflyCount; i++) {
        const radius = 6 + Math.random() * 32;
        const theta = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 50;
        const speed = (0.2 + (1 / (radius * 0.15))) * 0.5;

        fPos[i * 3] = Math.cos(theta) * radius;
        fPos[i * 3 + 1] = height;
        fPos[i * 3 + 2] = Math.sin(theta) * radius;

        const rand = Math.random();
        const c = rand < 0.5 ? fc1 : rand < 0.85 ? fc2 : fc3;
        fColors[i * 3] = c.r;
        fColors[i * 3 + 1] = c.g;
        fColors[i * 3 + 2] = c.b;

        fParams.push({ radius, theta, height, speed });
      }

      fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
      fGeo.setAttribute('color', new THREE.BufferAttribute(fColors, 3));

      const fMat = new THREE.PointsMaterial({
        size: isDark ? 0.38 : 0.28,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.9 : 0.6,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });

      const fireflyMesh = new THREE.Points(fGeo, fMat);
      themeWorldGroup.add(fireflyMesh);
      registerDisposable(fGeo);
      registerDisposable(fMat);

      // 3. Shimmering Diamond Lattice in corner
      const diamondGeo = new THREE.IcosahedronGeometry(7, 0);
      const diamondMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.35 : 0.2,
      });
      const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
      diamondMesh.position.set(-20, 12, -7);
      themeWorldGroup.add(diamondMesh);
      registerDisposable(diamondGeo);
      registerDisposable(diamondMat);

      updateCallbacks.push((elapsed, targetX, targetY) => {
        // Shard tumbling and bobbing
        shards.forEach((s) => {
          const u = s.userData;
          s.position.y = u.baseY + Math.sin(elapsed * u.bobSpeed + u.offset) * 1.6;
          s.rotation.x += u.rotX;
          s.rotation.y += u.rotY;
          s.rotation.z += u.rotZ;
        });

        diamondMesh.rotation.x = elapsed * 0.15 + targetY;
        diamondMesh.rotation.y = elapsed * 0.2 + targetX;

        // Swirling vortex animation
        const pAttr = fGeo.attributes.position;
        for (let i = 0; i < fireflyCount; i++) {
          const fp = fParams[i];
          fp.theta += fp.speed * 0.02;
          const px = Math.cos(fp.theta) * fp.radius;
          const pz = Math.sin(fp.theta) * fp.radius;
          const py = fp.height + Math.sin(elapsed * 1.5 + i) * 1.2;
          pAttr.setXYZ(i, px, py, pz);
        }
        pAttr.needsUpdate = true;
      });
    }

    // =========================================================================
    // 🪐 THEME 4: GYRO — Cosmic Gyroscope Rings, Spiral Galaxy & Shooting Meteors
    // =========================================================================
    else if (studioTheme === 'gyro') {
      // 1. Massive Concentric Celestial Astrolabe Rings
      const ringGroup = new THREE.Group();
      themeWorldGroup.add(ringGroup);

      const r1Geo = new THREE.TorusGeometry(26, 0.35, 16, 120);
      const r1Mat = new THREE.MeshBasicMaterial({
        color: 0xec4899,
        transparent: true,
        opacity: isDark ? 0.6 : 0.35,
        blending: THREE.AdditiveBlending,
      });
      const ring1 = new THREE.Mesh(r1Geo, r1Mat);
      ringGroup.add(ring1);
      registerDisposable(r1Geo);
      registerDisposable(r1Mat);

      const r2Geo = new THREE.TorusGeometry(20, 0.3, 16, 100);
      const r2Mat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: isDark ? 0.65 : 0.4,
        blending: THREE.AdditiveBlending,
      });
      const ring2 = new THREE.Mesh(r2Geo, r2Mat);
      ringGroup.add(ring2);
      registerDisposable(r2Geo);
      registerDisposable(r2Mat);

      const r3Geo = new THREE.TorusGeometry(14, 0.25, 16, 80);
      const r3Mat = new THREE.MeshBasicMaterial({
        color: 0xf43f5e,
        transparent: true,
        opacity: isDark ? 0.7 : 0.42,
        blending: THREE.AdditiveBlending,
      });
      const ring3 = new THREE.Mesh(r3Geo, r3Mat);
      ringGroup.add(ring3);
      registerDisposable(r3Geo);
      registerDisposable(r3Mat);

      ringGroup.position.set(0, 2, -14);
      ringGroup.rotation.x = 0.82;
      ringGroup.rotation.y = 0.25;

      // 2. Swirling Logarithmic Spiral Galaxy
      const galaxyCount = 1100;
      const gGeo = new THREE.BufferGeometry();
      const gPos = new Float32Array(galaxyCount * 3);
      const gColors = new Float32Array(galaxyCount * 3);

      const gc1 = new THREE.Color(0xf472b6);
      const gc2 = new THREE.Color(0xc084fc);
      const gc3 = new THREE.Color(0x38bdf8);

      const branches = 3;
      for (let i = 0; i < galaxyCount; i++) {
        const radius = Math.random() * 40;
        const branchAngle = ((i % branches) * ((2 * Math.PI) / branches));
        const spinAngle = radius * 0.28;

        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2.5;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2.5;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2.5;

        gPos[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        gPos[i * 3 + 1] = randomY * 2.0;
        gPos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ - 6;

        const mixed = radius < 15 ? gc1 : radius < 28 ? gc2 : gc3;
        gColors[i * 3] = mixed.r;
        gColors[i * 3 + 1] = mixed.g;
        gColors[i * 3 + 2] = mixed.b;
      }

      gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
      gGeo.setAttribute('color', new THREE.BufferAttribute(gColors, 3));

      const gMat = new THREE.PointsMaterial({
        size: isDark ? 0.45 : 0.32,
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.85 : 0.55,
        blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      });

      const galaxyMesh = new THREE.Points(gGeo, gMat);
      themeWorldGroup.add(galaxyMesh);
      registerDisposable(gGeo);
      registerDisposable(gMat);

      // 3. Shooting Meteors / Celestial Streaks
      const meteorCount = 4;
      const meteors = [];

      for (let i = 0; i < meteorCount; i++) {
        const mPoints = [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(4.5, 3.2, 0),
        ];
        const mGeo = new THREE.BufferGeometry().setFromPoints(mPoints);
        const mMat = new THREE.LineBasicMaterial({
          color: 0xfbcfe8,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
        });
        registerDisposable(mGeo);
        registerDisposable(mMat);

        const mLine = new THREE.Line(mGeo, mMat);
        themeWorldGroup.add(mLine);

        meteors.push({
          line: mLine,
          mat: mMat,
          active: false,
          delay: Math.random() * 3,
          speed: 0.9 + Math.random() * 0.6,
          x: 0,
          y: 0,
          z: 0,
        });
      }

      updateCallbacks.push((elapsed, targetX, targetY) => {
        // Gyro rings harmonic multi-axis rotation
        ring1.rotation.x = elapsed * 0.45;
        ring1.rotation.y = elapsed * 0.35;

        ring2.rotation.y = elapsed * 0.6;
        ring2.rotation.z = elapsed * 0.5;

        ring3.rotation.x = -elapsed * 0.55;
        ring3.rotation.z = elapsed * 0.7;

        ringGroup.rotation.x = 0.5 + targetY * 0.5;
        ringGroup.rotation.y = targetX * 0.6;

        // Galaxy slow majestic spin
        galaxyMesh.rotation.y = elapsed * 0.035 + targetX * 0.4;

        // Shooting meteors
        meteors.forEach((m) => {
          if (!m.active) {
            m.delay -= 0.016;
            if (m.delay <= 0) {
              m.active = true;
              m.x = 25 + Math.random() * 20;
              m.y = 20 + Math.random() * 15;
              m.z = (Math.random() - 0.5) * 15;
              m.line.position.set(m.x, m.y, m.z);
              m.mat.opacity = 0.9;
            }
          } else {
            m.x -= m.speed * 1.5;
            m.y -= m.speed * 1.1;
            m.line.position.set(m.x, m.y, m.z);
            m.mat.opacity -= 0.015;

            if (m.mat.opacity <= 0 || m.x < -35 || m.y < -30) {
              m.active = false;
              m.mat.opacity = 0;
              m.delay = 1.5 + Math.random() * 3.5;
            }
          }
        });
      });
    }

    // =========================================================================
    // 🖱 Mouse Interactive Parallax Tracking
    // =========================================================================
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.001;
      mouseY = (e.clientY - windowHalfY) * 0.001;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // =========================================================================
    // 🔄 Animation Loop
    // =========================================================================
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Mouse damping lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Camera subtle parallax
      camera.position.x = targetX * 4;
      camera.position.y = -targetY * 4;
      camera.lookAt(0, 0, 0);

      // Execute theme-specific animation updates
      for (let i = 0; i < updateCallbacks.length; i++) {
        updateCallbacks[i](elapsed, targetX, targetY);
      }

      renderer.render(scene, camera);
    };

    animate();

    // =========================================================================
    // 🧹 Cleanup on Unmount or Theme Change
    // =========================================================================
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      disposables.forEach((item) => {
        if (item && typeof item.dispose === 'function') {
          item.dispose();
        }
      });

      renderer.dispose();
    };
  }, [theme, studioTheme, currentPreset]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700"
    />
  );
}

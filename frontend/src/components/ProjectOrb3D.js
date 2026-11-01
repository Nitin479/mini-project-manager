'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from './ThemeContext';

export default function ProjectOrb3D({ taskCount = 0 }) {
  const mountRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 180;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const isDark = theme === 'dark';

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.2);
    scene.add(ambient);

    const point = new THREE.PointLight(0x06b6d4, 3, 20);
    point.position.set(3, 3, 4);
    scene.add(point);

    const pinkPoint = new THREE.PointLight(0xa855f7, 3, 20);
    pinkPoint.position.set(-3, -2, 3);
    scene.add(pinkPoint);

    // 3D Gem Group
    const group = new THREE.Group();
    scene.add(group);

    // Gem Geometry
    const gemGeo = new THREE.OctahedronGeometry(1.6, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      emissive: 0x1e1b4b,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    group.add(gem);

    // Outer Wireframe
    const wireGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.4 : 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    group.add(wireMesh);

    // Tiny orbiting beads
    const beadCount = Math.max(3, Math.min(taskCount, 12));
    const beads = [];
    const beadGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const beadMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    for (let i = 0; i < beadCount; i++) {
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.userData = {
        angle: (i / beadCount) * Math.PI * 2,
        speed: 0.8 + (i % 3) * 0.2,
        radius: 2.5,
      };
      group.add(bead);
      beads.push(bead);
    }

    let frameId;
    const startTime = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) * 0.001;

      group.rotation.x = t * 0.3;
      group.rotation.y = t * 0.45;

      beads.forEach((b) => {
        const a = t * b.userData.speed + b.userData.angle;
        b.position.x = Math.cos(a) * b.userData.radius;
        b.position.z = Math.sin(a) * b.userData.radius;
        b.position.y = Math.sin(a * 2) * 0.5;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      gemGeo.dispose();
      gemMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      beadGeo.dispose();
      beadMat.dispose();
    };
  }, [theme, taskCount]);

  return (
    <div
      ref={mountRef}
      className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 pointer-events-none select-none"
    />
  );
}
'use client';

import { useState, useRef } from 'react';

export default function CardTilt3D({ children, className = '', maxTilt = 12 }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
  });
  const [glare, setGlare] = useState({
    opacity: 0,
    x: 50,
    y: 50,
  });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px) scale3d(1.025, 1.025, 1.025)`,
      transition: 'transform 0.08s ease-out',
    });

    setGlare({
      opacity: 0.2,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
    });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={`relative transform-gpu will-change-transform ${className}`}
    >
      {/* 3D Specular Glare Reflection */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-20 overflow-hidden"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`,
        }}
      />
      {children}
    </div>
  );
}

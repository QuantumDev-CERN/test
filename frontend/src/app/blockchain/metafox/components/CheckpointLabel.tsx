'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';

interface CheckpointLabelProps {
  id: string;
  position: THREE.Vector3;
  camera: THREE.PerspectiveCamera | null;
  text: string;
  subtext: string;
  color: string;
  modelPosition?: THREE.Vector3;
}

const CheckpointLabel: React.FC<CheckpointLabelProps> = ({
  id,
  position,
  camera,
  text,
  subtext,
  color,
  modelPosition
}) => {
  const [screenPosition, setScreenPosition] = useState({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(16);
  const [labelColor, setLabelColor] = useState(color);

  useEffect(() => {
    if (!camera) return;

    const updatePosition = () => {
      const screenPos = position.clone().project(camera);
      setScreenPosition({
        x: (screenPos.x * 0.5 + 0.5) * window.innerWidth - 80,
        y: (-screenPos.y * 0.5 + 0.5) * window.innerHeight - 30
      });
    };

    // Update position continuously to follow camera movement
    const interval = setInterval(updatePosition, 16); // ~60fps
    updatePosition();

    // Check proximity to model
    if (modelPosition) {
      const distance = modelPosition.distanceTo(new THREE.Vector3(position.x, 0, position.z));
      if (distance < 3) {
        setFontSize(20);
        setLabelColor(color === "#00ff00" ? "#88ffaa" : "#ffaa44");
      } else {
        setFontSize(16);
        setLabelColor(color);
      }
    }

    const handleResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [position, camera, modelPosition, color]);

  return (
    <div
      id={id}
      className="absolute pointer-events-none text-center font-bold"
      style={{
        left: `${screenPosition.x}px`,
        top: `${screenPosition.y}px`,
        color: labelColor,
        fontSize: `${fontSize}px`,
        fontFamily: 'Arial, sans-serif',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        zIndex: 10
      }}
    >
      {text}<br />
      {subtext}
    </div>
  );
};

export default CheckpointLabel;

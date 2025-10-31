import { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CustomNodeData } from '../types';

interface CustomNodeProps {
  data: CustomNodeData;
  selected?: boolean;
}

export function CustomNode({ data, selected }: CustomNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const backgroundColor = data?.color || '#3b82f6';
  const borderColor = data?.borderColor || '#2563eb';

  const getSkillLevel = () => {
    if (backgroundColor === '#22c55e') return 'Beginner';
    if (backgroundColor === '#f59e0b') return 'Intermediate';
    if (backgroundColor === '#3b82f6') return 'Advanced';
    if (backgroundColor === '#8b5cf6') return 'Expert';
    if (backgroundColor === '#ec4899') return 'Master';
    return 'Advanced';
  };

  const skillLevel = getSkillLevel();

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-5), 
          {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100
          }
        ]);
      }, 200);

      return () => clearInterval(interval);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  if (!data) {
    return null;
  }



  return (
    <div 
      className="creative-node-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: selected ? 'brightness(1.2)' : 'brightness(1)',
      }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="floating-particle"
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: '4px',
            height: '4px',
            background: backgroundColor,
            borderRadius: '50%',
            opacity: 0.6,
            animation: 'floatUp 2s ease-out forwards',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          inset: '-4px',
          background: `linear-gradient(45deg, ${backgroundColor}40, ${borderColor}40)`,
          borderRadius: '12px',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          filter: 'blur(8px)',
          zIndex: 1
        }}
      />

      
      <div 
        className="main-node"
        style={{
          position: 'relative',
          backgroundColor,
          color: '#ffffff',
          border: `3px solid ${borderColor}`,
          borderRadius: '12px',
          boxShadow: isHovered 
            ? `0 8px 25px ${backgroundColor}60, 0 0 0 1px ${backgroundColor}30`
            : `0 4px 12px ${backgroundColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'clamp(120px, 16vw, 160px)',
          height: 'clamp(50px, 8vh, 60px)',
          fontSize: 'clamp(11px, 2.2vw, 15px)',
          fontWeight: '700',
          textAlign: 'center',
          padding: 'clamp(6px, 1.2vw, 10px)',
          minWidth: '100px',
          minHeight: '45px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 3,
          background: isHovered 
            ? `linear-gradient(135deg, ${backgroundColor}, ${borderColor})`
            : backgroundColor,
          animation: selected ? 'pulse 2s infinite' : 'none'
        }}
      >
        <Handle 
          type="target" 
          position={Position.Top} 
          style={{ 
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            border: `2px solid ${borderColor}`,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} 
        />



        <div
          style={{
            position: 'absolute',
            top: '-6px',
            left: '-6px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            fontSize: '8px',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: '600',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 10
          }}
        >
          {skillLevel}
        </div>

        <div style={{ 
          padding: '0 6px', 
          lineHeight: '1.3',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 2
        }}>
          {data.label}
        </div>



        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ 
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            border: `2px solid ${borderColor}`,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} 
        />
      </div>

      {isHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            marginBottom: '8px',
            zIndex: 20,
            animation: 'tooltipSlideIn 0.2s ease-out',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '2px' }}>{data.label}</div>
          <div style={{ opacity: 0.8, fontSize: '10px' }}>
            {skillLevel}
          </div>
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(0,0,0,0.9)'
            }}
          />
        </div>
      )}
    </div>
  );
}
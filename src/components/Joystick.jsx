import { useState, useRef, useEffect } from 'react';

export function Joystick({ onMove, size = 120, position = 'bottom-right' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [basePosition, setBasePosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef(null);
  const baseRef = useRef(null);

  const maxDistance = size / 2 - 20; // Leave some margin

  useEffect(() => {
    const updateBasePosition = () => {
      if (baseRef.current) {
        const rect = baseRef.current.getBoundingClientRect();
        const newBasePosition = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        setBasePosition(newBasePosition);
      }
    };
    
    updateBasePosition();
    
    // Update position on window resize
    window.addEventListener('resize', updateBasePosition);
    
    // Global touch event handlers for better mobile support
    const handleGlobalTouchMove = (e) => {
      if (isDragging) {
        e.preventDefault();
        updateJoystickPosition(e);
      }
    };
    
    const handleGlobalTouchEnd = (e) => {
      if (isDragging) {
        e.preventDefault();
        setIsDragging(false);
        setJoystickPosition({ x: 0, y: 0 });
        onMove({ x: 0, y: 0 });
      }
    };
    
    document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener('resize', updateBasePosition);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, onMove]);

  const handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    updateJoystickPosition(e);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) {
      updateJoystickPosition(e);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setJoystickPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateJoystickPosition(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateJoystickPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setJoystickPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  const updateJoystickPosition = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Get the joystick container position
    const containerRect = baseRef.current.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    let x, y;
    if (distance > maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      x = Math.cos(angle) * maxDistance;
      y = Math.sin(angle) * maxDistance;
    } else {
      x = deltaX;
      y = deltaY;
    }

    setJoystickPosition({ x, y });

    // Normalize values between -1 and 1
    const normalizedX = x / maxDistance;
    const normalizedY = y / maxDistance; // Remove Y inversion for correct direction
    
    // Apply smaller deadzone for better responsiveness
    const deadzone = 0.05;
    const finalX = Math.abs(normalizedX) > deadzone ? normalizedX : 0;
    const finalY = Math.abs(normalizedY) > deadzone ? normalizedY : 0;



    onMove({ x: finalX, y: finalY });
  };

  // Position classes
  const getPositionClass = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div 
      className={`fixed ${getPositionClass()} z-20 select-none`}
      style={{ width: size, height: size }}
    >
             {/* Joystick Base */}
       <div
         ref={baseRef}
         className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-full border-2 border-white/50"
         style={{ 
           width: size, 
           height: size,
           touchAction: 'none' // Prevent default touch behaviors
         }}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}
       />

             {/* Joystick Handle */}
       <div
         ref={joystickRef}
         className="absolute bg-white/80 backdrop-blur-sm rounded-full border-2 border-white shadow-lg transition-all duration-150 cursor-pointer"
         style={{
           width: size * 0.4,
           height: size * 0.4,
           left: size / 2 - (size * 0.4) / 2 + joystickPosition.x,
           top: size / 2 - (size * 0.4) / 2 + joystickPosition.y,
           transform: isDragging ? 'scale(1.15)' : 'scale(1)',
           boxShadow: isDragging ? '0 0 20px rgba(255,255,255,0.3)' : '0 4px 8px rgba(0,0,0,0.2)',
           touchAction: 'none', // Prevent default touch behaviors
         }}
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
       />

      {/* Center Dot */}
      <div
        className="absolute bg-white/60 rounded-full"
        style={{
          width: 8,
          height: 8,
          left: size / 2 - 4,
          top: size / 2 - 4,
        }}
      />
    </div>
  );
} 
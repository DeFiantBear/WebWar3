import { useEffect, useRef, useState } from "react";

export const EnhancedJoystick = ({ onMove, onFire, onFireEnd }) => {
  const joystickRef = useRef(null);
  const fireButtonRef = useRef(null);
  
  const [isJoystickPressed, setIsJoystickPressed] = useState(false);
  const [isFirePressed, setIsFirePressed] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [containerRect, setContainerRect] = useState(null);

  const deadzone = 0.02;
  const maxDistance = 50;

  useEffect(() => {
    const joystick = joystickRef.current;
    if (joystick) {
      const rect = joystick.getBoundingClientRect();
      setContainerRect(rect);
    }
  }, []);

  const updateJoystickPosition = (clientX, clientY) => {
    if (!containerRect) return;

    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;

    const x = clientX - centerX;
    const y = clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);

    if (distance > maxDistance) {
      const angle = Math.atan2(x, y);
      const limitedX = Math.sin(angle) * maxDistance;
      const limitedY = Math.cos(angle) * maxDistance;
      setJoystickPosition({ x: limitedX, y: limitedY });
    } else {
      setJoystickPosition({ x, y });
    }

    const normalizedX = x / maxDistance;
    const normalizedY = y / maxDistance;
    const magnitude = Math.min(distance / maxDistance, 1);

    if (magnitude > deadzone) {
      const angle = Math.atan2(normalizedX, normalizedY);
      onMove?.({ x: normalizedX, y: normalizedY, angle, magnitude });
    } else {
      onMove?.({ x: 0, y: 0, angle: 0, magnitude: 0 });
    }
  };

  const handleJoystickStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsJoystickPressed(true);
    updateJoystickPosition(e.clientX, e.clientY);
  };

  const handleJoystickEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsJoystickPressed(false);
    setJoystickPosition({ x: 0, y: 0 });
    onMove?.({ x: 0, y: 0, angle: 0, magnitude: 0 });
  };

  const handleFireStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFirePressed(true);
    onFire?.();
  };

  const handleFireEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFirePressed(false);
    onFireEnd?.();
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const element = e.target;
    
    if (element === joystickRef.current) {
      setIsJoystickPressed(true);
      updateJoystickPosition(touch.clientX, touch.clientY);
    } else if (element === fireButtonRef.current) {
      setIsFirePressed(true);
      onFire?.();
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isJoystickPressed && e.touches[0]) {
      const touch = e.touches[0];
      updateJoystickPosition(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isJoystickPressed) {
      setIsJoystickPressed(false);
      setJoystickPosition({ x: 0, y: 0 });
      onMove?.({ x: 0, y: 0, angle: 0, magnitude: 0 });
    }
    if (isFirePressed) {
      setIsFirePressed(false);
      onFireEnd?.();
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isJoystickPressed) {
        updateJoystickPosition(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = (e) => {
      if (isJoystickPressed) {
        handleJoystickEnd(e);
      }
      if (isFirePressed) {
        handleFireEnd(e);
      }
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isJoystickPressed, isFirePressed]);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex gap-4">
      <div
        ref={joystickRef}
        className="relative w-24 h-24 bg-gray-800 rounded-full border-2 border-gray-600 touch-none"
        style={{ touchAction: "none" }}
        onMouseDown={handleJoystickStart}
        onTouchStart={handleTouchStart}
      >
        <div
          className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-blue-300 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
          }}
        />
      </div>

      <div
        ref={fireButtonRef}
        className={`w-16 h-16 rounded-full border-2 touch-none flex items-center justify-center text-white font-bold text-sm ${
          isFirePressed
            ? "bg-red-600 border-red-400"
            : "bg-red-500 border-red-300"
        }`}
        style={{ touchAction: "none" }}
        onMouseDown={handleFireStart}
        onTouchStart={handleTouchStart}
      >
        FIRE
      </div>
    </div>
  );
}; 
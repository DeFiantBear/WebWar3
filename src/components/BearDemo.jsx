import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { CharacterBearGLTF } from "./CharacterBearGLTF";
import { Joystick } from "./Joystick";

export function BearDemo() {
  const [color, setColor] = useState("#3b82f6");
  const [animation, setAnimation] = useState("Idle");
  const [movement, setMovement] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  const handleJoystickMove = (joystickMovement) => {
    setMovement(joystickMovement);
    
    // Auto-set animation based on movement with smooth transitions
    const isMoving = Math.abs(joystickMovement.x) > 0.02 || Math.abs(joystickMovement.y) > 0.02;
    
    if (isMoving) {
      if (animation !== "Run" && animation !== "Run_Shoot") {
        setAnimation("Run");
      }
    } else {
      if (animation === "Run" || animation === "Run_Shoot") {
        setAnimation("Idle");
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-900 to-purple-900">

      {/* 3D Scene */}
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
        className="w-full h-full"
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment */}
        <Environment preset="sunset" />
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2d3748" />
        </mesh>

        {/* Bear Character */}
        <CharacterBearGLTF
          color={color}
          animation={animation}
          weapon="None"
          position={[0, 0, 0]}
          movement={movement}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
        />


      </Canvas>

      {/* Mobile Joystick */}
      {isMobile && (
        <Joystick 
          onMove={handleJoystickMove}
          size={120}
          position="bottom-left"
        />
      )}
    </div>
  );
} 
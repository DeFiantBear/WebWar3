import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stats } from "@react-three/drei";
import { CharacterBearGLTF } from "./CharacterBearGLTF";
import { useSoundManager } from "./SoundManager";
import { Joystick } from "./Joystick";

export function BearDemo() {
  const [color, setColor] = useState("#3b82f6");
  const [animation, setAnimation] = useState("Idle");
  const [weapon, setWeapon] = useState("AK");
  const [showStats, setShowStats] = useState(false);
  const [movement, setMovement] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  const { playRifle, playHurt, playDead } = useSoundManager(0.3);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAnimationChange = (newAnimation) => {
    setAnimation(newAnimation);
    
    // Play appropriate sound based on animation
    if (newAnimation === "Run_Shoot") {
      playRifle();
    } else if (newAnimation === "Hurt") {
      playHurt();
    } else if (newAnimation === "Dead") {
      playDead();
    }
  };

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
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
        <h2 className="text-xl font-bold mb-4">Bear Character Demo</h2>
        
        <div className="space-y-4">
          {/* Color Control */}
          <div>
            <label className="block text-sm font-medium mb-2">Color:</label>
            <div className="flex gap-2">
              {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Animation Control */}
          <div>
            <label className="block text-sm font-medium mb-2">Animation:</label>
            <select
              value={animation}
              onChange={(e) => handleAnimationChange(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
            >
              <option value="Idle">Idle</option>
              <option value="Run">Run</option>
              <option value="Run_Shoot">Run & Shoot</option>
              <option value="Hurt">Hurt</option>
              <option value="Dead">Dead</option>
            </select>
          </div>

          {/* Weapon Control */}
          <div>
            <label className="block text-sm font-medium mb-2">Weapon:</label>
            <select
              value={weapon}
              onChange={(e) => setWeapon(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
            >
              <option value="None">None</option>
              <option value="AK">AK-47</option>
              <option value="Pistol">Pistol</option>
              <option value="Shotgun">Shotgun</option>
              <option value="Sword">Sword</option>
            </select>
          </div>

          {/* Stats Toggle */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showStats}
                onChange={(e) => setShowStats(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Show Stats</span>
            </label>
          </div>

          {/* Sound Test Buttons */}
          <div>
            <label className="block text-sm font-medium mb-2">Test Sounds:</label>
            <div className="flex gap-2">
              <button
                onClick={playRifle}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Rifle
              </button>
              <button
                onClick={playHurt}
                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
              >
                Hurt
              </button>
              <button
                onClick={playDead}
                className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
              >
                Dead
              </button>
            </div>
          </div>
        </div>
      </div>

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
          weapon={weapon}
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

        {/* Stats */}
        {showStats && <Stats />}
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
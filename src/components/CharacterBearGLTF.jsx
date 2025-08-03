import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial } from "three";

export function CharacterBearGLTF({
  color = "#3b82f6", // Primary blue
  animation = "Idle",
  weapon = "AK",
  position = [0, 0, 0],
  movement = { x: 0, y: 0 },
  ...props
}) {
  const group = useRef();
  const timeRef = useRef(0);
  const [currentPosition, setCurrentPosition] = useState([...position]);

  // Optimized materials - created once and reused
  const materials = useMemo(() => ({
    main: new MeshStandardMaterial({ color }),
    dark: new MeshStandardMaterial({ color: "#1e40af" }),
    light: new MeshStandardMaterial({ color: "#60a5fa" }),
    accent: new MeshStandardMaterial({ color: "#93c5fd" }),
    black: new MeshStandardMaterial({ color: "#1e3a8a" }),
    weapon: new MeshStandardMaterial({ color: "#374151" }), // Dark gray for weapons
    wood: new MeshStandardMaterial({ color: "#92400e" }), // Brown for weapon stocks
    metal: new MeshStandardMaterial({ color: "#6b7280" }) // Light gray for metal parts
  }), [color]);

  // Update animation time continuously - optimized for mobile
  useFrame((_, delta) => {
    timeRef.current += delta * 4; // Slightly reduced for better mobile performance
    
    // Handle movement
    if (movement.x !== 0 || movement.y !== 0) {
      const speed = 5; // Movement speed
      const newX = currentPosition[0] + movement.x * speed * delta;
      const newZ = currentPosition[2] + movement.y * speed * delta;
      setCurrentPosition([newX, currentPosition[1], newZ]);
    }
  });

  // Calculate arm and leg rotations based on animation - optimized
  const getArmRotation = (side) => {
    if (animation === "Run" || animation === "Run_Shoot") {
      const offset = side === "left" ? 0 : Math.PI;
      return Math.sin(timeRef.current + offset) * 0.25; // Reduced rotation for smoother mobile
    }
    return 0;
  };

  const getLegRotation = (side) => {
    if (animation === "Run" || animation === "Run_Shoot") {
      const offset = side === "left" ? Math.PI : 0;
      return Math.sin(timeRef.current + offset) * 0.15; // Reduced rotation for smoother mobile
    }
    return 0;
  };

  // Weapon rendering component
  const renderWeapon = () => {
    if (!weapon || weapon === "None") return null;

    switch (weapon) {
      case "AK":
        return (
          <group position={[0.8, 1.4, 0]} rotation={[0, 0, -0.3]}>
            {/* AK-47 Body */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[1.2, 0.15, 0.15]} />
              <primitive object={materials.weapon} />
            </mesh>
            {/* AK-47 Barrel */}
            <mesh castShadow receiveShadow position={[0.6, 0, 0]}>
              <boxGeometry args={[0.4, 0.08, 0.08]} />
              <primitive object={materials.metal} />
            </mesh>
            {/* AK-47 Stock */}
            <mesh castShadow receiveShadow position={[-0.6, 0, 0]}>
              <boxGeometry args={[0.3, 0.12, 0.12]} />
              <primitive object={materials.wood} />
            </mesh>
            {/* AK-47 Magazine */}
            <mesh castShadow receiveShadow position={[0.2, -0.1, 0]}>
              <boxGeometry args={[0.15, 0.25, 0.08]} />
              <primitive object={materials.weapon} />
            </mesh>
          </group>
        );
      
      case "Pistol":
        return (
          <group position={[0.6, 1.5, 0]} rotation={[0, 0, -0.2]}>
            {/* Pistol Body */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.4, 0.12, 0.08]} />
              <primitive object={materials.weapon} />
            </mesh>
            {/* Pistol Barrel */}
            <mesh castShadow receiveShadow position={[0.2, 0, 0]}>
              <boxGeometry args={[0.2, 0.08, 0.06]} />
              <primitive object={materials.metal} />
            </mesh>
            {/* Pistol Grip */}
            <mesh castShadow receiveShadow position={[-0.1, -0.15, 0]}>
              <boxGeometry args={[0.08, 0.25, 0.06]} />
              <primitive object={materials.wood} />
            </mesh>
          </group>
        );
      
      case "Shotgun":
        return (
          <group position={[0.9, 1.3, 0]} rotation={[0, 0, -0.4]}>
            {/* Shotgun Body */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[1.0, 0.18, 0.18]} />
              <primitive object={materials.weapon} />
            </mesh>
            {/* Shotgun Barrel */}
            <mesh castShadow receiveShadow position={[0.5, 0, 0]}>
              <boxGeometry args={[0.3, 0.12, 0.12]} />
              <primitive object={materials.metal} />
            </mesh>
            {/* Shotgun Stock */}
            <mesh castShadow receiveShadow position={[-0.5, 0, 0]}>
              <boxGeometry args={[0.4, 0.15, 0.15]} />
              <primitive object={materials.wood} />
            </mesh>
          </group>
        );
      
      case "Sword":
        return (
          <group position={[0.7, 1.4, 0]} rotation={[0, 0, -0.1]}>
            {/* Sword Blade */}
            <mesh castShadow receiveShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.8, 0.08, 0.02]} />
              <primitive object={materials.metal} />
            </mesh>
            {/* Sword Handle */}
            <mesh castShadow receiveShadow position={[-0.4, 0, 0]}>
              <boxGeometry args={[0.2, 0.06, 0.06]} />
              <primitive object={materials.wood} />
            </mesh>
            {/* Sword Guard */}
            <mesh castShadow receiveShadow position={[-0.3, 0, 0]}>
              <boxGeometry args={[0.05, 0.15, 0.05]} />
              <primitive object={materials.metal} />
            </mesh>
          </group>
        );
      
      default:
        return null;
    }
  };

  // Optimized bear - reduced complexity for mobile
  // Bear stomach area optimized - no collision issues
  return (
    <group {...props} dispose={null} ref={group} position={currentPosition}>
      {/* Main Body - Core structure */}
      <mesh castShadow receiveShadow position={[0, 1.3, 0]}>
        <boxGeometry args={[1.2, 1.2, 0.8]} />
        <primitive object={materials.main} />
      </mesh>

      {/* Head - Main structure */}
      <mesh castShadow receiveShadow position={[0, 2.2, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <primitive object={materials.main} />
      </mesh>

      {/* Snout - Simplified */}
      <mesh castShadow receiveShadow position={[0, 2.0, 0.4]}>
        <boxGeometry args={[0.6, 0.4, 0.3]} />
        <primitive object={materials.dark} />
      </mesh>

      {/* Ears - Simplified */}
      <mesh castShadow receiveShadow position={[-0.4, 2.6, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <primitive object={materials.dark} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.4, 2.6, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <primitive object={materials.dark} />
      </mesh>

      {/* Eyes - Simplified */}
      <mesh castShadow receiveShadow position={[-0.2, 2.3, 0.45]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <primitive object={materials.black} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.2, 2.3, 0.45]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <primitive object={materials.black} />
      </mesh>

      {/* Nose */}
      <mesh castShadow receiveShadow position={[0, 2.0, 0.55]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <primitive object={materials.black} />
      </mesh>

      {/* Left Arm - Animated */}
      <group position={[-0.6, 1.2, 0]} rotation={[getArmRotation("left"), 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <primitive object={materials.main} />
        </mesh>
        
        {/* Left Paw - Simplified */}
        <mesh castShadow receiveShadow position={[0, -0.6, 0]}>
          <boxGeometry args={[0.45, 0.2, 0.45]} />
          <primitive object={materials.dark} />
        </mesh>
      </group>

      {/* Right Arm - Animated */}
      <group position={[0.6, 1.2, 0]} rotation={[getArmRotation("right"), 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <primitive object={materials.main} />
        </mesh>
        
        {/* Right Paw - Simplified */}
        <mesh castShadow receiveShadow position={[0, -0.6, 0]}>
          <boxGeometry args={[0.45, 0.2, 0.45]} />
          <primitive object={materials.dark} />
        </mesh>
      </group>

      {/* Left Leg - Animated */}
      <group position={[-0.3, 0.6, 0]} rotation={[getLegRotation("left"), 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <primitive object={materials.main} />
        </mesh>
        
        {/* Left Foot - Simplified */}
        <mesh castShadow receiveShadow position={[0, -0.6, 0.1]}>
          <boxGeometry args={[0.45, 0.2, 0.55]} />
          <primitive object={materials.dark} />
        </mesh>
      </group>

      {/* Right Leg - Animated */}
      <group position={[0.3, 0.6, 0]} rotation={[getLegRotation("right"), 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.8, 0.4]} />
          <primitive object={materials.main} />
        </mesh>
        
        {/* Right Foot - Simplified */}
        <mesh castShadow receiveShadow position={[0, -0.6, 0.1]}>
          <boxGeometry args={[0.45, 0.2, 0.55]} />
          <primitive object={materials.dark} />
        </mesh>
      </group>

      {/* Tail - Simplified */}
      <mesh castShadow receiveShadow position={[0, 1.2, -0.4]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <primitive object={materials.main} />
      </mesh>

      {/* Weapon */}
      {renderWeapon()}
    </group>
  );
} 
import { Loader, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useState } from "react";
import { CharacterController } from "./CharacterController";
import { EnhancedJoystick } from "./EnhancedJoystick";
import { Bullet } from "./Bullet";
import { BulletHit } from "./BulletHit";
import { Map } from "./Map";

export const BearDemo = () => {
  const [bullets, setBullets] = useState([]);
  const [hits, setHits] = useState([]);
  const [joystickState, setJoystickState] = useState({
    x: 0,
    y: 0,
    angle: 0,
    magnitude: 0,
    isJoystickPressed: false,
    isFirePressed: false,
  });

  const onFire = (bullet) => {
    setBullets((prev) => [...prev, bullet]);
  };

  const onHit = (bulletId, position) => {
    setBullets((prev) => prev.filter((bullet) => bullet.id !== bulletId));
    setHits((prev) => [...prev, { id: bulletId, position }]);
  };

  const onHitEnded = (hitId) => {
    setHits((prev) => prev.filter((h) => h.id !== hitId));
  };

  const onKilled = (victim, killer) => {
    console.log(`${killer} killed ${victim}`);
  };

  const handleJoystickMove = (data) => {
    setJoystickState((prev) => ({
      ...prev,
      ...data,
      isJoystickPressed: data.magnitude > 0.02,
    }));
  };

  const handleFire = () => {
    setJoystickState((prev) => ({ ...prev, isFirePressed: true }));
  };

  const handleFireEnd = () => {
    setJoystickState((prev) => ({ ...prev, isFirePressed: false }));
  };

  const joystick = {
    angle: () => joystickState.angle,
    isJoystickPressed: () => joystickState.isJoystickPressed,
    isPressed: (button) => button === "fire" && joystickState.isFirePressed,
  };

  return (
    <div className="w-full h-screen bg-black">
      <Loader />
      <Canvas
        shadows
        camera={{ position: [0, 30, 0], fov: 30, near: 2 }}
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        <color attach="background" args={["#242424"]} />
        <SoftShadows size={42} />
        
        <Suspense>
          <Physics>
            <Map />
            <CharacterController
              joystick={joystick}
              userPlayer={true}
              onKilled={onKilled}
              onFire={onFire}
            />
            {bullets.map((bullet) => (
              <Bullet
                key={bullet.id}
                {...bullet}
                onHit={(position) => onHit(bullet.id, position)}
              />
            ))}
            {hits.map((hit) => (
              <BulletHit key={hit.id} {...hit} onEnded={() => onHitEnded(hit.id)} />
            ))}
          </Physics>
        </Suspense>
      </Canvas>

      <EnhancedJoystick
        onMove={handleJoystickMove}
        onFire={handleFire}
        onFireEnd={handleFireEnd}
      />
    </div>
  );
}; 
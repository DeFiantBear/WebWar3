import { useFrame } from "@react-three/fiber";
import { RigidBody, vec3 } from "@react-three/rapier";
import { useRef } from "react";

export const Bullet = ({ id, position, angle, player, onHit, ...props }) => {
  const rigidbody = useRef();
  const startTime = useRef(Date.now());
  
  const BULLET_SPEED = 20;
  const BULLET_LIFETIME = 3000;

  useFrame((_, delta) => {
    if (!rigidbody.current) return;

    const impulse = {
      x: Math.sin(angle) * BULLET_SPEED * delta,
      y: 0,
      z: Math.cos(angle) * BULLET_SPEED * delta,
    };
    rigidbody.current.applyImpulse(impulse, true);

    if (Date.now() - startTime.current > BULLET_LIFETIME) {
      onHit?.(vec3(rigidbody.current.translation()));
    }
  });

  return (
    <group {...props}>
      <RigidBody
        ref={rigidbody}
        colliders="ball"
        args={[0.1]}
        position={[position.x, position.y + 1.5, position.z]}
        type="dynamic"
        userData={{
          type: "bullet",
          damage: 25,
          player: player,
        }}
        onIntersectionEnter={({ other }) => {
          if (other.rigidBody?.userData?.type !== "bullet") {
            onHit?.(vec3(rigidbody.current.translation()));
          }
        }}
      >
        <mesh>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      </RigidBody>
    </group>
  );
}; 
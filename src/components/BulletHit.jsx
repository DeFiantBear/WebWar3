import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export const BulletHit = ({ id, position, onEnded, ...props }) => {
  const group = useRef();
  const [particles, setParticles] = useState(() => {
    const particleCount = 20;
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
      ),
      life: 1.0,
      decay: 0.02 + Math.random() * 0.03,
    }));
  });

  useFrame((_, delta) => {
    if (!group.current) return;

    setParticles((prevParticles) => {
      const updatedParticles = prevParticles.map((particle) => ({
        ...particle,
        position: particle.position.clone().add(
          particle.velocity.clone().multiplyScalar(delta)
        ),
        life: particle.life - particle.decay,
      }));

      const aliveParticles = updatedParticles.filter((p) => p.life > 0);

      if (aliveParticles.length === 0) {
        setTimeout(() => onEnded?.(id), 100);
      }

      return aliveParticles;
    });
  });

  return (
    <group {...props} ref={group} position={[position.x, position.y, position.z]}>
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.position}>
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial
            color="orange"
            transparent
            opacity={particle.life}
          />
        </mesh>
      ))}
    </group>
  );
}; 
import { RigidBody } from "@react-three/rapier";

export const Map = () => {
  return (
    <>
      {/* Ground */}
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#4a7c59" />
        </mesh>
      </RigidBody>

      {/* Walls around the map */}
      <RigidBody type="fixed">
        <mesh position={[0, 5, -50]} castShadow receiveShadow>
          <boxGeometry args={[100, 10, 1]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh position={[0, 5, 50]} castShadow receiveShadow>
          <boxGeometry args={[100, 10, 1]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh position={[-50, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 10, 100]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh position={[50, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 10, 100]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      </RigidBody>

      {/* Some obstacles for cover */}
      <RigidBody type="fixed">
        <mesh position={[10, 1, 10]} castShadow receiveShadow>
          <boxGeometry args={[3, 2, 3]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh position={[-15, 1, -8]} castShadow receiveShadow>
          <boxGeometry args={[4, 2, 4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh position={[5, 1, -20]} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed">
        <mesh position={[-8, 1, 15]} castShadow receiveShadow>
          <boxGeometry args={[3, 2, 3]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      </RigidBody>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  );
};

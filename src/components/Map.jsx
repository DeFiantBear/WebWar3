import { RigidBody } from "@react-three/rapier";

export const Map = () => (
  <group>
    <RigidBody type="fixed" colliders="cuboid" args={[50, 0.5, 50]} position={[0, -0.5, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
    </RigidBody>

    {/* Walls */}
    <RigidBody type="fixed" colliders="cuboid" args={[50, 5, 1]} position={[0, 2.5, -25]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[100, 10, 2]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </RigidBody>

    <RigidBody type="fixed" colliders="cuboid" args={[50, 5, 1]} position={[0, 2.5, 25]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[100, 10, 2]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </RigidBody>

    <RigidBody type="fixed" colliders="cuboid" args={[1, 5, 50]} position={[-25, 2.5, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 10, 100]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </RigidBody>

    <RigidBody type="fixed" colliders="cuboid" args={[1, 5, 50]} position={[25, 2.5, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 10, 100]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </RigidBody>

    {/* Obstacles */}
    {[
      { pos: [5, 1, 5] },
      { pos: [-8, 1, -3] },
      { pos: [0, 1, -10] },
      { pos: [-5, 1, 8] },
    ].map((obstacle, index) => (
      <RigidBody
        key={index}
        type="fixed"
        colliders="cuboid"
        args={[3, 2, 3]}
        position={obstacle.pos}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 4, 6]} />
          <meshStandardMaterial color="#718096" />
        </mesh>
      </RigidBody>
    ))}
  </group>
); 
import { Billboard, CameraControls, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { CharacterSoldier } from "./CharacterSoldier";
const MOVEMENT_SPEED = 202;
const FIRE_RATE = 380;
export const WEAPON_OFFSET = {
  x: -0.2,
  y: 1.4,
  z: 0.8,
};

export const CharacterController = ({
  joystick,
  userPlayer = true,
  onKilled,
  onFire,
  ...props
}) => {
  const group = useRef();
  const character = useRef();
  const rigidbody = useRef();
  const controls = useRef();
  const directionalLight = useRef();
  
  const [animation, setAnimation] = useState("Idle");
  const [weapon] = useState("AK");
  const [health, setHealth] = useState(100);
  const [deaths, setDeaths] = useState(0);
  const [kills, setKills] = useState(0);
  const [dead, setDead] = useState(false);
  const [color] = useState("#3b82f6");
  
  const lastShoot = useRef(0);
  const lastAngle = useRef(0);

  const spawnRandomly = () => {
    const spawnPos = { x: 0, y: 0, z: 0 };
    rigidbody.current?.setTranslation(spawnPos);
  };

  useEffect(() => {
    spawnRandomly();
  }, []);

  useEffect(() => {
    if (dead) {
      const audio = new Audio("/dead.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  }, [dead]);

  useEffect(() => {
    if (health < 100 && health > 0) {
      const audio = new Audio("/hurt.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
  }, [health]);

  useEffect(() => {
    if (character.current && userPlayer) {
      directionalLight.current.target = character.current;
    }
  }, [userPlayer]);

  useFrame((_, delta) => {
    // CAMERA FOLLOW
    if (controls.current && userPlayer) {
      const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
      const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16;
      const playerWorldPos = vec3(rigidbody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x,
        playerWorldPos.y + (dead ? 12 : cameraDistanceY),
        playerWorldPos.z + (dead ? 2 : cameraDistanceZ),
        playerWorldPos.x,
        playerWorldPos.y + 1.5,
        playerWorldPos.z,
        true
      );
    }

    if (dead) {
      setAnimation("Death");
      return;
    }

    // Get joystick data
    const angle = joystick?.angle?.();
    const isMoving = joystick?.isJoystickPressed?.();
    const isFiring = joystick?.isPressed?.("fire");

    // Handle movement
    if (isMoving && angle !== undefined) {
      setAnimation("Run");
      
      // Update character rotation to face movement direction
      if (Math.abs(angle - lastAngle.current) > 0.01) {
        character.current.rotation.y = angle;
        lastAngle.current = angle;
      }

      // Apply movement impulse in the direction the character is facing
      // Use joystick magnitude for variable speed
      const joystickMagnitude = joystick?.magnitude?.() || 1;
      const speedMultiplier = Math.max(0.3, joystickMagnitude);
      
      const impulse = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta * speedMultiplier,
        y: 0,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta * speedMultiplier,
      };

      rigidbody.current.applyImpulse(impulse, true);
    } else {
      setAnimation("Idle");
    }

    // Handle shooting
    if (isFiring) {
      // Set shooting animation
      setAnimation(
        isMoving && angle !== undefined ? "Run_Shoot" : "Idle_Shoot"
      );
      
      // Ensure character faces shooting direction
      if (angle !== undefined && Math.abs(angle - lastAngle.current) > 0.01) {
        character.current.rotation.y = angle;
        lastAngle.current = angle;
      }
      
      if (userPlayer) {
        if (Date.now() - lastShoot.current > FIRE_RATE) {
          lastShoot.current = Date.now();
          
          // Get current character position and rotation
          const currentPos = vec3(rigidbody.current.translation());
          const shootAngle = angle !== undefined ? angle : character.current.rotation.y;
          
          // Add weapon offset to bullet spawn position
          const bulletSpawnPos = {
            x: currentPos.x + Math.sin(shootAngle) * WEAPON_OFFSET.z,
            y: currentPos.y + WEAPON_OFFSET.y,
            z: currentPos.z + Math.cos(shootAngle) * WEAPON_OFFSET.z,
          };
          
          const newBullet = {
            id: `bear-${Date.now()}`,
            position: bulletSpawnPos,
            angle: shootAngle,
            player: "bear",
          };
          onFire?.(newBullet);
        }
      }
    }
  });

  const handleDamage = (damage, attacker) => {
    if (health > 0 && !dead) {
      const newHealth = health - damage;
      if (newHealth <= 0) {
        setDeaths(deaths + 1);
        setDead(true);
        setHealth(0);
        rigidbody.current.setEnabled(false);
        setTimeout(() => {
          spawnRandomly();
          rigidbody.current.setEnabled(true);
          setHealth(100);
          setDead(false);
        }, 2000);
        onKilled?.("bear", attacker);
      } else {
        setHealth(newHealth);
      }
    }
  };

  return (
    <group {...props} ref={group}>
      {userPlayer && <CameraControls ref={controls} />}
      <RigidBody
        ref={rigidbody}
        colliders={false}
        linearDamping={12}
        lockRotations
        type="dynamic"
        onIntersectionEnter={({ other }) => {
          if (
            other.rigidBody?.userData?.type === "bullet" &&
            health > 0 &&
            !dead
          ) {
            handleDamage(other.rigidBody.userData.damage || 25, other.rigidBody.userData.player);
          }
        }}
      >
        <PlayerInfo health={health} deaths={deaths} kills={kills} color={color} />
        <group ref={character}>
          <CharacterSoldier
            color={color}
            animation={animation}
            weapon={weapon}
            position={[0, 0, 0]}
            movement={{
              x: joystick?.isJoystickPressed?.() ? Math.sin(joystick.angle()) : 0,
              y: joystick?.isJoystickPressed?.() ? Math.cos(joystick.angle()) : 0
            }}
          />
          {userPlayer && (
            <Crosshair position={[WEAPON_OFFSET.x, WEAPON_OFFSET.y, WEAPON_OFFSET.z]} />
          )}
        </group>
        {userPlayer && (
          <directionalLight
            ref={directionalLight}
            position={[15, 12, -15]}
            intensity={0.4}
            castShadow
            shadow-camera-near={0}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />
        )}
        <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]} />
      </RigidBody>
    </group>
  );
};

const PlayerInfo = ({ health, deaths, kills, color }) => (
  <Billboard position-y={2.5}>
    <Text position-y={0.36} fontSize={0.4}>
      Bear
      <meshBasicMaterial color={color} />
    </Text>
    <mesh position-z={-0.1}>
      <planeGeometry args={[1, 0.2]} />
      <meshBasicMaterial color="black" transparent opacity={0.5} />
    </mesh>
    <mesh scale-x={health / 100} position-x={-0.5 * (1 - health / 100)}>
      <planeGeometry args={[1, 0.2]} />
      <meshBasicMaterial color="red" />
    </mesh>
    <Text position-y={-0.5} fontSize={0.3}>
      K: {kills} D: {deaths}
      <meshBasicMaterial color="white" />
    </Text>
  </Billboard>
);

const Crosshair = (props) => {
  return (
    <group {...props}>
      <mesh position-z={1}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" transparent opacity={0.9} />
      </mesh>
      <mesh position-z={2}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" transparent opacity={0.85} />
      </mesh>
      <mesh position-z={3}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" transparent opacity={0.8} />
      </mesh>

      <mesh position-z={4.5}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" opacity={0.7} transparent />
      </mesh>

      <mesh position-z={6.5}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" opacity={0.6} transparent />
      </mesh>

      <mesh position-z={9}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" opacity={0.2} transparent />
      </mesh>
    </group>
  );
};

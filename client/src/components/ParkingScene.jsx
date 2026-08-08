import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

/* =====================================================
   REALISTIC CAR
===================================================== */

function Car({
  position = [0, 0, 0],
  color = "#2563eb",
  rotation = [0, 0, 0],
  scale = 1,
}) {
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
    >

      {/* ================= MAIN BODY ================= */}

      <mesh position={[0, 0.58, 0]} castShadow>
        <boxGeometry args={[1.9, 0.55, 3.8]} />

        <meshPhysicalMaterial
          color={color}
          metalness={0.75}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Front hood */}

      <mesh position={[0, 0.82, 1.15]} castShadow>
        <boxGeometry args={[1.78, 0.22, 1.1]} />

        <meshPhysicalMaterial
          color={color}
          metalness={0.7}
          roughness={0.18}
          clearcoat={1}
        />
      </mesh>

      {/* Rear section */}

      <mesh position={[0, 0.82, -1.15]} castShadow>
        <boxGeometry args={[1.78, 0.25, 1.05]} />

        <meshPhysicalMaterial
          color={color}
          metalness={0.7}
          roughness={0.18}
          clearcoat={1}
        />
      </mesh>

      {/* ================= CABIN ================= */}

      <mesh
        position={[0, 1.02, -0.1]}
        castShadow
      >
        <boxGeometry args={[1.42, 0.65, 1.85]} />

        <meshPhysicalMaterial
          color={color}
          metalness={0.65}
          roughness={0.18}
          clearcoat={1}
        />
      </mesh>

      {/* ================= FRONT WINDSHIELD ================= */}

      <mesh position={[0, 1.17, 0.48]}>
        <boxGeometry args={[1.28, 0.42, 0.08]} />

        <meshPhysicalMaterial
          color="#07111c"
          metalness={0.5}
          roughness={0.08}
          transmission={0.15}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ================= REAR WINDOW ================= */}

      <mesh position={[0, 1.17, -0.52]}>
        <boxGeometry args={[1.28, 0.42, 0.08]} />

        <meshPhysicalMaterial
          color="#07111c"
          metalness={0.5}
          roughness={0.08}
          transmission={0.15}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ================= SIDE WINDOWS ================= */}

      <mesh position={[-0.72, 1.14, 0]}>
        <boxGeometry args={[0.04, 0.38, 1.45]} />

        <meshPhysicalMaterial
          color="#081421"
          metalness={0.7}
          roughness={0.08}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh position={[0.72, 1.14, 0]}>
        <boxGeometry args={[0.04, 0.38, 1.45]} />

        <meshPhysicalMaterial
          color="#081421"
          metalness={0.7}
          roughness={0.08}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ================= WHEELS ================= */}

      {[
        [-1.02, 0.4, 1.15],
        [1.02, 0.4, 1.15],
        [-1.02, 0.4, -1.15],
        [1.02, 0.4, -1.15],
      ].map((wheel, index) => (
        <group key={index} position={wheel}>

          {/* Tire */}

          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry
              args={[0.34, 0.34, 0.24, 32]}
            />

            <meshStandardMaterial
              color="#030507"
              roughness={0.92}
            />
          </mesh>

          {/* Rim */}

          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry
              args={[0.19, 0.19, 0.255, 24]}
            />

            <meshStandardMaterial
              color="#a8b2bf"
              metalness={0.95}
              roughness={0.18}
            />
          </mesh>

          {/* Hub */}

          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry
              args={[0.075, 0.075, 0.27, 20]}
            />

            <meshStandardMaterial
              color="#111827"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

        </group>
      ))}

      {/* ================= HEADLIGHTS ================= */}

      <mesh position={[-0.58, 0.69, 1.91]}>
        <boxGeometry args={[0.48, 0.17, 0.06]} />

        <meshStandardMaterial
          color="#eaffff"
          emissive="#bffcff"
          emissiveIntensity={5}
        />
      </mesh>

      <mesh position={[0.58, 0.69, 1.91]}>
        <boxGeometry args={[0.48, 0.17, 0.06]} />

        <meshStandardMaterial
          color="#eaffff"
          emissive="#bffcff"
          emissiveIntensity={5}
        />
      </mesh>

      {/* ================= TAILLIGHTS ================= */}

      <mesh position={[-0.58, 0.7, -1.91]}>
        <boxGeometry args={[0.46, 0.16, 0.06]} />

        <meshStandardMaterial
          color="#ff3030"
          emissive="#ff1111"
          emissiveIntensity={3}
        />
      </mesh>

      <mesh position={[0.58, 0.7, -1.91]}>
        <boxGeometry args={[0.46, 0.16, 0.06]} />

        <meshStandardMaterial
          color="#ff3030"
          emissive="#ff1111"
          emissiveIntensity={3}
        />
      </mesh>

      {/* ================= FRONT GRILLE ================= */}

      <mesh position={[0, 0.48, 1.925]}>
        <boxGeometry args={[0.72, 0.18, 0.035]} />

        <meshStandardMaterial
          color="#05070a"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

    </group>
  );
}

/* =====================================================
   PARKING SPACE
===================================================== */

function ParkingSpace({
  position,
  occupied,
}) {
  return (
    <group position={position}>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
      >
        <planeGeometry args={[3, 5.2]} />

        <meshStandardMaterial
          color="#101925"
          roughness={0.9}
        />
      </mesh>

      {/* glowing parking outline */}

      {!occupied && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.025, 0]}
        >
          <planeGeometry args={[2.7, 4.9]} />

          <meshBasicMaterial
            color="#3ee6a0"
            transparent
            opacity={0.035}
          />
        </mesh>
      )}

      {/* Parking lines */}

      <mesh
        position={[-1.42, 0.04, 0]}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[0.035, 0.03, 5]} />

        <meshBasicMaterial
          color={occupied ? "#334155" : "#3ee6a0"}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh
        position={[1.42, 0.04, 0]}
      >
        <boxGeometry args={[0.035, 0.03, 5]} />

        <meshBasicMaterial
          color={occupied ? "#334155" : "#3ee6a0"}
          transparent
          opacity={0.7}
        />
      </mesh>

    </group>
  );
}

/* =====================================================
   AVAILABLE MARKER
===================================================== */

function AvailabilityMarker({ position }) {
  return (
    <Float
      speed={2}
      rotationIntensity={0.15}
      floatIntensity={0.35}
    >
      <group position={position}>

        <mesh position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.12, 20, 20]} />

          <meshStandardMaterial
            color="#3ee6a0"
            emissive="#3ee6a0"
            emissiveIntensity={4}
          />
        </mesh>

        <pointLight
          position={[0, 0.65, 0]}
          color="#3ee6a0"
          intensity={1.8}
          distance={2.5}
        />

      </group>
    </Float>
  );
}

/* =====================================================
   PARKING LOT
===================================================== */

function ParkingLot() {

  const spaces = [
    [-5.2, 0, -3.2],
    [-1.75, 0, -3.2],
    [1.75, 0, -3.2],
    [5.2, 0, -3.2],

    [-5.2, 0, 3.2],
    [-1.75, 0, 3.2],
    [1.75, 0, 3.2],
    [5.2, 0, 3.2],
  ];

  return (
    <group>

      {/* Ground */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        receiveShadow
      >
        <planeGeometry args={[19, 14]} />

        <meshStandardMaterial
          color="#090f18"
          roughness={0.95}
        />
      </mesh>

      {/* Central road */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
      >
        <planeGeometry args={[4.5, 14]} />

        <meshStandardMaterial
          color="#151d28"
          roughness={0.9}
        />
      </mesh>

      {/* Parking spaces */}

      {spaces.map((space, index) => (
        <ParkingSpace
          key={index}
          position={space}
          occupied={[0, 3, 4].includes(index)}
        />
      ))}

      {/* ================= CARS ================= */}

      <Car
        position={[-5.2, 0, -3.2]}
        color="#2563eb"
        rotation={[0, Math.PI, 0]}
      />

      <Car
        position={[1.75, 0, -3.2]}
        color="#7c3aed"
        rotation={[0, Math.PI, 0]}
      />

      <Car
        position={[-5.2, 0, 3.2]}
        color="#ef4444"
      />

      {/* Available indicators */}

      <AvailabilityMarker
        position={[-1.75, 0, -3.2]}
      />

      <AvailabilityMarker
        position={[5.2, 0, -3.2]}
      />

      <AvailabilityMarker
        position={[-1.75, 0, 3.2]}
      />

      <AvailabilityMarker
        position={[1.75, 0, 3.2]}
      />

      {/* ================= ROAD LIGHTS ================= */}

      {[-7.5, 7.5].map((x, index) => (
        <group
          key={index}
          position={[x, 0, 0]}
        >

          <mesh position={[0, 2.3, 0]}>
            <cylinderGeometry
              args={[0.055, 0.055, 4.6, 16]}
            />

            <meshStandardMaterial
              color="#475569"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          <mesh position={[0, 4.55, 0]}>
            <sphereGeometry
              args={[0.13, 16, 16]}
            />

            <meshStandardMaterial
              color="#d9fff1"
              emissive="#3ee6a0"
              emissiveIntensity={3}
            />
          </mesh>

          <pointLight
            position={[0, 4.2, 0]}
            color="#3ee6a0"
            intensity={8}
            distance={9}
          />

        </group>
      ))}

    </group>
  );
}

/* =====================================================
   SCENE
===================================================== */

function Scene() {

  return (
    <>
      <ambientLight intensity={0.6} />

      <directionalLight
        position={[6, 10, 6]}
        intensity={2.5}
        castShadow
      />

      <pointLight
        position={[-5, 5, 3]}
        color="#2563eb"
        intensity={10}
        distance={15}
      />

      <pointLight
        position={[5, 5, -3]}
        color="#3ee6a0"
        intensity={10}
        distance={15}
      />

      <ParkingLot />

      <ContactShadows
        position={[0, -0.07, 0]}
        opacity={0.5}
        scale={22}
        blur={2.5}
        far={12}
      />

      <Environment preset="city" />
    </>
  );
}

/* =====================================================
   EXPORT
===================================================== */

export default function ParkingScene() {

  return (
    <div
      style={{
        width: "100%",
        height: "520px",
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [12, 9, 14],
          fov: 40,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >

        <color
          attach="background"
          args={["#070c14"]}
        />

        <Scene />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate
          autoRotateSpeed={0.25}
        />

      </Canvas>
    </div>
  );
}
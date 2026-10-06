"use client";

import { ContactShadows, Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Wheel({ x, z }: { x: number; z: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.28;
  });

  return (
    <group ref={group} position={[x, 0.7, z]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.56, 0.56, 0.3, 24]} />
        <meshStandardMaterial color="#080a0d" metalness={0.76} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.055, 20]} />
        <meshStandardMaterial color="#3e4652" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.205, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.065, 16]} />
        <meshStandardMaterial color="#11151b" metalness={0.7} roughness={0.28} />
      </mesh>
    </group>
  );
}

function ArashiMachine() {
  const root = useRef<THREE.Group>(null);
  const scanner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.getElapsedTime();
    root.current.position.y = Math.sin(t * 0.8) * 0.025;
    root.current.rotation.y = Math.sin(t * 0.33) * 0.045;
    root.current.rotation.x = Math.sin(t * 0.23) * 0.012;
    if (scanner.current) {
      scanner.current.position.y = 1.16 + Math.sin(t * 1.35) * 0.52;
      const material = scanner.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.16 + (Math.sin(t * 1.35) + 1) * 0.055;
    }
  });

  const wheelXs = [-2.15, -0.72, 0.72, 2.15];

  return (
    <group ref={root} rotation={[0.04, -0.42, 0]} scale={1.02}>
      <RoundedBox args={[6.25, 0.58, 1.9]} radius={0.11} smoothness={4} position={[0, 0.7, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#1d2530" metalness={0.82} roughness={0.28} />
      </RoundedBox>

      <RoundedBox args={[3.25, 1.23, 1.72]} radius={0.17} smoothness={5} position={[1.18, 1.48, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#25303e" metalness={0.7} roughness={0.24} />
      </RoundedBox>

      <RoundedBox args={[1.85, 0.72, 1.79]} radius={0.1} smoothness={4} position={[-1.74, 1.18, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#171d26" metalness={0.75} roughness={0.29} />
      </RoundedBox>

      <mesh position={[1.18, 1.78, 1.0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.65, 0.67, 0.045]} />
        <meshPhysicalMaterial color="#0b1017" roughness={0.12} metalness={0.15} transmission={0.12} opacity={0.92} transparent />
      </mesh>
      <mesh position={[1.18, 1.78, -1.0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.65, 0.67, 0.045]} />
        <meshPhysicalMaterial color="#0b1017" roughness={0.12} metalness={0.15} transmission={0.12} opacity={0.92} transparent />
      </mesh>

      <RoundedBox args={[1.55, 0.22, 1.76]} radius={0.06} smoothness={3} position={[-2.16, 1.7, 0]} castShadow>
        <meshStandardMaterial color="#111720" metalness={0.78} roughness={0.25} />
      </RoundedBox>

      <RoundedBox args={[0.42, 0.22, 1.78]} radius={0.04} smoothness={2} position={[2.78, 1.16, 0]} castShadow>
        <meshStandardMaterial color="#0c1118" metalness={0.84} roughness={0.22} />
      </RoundedBox>

      <mesh position={[2.86, 1.48, 0.96]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 0.32]} />
        <meshStandardMaterial color="#e8f0ff" emissive="#b7d1ff" emissiveIntensity={5} toneMapped={false} />
      </mesh>
      <mesh position={[2.86, 1.48, -0.96]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 0.32]} />
        <meshStandardMaterial color="#e8f0ff" emissive="#b7d1ff" emissiveIntensity={5} toneMapped={false} />
      </mesh>

      <mesh position={[1.42, 1.1, 0]} castShadow>
        <boxGeometry args={[0.12, 0.85, 1.3]} />
        <meshStandardMaterial color="#596777" metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh position={[0.42, 1.08, 0]} castShadow>
        <boxGeometry args={[0.1, 0.9, 1.34]} />
        <meshStandardMaterial color="#596777" metalness={0.9} roughness={0.18} />
      </mesh>

      <RoundedBox args={[1.45, 0.32, 1.75]} radius={0.07} smoothness={3} position={[-1.55, 0.99, 0]} castShadow>
        <meshStandardMaterial color="#202a36" metalness={0.78} roughness={0.29} />
      </RoundedBox>

      <group position={[-2.7, 1.75, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.85, 18]} />
          <meshStandardMaterial color="#121820" metalness={0.86} roughness={0.24} />
        </mesh>
        <mesh position={[0.05, 0.43, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#92adff" emissive="#7598ff" emissiveIntensity={2.2} />
        </mesh>
      </group>

      {wheelXs.map((x) => (
        <Wheel key={x + "-left"} x={x} z={-1.08} />
      ))}
      {wheelXs.map((x) => (
        <Wheel key={x + "-right"} x={x} z={1.08} />
      ))}

      <mesh ref={scanner} position={[0, 1.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.4, 0.018]} />
        <meshBasicMaterial color="#98b5ff" transparent opacity={0.19} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.15, 2.18, 64]} />
        <meshBasicMaterial color="#7294e7" transparent opacity={0.17} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={3.2} color="#e9efff" castShadow />
      <directionalLight position={[-5, 2, -3]} intensity={1.6} color="#7395ff" />
      <pointLight position={[0, 2.6, 0]} intensity={5} distance={9} color="#8faeff" />
      <pointLight position={[-4, 1, 2]} intensity={2} distance={7} color="#d8e2ff" />
      <Float speed={1.15} rotationIntensity={0.045} floatIntensity={0.18}>
        <ArashiMachine />
      </Float>
      <ContactShadows position={[0, -0.02, 0]} opacity={0.52} scale={8} blur={2.8} far={5} />
    </>
  );
}

export function Arashi3D() {
  return (
    <div className="arashi-3d-shell" aria-label="Interactive 3D model of the ST-17 Arashi">
      <Canvas
        dpr={[1, 1.6]}
        shadows
        camera={{ position: [7.5, 4.25, 7.4], fov: 36, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene />
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={6.5}
          maxDistance={11}
          minPolarAngle={Math.PI / 3.1}
          maxPolarAngle={Math.PI / 2.02}
          autoRotate
          autoRotateSpeed={0.48}
          enableDamping
          dampingFactor={0.07}
          rotateSpeed={0.42}
        />
      </Canvas>
      <div className="arashi-3d-hint"><span>3D</span><small>Drag to inspect · scroll to zoom</small></div>
    </div>
  );
}

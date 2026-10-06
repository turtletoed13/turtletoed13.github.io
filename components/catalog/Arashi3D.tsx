"use client";

import { ContactShadows, Float, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { ImportedModel } from "./ImportedModel";
import type { ModelAsset } from "../../types/model";

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
  const wheelXs = [-2.15, -0.72, 0.72, 2.15];

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

  return (
    <group ref={root} rotation={[0.04, -0.42, 0]} scale={1.02}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.25, 0.58, 1.9]} />
        <meshStandardMaterial color="#1d2530" metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[1.18, 1.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.25, 1.23, 1.72]} />
        <meshStandardMaterial color="#25303e" metalness={0.7} roughness={0.24} />
      </mesh>
      <mesh position={[-1.74, 1.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.85, 0.72, 1.79]} />
        <meshStandardMaterial color="#171d26" metalness={0.75} roughness={0.29} />
      </mesh>
      <mesh position={[1.18, 1.78, 1]}>
        <boxGeometry args={[2.65, 0.67, 0.045]} />
        <meshPhysicalMaterial color="#0b1017" roughness={0.12} metalness={0.15} transmission={0.12} opacity={0.92} transparent />
      </mesh>
      <mesh position={[1.18, 1.78, -1]}>
        <boxGeometry args={[2.65, 0.67, 0.045]} />
        <meshPhysicalMaterial color="#0b1017" roughness={0.12} metalness={0.15} transmission={0.12} opacity={0.92} transparent />
      </mesh>
      <mesh position={[-2.16, 1.7, 0]} castShadow>
        <boxGeometry args={[1.55, 0.22, 1.76]} />
        <meshStandardMaterial color="#111720" metalness={0.78} roughness={0.25} />
      </mesh>
      <mesh position={[2.78, 1.16, 0]} castShadow>
        <boxGeometry args={[0.42, 0.22, 1.78]} />
        <meshStandardMaterial color="#0c1118" metalness={0.84} roughness={0.22} />
      </mesh>
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
      <mesh position={[-1.55, 0.99, 0]} castShadow>
        <boxGeometry args={[1.45, 0.32, 1.75]} />
        <meshStandardMaterial color="#202a36" metalness={0.78} roughness={0.29} />
      </mesh>
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
      {wheelXs.map((x) => <Wheel key={x + "-left"} x={x} z={-1.08} />)}
      {wheelXs.map((x) => <Wheel key={x + "-right"} x={x} z={1.08} />)}
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

function ImportedPresentation({
  asset,
  onReady,
}: {
  asset: ModelAsset;
  onReady: () => void;
}) {
  const root = useRef<THREE.Group>(null);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useFrame((state) => {
    if (!root.current) return;

    const t = state.clock.getElapsedTime();
    root.current.position.y = Math.sin(t * 0.82) * 0.028;
    root.current.rotation.y = Math.sin(t * 0.28) * 0.035;
  });

  return (
    <group ref={root} rotation={[0.02, -0.4, 0]} scale={1.03}>
      <ImportedModel asset={asset} />
    </group>
  );
}

class ModelErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const ARASHI_ASSET: ModelAsset = {
  vehicleId: "arashi",
  url: "/models/vehicles/arashi/Armored_car_death_race.usdz",
  filename: "Armored_car_death_race.usdz",
  extension: "usdz",
  format: "usdz",
};

function AssetOrProcedural({
  onLoadingChange,
  onAssetChange,
}: {
  onLoadingChange: (loading: boolean) => void;
  onAssetChange: (asset: ModelAsset | null) => void;
}) {
  const ready = useCallback(() => onLoadingChange(false), [onLoadingChange]);

  useEffect(() => {
    onLoadingChange(true);
    onAssetChange(ARASHI_ASSET);
  }, [onAssetChange, onLoadingChange]);
  const fallback = (
    <Float speed={1.15} rotationIntensity={0.045} floatIntensity={0.18}>
      <ArashiMachine />
    </Float>
  );

  if (!asset) return fallback;

  return (
    <ModelErrorBoundary fallback={fallback} onError={() => onLoadingChange(false)}>
      <Suspense fallback={fallback}>
        <Float speed={1.05} rotationIntensity={0.025} floatIntensity={0.14}>
          <ImportedPresentation asset={asset} onReady={ready} />
        </Float>
      </Suspense>
    </ModelErrorBoundary>
  );
}

function ArashiModelLoadingOverlay({
  loading,
  authored,
}: {
  loading: boolean;
  authored: boolean;
}) {
  const { progress, item } = useProgress();
  const percent = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div
      className={`arashi-model-loader ${loading ? "is-visible" : "is-complete"}`}
      aria-hidden={!loading}
      aria-live="polite"
    >
      <div className="arashi-loader-panel">
        <div className="arashi-loader-top">
          <span>{authored ? "AUTHORED ASSET" : "NOLINE VISUAL ENGINE"}</span>
          <b>{authored ? "USDZ" : "FALLBACK"}</b>
        </div>
        <div className="arashi-loader-title">
          {authored ? "Initializing vehicle geometry" : "Preparing presentation"}
        </div>
        <div className="arashi-loader-track">
          <i style={{ width: `${Math.max(8, percent)}%` }} />
        </div>
        <div className="arashi-loader-meta">
          <span>{item ? `LOADING / ${item.split("/").pop()}` : "STREAMING / MATERIALS / LIGHTING"}</span>
          <strong>{percent > 0 ? `${percent}%` : "LOADING"}</strong>
        </div>
      </div>
    </div>
  );
}

function ArashiScene({
  onLoadingChange,
  onAssetChange,
}: {
  onLoadingChange: (loading: boolean) => void;
  onAssetChange: (asset: ModelAsset | null) => void;
}) {
  return (
    <>
      <ambientLight intensity={1.05} />
      <directionalLight position={[4, 6, 5]} intensity={3.4} color="#e9efff" castShadow />
      <directionalLight position={[-5, 2, -3]} intensity={1.65} color="#7395ff" />
      <pointLight position={[0, 2.6, 0]} intensity={5.2} distance={9} color="#8faeff" />
      <pointLight position={[-4, 1, 2]} intensity={2.1} distance={7} color="#d8e2ff" />
      <AssetOrProcedural
        onLoadingChange={onLoadingChange}
        onAssetChange={onAssetChange}
      />
      <ContactShadows position={[0, -0.02, 0]} opacity={0.52} scale={8} blur={2.8} far={5} />
    </>
  );
}

export function Arashi3D() {
  const [loading, setLoading] = useState(true);
  const [authored, setAuthored] = useState(false);

  const handleLoadingChange = useCallback((value: boolean) => {
    setLoading(value);
  }, []);

  const handleAssetChange = useCallback((asset: ModelAsset | null) => {
    setAuthored(Boolean(asset));
  }, []);

  return (
    <div className="arashi-3d-shell" aria-label="Interactive 3D model of the ST-17 Arashi">
      <Canvas
        dpr={[1, 1.6]}
        shadows
        camera={{ position: [7.5, 4.25, 7.4], fov: 36, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ArashiScene
          onLoadingChange={handleLoadingChange}
          onAssetChange={handleAssetChange}
        />
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

      <ArashiModelLoadingOverlay loading={loading} authored={authored} />

      <div className="arashi-3d-hint">
        <span>3D</span>
        <small>Drag to inspect · scroll to zoom</small>
      </div>
    </div>
  );
}

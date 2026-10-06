"use client";

import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { AMFLoader } from "three/addons/loaders/AMFLoader.js";
import { ColladaLoader } from "three/addons/loaders/ColladaLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { PCDLoader } from "three/addons/loaders/PCDLoader.js";
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { TDSLoader } from "three/addons/loaders/TDSLoader.js";
import { ThreeMFLoader } from "three/addons/loaders/3MFLoader.js";
import { USDLoader } from "three/addons/loaders/USDLoader.js";
import { VOXLoader } from "three/addons/loaders/VOXLoader.js";
import { VRMLLoader } from "three/addons/loaders/VRMLLoader.js";
import { XYZLoader } from "three/addons/loaders/XYZLoader.js";
import * as THREE from "three";
import type { ModelAsset } from "../../types/model";

const TARGET_SIZE = 5.8;
const FLOOR_OFFSET = 0.08;

function prepareMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!("isMesh" in child) || !(child as THREE.Mesh).isMesh) return;

    const mesh = child as THREE.Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    materials.forEach((material) => {
      if (!material) return;

      material.side = THREE.FrontSide;
      material.needsUpdate = true;

      if (
        material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhysicalMaterial
      ) {
        material.envMapIntensity = Math.max(material.envMapIntensity || 0, 1.2);
      }
    });
  });
}

function normalizeObject(object: THREE.Object3D) {
  const prepared = object.clone(true);
  prepareMaterials(prepared);

  prepared.updateMatrixWorld(true);

  let box = new THREE.Box3().setFromObject(prepared, true);

  if (box.isEmpty() || !Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) {
    return {
      object: prepared,
      scale: 1,
      position: [0, 0, 0] as [number, number, number],
    };
  }

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);

  if (!Number.isFinite(maxDimension) || maxDimension < 0.000001) {
    return {
      object: prepared,
      scale: 1,
      position: [0, 0, 0] as [number, number, number],
    };
  }

  const scale = TARGET_SIZE / maxDimension;

  return {
    object: prepared,
    scale,
    position: [
      -center.x * scale,
      -box.min.y * scale + FLOOR_OFFSET,
      -center.z * scale,
    ] as [number, number, number],
  };
}

function ModelObject({ object }: { object: THREE.Object3D }) {
  const normalized = useMemo(() => normalizeObject(object), [object]);

  return (
    <group
      scale={normalized.scale}
      position={normalized.position}
      rotation={[0, 0, 0]}
    >
      <primitive object={normalized.object} dispose={null} />
    </group>
  );
}

function GLTFAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(GLTFLoader, asset.url);
  return <ModelObject object={loaded.scene} />;
}

function FBXAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(FBXLoader, asset.url);
  return <ModelObject object={loaded} />;
}

function OBJPlainAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(OBJLoader, asset.url);
  return <ModelObject object={loaded} />;
}

function OBJMaterialAsset({ asset }: { asset: ModelAsset }) {
  const materials = useLoader(MTLLoader, asset.companionMaterialUrl!);
  materials.preload();
  const object = useLoader(OBJLoader, asset.url, (loader) => loader.setMaterials(materials));
  return <ModelObject object={object} />;
}

function OBJAsset({ asset }: { asset: ModelAsset }) {
  return asset.companionMaterialUrl ? (
    <OBJMaterialAsset asset={asset} />
  ) : (
    <OBJPlainAsset asset={asset} />
  );
}

function DAEAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(ColladaLoader, asset.url);
  return loaded?.scene ? <ModelObject object={loaded.scene} /> : null;
}

function TDSAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(TDSLoader, asset.url);
  return <ModelObject object={loaded} />;
}

function ThreeMFAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(ThreeMFLoader, asset.url);
  return <ModelObject object={loaded} />;
}

function AMFAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(AMFLoader, asset.url);
  return <ModelObject object={loaded} />;
}

function VRMLAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(VRMLLoader, asset.url);
  return <ModelObject object={loaded} />;
}

function USDAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(USDLoader, asset.url);
  return <ModelObject object={loaded} />;
}

function PLYAsset({ asset }: { asset: ModelAsset }) {
  const geometry = useLoader(PLYLoader, asset.url);

  const mesh = useMemo(() => {
    geometry.computeVertexNormals();

    return new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: "#77808b",
        metalness: 0.76,
        roughness: 0.29,
      }),
    );
  }, [geometry]);

  return <ModelObject object={mesh} />;
}

function STLAsset({ asset }: { asset: ModelAsset }) {
  const geometry = useLoader(STLLoader, asset.url);

  const mesh = useMemo(
    () =>
      new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: "#77808b",
          metalness: 0.82,
          roughness: 0.26,
        }),
      ),
    [geometry],
  );

  return <ModelObject object={mesh} />;
}

function XYZAsset({ asset }: { asset: ModelAsset }) {
  const geometry = useLoader(XYZLoader, asset.url);

  const points = useMemo(
    () =>
      new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
          size: 0.045,
          vertexColors: geometry.getAttribute("color") !== undefined,
        }),
      ),
    [geometry],
  );

  return <ModelObject object={points} />;
}

function PCDAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(PCDLoader, asset.url);
  return <ModelObject object={loaded} />;
}

function VOXAsset({ asset }: { asset: ModelAsset }) {
  const loaded = useLoader(VOXLoader, asset.url);
  if (!loaded?.scene) return null;

  const scene = loaded.scene.children[0] ?? loaded.scene;
  return <ModelObject object={scene} />;
}

function LoadedAsset({ asset }: { asset: ModelAsset }) {
  switch (asset.format) {
    case "glb":
    case "gltf":
      return <GLTFAsset asset={asset} />;
    case "fbx":
      return <FBXAsset asset={asset} />;
    case "obj":
      return <OBJAsset asset={asset} />;
    case "dae":
      return <DAEAsset asset={asset} />;
    case "3ds":
      return <TDSAsset asset={asset} />;
    case "3mf":
      return <ThreeMFAsset asset={asset} />;
    case "amf":
      return <AMFAsset asset={asset} />;
    case "wrl":
      return <VRMLAsset asset={asset} />;
    case "usd":
    case "usda":
    case "usdc":
    case "usdz":
      return <USDAsset asset={asset} />;
    case "ply":
      return <PLYAsset asset={asset} />;
    case "stl":
      return <STLAsset asset={asset} />;
    case "xyz":
      return <XYZAsset asset={asset} />;
    case "pcd":
      return <PCDAsset asset={asset} />;
    case "vox":
      return <VOXAsset asset={asset} />;
    default:
      return null;
  }
}

export function ImportedModel({ asset }: { asset: ModelAsset }) {
  return <LoadedAsset asset={asset} />;
}

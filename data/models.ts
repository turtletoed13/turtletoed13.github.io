import type { RuntimeModelFormat } from "../types/model";

export const runtimeModelFormats: RuntimeModelFormat[] = [
  "glb", "gltf", "fbx", "obj", "dae", "3ds",
  "ply", "stl", "amf", "3mf", "wrl", "xyz",
  "pcd", "vox", "usd", "usda", "usdc", "usdz",
];

export const runtimeModelExtensions = new Set<string>(runtimeModelFormats);

export const modelPriority: RuntimeModelFormat[] = [
  "glb", "gltf", "fbx", "obj", "dae", "usdz", "3ds",
  "3mf", "amf", "ply", "stl", "wrl", "vox", "pcd", "xyz",
];

export const modelFormatLabels: Record<RuntimeModelFormat, string> = {
  glb: "GLB", gltf: "glTF", fbx: "FBX", obj: "OBJ", dae: "Collada",
  "3ds": "3DS", ply: "PLY", stl: "STL", amf: "AMF", "3mf": "3MF",
  wrl: "VRML", xyz: "XYZ", pcd: "PCD", vox: "VOX", usd: "USD", usda: "USDA", usdc: "USDC", usdz: "USDZ",
};
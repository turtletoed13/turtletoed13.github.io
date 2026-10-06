export type RuntimeModelFormat =
  | "glb" | "gltf" | "fbx" | "obj" | "dae" | "3ds"
  | "ply" | "stl" | "amf" | "3mf" | "wrl" | "xyz"
  | "pcd" | "vox" | "usd" | "usda" | "usdc" | "usdz";

export type SourceModelFormat =
  | "blend" | "max" | "c4d" | "ma" | "mb";

export type ModelAsset = {
  vehicleId: string;
  url: string;
  filename: string;
  extension: string;
  format: RuntimeModelFormat;
  companionMaterialUrl?: string;
};
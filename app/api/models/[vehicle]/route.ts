import { readdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { modelPriority, runtimeModelExtensions } from "../../../../data/models";
import type { ModelAsset } from "../../../../types/model";

const ROOT = path.join(process.cwd(), "public", "models", "vehicles");

function cleanVehicleId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

async function collectFiles(root: string, current = root): Promise<string[]> {
  let entries;
  try { entries = await readdir(current, { withFileTypes: true }); }
  catch { return []; }

  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "source") continue;
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(root, fullPath));
    else files.push(fullPath);
  }
  return files;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ vehicle: string }> },
) {
  const { vehicle } = await context.params;
  const vehicleId = cleanVehicleId(vehicle);
  if (!vehicleId) return NextResponse.json({ assets: [] }, { status: 400 });

  const vehicleRoot = path.join(ROOT, vehicleId);
  const files = await collectFiles(vehicleRoot);
  const objMaterials = new Map<string, string>();

  for (const filePath of files) {
    if (path.extname(filePath).toLowerCase() !== ".mtl") continue;
    objMaterials.set(path.basename(filePath, path.extname(filePath)).toLowerCase(), filePath);
  }

  const assets = files
    .map((filePath): ModelAsset | null => {
      const extension = path.extname(filePath).slice(1).toLowerCase();
      if (!runtimeModelExtensions.has(extension)) return null;

      const relative = path.relative(vehicleRoot, filePath).split(path.sep).join("/");
      const format = extension as ModelAsset["format"];
      const stem = path.basename(filePath, path.extname(filePath)).toLowerCase();
      const sameStemMaterial = format === "obj" ? objMaterials.get(stem) : undefined;
      const sameDirectoryMaterials = format === "obj"
        ? allMaterials.filter((material) => path.dirname(material) === path.dirname(filePath))
        : [];
      const companion = sameStemMaterial ?? (sameDirectoryMaterials.length === 1 ? sameDirectoryMaterials[0] : undefined);

      return {
        vehicleId,
        url: "/models/vehicles/" + vehicleId + "/" + relative,
        filename: path.basename(filePath),
        extension,
        format,
        ...(companion ? { companionMaterialUrl:
          "/models/vehicles/" + vehicleId + "/" + path.relative(vehicleRoot, companion).split(path.sep).join("/"),
        } : {}),
      };
    })
    .filter((asset): asset is ModelAsset => asset !== null)
    .sort((a, b) => modelPriority.indexOf(a.format) - modelPriority.indexOf(b.format));

  return NextResponse.json({ assets });
}
import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const rootFiles = ["index.html", "404.html", "app.js", "styles.css", "favicon.svg"];
const requiredFiles = [
  ...rootFiles,
  "brands/registry.js",
  "brands/resolve-config.js",
  "brands/MORSA/config.js",
  "brands/MORSA/Assets/arashi/config.js",
  "brands/MORSA/Assets/arashi/model/arx_apc.glb",
  "brands/Scorpion/config.js",
];

async function assertFile(relativePath) {
  const filePath = path.join(root, relativePath);
  const info = await stat(filePath);
  if (!info.isFile() || info.size === 0) {
    throw new Error("Required EYEFIND source asset is missing or empty: " + relativePath);
  }
  return info;
}

// Validate required sources before clearing the generated public directory.
const sourceInfo = new Map();
for (const relativePath of requiredFiles) {
  sourceInfo.set(relativePath, await assertFile(relativePath));
}
const modelRelative = "brands/MORSA/Assets/arashi/model/arx_apc.glb";
const modelSourceSize = sourceInfo.get(modelRelative).size;

await rm(publicDir, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });
for (const file of rootFiles) {
  await cp(path.join(root, file), path.join(publicDir, file));
}
await cp(path.join(root, "brands"), path.join(publicDir, "brands"), { recursive: true });

const publishedModel = await stat(path.join(publicDir, modelRelative));
if (!publishedModel.isFile() || publishedModel.size !== modelSourceSize) {
  throw new Error("EYEFIND public sync did not preserve the original Arashi GLB.");
}
console.info("EYEFIND static sync complete: " + rootFiles.length + " root files, brand registry, and Arashi GLB (" + modelSourceSize + " bytes).");

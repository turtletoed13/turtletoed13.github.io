import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const rootFiles = ["index.html", "404.html", "app.js", "styles.css", "favicon.svg"];

await rm(publicDir, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });

for (const file of rootFiles) {
  await cp(path.join(root, file), path.join(publicDir, file));
}

await cp(path.join(root, "brands"), path.join(publicDir, "brands"), { recursive: true });
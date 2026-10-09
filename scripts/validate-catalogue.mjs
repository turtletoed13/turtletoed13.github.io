import assert from "node:assert/strict";
import { open, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brands } from "../brands/registry.js";
import { resolveAssetConfig } from "../brands/resolve-config.js";
import MORSA from "../brands/MORSA/config.js";
import Scorpion from "../brands/Scorpion/config.js";
import arashi from "../brands/MORSA/Assets/arashi/config.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modelPath = path.join(projectRoot, "brands/MORSA/Assets/arashi/model/arx_apc.glb");

assert.deepEqual(brands.map((brand) => brand.id), ["morsa", "scorpion"], "Only the two approved destinations may be registered.");
assert.equal(MORSA.legalName, "MORSA — Military Ordnance, Restricted Stock & Acquisition");
assert.equal(Scorpion.legalName, "Scorpion Automotive Dealership & Performance");
assert.deepEqual(MORSA.assets, ["arashi"], "The dedicated Arashi listing must be registered.");
assert.deepEqual(Scorpion.assets, [], "Do not invent Scorpion inventory.");
assert.equal(arashi.id, "arashi");
assert.equal(arashi.name, "Heavy, ST-17 Arashi");
assert.equal(arashi.model.src, "model/arx_apc.glb");
assert.notEqual(arashi.id, "_TEMPLATE");

const modelStat = await stat(modelPath);
assert.ok(modelStat.isFile() && modelStat.size > 1000, "The canonical Arashi GLB must exist and be non-empty.");
const handle = await open(modelPath, "r");
try {
  const header = Buffer.alloc(20);
  const { bytesRead } = await handle.read(header, 0, header.length, 0);
  assert.equal(bytesRead, 20, "GLB header must be readable.");
  assert.equal(header.toString("ascii", 0, 4), "glTF", "Asset must be a GLB container, not a placeholder/text file.");
  assert.equal(header.readUInt32LE(4), 2, "GLB version must be glTF 2.0.");
  assert.equal(header.readUInt32LE(8), modelStat.size, "GLB header length must match the actual file.");
  assert.equal(header.readUInt32LE(16), 0x4e4f534a, "First GLB chunk must contain JSON metadata.");
  assert.ok(header.readUInt32LE(12) <= modelStat.size - 20, "GLB JSON chunk length must fit inside the file.");
} finally {
  await handle.close();
}

const itemSource = {
  ...arashi,
  configSource: "inherit",
  description: "Listing-authored description.",
  visible: true,
  onSale: false,
  salePercent: 0,
  price: 425000,
  originalPrice: null,
  salePrice: null,
  stockStatus: "Listing stock"
};
const brandMode = resolveAssetConfig({ ...MORSA, catalog: { ...MORSA.catalog, configSource: "brand" } }, itemSource);
assert.equal(brandMode.configSourceResolved, "brand");
assert.equal(brandMode.description, "Listing-authored description.");
assert.equal(brandMode.onSale, false);
assert.equal(brandMode.price, 425000);

const generatedBrand = {
  ...MORSA,
  catalog: {
    configSource: "generated",
    generatedConfig: {
      descriptionTemplate: "{name} · {brandName} · {legalName} · {category}",
      visible: false,
      onSale: true,
      salePercent: 15,
      price: null,
      originalPrice: null,
      salePrice: null,
      stockStatus: "Generated status",
      currency: "USD",
      badge: "GENERATED"
    }
  }
};
const generatedMode = resolveAssetConfig(generatedBrand, itemSource);
assert.equal(generatedMode.configSourceResolved, "generated");
assert.equal(generatedMode.visible, false, "Generated visibility must override listing visibility.");
assert.equal(generatedMode.onSale, true, "Generated sale state must override listing sale state.");
assert.equal(generatedMode.salePercent, 15);
assert.equal(generatedMode.price, 425000, "A null generated price intentionally falls back to the listing price.");
assert.equal(generatedMode.stockStatus, "Generated status");
assert.equal(generatedMode.badge, "GENERATED");
assert.equal(generatedMode.description, "Heavy, ST-17 Arashi · MORSA · MORSA — Military Ordnance, Restricted Stock & Acquisition · Armored vehicle");

const forcedBrandMode = resolveAssetConfig(generatedBrand, { ...itemSource, configSource: "brand" });
assert.equal(forcedBrandMode.configSourceResolved, "brand", "A listing-level brand override must win.");
const forcedGeneratedMode = resolveAssetConfig({ ...MORSA, catalog: { ...MORSA.catalog, configSource: "brand" } }, { ...itemSource, configSource: "generated" });
assert.equal(forcedGeneratedMode.configSourceResolved, "generated", "A listing-level generated override must win.");

console.info("EYEFIND catalogue validation passed: registered destinations, Arashi GLB header, template exclusion, and config-mode precedence.");

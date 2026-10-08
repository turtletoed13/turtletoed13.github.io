const allowedModes = new Set(["brand", "generated", "inherit"]);

function fillTemplate(template, values) {
  return String(template || "").replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : "";
  });
}

/**
 * Resolve item metadata without coupling the catalogue renderer to a specific brand.
 *
 * brand.catalog.configSource:
 *   "brand"     -> fields from Assets/<asset-id>/config.js drive description, price and sale state.
 *   "generated" -> brand.catalog.generatedConfig drives generated description, visibility and sale defaults.
 *
 * An asset can override the brand-wide mode with configSource: "brand" or "generated".
 */
export function resolveAssetConfig(brand, asset) {
  const catalog = brand.catalog || {};
  const generated = catalog.generatedConfig || {};
  const requestedMode = allowedModes.has(asset.configSource) ? asset.configSource : "inherit";
  const mode = requestedMode === "inherit" ? (catalog.configSource === "brand" ? "brand" : "generated") : requestedMode;
  const values = {
    name: asset.name || asset.id || "Untitled listing",
    brandName: brand.name || "",
    legalName: brand.legalName || "",
    category: asset.category || brand.category || "",
    brandTagline: brand.tagline || ""
  };

  if (mode === "brand") {
    return Object.assign({}, asset, {
      name: values.name,
      description: asset.description || "",
      visible: asset.visible !== false,
      onSale: asset.onSale === true,
      salePercent: Number(asset.salePercent || 0),
      price: asset.price == null || asset.price === "" ? null : Number(asset.price),
      salePrice: asset.salePrice == null || asset.salePrice === "" ? null : Number(asset.salePrice),
      originalPrice: asset.originalPrice == null || asset.originalPrice === "" ? null : Number(asset.originalPrice),
      stockStatus: asset.stockStatus || "Available",
      currency: asset.currency || generated.currency || "USD",
      configSourceResolved: "brand"
    });
  }

  const generatedPrice = generated.price == null || generated.price === "" ? asset.price : generated.price;
  const generatedOriginalPrice = generated.originalPrice == null || generated.originalPrice === "" ? asset.originalPrice : generated.originalPrice;
  const generatedSalePrice = generated.salePrice == null || generated.salePrice === "" ? asset.salePrice : generated.salePrice;
  return Object.assign({}, asset, {
    name: values.name,
    description: fillTemplate(generated.descriptionTemplate, values) || asset.description || "",
    visible: generated.visible !== false,
    onSale: generated.onSale === true,
    salePercent: Number(generated.salePercent || 0),
    price: generatedPrice == null || generatedPrice === "" ? null : Number(generatedPrice),
    salePrice: generatedSalePrice == null || generatedSalePrice === "" ? null : Number(generatedSalePrice),
    originalPrice: generatedOriginalPrice == null || generatedOriginalPrice === "" ? null : Number(generatedOriginalPrice),
    stockStatus: generated.stockStatus || asset.stockStatus || "Available",
    currency: generated.currency || asset.currency || "USD",
    badge: generated.badge || asset.badge || "",
    configSourceResolved: "generated"
  });
}

export default resolveAssetConfig;
// Copy this directory for each new MORSA listing.
// Example: brands/MORSA/Assets/<item-id>/config.js
const asset = {
  id: "replace-with-item-id",
  name: "Replace with listing name",
  catalogId: "MORSA-REPLACE-ME",
  category: "Specialist supply",
  // inherit follows MORSA/config.js; brand uses this file's metadata,
  // generated uses MORSA's shared catalog.generatedConfig.
  configSource: "inherit",
  description: "Write the listing description here.",
  visible: true,
  onSale: false,
  salePercent: 0,
  price: null,
  originalPrice: null,
  salePrice: null,
  stockStatus: "Available",
  currency: "USD",
  badge: "SPECIALIST LISTING",
  model: { src: "model/model.glb", format: "glb" },
  poster: "images/preview.webp",
  images: ["images/preview.webp"],
  tags: []
};

export default asset;
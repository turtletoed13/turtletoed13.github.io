// Duplicate this folder for each new Scorpion vehicle or performance listing.
// Example destination: brands/Scorpion/Assets/<item-id>/config.js
const asset = {
  id: "replace-with-item-id",
  name: "Replace with vehicle name",
  catalogId: "SCORPION-REPLACE-ME",
  category: "Automotive",

  // inherit follows Scorpion/config.js. Use "brand" to force the fields below,
  // or "generated" to force Scorpion's catalog.generatedConfig for this listing.
  configSource: "inherit",

  // Used when the effective config mode is "brand".
  description: "Write the vehicle description here.",
  visible: true,
  onSale: false,
  salePercent: 0,
  price: null,
  originalPrice: null,
  salePrice: null,
  stockStatus: "Available",
  currency: "USD",
  badge: "DEALERSHIP LISTING",

  // Use a browser-ready GLB/glTF for the in-page interactive 3D preview.
  model: {
    src: "model/model.glb",
    format: "glb"
  },
  poster: "images/preview.webp",
  images: ["images/preview.webp"],
  tags: []
};

export default asset;
// Duplicate this folder for each new MORSA listing.
// Example destination: brands/MORSA/Assets/<item-id>/config.js
const asset = {
  id: "replace-with-item-id",
  name: "Replace with listing name",
  catalogId: "MORSA-REPLACE-ME",
  category: "Specialist supply",

  // inherit follows MORSA/config.js. Use "brand" to force the fields below,
  // or "generated" to force MORSA's catalog.generatedConfig for this one item.
  configSource: "inherit",

  // Used when the effective config mode is "brand".
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

  // Put a GLB/glTF model in this folder's model/ directory.
  // Keep source authoring files alongside it if needed, but point the browser
  // preview at a browser-supported .glb or .gltf file.
  model: {
    src: "model/model.glb",
    format: "glb"
  },
  poster: "images/preview.webp",
  images: ["images/preview.webp"],
  tags: []
};

export default asset;
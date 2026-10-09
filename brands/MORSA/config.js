const MORSA = {
  id: "morsa",
  folder: "MORSA",
  name: "MORSA",
  legalName: "MORSA — Military Ordnance, Restricted Stock & Acquisition",
  domain: "morsa.eyefind",
  category: "Specialist supply",
  categoryId: "specialist",
  tagline: "Specialist capability. Carefully sourced.",
  description: "A specialist destination for restricted stock, tactical mobility and mission-focused equipment. Clear listings, controlled availability and a catalogue built to expand with the world.",
  accent: "#c8bea7",
  logo: "./brands/MORSA/Brand/logo.svg",
  featuredAsset: "arashi",
  featuredModel: "Assets/arashi/model/arx_apc.glb",
  assets: ["arashi"],

  catalog: {
    // Toggle between "brand" and "generated".
    // brand: every Assets/<item>/config.js controls its own description, price, visibility and sale state.
    // generated: generatedConfig controls those shared values for every item unless that item overrides configSource.
    configSource: "generated",
    generatedConfig: {
      descriptionTemplate: "{name} is part of the MORSA catalogue, with supplier-managed specifications and availability.",
      visible: true,
      onSale: false,
      salePercent: 0,
      price: null,
      originalPrice: null,
      salePrice: null,
      stockStatus: "Available",
      currency: "USD",
      badge: "SPECIALIST LISTING"
    }
  }
};

export default MORSA;
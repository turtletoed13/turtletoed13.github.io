const Scorpion = {
  id: "scorpion",
  folder: "Scorpion",
  name: "Scorpion",
  legalName: "Scorpion Automotive Dealership & Performance",
  domain: "scorpion.eyefind",
  category: "Automotive",
  categoryId: "automotive",
  tagline: "Purposeful design. Pure performance.",
  description: "A focused automotive destination for performance machines, considered specifications and dealership-quality presentation. Explore the collection as new vehicles and configuration options are published.",
  accent: "#d8a78e",
  logo: "./brands/Scorpion/Brand/logo.svg",
  assets: [],

  catalog: {
    // Toggle between "brand" and "generated".
    // brand: every Assets/<item>/config.js controls its own description, price, visibility and sale state.
    // generated: generatedConfig controls those shared values for every item unless that item overrides configSource.
    configSource: "generated",
    generatedConfig: {
      descriptionTemplate: "{name} is part of the Scorpion collection, with performance details and availability maintained by the dealership.",
      visible: true,
      onSale: false,
      salePercent: 0,
      price: null,
      originalPrice: null,
      salePrice: null,
      stockStatus: "Available",
      currency: "USD",
      badge: "DEALERSHIP LISTING"
    }
  }
};

export default Scorpion;
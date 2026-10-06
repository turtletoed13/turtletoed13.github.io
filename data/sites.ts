import type { NolineSite } from "../types/catalog";

export const sites: NolineSite[] = [
  { id: "market", name: "Mercury Market", domain: "mercury.noline", category: "Commerce", tagline: "Everything in one place.", description: "A premium marketplace for products, services and city essentials.", glyph: "M", serviceStatus: "live" },
  { id: "ironclad", name: "Ironclad Exchange", domain: "ironclad.noline", category: "Mobility", tagline: "Machines built without compromise.", description: "Specialized heavy vehicles and high-mobility platforms.", glyph: "I", serviceStatus: "live" },
  { id: "aurelion", name: "Aurelion Motors", domain: "aurelion.noline", category: "Automotive", tagline: "Performance, elevated.", description: "Exotic, grand touring and executive vehicles.", glyph: "A", serviceStatus: "live" },
  { id: "keystone", name: "Keystone Estates", domain: "keystone.noline", category: "Property", tagline: "Own where you belong.", description: "Private residences, compounds and commercial property.", glyph: "K", serviceStatus: "live" },
  { id: "atlas", name: "Atlas Meridian", domain: "atlas.noline", category: "Travel", tagline: "Go further.", description: "Premium travel, aviation and city transport.", glyph: "A", serviceStatus: "planned" },
  { id: "northline", name: "Northline Financial", domain: "northline.noline", category: "Finance", tagline: "Move money with confidence.", description: "Modern financial tools ready for a future game economy.", glyph: "N", serviceStatus: "planned" },
  { id: "vanta", name: "Vanta Customs", domain: "vanta.noline", category: "Automotive", tagline: "Make it yours.", description: "Factory options, custom finishes and vehicle upgrades.", glyph: "V", serviceStatus: "live" },
  { id: "vector", name: "Vector Works", domain: "vector.noline", category: "Engineering", tagline: "Tune the machine.", description: "Performance parts, engineering and fabrication.", glyph: "V", serviceStatus: "live" },
  { id: "signal", name: "Signal Current", domain: "signal.noline", category: "News", tagline: "Know what is happening.", description: "City reports, market movement and live events.", glyph: "S", serviceStatus: "live" },
  { id: "vantage", name: "Vantage Careers", domain: "vantage.noline", category: "Careers", tagline: "Make your next move.", description: "Contracts and opportunities across the city.", glyph: "V", serviceStatus: "planned" },
  { id: "foundry", name: "Foundry Supply", domain: "foundry.noline", category: "Industrial", tagline: "Serious gear for serious work.", description: "Industrial equipment and specialist supply.", glyph: "F", serviceStatus: "planned" },
];

export const liveSites = sites.filter((site) => site.serviceStatus === "live");

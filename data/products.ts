import type { NolineProduct } from "../lib/store";

export const products: NolineProduct[] = [
  { id: "noline-pass", name: "NOLINE Priority Pass", description: "Priority access across participating city services and future game systems.", price: 1200, category: "Membership" },
  { id: "security-suite", name: "Executive Security Suite", description: "A future-ready service package for residences, vehicles and private operations.", price: 6800, category: "Services" },
  { id: "air-charter", name: "Atlas Private Charter", description: "Flexible premium transport credit for the Atlas Meridian network.", price: 14500, category: "Travel" },
  { id: "calibration", name: "Vector Performance Calibration", description: "Factory-style tuning service for supported performance vehicles.", price: 4200, category: "Engineering" }
];

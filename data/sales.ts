import { regularVehicles, saleVehicles, specialVehicles } from "./vehicles";

export const catalogSections = {
  onSale: saleVehicles,
  fullPrice: regularVehicles,
  specialStock: specialVehicles,
};

export const catalogCounts = {
  onSale: saleVehicles.length,
  fullPrice: regularVehicles.length,
  specialStock: specialVehicles.length,
};

export const unavailableNote = "Vehicles marked unavailable remain visible so the catalog can later be driven by live game inventory.";

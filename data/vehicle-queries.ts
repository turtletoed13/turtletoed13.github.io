import { vehicles } from "./vehicles";
import type { Vehicle } from "../types/catalog";

export function getVehicleById(id: string): Vehicle {
  return vehicles.find((vehicle) => vehicle.id === id) ?? vehicles[0];
}

export function searchVehicles(query: string): Vehicle[] {
  const q = query.trim().toLowerCase();
  if (!q) return vehicles;
  return vehicles.filter((vehicle) =>
    [vehicle.name, vehicle.brand, vehicle.manufacturer, vehicle.className, vehicle.category, ...vehicle.tags]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}

"use client";

import { Car, Zap } from "lucide-react";
import { vehicles } from "../../data/vehicles";
import { VehicleCard } from "../catalog/VehicleCard";

export function ShowroomPage({ mode = "luxury", favorites, onFavorite, onOpenVehicle, onAdd }: { mode?: "luxury" | "heavy" | "special"; favorites: string[]; onFavorite: (id: string) => void; onOpenVehicle: (id: string) => void; onAdd: (id: string) => void }) {
  const list = mode === "heavy" ? vehicles.filter((v) => v.category === "Heavy") : mode === "special" ? vehicles.filter((v) => v.specialVehicle) : vehicles.filter((v) => v.category === "Luxury" || v.category === "Performance");
  const special = mode === "special";
  return <div className="page"><div className="page-head"><span className="kicker">{special ? "SPECIAL STOCK" : "AURELION MOTORS"}</span><h1>{special ? "Machines that won't stay." : "Performance, elevated."}</h1><p>{special ? "Limited vehicles receive their own visual treatment and remain visible even when inventory is one unit deep." : "Luxury, executive and performance vehicles with inspection-first browsing."}</p></div><div className="showroom-hero"><div><span>{special ? "LIMITED / HAND-FINISHED" : "AURELION COLLECTION"}</span><h2>{special ? "Rare by design." : "Choose the machine that fits the moment."}</h2><p>Every listing opens to a dedicated inspection page.</p></div><div className="showroom-symbol">{special ? <Zap size={28}/> : <Car size={28}/>}</div></div><div className="vehicle-grid">{list.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} favorite={favorites.includes(vehicle.id)} onFavorite={() => onFavorite(vehicle.id)} onOpen={() => onOpenVehicle(vehicle.id)} onAdd={() => onAdd(vehicle.id)}/>)}</div></div>;
}

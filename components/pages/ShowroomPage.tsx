"use client";

import { ArrowRight, Car, Zap } from "lucide-react";
import { vehicles } from "../../data/vehicles";
import { VehicleCard } from "../catalog/VehicleCard";

export function ShowroomPage({
  mode = "luxury",
  favorites,
  onFavorite,
  onOpenVehicle,
  onAdd,
}: {
  mode?: "luxury" | "heavy" | "special";
  favorites: string[];
  onFavorite: (id: string) => void;
  onOpenVehicle: (id: string) => void;
  onAdd: (id: string) => void;
}) {
  const list = mode === "heavy"
    ? vehicles.filter((v) => v.category === "Heavy")
    : mode === "special"
      ? vehicles.filter((v) => v.specialVehicle)
      : vehicles.filter((v) => v.category === "Luxury" || v.category === "Performance");

  const special = mode === "special";

  return (
    <div className="premium-page premium-showroom">
      <header className="premium-page-intro">
        <div>
          <span className="premium-kicker">{special ? "SPECIAL / LIMITED STOCK" : mode === "heavy" ? "IRONCLAD / MOBILITY" : "AURELION / MOTORS"}</span>
          <h1>{special ? <>Rare by<br /><em>design.</em></> : mode === "heavy" ? <>Built to<br /><em>keep moving.</em></> : <>Performance,<br /><em>elevated.</em></>}</h1>
          <p>{special ? "A small class of vehicles that exist outside ordinary inventory." : mode === "heavy" ? "Heavy-duty mobility for operators who expect absolute confidence from the machine." : "Exotic, grand touring and executive vehicles presented as complete objects."}</p>
        </div>
        <div className="premium-showroom-symbol">{special ? <Zap size={28} /> : <Car size={28} />}</div>
      </header>

      <section className={`premium-showroom-hero ${mode}`}>
        <div>
          <span>{special ? "LIMITED / HAND-FINISHED" : "INSPECTION-FIRST COLLECTION"}</span>
          <h2>{special ? "One remaining changes the decision." : mode === "heavy" ? "The hard part starts where the road ends." : "Choose the machine that fits the moment."}</h2>
        </div>
        <div className="premium-showroom-hero-meta">
          <span>{list.length.toString().padStart(2, "0")} OBJECTS</span>
          <span>LIVE CATALOG</span>
        </div>
      </section>

      <div className="premium-vehicle-grid premium-showroom-grid">
        {list.map((vehicle, index) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            index={index}
            favorite={favorites.includes(vehicle.id)}
            onFavorite={() => onFavorite(vehicle.id)}
            onOpen={() => onOpenVehicle(vehicle.id)}
            onAdd={() => onAdd(vehicle.id)}
          />
        ))}
      </div>

      <button className="premium-showroom-link" onClick={() => onOpenVehicle(list[0]?.id ?? "arashi")}>
        <span><small>INSPECTION LAYER</small><strong>Open the selected machine in full.</strong></span>
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

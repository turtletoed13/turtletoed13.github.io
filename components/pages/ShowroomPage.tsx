"use client";

import { ArrowRight, Car, Zap } from "lucide-react";
import { vehicles } from "../../data/vehicles";
import { VehicleCard } from "../catalog/VehicleCard";

export function ShowroomPage({
  mode = "luxury", favorites, onFavorite, onOpenVehicle, onAdd
}: {
  mode?: "luxury" | "heavy" | "special";
  favorites: string[];
  onFavorite: (id: string) => void;
  onOpenVehicle: (id: string) => void;
  onAdd: (id: string) => void;
}) {
  const list = mode === "heavy"
    ? vehicles.filter(v => v.category === "Heavy")
    : mode === "special"
      ? vehicles.filter(v => v.specialVehicle)
      : vehicles.filter(v => v.category === "Luxury" || v.category === "Performance");

  const special = mode === "special";
  const heavy = mode === "heavy";

  return (
    <div className="apple-page apple-showroom">
      <header className="apple-page-hero">
        <div>
          <span className="apple-eyebrow">{special ? "Special collection" : heavy ? "Ironclad" : "Aurelion Motors"}</span>
          <h1>{special ? <>Rare by<br /><em>nature.</em></> : heavy ? <>Built to<br /><em>keep going.</em></> : <>Beautifully<br /><em>made.</em>}</h1>
          <p>{special ? "A small collection for the moments when ordinary isn't enough." : heavy ? "Heavy mobility with a quiet confidence and a sense of purpose." : "Luxury and performance, presented as complete objects."}</p>
        </div>
        <div className="apple-page-hero-icon">{special ? <Zap size={28} /> : <Car size={28} />}</div>
      </header>

      <section className={`apple-showroom-hero ${mode}`}>
        <div className="apple-showroom-hero-copy">
          <span>{special ? "Limited availability" : heavy ? "Designed for difficult roads" : "A considered collection"}</span>
          <h2>{special ? "One remaining." : heavy ? "The road can change. The machine doesn't have to." : "Choose the one that feels right."}</h2>
        </div>
        <span className="apple-showroom-count">{list.length} {list.length === 1 ? "vehicle" : "vehicles"}</span>
      </section>

      <section className="apple-section">
        <div className="apple-section-title"><div><span className="apple-eyebrow">Collection</span><h2>Take your time.</h2></div></div>
        <div className="apple-vehicle-grid">{list.map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} favorite={favorites.includes(vehicle.id)} onFavorite={() => onFavorite(vehicle.id)} onOpen={() => onOpenVehicle(vehicle.id)} onAdd={() => onAdd(vehicle.id)} />)}</div>
      </section>

      <button className="apple-showroom-cta" onClick={() => onOpenVehicle(list[0]?.id ?? "arashi")}><span><small>Featured</small><strong>Open the full vehicle experience.</strong></span><ArrowRight size={15} /></button>
    </div>
  );
}

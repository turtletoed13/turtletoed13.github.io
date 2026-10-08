"use client";

import { ArrowRight, Heart, Plus, Tag, Zap } from "lucide-react";
import type { Vehicle } from "../../types/catalog";
import { Pressable } from "../animations/Pressable";

const money = (value: number) => "$" + value.toLocaleString("en-US");

export function VehicleCard({
  vehicle,
  index = 0,
  favorite,
  onFavorite,
  onOpen,
  onAdd,
}: {
  vehicle: Vehicle;
  index?: number;
  favorite: boolean;
  onFavorite: () => void;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <article className={`premium-vehicle-card ${vehicle.specialVehicle ? "special" : ""}`}>
      <Pressable className="premium-vehicle-art" onClick={onOpen} aria-label={`Inspect ${vehicle.name}`}>
        <div className="premium-vehicle-meta-top">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{vehicle.specialVehicle ? "SPECIAL" : vehicle.category.toUpperCase()}</span>
        </div>
        <div className="premium-vehicle-art-grid" aria-hidden="true" />
        <div className="premium-vehicle-image" style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined} />
        <div className="premium-vehicle-vignette" />
        <div className="premium-vehicle-badges">
          {vehicle.specialVehicle && <span><Zap size={10} /> SPECIAL</span>}
          {vehicle.saleStatus === "sale" && <span><Tag size={10} /> {vehicle.saleLabel ?? "ON SALE"}</span>}
        </div>
        <div className="premium-vehicle-art-foot"><span>{vehicle.manufacturer}</span><strong>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</strong></div>
      </Pressable>

      <div className="premium-vehicle-info">
        <div className="premium-vehicle-title">
          <div><span>{vehicle.className}</span><h3>{vehicle.name}</h3><p>{vehicle.tagline}</p></div>
          <div className="premium-vehicle-price">
            {vehicle.originalPrice && <del>{money(vehicle.originalPrice)}</del>}
            <strong>{money(vehicle.price)}</strong>
          </div>
        </div>

        <div className="premium-vehicle-stock">
          <span><i className={vehicle.stock} /> {vehicle.stockLabel}</span>
          <span>{vehicle.delivery}</span>
        </div>

        <div className="premium-vehicle-actions">
          <button className={favorite ? "heart active" : "heart"} onClick={onFavorite} aria-label={favorite ? "Remove favorite" : "Favorite"}>
            <Heart size={14} fill={favorite ? "currentColor" : "none"} />
          </button>
          <button className="premium-card-button secondary" onClick={onOpen}>Inspect <ArrowRight size={13} /></button>
          <button className="premium-card-button primary" onClick={onAdd}>Add <Plus size={13} /></button>
        </div>
      </div>
    </article>
  );
}

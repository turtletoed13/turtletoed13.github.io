"use client";

import { ArrowRight, Heart, Plus, Tag, Zap } from "lucide-react";
import type { Vehicle } from "../../types/catalog";
import { Pressable } from "../animations/Pressable";

const money = (value: number) => "$" + value.toLocaleString("en-US");

export function VehicleCard({
  vehicle, index = 0, favorite, onFavorite, onOpen, onAdd,
}: {
  vehicle: Vehicle;
  index?: number;
  favorite: boolean;
  onFavorite: () => void;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="apple-vehicle-card">
      <Pressable className="apple-vehicle-art" onClick={onOpen} aria-label={`Inspect ${vehicle.name}`}>
        <div className="apple-vehicle-top"><span>{String(index + 1).padStart(2, "0")}</span><span>{vehicle.specialVehicle ? "Special" : vehicle.category}</span></div>
        <div className="apple-vehicle-haze" />
        <div className="apple-vehicle-image" style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined} />
        <div className="apple-vehicle-bottom"><span>{vehicle.manufacturer}</span><strong>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</strong></div>
        <div className="apple-vehicle-badges">
          {vehicle.specialVehicle && <span><Zap size={10} /> Special</span>}
          {vehicle.saleStatus === "sale" && <span><Tag size={10} /> {vehicle.saleLabel ?? "On sale"}</span>}
        </div>
      </Pressable>

      <div className="apple-vehicle-info">
        <div className="apple-vehicle-copy"><span>{vehicle.className}</span><h3>{vehicle.name}</h3><p>{vehicle.tagline}</p></div>
        <div className="apple-vehicle-price">{vehicle.originalPrice && <del>{money(vehicle.originalPrice)}</del>}<strong>{money(vehicle.price)}</strong></div>
      </div>

      <div className="apple-vehicle-meta">
        <span><i className={vehicle.stock} /> {vehicle.stockLabel}</span>
        <span>{vehicle.delivery}</span>
      </div>

      <div className="apple-vehicle-actions">
        <button className={favorite ? "apple-heart active" : "apple-heart"} onClick={onFavorite} aria-label="Favorite"><Heart size={14} fill={favorite ? "currentColor" : "none"} /></button>
        <button className="apple-card-button secondary" onClick={onOpen}>Explore <ArrowRight size={13} /></button>
        <button className="apple-card-button primary" onClick={onAdd}>Add <Plus size={13} /></button>
      </div>
    </article>
  );
}

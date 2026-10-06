"use client";

import { ArrowRight, Heart, Plus, Tag, Zap } from "lucide-react";
import type { Vehicle } from "../../types/catalog";
import { Pressable } from "../animations/Pressable";

const money = (value: number) => "$" + value.toLocaleString("en-US");

export function VehicleCard({
  vehicle,
  favorite,
  onFavorite,
  onOpen,
  onAdd,
}: {
  vehicle: Vehicle;
  favorite: boolean;
  onFavorite: () => void;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="catalog-card">
      <Pressable className="catalog-art-button" onClick={onOpen} aria-label={`Inspect ${vehicle.name}`}>
        <div className={`catalog-art ${vehicle.specialVehicle ? "special-art" : ""}`}>
          <div className={`vehicle-ghost ${vehicle.category.toLowerCase()} `}><span>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</span></div>
        </div>
        <div className="catalog-badges">
          {vehicle.specialVehicle && <span className="badge special"><Zap size={11}/> SPECIAL</span>}
          {vehicle.saleStatus === "sale" && <span className="badge sale"><Tag size={11}/> {vehicle.saleLabel ?? "ON SALE"}</span>}
        </div>
      </Pressable>
      <div className="catalog-body">
        <div className="catalog-heading">
          <div><small>{vehicle.manufacturer} / {vehicle.className}</small><h3>{vehicle.name}</h3><p>{vehicle.tagline}</p></div>
          <div className="catalog-price">
            {vehicle.originalPrice && <del>{money(vehicle.originalPrice)}</del>}
            <strong>{money(vehicle.price)}</strong>
          </div>
        </div>
        <div className="catalog-stock"><span className={`stock-dot ${vehicle.stock}`}/>{vehicle.stockLabel}<span>·</span>{vehicle.delivery}</div>
        <div className="catalog-actions">
          <button className={favorite ? "round-action liked" : "round-action"} onClick={onFavorite} aria-label="Favorite"><Heart size={14} fill={favorite ? "currentColor" : "none"}/></button>
          <button className="button secondary" onClick={onOpen}>Inspect <ArrowRight size={13}/></button>
          <button className="button blue" onClick={onAdd}>Add <Plus size={13}/></button>
        </div>
      </div>
    </article>
  );
}

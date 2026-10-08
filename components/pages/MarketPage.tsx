"use client";

import { Search, ArrowRight, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { saleVehicles, regularVehicles, specialVehicles, vehicles } from "../../data/vehicles";
import { products } from "../../data/products";
import type { Vehicle } from "../../types/catalog";
import { VehicleCard } from "../catalog/VehicleCard";

type Filter = "all" | "sale" | "full" | "special";
const filters: [Filter, string][] = [["all", "All"], ["sale", "On sale"], ["full", "Full price"], ["special", "Special"]];

export function MarketPage({
  favorites, onFavorite, onOpenVehicle, onAdd, onService, initialFilter = "all"
}: {
  favorites: string[];
  onFavorite: (id: string) => void;
  onOpenVehicle: (id: string) => void;
  onAdd: (id: string) => void;
  onService?: (id: string) => void;
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState("");
  useEffect(() => setFilter(initialFilter), [initialFilter]);

  const shown: Vehicle[] = useMemo(() => {
    const source = filter === "sale" ? saleVehicles : filter === "full" ? regularVehicles : filter === "special" ? specialVehicles : vehicles;
    const q = query.trim().toLowerCase();
    return q ? source.filter(v => [v.name, v.manufacturer, v.category, v.className, ...v.tags].join(" ").toLowerCase().includes(q)) : source;
  }, [filter, query]);

  return (
    <div className="apple-page apple-market">
      <header className="apple-page-hero">
        <div>
          <span className="apple-eyebrow">Mercury</span>
          <h1>Buy something<br /><em>you'll keep.</em></h1>
          <p>A quiet collection of vehicles and useful things, designed to be explored rather than sold at you.</p>
        </div>
        <div className="apple-page-hero-number"><span>{vehicles.length}</span><small>objects</small></div>
      </header>

      <div className="apple-market-bar">
        <div className="apple-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Mercury…" />
          {query && <button onClick={() => setQuery("")}>Clear</button>}
        </div>
        <div className="apple-filter">
          {filters.map(([id, label]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>)}
        </div>
      </div>

      <section className="apple-section">
        <div className="apple-section-title"><div><span className="apple-eyebrow">Vehicles</span><h2>{filter === "sale" ? "On sale." : filter === "full" ? "Full price." : filter === "special" ? "Special stock." : "The collection."}</h2></div><span>{shown.length} available</span></div>
        <div className="apple-vehicle-grid">
          {shown.map((vehicle, index) => <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} favorite={favorites.includes(vehicle.id)} onFavorite={() => onFavorite(vehicle.id)} onOpen={() => onOpenVehicle(vehicle.id)} onAdd={() => onAdd(vehicle.id)} />)}
        </div>
      </section>

      <section className="apple-section apple-goods">
        <div className="apple-section-title"><div><span className="apple-eyebrow">More</span><h2>Useful, considered things.</h2></div></div>
        <div className="apple-goods-grid">
          {products.map((product) => (
            <article className="apple-good" key={product.id}>
              <div className="apple-good-symbol">{product.category.slice(0, 1)}</div>
              <div><span>{product.category}</span><h3>{product.name}</h3><p>{product.description}</p></div>
              <strong>{product.price.toLocaleString("en-US")}</strong>
              <button onClick={() => onService?.(product.id)}><Check size={13} /> Request <ArrowRight size={12} /></button>
            </article>
          ))}
        </div>
      </section>

      <footer className="apple-footer"><span>MERCURY</span><span>NOLINE</span><span>© 2026</span></footer>
    </div>
  );
}

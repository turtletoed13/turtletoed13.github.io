"use client";

import { Search, SlidersHorizontal, ArrowRight, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { saleVehicles, regularVehicles, specialVehicles, vehicles } from "../../data/vehicles";
import { products } from "../../data/products";
import type { Vehicle } from "../../types/catalog";
import { VehicleCard } from "../catalog/VehicleCard";

type Filter = "all" | "sale" | "full" | "special";

const filters: [Filter, string, string][] = [
  ["all", "All inventory", "05"],
  ["sale", "On sale", "01"],
  ["full", "Full price", "03"],
  ["special", "Special", "02"],
];

export function MarketPage({
  favorites,
  onFavorite,
  onOpenVehicle,
  onAdd,
  onService,
  initialFilter = "all",
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
    return q ? source.filter((v) => [v.name, v.manufacturer, v.category, v.className, ...v.tags].join(" ").toLowerCase().includes(q)) : source;
  }, [filter, query]);

  return (
    <div className="premium-page premium-market">
      <header className="premium-page-intro">
        <div>
          <span className="premium-kicker">MERCURY / COMMERCE</span>
          <h1>Buy less.<br /><em>Choose better.</em></h1>
          <p>A quiet storefront for objects worth putting in your world. Deep inspection, transparent availability and a game-ready acquisition boundary.</p>
        </div>
        <div className="premium-page-intro-side">
          <span>CATALOG</span>
          <strong>05</strong>
          <small>CURATED OBJECTS</small>
        </div>
      </header>

      <section className="premium-market-banner">
        <div className="premium-market-banner-copy">
          <span className="premium-kicker">MERCURY INDEX / 07</span>
          <h2>The collection moves with the city.</h2>
          <p>Browse the current catalog by availability, price and rarity.</p>
        </div>
        <div className="premium-market-stats">
          <div><span>ON SALE</span><strong>{saleVehicles.length.toString().padStart(2, "0")}</strong></div>
          <div><span>FULL PRICE</span><strong>{regularVehicles.length.toString().padStart(2, "0")}</strong></div>
          <div><span>SPECIAL</span><strong>{specialVehicles.length.toString().padStart(2, "0")}</strong></div>
        </div>
      </section>

      <section className="premium-market-controls">
        <div className="premium-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search vehicles, manufacturers, classes…" />
          {query && <button onClick={() => setQuery("")}>Clear</button>}
        </div>
        <div className="premium-filter-shell">
          <SlidersHorizontal size={13} />
          <div className="premium-filters">
            {filters.map(([id, label, count]) => (
              <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>
                <span>{label}</span><small>{count}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-catalog-section">
        <div className="premium-section-head">
          <div><span className="premium-kicker">CURRENT INVENTORY</span><h2>{filter === "sale" ? "On sale." : filter === "full" ? "Full price." : filter === "special" ? "Special stock." : "The collection."}</h2></div>
          <span className="premium-count">{shown.length} OBJECTS</span>
        </div>
        <div className="premium-vehicle-grid">
          {shown.map((vehicle, index) => (
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
      </section>

      <section className="premium-market-goods">
        <div className="premium-section-head">
          <div><span className="premium-kicker">CITY GOODS</span><h2>More than vehicles.</h2></div>
        </div>
        <div className="premium-goods-grid">
          {products.map((product, index) => (
            <article className="premium-good" key={product.id}>
              <div className="premium-good-index">0{index + 1}</div>
              <div className="premium-good-mark">{product.category.slice(0, 2).toUpperCase()}</div>
              <div className="premium-good-copy"><span>{product.category}</span><h3>{product.name}</h3><p>{product.description}</p></div>
              <strong>{product.price.toLocaleString("en-US")}</strong>
              <button onClick={() => onService?.(product.id)}><Check size={13} /> Request <ArrowRight size={12} /></button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

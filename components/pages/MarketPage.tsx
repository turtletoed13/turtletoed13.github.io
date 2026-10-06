"use client";

import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { saleVehicles, regularVehicles, specialVehicles, vehicles } from "../../data/vehicles";
import { products } from "../../data/products";
import type { Vehicle } from "../../types/catalog";
import { VehicleCard } from "../catalog/VehicleCard";

type Filter = "all" | "sale" | "full" | "special";

export function MarketPage({ favorites, onFavorite, onOpenVehicle, onAdd, onService, initialFilter = "all" }: { favorites: string[]; onFavorite: (id: string) => void; onOpenVehicle: (id: string) => void; onAdd: (id: string) => void; onService?: (id: string) => void; initialFilter?: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  useEffect(() => setFilter(initialFilter), [initialFilter]);
  const [query, setQuery] = useState("");
  const shown: Vehicle[] = useMemo(() => {
    const source = filter === "sale" ? saleVehicles : filter === "full" ? regularVehicles : filter === "special" ? specialVehicles : vehicles;
    const q = query.trim().toLowerCase();
    return q ? source.filter((v) => [v.name, v.manufacturer, v.category, v.className].join(" ").toLowerCase().includes(q)) : source;
  }, [filter, query]);

  return <div className="page">
    <div className="page-head"><span className="kicker">MERCURY MARKET</span><h1>Objects with purpose.</h1><p>One storefront. Four catalog states. Deep inspection and future-ready checkout on every vehicle listing.</p></div>
    <div className="market-banner"><div><span>CURATED DROP / {vehicles.length.toString().padStart(2,"0")}</span><h2>Move through the city.</h2><p>See what's on sale, what's full price and what's truly special.</p></div><div className="banner-metrics"><b>{saleVehicles.length}<small>ON SALE</small></b><b>{regularVehicles.length}<small>FULL PRICE</small></b><b>{specialVehicles.length}<small>SPECIAL</small></b></div></div>
    <div className="market-controls"><div className="catalog-search"><input placeholder="Search the catalog…" value={query} onChange={(e) => setQuery(e.target.value)}/></div><div className="filter-tabs">{([["all","All"],["sale","On sale"],["full","Full price"],["special","Special vehicles"]] as const).map(([id,label]) => <button key={id} className={filter===id?"selected":""} onClick={() => setFilter(id)}>{label}</button>)}</div></div>
    <section className="catalog-section"><div className="section-head"><div><span className="kicker">VEHICLE CATALOG</span><h2>{filter === "sale" ? "On sale." : filter === "full" ? "Full price." : filter === "special" ? "Special stock." : "The collection."}</h2></div><span className="catalog-count">{shown.length} listings</span></div><div className="vehicle-grid">{shown.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} favorite={favorites.includes(vehicle.id)} onFavorite={() => onFavorite(vehicle.id)} onOpen={() => onOpenVehicle(vehicle.id)} onAdd={() => onAdd(vehicle.id)}/>)}</div></section>
    <section className="market-products"><div className="section-head"><div><span className="kicker">SERVICES & GOODS</span><h2>More than vehicles.</h2></div></div><div className="product-mini-grid">{products.map((product) => <article key={product.id} className="product-mini"><span className="mini-product-mark">{product.category.slice(0,2).toUpperCase()}</span><div><small>{product.category}</small><h3>{product.name}</h3><p>{product.description}</p></div><strong>{product.price.toLocaleString("en-US")}</strong><button className="button secondary" onClick={() => onService?.(product.id)}><Check size={13}/> Request</button></article>)}</div></section>
  </div>;
}

"use client";

import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Check, Copy, Heart, Info, ShoppingBag } from "lucide-react";
import type { Vehicle } from "../../types/catalog";

const money = (value: number) => "$" + value.toLocaleString("en-US");

export function VehicleDetail({
  vehicle,
  favorite,
  bookmarked,
  onBack,
  onFavorite,
  onBookmark,
  onInspect,
  onPurchase,
  onAdd,
}: {
  vehicle: Vehicle;
  favorite: boolean;
  bookmarked: boolean;
  onBack: () => void;
  onFavorite: () => void;
  onBookmark: () => void;
  onInspect: () => void;
  onPurchase: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="vehicle-detail-page">
      <div className="detail-top"><button className="back-link" onClick={onBack}><ArrowLeft size={14}/> Back to showroom</button><div className="detail-actions"><button onClick={onBookmark}>{bookmarked ? <BookmarkCheck size={15}/> : <Bookmark size={15}/>}</button><button onClick={onFavorite}>{favorite ? <Heart size={15} fill="currentColor"/> : <Heart size={15}/>}</button><button onClick={() => navigator.clipboard?.writeText(window.location.href)}><Copy size={15}/></button></div></div>
      <div className="detail-hero-grid">
        <div className={`detail-art ${vehicle.id === "arashi" ? "heavy-detail" : vehicle.specialVehicle ? "special-detail" : ""}`} style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined}><div className="detail-machine"><span>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</span></div><div className="detail-stamp"><span className={`stock-dot ${vehicle.stock}`}/>{vehicle.stockLabel}</div></div>
        <div className="detail-copy">
          <span className="kicker">{vehicle.manufacturer} / {vehicle.className}</span>
          <h1>{vehicle.name}</h1><p className="detail-lead">{vehicle.tagline}</p><p>{vehicle.description}</p>
          <div className="detail-pricing">{vehicle.originalPrice && <del>{money(vehicle.originalPrice)}</del>}<strong>{money(vehicle.price)}</strong>{vehicle.saleLabel && <span>{vehicle.saleLabel}</span>}</div>
          <div className="detail-ctas"><button className="button blue large" onClick={onPurchase}>Purchase <ArrowRight size={15}/></button><button className="button secondary large" onClick={onAdd}>Add to basket <ShoppingBag size={14}/></button><button className="inspect-link" onClick={onInspect}><Info size={14}/> Full inspection</button></div>
        </div>
      </div>
      <div className="detail-specs">{vehicle.stats.map((s) => <div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}</div>
      <div className="detail-columns"><section className="detail-panel"><span className="kicker">ENGINEERING</span><h2>Built around the machine.</h2>{vehicle.features.map((f) => <div className="feature-line" key={f}><Check size={14}/><span>{f}</span></div>)}</section><section className="detail-panel"><span className="kicker">CATALOG STATUS</span><h2>Available information.</h2><div className="ownership"><span>Availability</span><strong>{vehicle.stockLabel}</strong></div><div className="ownership"><span>Delivery</span><strong>{vehicle.delivery}</strong></div><div className="ownership"><span>Catalog ID</span><strong>{vehicle.catalogId}</strong></div><div className="ownership"><span>Manufacturer</span><strong>{vehicle.manufacturer}</strong></div></section></div>
    </div>
  );
}

"use client";

import { Check, X, ArrowRight } from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { Vehicle } from "../../types/catalog";

const money = (value: number) => "$" + value.toLocaleString("en-US");

export function VehicleInspector({ vehicle, onClose, onPurchase }: { vehicle: Vehicle; onClose: () => void; onPurchase: () => void }) {
  const [finish, setFinish] = useState(vehicle.colors[0]);
  return <div className="modal-backdrop" onMouseDown={(e) => e.currentTarget === e.target && onClose()}>
    <div className="vehicle-inspector">
      <div className="modal-head"><div><span className="kicker">DIGITAL INSPECTION / {vehicle.manufacturer}</span><h2>{vehicle.name}</h2></div><button onClick={onClose}><X size={18}/></button></div>
      <div className="inspection-stage" style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined}><div className={`inspection-machine ${vehicle.id === "arashi" ? "inspection-heavy" : ""}`} style={{ "--machine-color": finish } as CSSProperties}><span>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</span></div><div className="inspection-readout"><span>LIVE SPEC VIEW</span><b>{vehicle.stockLabel}</b></div></div>
      <div className="inspection-meta">{vehicle.stats.map((s) => <div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}</div>
      <div className="finish-row"><div><span>Factory finish</span><small>{finish}</small></div><div className="swatches">{vehicle.colors.map((color) => <button key={color} onClick={() => setFinish(color)} style={{ background: color }} className={finish === color ? "selected" : ""}/>)}</div></div>
      <div className="inspection-features">{vehicle.features.map((feature) => <div key={feature}><Check size={13}/>{feature}</div>)}</div>
      <div className="modal-footer"><div><span>Total</span><strong>{money(vehicle.price)}</strong></div><button className="button blue" onClick={onPurchase}>Purchase vehicle <ArrowRight size={15}/></button></div>
    </div>
  </div>;
}

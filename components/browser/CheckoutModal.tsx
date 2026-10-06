"use client";

import { ArrowRight, Check, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import type { Vehicle } from "../../types/catalog";
import { createPurchase } from "../../lib/store";

const money = (value: number) => "$" + value.toLocaleString("en-US");

export function CheckoutModal({ vehicle, onClose }: { vehicle: Vehicle; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function confirm() {
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    await createPurchase({ product: vehicle, quantity: 1, total: vehicle.price, source: "noline-checkout" });
    setBusy(false);
    setDone(true);
  }
  return <div className="modal-backdrop"><div className={`checkout-modal ${done ? "done" : ""}`}>
    {!done ? <>
      <div className="checkout-mark">{vehicle.id === "arashi" ? "ST" : vehicle.brand.slice(0,1)}</div>
      <div className="checkout-head"><span className="kicker">SECURE CHECKOUT</span><button onClick={onClose}><X size={17}/></button></div>
      <h2>Confirm your order.</h2><p>{vehicle.name}</p>
      <div className="checkout-lines"><div><span>Vehicle</span><strong>{money(vehicle.price)}</strong></div><div><span>Availability</span><strong>{vehicle.stockLabel}</strong></div><div><span>Delivery</span><strong>{vehicle.delivery}</strong></div></div>
      <button className="button blue full" disabled={busy} onClick={confirm}>{busy ? <><RefreshCw size={14} className="spin"/> Preparing order…</> : <>Confirm purchase <ArrowRight size={15}/></>}</button>
      <button className="cancel" onClick={onClose}>Not now</button>
    </> : <>
      <div className="success-orb"><Check size={28}/></div>
      <span className="kicker">ORDER READY</span><h2>Transaction prepared.</h2><p className="success-copy">NOLINE has completed the client-side checkout ceremony. The future game server takes the authoritative purchase step here.</p>
      <div className="receipt"><div><span>Item</span><strong>{vehicle.name}</strong></div><div><span>Manufacturer</span><strong>{vehicle.manufacturer}</strong></div><div><span>Total</span><strong>{money(vehicle.price)}</strong></div><div><span>Status</span><strong>GAME HANDOFF READY</strong></div></div>
      <button className="button blue full" onClick={onClose}>Done</button>
    </>}
  </div></div>;
}

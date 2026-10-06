"use client";

import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import type { Vehicle } from "../../types/catalog";

const money = (value: number) => "$" + value.toLocaleString("en-US");

export function BasketDrawer({ items, onClose, onRemove, onCheckout }: { items: Vehicle[]; onClose: () => void; onRemove: (id: string) => void; onCheckout: (vehicle: Vehicle) => void }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <div className="modal-backdrop" onMouseDown={(event) => event.currentTarget === event.target && onClose()}><aside className="basket-drawer"><div className="modal-head"><div><span className="kicker">BASKET</span><h2>Your order</h2></div><button onClick={onClose}><X size={18}/></button></div><div className="basket-list">{items.length ? items.map((item) => <div className="basket-row" key={item.id}><div className="basket-art">{item.id === "arashi" ? "ST" : item.brand.slice(0,1)}</div><div><strong>{item.name}</strong><small>{item.manufacturer}</small></div><b>{money(item.price)}</b><button onClick={() => onRemove(item.id)}><Trash2 size={13}/></button></div>) : <div className="empty"><span><ShoppingBag size={21}/></span><h3>Nothing here yet.</h3><p>Add a vehicle from the catalog.</p></div>}</div><div className="basket-total"><div className="ownership"><span>Subtotal</span><strong>{money(total)}</strong></div><div className="ownership"><span>Delivery</span><strong>Calculated by game</strong></div><button className="button blue full" disabled={!items.length} onClick={() => items[0] && onCheckout(items[0])}>Continue <ArrowRight size={15}/></button><small>Currency, ownership and delivery remain server-authoritative.</small></div></aside></div>;
}

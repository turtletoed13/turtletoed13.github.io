"use client";

import { Activity, ArrowRight, Bookmark, Car, Command, Grid2X2, History, Search, Settings, ShoppingBag, X } from "lucide-react";
import type { ElementType } from "react";
import { FadeScale } from "../animations/FadeScale";
import { sites } from "../../data/sites";
import { vehicles } from "../../data/vehicles";

export function CommandCenter({
  search, setSearch, onClose, onSite, onPage, onVehicle,
}: {
  search: string;
  setSearch: (value: string) => void;
  onClose: () => void;
  onSite: (id: string) => void;
  onPage: (page: "services" | "market" | "history" | "bookmarks" | "settings" | "diagnostics") => void;
  onVehicle: (id: string) => void;
}) {
  const q = search.trim().toLowerCase();
  const results = [
    ...sites.filter((s) => [s.name, s.domain, s.category, s.tagline].join(" ").toLowerCase().includes(q)).map((s) => ({ type: "site" as const, id: s.id, name: s.name, sub: s.domain, glyph: s.glyph })),
    ...vehicles.filter((v) => [v.name, v.brand, v.manufacturer, v.className].join(" ").toLowerCase().includes(q)).map((v) => ({ type: "vehicle" as const, id: v.id, name: v.name, sub: v.manufacturer, glyph: v.id === "arashi" ? "ST" : v.brand[0] })),
  ];
  const tile = (Icon: ElementType, title: string, hint: string, action: () => void) => <button className="command-tile" onClick={action}><span><Icon size={16}/></span><strong>{title}</strong><small>{hint}</small><ArrowRight size={13}/></button>;
  return <div className="modal-backdrop command-layer" onMouseDown={(e) => e.currentTarget === e.target && onClose()}><FadeScale className="command-center"><div className="modal-head"><div><span className="kicker">NOLINE COMMAND</span><h2>Find anything.</h2></div><button onClick={onClose}><X size={17}/></button></div><div className="command-search"><Search size={17}/><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services, vehicles or commands…"/></div>{!q ? <><div className="command-label">SHORTCUTS</div><div className="command-grid">{tile(Grid2X2,"All services","Browse the network",()=>onPage("services"))}{tile(ShoppingBag,"Marketplace","Shop the city",()=>onPage("market"))}{tile(Car,"Vehicle showroom","Inspect machines",()=>onSite("aurelion"))}{tile(History,"History","Recent browsing",()=>onPage("history"))}{tile(Bookmark,"Bookmarks","Saved vehicles",()=>onPage("bookmarks"))}{tile(Settings,"Settings","Tune the browser",()=>onPage("settings"))}{tile(Activity,"Diagnostics","System status",()=>onPage("diagnostics"))}{tile(Command,"cmdrun5","Open this interface",onClose)}</div></> : <div className="command-results">{results.length ? results.map((r) => <button key={r.type + r.id} onClick={() => r.type === "site" ? onSite(r.id) : onVehicle(r.id)}><span className="result-icon">{r.glyph}</span><span><strong>{r.name}</strong><small>{r.sub}</small></span><ArrowRight size={14}/></button>) : <div className="empty compact-empty"><span><Search size={18}/></span><h3>No results.</h3><p>Nothing matches “{search}”.</p></div>}</div>}<div className="command-foot"><span><kbd>⌘ K</kbd> Command</span><span><kbd>ESC</kbd> Close</span></div></FadeScale></div>;
}

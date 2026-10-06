"use client";

import { ArrowRight, Globe2, LockKeyhole, Sparkles } from "lucide-react";
import type { NolineSite } from "../../types/catalog";

export function SitePage({ site, onOpenShowroom, onMarket }: { site: NolineSite; onOpenShowroom: () => void; onMarket: () => void }) {
  const automotive = site.id === "aurelion" || site.id === "ironclad" || site.id === "vanta";
  return <div className="page site-landing">
    <div className="site-landing-head"><div><span className="kicker">{site.category.toUpperCase()} / {site.domain}</span><h1>{site.name}</h1><p>{site.description}</p></div><span className="site-hero-symbol"><Globe2 size={27}/></span></div>
    <div className="site-hero-panel"><div><span className="live-label"><span/> {site.serviceStatus === "live" ? "SERVICE LIVE" : "SERVICE RESERVED"}</span><h2>{site.tagline}</h2><p>{automotive ? "Browse the current collection, inspect every machine in depth and prepare an order." : "This surface is ready for the future game catalog, account layer and server-driven content."}</p><div className="actions">{automotive ? <button className="button blue" onClick={onOpenShowroom}>Open collection <ArrowRight size={14}/></button> : <button className="button blue" onClick={onMarket}>Explore Mercury Market <ArrowRight size={14}/></button>}</div></div><div className="site-hero-grid"><span><Sparkles size={15}/><b>Layered UI</b><small>Apple-grade browser surface</small></span><span><LockKeyhole size={15}/><b>Secure boundary</b><small>Game owns authoritative state</small></span></div></div>
  </div>;
}

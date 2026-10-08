"use client";

import { ArrowRight, Globe2, LockKeyhole, Sparkles } from "lucide-react";
import type { NolineSite } from "../../types/catalog";

export function SitePage({ site, onOpenShowroom, onMarket }: { site: NolineSite; onOpenShowroom: () => void; onMarket: () => void }) {
  const automotive = site.id === "aurelion" || site.id === "ironclad" || site.id === "vanta";
  return (
    <div className="premium-page premium-site">
      <header className="premium-site-header">
        <div>
          <span className="premium-kicker">{site.category.toUpperCase()} / {site.domain}</span>
          <h1>{site.name}</h1>
          <p>{site.description}</p>
        </div>
        <div className="premium-site-mark"><Globe2 size={23} /><span>{site.glyph}</span></div>
      </header>

      <section className={`premium-site-hero ${automotive ? "automotive" : ""}`}>
        <div className="premium-site-hero-main">
          <div className="premium-live"><i /> {site.serviceStatus === "live" ? "SERVICE LIVE" : "SERVICE RESERVED"}</div>
          <span className="premium-kicker">NOLINE / {site.category.toUpperCase()}</span>
          <h2>{site.tagline}</h2>
          <p>{automotive ? "Browse the current collection, inspect every machine in depth and prepare an acquisition." : "This surface is already mapped into NOLINE and ready for future game-backed content, identity and state."}</p>
          <div className="premium-site-actions">
            {automotive
              ? <button className="premium-action primary" onClick={onOpenShowroom}><span>Open collection</span><ArrowRight size={15} /></button>
              : <button className="premium-action primary" onClick={onMarket}><span>Explore Mercury</span><ArrowRight size={15} /></button>}
          </div>
        </div>

        <div className="premium-site-specs">
          <div><Sparkles size={15} /><span><strong>Spatial UI</strong><small>Layered client surface</small></span></div>
          <div><LockKeyhole size={15} /><span><strong>Protected boundary</strong><small>Game owns authority</small></span></div>
          <div><Globe2 size={15} /><span><strong>Registered route</strong><small>{site.domain}</small></span></div>
        </div>
      </section>
    </div>
  );
}

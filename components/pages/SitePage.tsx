"use client";

import { ArrowRight, Globe2, LockKeyhole } from "lucide-react";
import type { NolineSite } from "../../types/catalog";

export function SitePage({ site, onOpenShowroom, onMarket }: { site: NolineSite; onOpenShowroom: () => void; onMarket: () => void }) {
  const automotive = site.id === "aurelion" || site.id === "ironclad" || site.id === "vanta";

  return (
    <div className="apple-page apple-site">
      <header className="apple-page-hero">
        <div>
          <span className="apple-eyebrow">{site.category} · {site.domain}</span>
          <h1>{site.name}</h1>
          <p>{site.description}</p>
        </div>
        <div className="apple-site-symbol"><span>{site.glyph}</span><Globe2 size={18} /></div>
      </header>

      <section className={`apple-site-panel ${automotive ? "automotive" : ""}`}>
        <div>
          <span className="apple-eyebrow">{site.serviceStatus === "live" ? "Available now" : "Coming soon"}</span>
          <h2>{site.tagline}</h2>
          <p>{automotive ? "Explore the collection, open any vehicle and move naturally into its full experience." : "A part of the NOLINE network, ready for future content and game-backed services."}</p>
          <button className="apple-button dark" onClick={automotive ? onOpenShowroom : onMarket}>{automotive ? "Open collection" : "Explore Mercury"} <ArrowRight size={14} /></button>
        </div>
        <div className="apple-site-details">
          <div><Globe2 size={15} /><span><strong>In-world service</strong><small>{site.domain}</small></span></div>
          <div><LockKeyhole size={15} /><span><strong>Protected session</strong><small>Game-owned state</small></span></div>
        </div>
      </section>
    </div>
  );
}

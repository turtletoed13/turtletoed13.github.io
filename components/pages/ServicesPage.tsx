"use client";

import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { sites } from "../../data/sites";

export function ServicesPage({ onOpen }: { onOpen: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? sites.filter(site => [site.name, site.domain, site.category, site.tagline].join(" ").toLowerCase().includes(q)) : sites;
  }, [query]);

  return (
    <div className="apple-page apple-services">
      <header className="apple-page-hero">
        <div>
          <span className="apple-eyebrow">NOLINE</span>
          <h1>Your city.<br /><em>at a glance.</em></h1>
          <p>Every service, one clean surface. Open what you need and move on.</p>
        </div>
        <div className="apple-page-hero-number"><span>{shown.length}</span><small>services</small></div>
      </header>

      <div className="apple-services-search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search services…" /></div>

      <section className="apple-services-list">
        {shown.map((site, index) => (
          <button className="apple-service-row" key={site.id} onClick={() => onOpen(site.id)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className="apple-row-symbol">{site.glyph}</span>
            <span className="apple-row-copy"><strong>{site.name}</strong><small>{site.category} · {site.tagline}</small></span>
            <span className={site.serviceStatus === "live" ? "apple-row-status live" : "apple-row-status"}>{site.serviceStatus === "live" ? "Available" : "Coming soon"}</span>
            <ArrowRight size={15} />
          </button>
        ))}
      </section>

      <footer className="apple-footer"><span>NETWORK</span><span>NOLINE</span><span>© 2026</span></footer>
    </div>
  );
}

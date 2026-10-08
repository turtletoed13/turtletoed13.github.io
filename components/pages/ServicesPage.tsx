"use client";

import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { sites } from "../../data/sites";

export function ServicesPage({ onOpen }: { onOpen: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? sites.filter((site) => [site.name, site.domain, site.category, site.tagline].join(" ").toLowerCase().includes(q)) : sites;
  }, [query]);

  return (
    <div className="premium-page premium-services">
      <header className="premium-page-intro premium-services-intro">
        <div>
          <span className="premium-kicker">NOLINE / NETWORK</span>
          <h1>Your city.<br /><em>One surface.</em></h1>
          <p>Every registered service is a door into the world. Live systems answer immediately; reserved systems are already mapped for the game.</p>
        </div>
        <div className="premium-network-summary">
          <strong>{sites.length.toString().padStart(2, "0")}</strong>
          <span>REGISTERED</span>
          <small>{sites.filter((s) => s.serviceStatus === "live").length.toString().padStart(2, "0")} LIVE NOW</small>
        </div>
      </header>

      <div className="premium-directory-toolbar">
        <div className="premium-search">
          <Search size={15} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the network…" />
        </div>
        <span>{shown.length} SERVICES</span>
      </div>

      <div className="premium-service-directory">
        {shown.map((site, index) => (
          <button className="premium-service-row" key={site.id} onClick={() => onOpen(site.id)}>
            <span className="premium-service-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="premium-service-mark">{site.glyph}</span>
            <span className="premium-service-main">
              <small>{site.category} / {site.domain}</small>
              <strong>{site.name}</strong>
              <span>{site.tagline}</span>
            </span>
            <span className={`premium-service-state ${site.serviceStatus}`}><i />{site.serviceStatus === "live" ? "LIVE" : "RESERVED"}</span>
            <ArrowRight size={15} />
          </button>
        ))}
      </div>

      <footer className="premium-footer"><span>NETWORK DIRECTORY</span><span>NOLINE / 2026</span></footer>
    </div>
  );
}

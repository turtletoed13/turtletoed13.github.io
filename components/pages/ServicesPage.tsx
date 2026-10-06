"use client";

import { ArrowRight } from "lucide-react";
import { sites } from "../../data/sites";

export function ServicesPage({ onOpen }: { onOpen: (id: string) => void }) {
  return <div className="page"><PageHead kicker="NOLINE SERVICES" title="Everything is closer." description="A curated directory for the city's online services. Stable IDs and domains keep the browser ready for future game-backed endpoints."/><div className="directory">{sites.map((site) => <button key={site.id} onClick={() => onOpen(site.id)}><span className="directory-icon">{site.glyph}</span><div><small>{site.category} / {site.domain}</small><h3>{site.name}</h3><p>{site.tagline}</p></div><span className={site.serviceStatus === "live" ? "directory-state live" : "directory-state"}>{site.serviceStatus.toUpperCase()}</span><ArrowRight size={16}/></button>)}</div></div>;
}
function PageHead({ kicker, title, description }: { kicker: string; title: string; description: string }) { return <div className="page-head"><span className="kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div>; }

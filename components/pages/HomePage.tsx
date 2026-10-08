"use client";

import { ArrowRight, Grid2X2, Search, ShoppingBag, Sparkles } from "lucide-react";
import { featuredVehicle } from "../../data/vehicles";
import { sites } from "../../data/sites";

export function HomePage({
  onMarket, onServices, onVehicle, onSite,
}: {
  onMarket: () => void;
  onServices: () => void;
  onVehicle: () => void;
  onSite: (id: string) => void;
}) {
  return (
    <div className="apple-page apple-home">
      <section className="apple-hero">
        <div className="apple-hero-copy">
          <span className="apple-eyebrow">NOLINE</span>
          <h1>Everything<br /><em>starts here.</em></h1>
          <p>One beautiful place for the services, vehicles, places and people that make your city feel alive.</p>
          <div className="apple-hero-actions">
            <button className="apple-button dark" onClick={onMarket}>Open Mercury <ArrowRight size={14} /></button>
            <button className="apple-button quiet" onClick={onServices}>Explore NOLINE <Grid2X2 size={14} /></button>
          </div>
          <button className="apple-command-hint" onClick={onServices}><Search size={13} /> Search the network <kbd>⌘K</kbd></button>
        </div>
        <button className="apple-hero-art" onClick={onVehicle} aria-label="Open featured vehicle">
          <div className="apple-hero-glow" />
          <div className="apple-hero-image" style={featuredVehicle.image ? { backgroundImage: `url(${featuredVehicle.image})` } : undefined} />
          <div className="apple-hero-art-copy">
            <span>Featured</span>
            <strong>{featuredVehicle.name}</strong>
            <small>{featuredVehicle.tagline}</small>
          </div>
          <span className="apple-hero-arrow"><ArrowRight size={17} /></span>
        </button>
      </section>

      <section className="apple-home-intro">
        <div><span className="apple-eyebrow">The network</span><h2>A calmer way to move through the world.</h2></div>
        <p>NOLINE brings the city into a single fluid surface. Open a service, discover a vehicle, follow a route or simply look around.</p>
      </section>

      <section className="apple-home-services">
        {sites.slice(0, 6).map((site, index) => (
          <button key={site.id} className="apple-service-tile" onClick={() => onSite(site.id)}>
            <span className="apple-service-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="apple-service-glyph">{site.glyph}</span>
            <span><strong>{site.name}</strong><small>{site.tagline}</small></span>
            <ArrowRight size={14} />
          </button>
        ))}
      </section>

      <section className="apple-feature-split">
        <button className="apple-feature large" onClick={onVehicle}>
          <div className="apple-feature-light" />
          <span className="apple-eyebrow">IRONCLAD</span>
          <h3>{featuredVehicle.name}</h3>
          <p>Engineered for the places the ordinary can't reach.</p>
          <span className="apple-feature-link">Explore vehicle <ArrowRight size={13} /></span>
          <div className="apple-feature-car" style={featuredVehicle.image ? { backgroundImage: `url(${featuredVehicle.image})` } : undefined} />
        </button>
        <button className="apple-feature" onClick={onMarket}>
          <div className="apple-feature-round"><ShoppingBag size={34} /></div>
          <span className="apple-eyebrow">MERCURY</span>
          <h3>The things worth owning.</h3>
          <p>Vehicles, services and city essentials in one considered storefront.</p>
          <span className="apple-feature-link">Shop the collection <ArrowRight size={13} /></span>
        </button>
      </section>

      <section className="apple-bottom-cta">
        <div>
          <span className="apple-eyebrow">NOLINE</span>
          <h2>Less noise.<br />More world.</h2>
        </div>
        <button className="apple-button dark" onClick={onServices}>Explore the network <ArrowRight size={14} /></button>
      </section>

      <footer className="apple-footer"><span>NOLINE</span><span>IN-WORLD NETWORK</span><span>© 2026</span></footer>
    </div>
  );
}

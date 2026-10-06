"use client";

import { Activity, ArrowRight, Car, Command, Grid2X2, ShoppingBag } from "lucide-react";
import { featuredVehicle } from "../../data/vehicles";
import { sites } from "../../data/sites";

export function HomePage({ onMarket, onServices, onVehicle, onSite }: { onMarket: () => void; onServices: () => void; onVehicle: () => void; onSite: (id: string) => void }) {
  return (
    <div className="page home-page game-home-page">
      <section className="hero-shell game-command-deck">
        <div className="game-overline"><span className="live-indicator"><i /></span> NOLINE NETWORK / WORLD LINK ACTIVE</div><div className="game-hero-kicker"><span>CLIENT / IN-WORLD</span><span>NODE 07</span><span>SECURE LINK</span></div>
        <h1>The world,<br/><em>connected.</em></h1>
        <p>NOLINE is the city's private browser for commerce, mobility, property, finance, travel, news and everything between.</p>
        <div className="actions game-hero-actions"><button className="button primary game-primary-button" onClick={onMarket}>Explore Mercury Market <ArrowRight size={15}/></button><button className="button secondary game-secondary-button" onClick={onServices}>Browse services <Grid2X2 size={14}/></button></div>
      </section>
      <section className="feature-strip game-feed-strip">
        <button onClick={onVehicle}><span className="strip-art heavy"><b>ST-17</b></span><span><small>SPECIAL VEHICLE</small><strong>{featuredVehicle.name}</strong></span><ArrowRight size={15}/></button>
        <button onClick={() => onSite("signal")}><span className="strip-art signal"><Activity size={17}/></span><span><small>LIVE CITY SIGNAL</small><strong>Market activity is moving</strong></span><ArrowRight size={15}/></button>
        <button onClick={onServices}><span className="strip-art cmd"><Command size={17}/></span><span><small>FAST ACCESS</small><strong>Type <b>cmdrun5</b> in the address bar</strong></span><ArrowRight size={15}/></button>
      </section>
      <section className="section game-section"><div className="section-head game-section-head"><div><span className="kicker">QUICK ACCESS</span><h2>Jump in.</h2></div><button className="text-link" onClick={onServices}>View all <ArrowRight size={13}/></button></div><div className="service-grid game-service-grid">{sites.slice(0, 8).map((site) => <button className="service-card game-service-card" key={site.id} onClick={() => onSite(site.id)}><span>{site.glyph}</span><strong>{site.name}</strong><small>{site.tagline}</small><ArrowRight size={13}/></button>)}</div></section>
      <section className="section"><div className="section-head"><div><span className="kicker">FEATURED</span><h2>Worth a look.</h2></div></div><div className="editorial-grid game-feature-grid"><button className="editorial wide game-feature-card game-feature-arashi" onClick={onVehicle}><span className="editorial-art arashi-art"><b>ST-17</b></span><div><small>IRONCLAD EXCHANGE / KURODA</small><h3>{featuredVehicle.name}</h3><p>High-mobility engineering with no wasted motion.</p></div></button><button className="editorial game-feature-card" onClick={onMarket}><span className="editorial-art market-art"><ShoppingBag size={35}/></span><div><small>MERCURY MARKET</small><h3>New inventory.</h3><p>Sale, full-price and special stock in one place.</p></div></button><button className="editorial" onClick={onServices}><span className="editorial-art services-art"><Car size={35}/></span><div><small>THE NOLINE NETWORK</small><h3>{sites.length} services.</h3><p>A growing city-wide service directory.</p></div></button></div></section>
      <footer className="footer"><span>NOLINE / CLIENT 0.5</span><span>NO ACCOUNT REQUIRED</span><span>GAME INTEGRATION READY</span></footer>
    </div>
  );
}

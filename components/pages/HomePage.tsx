"use client";

import {
  ArrowRight,
  Car,
  Command,
  Grid2X2,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Signal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { featuredVehicle } from "../../data/vehicles";
import { liveSites, sites } from "../../data/sites";

const pulses = [
  ["MERCURY", "Inventory index synchronized", "blue"],
  ["SIGNAL", "City feed nominal", "green"],
  ["IRONCLAD", "Special mobility node online", "neutral"],
] as const;

export function HomePage({
  onMarket,
  onServices,
  onVehicle,
  onSite,
}: {
  onMarket: () => void;
  onServices: () => void;
  onVehicle: () => void;
  onSite: (id: string) => void;
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const sync = 97.2 + ((seconds * 3) % 4) / 10;
  const signal = seconds % 3 === 0 ? "EXCELLENT" : "STABLE";

  return (
    <div className="premium-page premium-home">
      <section className="premium-home-hero">
        <div className="premium-hero-main">
          <div className="premium-hero-topline">
            <span><i /> NOLINE NETWORK</span>
            <span>SESSION 07 / LOCAL</span>
          </div>

          <div className="premium-hero-copy">
            <p className="premium-kicker">THE WORLD, CONNECTED.</p>
            <h1>Everything<br /><em>starts here.</em></h1>
            <p className="premium-hero-lead">
              The in-world network for movement, commerce, property, finance, travel and every service between them.
            </p>
          </div>

          <div className="premium-hero-actions">
            <button className="premium-action primary" onClick={onMarket}>
              <span><ShoppingBag size={15} /> Mercury Market</span>
              <ArrowRight size={15} />
            </button>
            <button className="premium-action secondary" onClick={onServices}>
              <span><Grid2X2 size={15} /> Explore the network</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="premium-hero-foot">
            <span>PRESS <kbd>⌘K</kbd> TO SEARCH</span>
            <span>OR ENTER <strong>cmdrun5</strong></span>
          </div>
        </div>

        <aside className="premium-home-telemetry">
          <div className="premium-telemetry-card premium-telemetry-primary">
            <div className="premium-card-topline"><span>LOCAL NODE</span><b>ONLINE</b></div>
            <div className="premium-sync">
              <div className="premium-sync-ring"><span>{sync.toFixed(1)}%</span><small>SYNC</small></div>
              <div className="premium-sync-copy">
                <strong>World link healthy.</strong>
                <span>Node response within normal parameters.</span>
              </div>
            </div>
            <div className="premium-stat-row">
              <div><span>SIGNAL</span><strong>{signal}</strong></div>
              <div><span>LIVE NODES</span><strong>{liveSites.length}</strong></div>
              <div><span>CATALOG</span><strong>05</strong></div>
            </div>
          </div>

          <div className="premium-telemetry-card premium-telemetry-status">
            <div className="premium-status-icon"><ShieldCheck size={16} /></div>
            <div><span>CLIENT SECURITY</span><strong>ENCRYPTED LOCAL SESSION</strong></div>
            <i />
          </div>

          <button className="premium-channel-card" onClick={() => onSite("signal")}>
            <div><span>LIVE CHANNEL</span><strong>SIGNAL CURRENT</strong><small>City reports and live movement</small></div>
            <span className="premium-channel-arrow"><Signal size={15} /><ArrowRight size={13} /></span>
          </button>
        </aside>
      </section>

      <section className="premium-pulse-bar">
        <div className="premium-pulse-label"><Radio size={13} /> LIVE NETWORK</div>
        {pulses.map(([channel, text, tone]) => (
          <div key={channel} className={`premium-pulse-item ${tone}`}>
            <span>{channel}</span><strong>{text}</strong>
          </div>
        ))}
      </section>

      <section className="premium-section">
        <div className="premium-section-head">
          <div><span className="premium-kicker">SERVICES</span><h2>The useful parts of your city.</h2></div>
          <button className="premium-link" onClick={onServices}>View all <ArrowRight size={13} /></button>
        </div>
        <div className="premium-module-grid">
          {sites.slice(0, 8).map((site, index) => (
            <button className="premium-module" key={site.id} onClick={() => onSite(site.id)}>
              <div className="premium-module-top"><span>{String(index + 1).padStart(2, "0")}</span><i className={site.serviceStatus === "live" ? "online" : ""} /></div>
              <div className="premium-module-glyph">{site.glyph}</div>
              <div className="premium-module-copy"><strong>{site.name}</strong><span>{site.category}</span><small>{site.tagline}</small></div>
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-section-head">
          <div><span className="premium-kicker">FEATURED</span><h2>Open something worth having.</h2></div>
        </div>

        <div className="premium-feature-grid">
          <button className="premium-feature premium-feature-vehicle" onClick={onVehicle}>
            <div className="premium-feature-gridline" />
            <div className="premium-feature-copy">
              <span className="premium-kicker">IRONCLAD / SPECIAL MOBILITY</span>
              <h3>{featuredVehicle.name}</h3>
              <p>{featuredVehicle.tagline}</p>
              <span className="premium-feature-link">Inspect vehicle <ArrowRight size={13} /></span>
            </div>
            <div className="premium-feature-object"><span>ST-17</span></div>
            <div className="premium-feature-meta"><span>NOLINE-ARASHI</span><span>01 / 01</span></div>
          </button>

          <button className="premium-feature premium-feature-market" onClick={onMarket}>
            <div className="premium-market-orbit"><ShoppingBag size={38} /></div>
            <div className="premium-feature-copy">
              <span className="premium-kicker">MERCURY / COMMERCE</span>
              <h3>Acquire what moves the world.</h3>
              <p>Five catalog objects, one consistent acquisition flow.</p>
              <span className="premium-feature-link">Open market <ArrowRight size={13} /></span>
            </div>
            <div className="premium-feature-meta"><span>CURATED CATALOG</span><span>05 OBJECTS</span></div>
          </button>
        </div>
      </section>

      <section className="premium-command-band">
        <div>
          <span className="premium-kicker"><Command size={13} /> COMMAND LAYER</span>
          <h2>One client.<br />Every system.</h2>
          <p>Fast navigation without breaking the atmosphere.</p>
        </div>
        <button onClick={onServices}>
          <span><span>NETWORK ACCESS</span><strong>{sites.length} registered services</strong></span>
          <ArrowRight size={15} />
        </button>
      </section>

      <footer className="premium-footer">
        <span>NOLINE / IN-WORLD NETWORK CLIENT</span>
        <span>GAME BRIDGE READY</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}

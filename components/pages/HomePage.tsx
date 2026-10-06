"use client";

import {
  Activity,
  ArrowRight,
  Car,
  Command,
  Cpu,
  Grid2X2,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Signal,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { featuredVehicle } from "../../data/vehicles";
import { liveSites, sites } from "../../data/sites";

const feed = [
  { channel: "MERCURY", text: "Vehicle inventory synchronized", tone: "blue" },
  { channel: "SIGNAL", text: "City network reporting nominal", tone: "green" },
  { channel: "IRONCLAD", text: "Special mobility node online", tone: "amber" },
];

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

  const sync = 97 + ((seconds * 7) % 3) / 10;
  const signal = 4 + (seconds % 2);

  return (
    <div className="page home-page game-home-page">
      <section className="game-command-deck">
        <div className="game-deck-grid" aria-hidden="true" />
        <div className="game-deck-main">
          <div className="game-overline">
            <span className="live-indicator"><i /></span>
            NOLINE NETWORK / WORLD LINK ACTIVE
          </div>
          <div className="game-hero-kicker">
            <span>CLIENT / IN-WORLD</span>
            <span>NODE 07</span>
            <span>SECURE LINK</span>
          </div>
          <h1>Access the<br/><em>world behind the world.</em></h1>
          <p>NOLINE is the in-world network layer for commerce, mobility, property, finance, travel and the systems that make your city move.</p>
          <div className="game-hero-actions">
            <button className="button blue game-primary-button" onClick={onMarket}>
              <ShoppingBag size={15}/>Open Mercury Market<ArrowRight size={15}/>
            </button>
            <button className="button secondary game-secondary-button" onClick={onServices}>
              <Grid2X2 size={14}/>Browse network
            </button>
            <button className="game-command-button" onClick={() => onSite("signal")}>
              <Signal size={14}/>
              <span><small>LIVE CHANNEL</small><strong>SIGNAL CURRENT</strong></span>
              <ArrowRight size={13}/>
            </button>
          </div>
        </div>
        <aside className="game-deck-side">
          <div className="game-node-card">
            <div className="game-node-header"><span>LOCAL NODE</span><b>ONLINE</b></div>
            <div className="game-node-ring">
              <div className="game-node-ring-inner"><strong>{sync.toFixed(1)}%</strong><span>SYNC</span></div>
            </div>
            <div className="game-node-metrics">
              <div><span>LINK</span><strong>{signal}/5</strong></div>
              <div><span>LIVE NODES</span><strong>{liveSites.length}</strong></div>
              <div><span>CATALOG</span><strong>{String(5).padStart(2, "0")}</strong></div>
            </div>
          </div>
          <div className="game-secure-card">
            <div className="game-secure-icon"><ShieldCheck size={16}/></div>
            <div><span>SESSION SECURITY</span><strong>ENCRYPTED LOCAL CLIENT</strong></div>
            <i className="game-secure-pulse"/>
          </div>
        </aside>
      </section>

      <section className="game-feed-strip">
        <div className="game-feed-label"><Terminal size={13}/>NETWORK FEED</div>
        {feed.map((item) => (
          <div key={item.channel} className={"game-feed-item " + item.tone}>
            <span>{item.channel}</span><strong>{item.text}</strong>
          </div>
        ))}
      </section>

      <section className="section game-section">
        <div className="section-head game-section-head">
          <div><span className="kicker">SYSTEM MODULES</span><h2>Your city, indexed.</h2></div>
          <button className="text-link game-text-link" onClick={onServices}>ALL MODULES <ArrowRight size={13}/></button>
        </div>
        <div className="service-grid game-service-grid">
          {sites.slice(0, 8).map((site, index) => (
            <button className="service-card game-service-card" key={site.id} onClick={() => onSite(site.id)}>
              <span className="game-service-index">0{index + 1}</span>
              <span className="game-service-glyph">{site.glyph}</span>
              <div><strong>{site.name}</strong><small>{site.category} / {site.domain}</small></div>
              <span className={"game-service-status " + site.serviceStatus}>{site.serviceStatus}</span>
              <ArrowRight size={13}/>
            </button>
          ))}
        </div>
      </section>

      <section className="section game-section">
        <div className="section-head game-section-head">
          <div><span className="kicker">NETWORK HIGHLIGHTS</span><h2>Systems worth opening.</h2></div>
        </div>
        <div className="game-feature-grid">
          <button className="game-feature-card game-feature-arashi" onClick={onVehicle}>
            <div className="game-feature-noise"/>
            <div className="game-feature-copy">
              <span className="kicker">IRONCLAD / SPECIAL MOBILITY</span>
              <strong>{featuredVehicle.name}</strong>
              <p>Heavy-duty mobility engineered for the city’s worst routes.</p>
              <span className="game-feature-action">INSPECT VEHICLE <ArrowRight size={13}/></span>
            </div>
            <div className="game-feature-object"><span>ST-17</span></div>
            <div className="game-feature-id">NOLINE-ARASHI / 01</div>
          </button>
          <button className="game-feature-card game-feature-market" onClick={onMarket}>
            <div className="game-feature-copy">
              <span className="kicker">MERCURY / COMMERCE</span>
              <strong>Acquire what moves the world.</strong>
              <p>Vehicles, services and specialist goods with one game-ready checkout layer.</p>
              <span className="game-feature-action">OPEN MARKET <ArrowRight size={13}/></span>
            </div>
            <ShoppingBag className="game-feature-symbol" size={44}/>
          </button>
        </div>
      </section>

      <section className="section game-section">
        <div className="game-utility-band">
          <div className="game-utility-primary">
            <span className="kicker">COMMAND ACCESS</span>
            <h2>One client. Every system.</h2>
            <p>Press <kbd>⌘K</kbd> or enter <strong>cmdrun5</strong> to open the NOLINE command layer.</p>
          </div>
          <div className="game-utility-actions">
            <button className="game-command-button compact" onClick={() => onSite("signal")}>
              <Radio size={14}/><span><small>WORLD SIGNAL</small><strong>OPEN CHANNEL</strong></span><ArrowRight size={13}/>
            </button>
            <button className="game-command-button compact" onClick={onServices}>
              <Cpu size={14}/><span><small>NETWORK</small><strong>{sites.length} REGISTERED MODULES</strong></span><ArrowRight size={13}/>
            </button>
          </div>
        </div>
      </section>

      <footer className="footer game-footer">
        <span>NOLINE / IN-WORLD NETWORK CLIENT</span><span>SESSION: LOCAL</span><span>GAME BRIDGE READY</span>
      </footer>
    </div>
  );
}
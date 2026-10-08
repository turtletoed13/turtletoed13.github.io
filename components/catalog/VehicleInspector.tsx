"use client";

import { ArrowRight, Check, Gauge, Maximize2, Palette, X } from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { Vehicle } from "../../types/catalog";
import { Arashi3D } from "./Arashi3D";

const money = (value: number) => "$" + value.toLocaleString("en-US");
type InspectTab = "configure" | "engineering" | "specifications";

export function VehicleInspector({ vehicle, onClose, onPurchase }: {
  vehicle: Vehicle;
  onClose: () => void;
  onPurchase: () => void;
}) {
  const [finish, setFinish] = useState(vehicle.colors[0]);
  const [tab, setTab] = useState<InspectTab>("configure");
  const isArashi = vehicle.id === "arashi";

  return (
    <div className="inspection-studio-backdrop" role="dialog" aria-modal="true" aria-label={`Explore ${vehicle.name}`} onMouseDown={(e) => e.currentTarget === e.target && onClose()}>
      <div className="vehicle-inspector-studio apple-inspector">
        <header className="studio-header">
          <div className="studio-header-left">
            <div className="studio-mark"><span>N</span></div>
            <div>
              <div className="studio-breadcrumb">NOLINE / {vehicle.catalogId}</div>
              <div className="studio-heading-row"><h2>Explore</h2></div>
            </div>
          </div>
          <button className="studio-close" onClick={onClose} aria-label="Close"><X size={17} /></button>
        </header>

        <div className="studio-hero">
          <section className={`studio-stage ${isArashi ? "studio-stage-heavy" : ""}`}>
            <div className="studio-stage-backdrop" />
            <div className="studio-stage-lines" />
            <div className="studio-stage-orbit orbit-a" />
            <div className="studio-stage-orbit orbit-b" />
            <div className="studio-stage-label studio-label-top"><span>{vehicle.category}</span><b>01</b></div>

            <div className="studio-stage-asset">
              {isArashi ? <Arashi3D /> : <div className="studio-flat-model" style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined} />}
            </div>

            <div className="studio-stage-label studio-label-bottom">
              <span>Move to explore</span>
              <span>Scroll to zoom</span>
            </div>
          </section>

          <aside className="studio-command-panel">
            <div className="studio-command-top">
              <div>
                <span className="studio-eyebrow">{vehicle.manufacturer}</span>
                <h1>{vehicle.name}</h1>
                <p>{vehicle.tagline}</p>
              </div>
              <span className="studio-category">{vehicle.category}</span>
            </div>

            <div className="studio-price">
              <div><span>{vehicle.originalPrice ? "Current price" : "Price"}</span><strong>{money(vehicle.price)}</strong></div>
              {vehicle.saleLabel && <b>{vehicle.saleLabel}</b>}
            </div>

            <div className="studio-stock">
              <span className="studio-stock-dot" />
              <div><strong>{vehicle.stockLabel}</strong><small>{vehicle.delivery}</small></div>
            </div>

            <div className="studio-primary-stats">
              {vehicle.stats.slice(0, 4).map(stat => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}
            </div>

            <button className="studio-acquire" onClick={onPurchase}>
              <span>Continue</span><ArrowRight size={15} />
            </button>
          </aside>
        </div>

        <div className="studio-toolbar">
          <div className="studio-tabs" role="tablist">
            <button className={tab === "configure" ? "active" : ""} onClick={() => setTab("configure")}><Palette size={13} /> Finish</button>
            <button className={tab === "engineering" ? "active" : ""} onClick={() => setTab("engineering")}><Gauge size={13} /> Details</button>
            <button className={tab === "specifications" ? "active" : ""} onClick={() => setTab("specifications")}><Maximize2 size={13} /> Specifications</button>
          </div>
        </div>

        <div className="studio-content">
          {tab === "configure" && (
            <section className="studio-config-view">
              <div className="studio-config-copy">
                <span className="studio-eyebrow">FINISH</span>
                <h3>Make it yours.</h3>
                <p>Choose the surface you want to see before moving into acquisition.</p>
                <div className="studio-finish-row">
                  {vehicle.colors.map((color, index) => (
                    <button key={color} className={finish === color ? "selected" : ""} onClick={() => setFinish(color)} style={{ "--finish": color } as CSSProperties} aria-label={`Finish ${index + 1}`}>
                      <span />
                      {finish === color && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <div className="studio-selected-finish"><span>Selected</span><strong>{finish.toUpperCase()}</strong></div>
              </div>
              <div className="studio-detail-card">
                <div className="studio-card-head"><span>Overview</span><b>{vehicle.catalogId}</b></div>
                <div className="studio-profile-grid">
                  <div><span>Class</span><strong>{vehicle.className}</strong></div>
                  <div><span>Manufacturer</span><strong>{vehicle.manufacturer}</strong></div>
                  <div><span>Availability</span><strong>{vehicle.stockLabel}</strong></div>
                  <div><span>Delivery</span><strong>{vehicle.delivery}</strong></div>
                </div>
              </div>
            </section>
          )}

          {tab === "engineering" && (
            <section className="studio-engineering-view">
              <div className="studio-section-intro">
                <span className="studio-eyebrow">DETAILS</span>
                <h3>Built around the way it feels.</h3>
                <p>{vehicle.description}</p>
              </div>
              <div className="studio-feature-grid">
                {vehicle.features.map((feature) => <div className="studio-feature-item" key={feature}><div><Check size={13} /><strong>{feature}</strong></div></div>)}
              </div>
            </section>
          )}

          {tab === "specifications" && (
            <section className="studio-spec-view">
              <div className="studio-section-intro"><span className="studio-eyebrow">SPECIFICATIONS</span><h3>Everything you need.</h3><p>A clean view of the published vehicle data.</p></div>
              <div className="studio-spec-grid">{vehicle.stats.map(stat => <div className="studio-spec-cell" key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
            </section>
          )}
        </div>

        <footer className="studio-footer">
          <div><span>{vehicle.name}</span><small>Preferences are saved for this session.</small></div>
          <button className="studio-footer-cta" onClick={onPurchase}>Continue <ArrowRight size={14} /></button>
        </footer>
      </div>
    </div>
  );
}

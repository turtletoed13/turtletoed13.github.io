"use client";

import {
  ArrowRight,
  Check,
  ChevronRight,
  Gauge,
  Maximize2,
  Palette,
  RotateCw,
  ShieldCheck,
  X,
  Zap,
  ZoomIn,
} from "lucide-react";
import { useState, type CSSProperties } from "react";
import type { Vehicle } from "../../types/catalog";
import { Arashi3D } from "./Arashi3D";

const money = (value: number) => "$" + value.toLocaleString("en-US");

type InspectTab = "configure" | "engineering" | "specifications";

export function VehicleInspector({
  vehicle,
  onClose,
  onPurchase,
}: {
  vehicle: Vehicle;
  onClose: () => void;
  onPurchase: () => void;
}) {
  const [finish, setFinish] = useState(vehicle.colors[0]);
  const [tab, setTab] = useState<InspectTab>("configure");

  const isArashi = vehicle.id === "arashi";
  const primaryStats = vehicle.stats.slice(0, 4);
  const remainingStats = vehicle.stats.slice(4);

  return (
    <div
      className="inspection-studio-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Inspect ${vehicle.name}`}
      onMouseDown={(event) => event.currentTarget === event.target && onClose()}
    >
      <div className="vehicle-inspector-studio">
        <header className="studio-header">
          <div className="studio-header-left">
            <div className="studio-mark"><span>NL</span></div>
            <div>
              <div className="studio-breadcrumb">NOLINE / DIGITAL STUDIO / {vehicle.catalogId}</div>
              <div className="studio-heading-row">
                <h2>Vehicle inspection</h2>
                <span className="studio-status"><i /> LIVE</span>
              </div>
            </div>
          </div>
          <button className="studio-close" onClick={onClose} aria-label="Close inspection"><X size={18} /></button>
        </header>

        <div className="studio-hero">
          <section className={`studio-stage ${isArashi ? "studio-stage-heavy" : ""}`}>
            <div className="studio-stage-backdrop" />
            <div className="studio-stage-lines" />
            <div className="studio-stage-orbit orbit-a" />
            <div className="studio-stage-orbit orbit-b" />

            <div className="studio-stage-label studio-label-top">
              <span>OBJECT / {vehicle.category.toUpperCase()}</span>
              <b>01</b>
            </div>

            <div className="studio-stage-asset">
              {isArashi ? (
                <Arashi3D />
              ) : (
                <>
                  <div
                    className="studio-flat-model"
                    style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined}
                  />
                  <div className="studio-flat-reflection" />
                </>
              )}
            </div>

            <div className="studio-stage-label studio-label-bottom">
              <span><RotateCw size={11} /> DRAG TO ORBIT</span>
              <span><ZoomIn size={11} /> SCROLL TO ZOOM</span>
            </div>

            <div className="studio-corner studio-corner-tl" />
            <div className="studio-corner studio-corner-tr" />
            <div className="studio-corner studio-corner-bl" />
            <div className="studio-corner studio-corner-br" />
          </section>

          <aside className="studio-command-panel">
            <div className="studio-command-top">
              <div>
                <span className="studio-eyebrow">{vehicle.manufacturer}</span>
                <h1>{vehicle.name}</h1>
                <p>{vehicle.tagline}</p>
              </div>
              <span className={`studio-category ${isArashi ? "heavy" : ""}`}>{vehicle.category}</span>
            </div>

            <div className="studio-price">
              <div>
                <span>{vehicle.originalPrice ? "CURRENT OFFER" : "CATALOG PRICE"}</span>
                <strong>{money(vehicle.price)}</strong>
              </div>
              {vehicle.saleLabel && <b>{vehicle.saleLabel}</b>}
            </div>

            <div className="studio-stock">
              <span className="studio-stock-dot" />
              <div>
                <strong>{vehicle.stockLabel}</strong>
                <small>{vehicle.delivery}</small>
              </div>
            </div>

            <div className="studio-primary-stats">
              {primaryStats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>

            <div className="studio-command-actions">
              <button className="studio-acquire" onClick={onPurchase}>
                <span>Continue to acquisition</span>
                <ArrowRight size={15} />
              </button>
              <div className="studio-assurance">
                <ShieldCheck size={13} />
                <span>Secure game-server handoff</span>
              </div>
            </div>
          </aside>
        </div>

        <div className="studio-toolbar">
          <div className="studio-tabs" role="tablist" aria-label="Inspection sections">
            <button className={tab === "configure" ? "active" : ""} onClick={() => setTab("configure")} role="tab" aria-selected={tab === "configure"}>
              <Palette size={13} /> Configure
            </button>
            <button className={tab === "engineering" ? "active" : ""} onClick={() => setTab("engineering")} role="tab" aria-selected={tab === "engineering"}>
              <Gauge size={13} /> Engineering
            </button>
            <button className={tab === "specifications" ? "active" : ""} onClick={() => setTab("specifications")} role="tab" aria-selected={tab === "specifications"}>
              <Maximize2 size={13} /> Specifications
            </button>
          </div>
          <div className="studio-toolbar-meta">
            <Zap size={12} />
            <span>LIVE DIGITAL TWIN</span>
          </div>
        </div>

        <div className="studio-content">
          {tab === "configure" && (
            <section className="studio-config-view">
              <div className="studio-config-copy">
                <span className="studio-eyebrow">FACTORY FINISH</span>
                <h3>Choose the final surface.</h3>
                <p>Preview the finish before you hand the vehicle to the acquisition flow.</p>
                <div className="studio-finish-row">
                  {vehicle.colors.map((color, index) => (
                    <button
                      key={color}
                      className={finish === color ? "selected" : ""}
                      onClick={() => setFinish(color)}
                      style={{ "--finish": color } as CSSProperties}
                      aria-label={`Select finish ${index + 1}`}
                    >
                      <span />
                      {finish === color && <Check size={13} />}
                    </button>
                  ))}
                </div>
                <div className="studio-selected-finish">
                  <span>SELECTED FINISH</span>
                  <strong>{finish.toUpperCase()}</strong>
                </div>
              </div>

              <div className="studio-detail-card">
                <div className="studio-card-head">
                  <span>VEHICLE PROFILE</span>
                  <b>{vehicle.catalogId}</b>
                </div>
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
                <span className="studio-eyebrow">ENGINEERING</span>
                <h3>The hardware behind the name.</h3>
                <p>{vehicle.description}</p>
              </div>
              <div className="studio-feature-grid">
                {vehicle.features.map((feature, index) => (
                  <div className="studio-feature-item" key={feature}>
                    <span>0{index + 1}</span>
                    <div><Check size={13} /><strong>{feature}</strong></div>
                    <ChevronRight size={14} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "specifications" && (
            <section className="studio-spec-view">
              <div className="studio-section-intro">
                <span className="studio-eyebrow">TECHNICAL DATA</span>
                <h3>Numbers, without the clutter.</h3>
                <p>Everything currently published for this catalog object.</p>
              </div>
              <div className="studio-spec-grid">
                {vehicle.stats.map((stat) => (
                  <div key={stat.label} className="studio-spec-cell">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
                {remainingStats.length === 0 && (
                  <div className="studio-spec-cell studio-spec-note">
                    <span>STATUS</span>
                    <strong>FULL DATASET LOADED</strong>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <footer className="studio-footer">
          <div>
            <span>ST-17 / NOLINE INSPECTION SYSTEM</span>
            <small>Configuration is saved for this inspection session.</small>
          </div>
          <button className="studio-footer-cta" onClick={onPurchase}>
            Acquire {vehicle.name}
            <ArrowRight size={14} />
          </button>
        </footer>
      </div>
    </div>
  );
}

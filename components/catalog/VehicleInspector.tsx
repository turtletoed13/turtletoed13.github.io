"use client";

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Gauge,
  Heart,
  Maximize2,
  Palette,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import type { Vehicle } from "../../types/catalog";
import { Arashi3D } from "./Arashi3D";

type InspectTab = "overview" | "finish" | "performance" | "equipment" | "specifications";

const money = (value: number) => "$" + value.toLocaleString("en-US");

const tabMeta: Array<{ id: InspectTab; label: string; short: string }> = [
  { id: "overview", label: "Overview", short: "01" },
  { id: "finish", label: "Finish", short: "02" },
  { id: "performance", label: "Performance", short: "03" },
  { id: "equipment", label: "Equipment", short: "04" },
  { id: "specifications", label: "Specifications", short: "05" },
];

export function VehicleInspector({
  vehicle,
  onClose,
  onPurchase,
}: {
  vehicle: Vehicle;
  onClose: () => void;
  onPurchase: () => void;
}) {
  const [tab, setTab] = useState<InspectTab>("overview");
  const [finish, setFinish] = useState(vehicle.colors[0] ?? "#17191d");
  const [cursor, setCursor] = useState({ x: 50, y: 48 });
  const [focusStage, setFocusStage] = useState(false);

  const savings = vehicle.originalPrice ? vehicle.originalPrice - vehicle.price : 0;
  const activeIndex = Math.max(0, tabMeta.findIndex((item) => item.id === tab));
  const activeMeta = tabMeta[activeIndex];
  const isArashi = vehicle.id === "arashi";
  const finishCode = finish.replace("#", "").toUpperCase();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setTab(tabMeta[Math.min(tabMeta.length - 1, activeIndex + 1)].id);
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setTab(tabMeta[Math.max(0, activeIndex - 1)].id);
      }

      const numeric = Number(event.key);
      if (numeric >= 1 && numeric <= tabMeta.length) {
        setTab(tabMeta[numeric - 1].id);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, onClose]);

  const moveStage = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setCursor({ x, y });
  };

  const resetStage = () => setCursor({ x: 50, y: 48 });

  const goTab = (index: number) => {
    setTab(tabMeta[Math.max(0, Math.min(tabMeta.length - 1, index))].id);
  };

  return (
    <div
      className="inspection-studio-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={"Inspect " + vehicle.name}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="inspect-v4">
        <header className="inspect-v4-header">
          <div className="inspect-v4-brand">
            <div className="inspect-v4-mark">N</div>
            <div className="inspect-v4-breadcrumb">
              <span>NOLINE</span>
              <i />
              <span>VEHICLES</span>
              <i />
              <strong>{vehicle.catalogId}</strong>
            </div>
          </div>

          <div className="inspect-v4-header-center">
            <span>VEHICLE INSPECTION</span>
            <b>{activeMeta.short} / 05</b>
          </div>

          <div className="inspect-v4-header-actions">
            <span className="inspect-v4-live"><i /> LIVE MODEL</span>
            <button className="inspect-v4-close" onClick={onClose} aria-label="Close inspection">
              <X size={16} />
            </button>
          </div>
        </header>

        <section className="inspect-v4-hero">
          <div
            className={"inspect-v4-stage" + (isArashi ? " is-heavy" : "") + (focusStage ? " is-focused" : "")}
            style={{
              "--pointer-x": cursor.x + "%",
              "--pointer-y": cursor.y + "%",
              "--finish": finish,
            } as CSSProperties}
            onMouseMove={moveStage}
            onMouseLeave={resetStage}
          >
            <div className="inspect-v4-stage-light" />
            <div className="inspect-v4-stage-grid" />
            <div className="inspect-v4-stage-ring ring-one" />
            <div className="inspect-v4-stage-ring ring-two" />

            <div className="inspect-v4-stage-top">
              <div>
                <span className="inspect-v4-index">01</span>
                <span>{vehicle.category.toUpperCase()}</span>
              </div>
              <button
                className={focusStage ? "active" : ""}
                onClick={() => setFocusStage((current) => !current)}
                aria-label={focusStage ? "Exit focused model view" : "Focus model view"}
              >
                <Maximize2 size={13} />
              </button>
            </div>

            <div className="inspect-v4-model">
              {isArashi ? (
                <Arashi3D />
              ) : (
                <div
                  className="inspect-v4-flat-image"
                  style={vehicle.image ? { backgroundImage: "url(" + vehicle.image + ")" } : undefined}
                />
              )}
            </div>

            {!isArashi && <div className="inspect-v4-finish-cast" />}

            <div className="inspect-v4-stage-bottom">
              <div>
                <span>INTERACTIVE VIEW</span>
                <strong>{isArashi ? "DRAG TO ROTATE · SCROLL TO ZOOM" : "MOVE TO EXPLORE"}</strong>
              </div>
              <div className="inspect-v4-stage-coordinates">
                <span>X {String(Math.round(cursor.x)).padStart(3, "0")}</span>
                <span>Y {String(Math.round(cursor.y)).padStart(3, "0")}</span>
              </div>
            </div>

            <div className="inspect-v4-corner corner-tl" />
            <div className="inspect-v4-corner corner-tr" />
            <div className="inspect-v4-corner corner-bl" />
            <div className="inspect-v4-corner corner-br" />
          </div>

          <aside className="inspect-v4-summary">
            <div className="inspect-v4-summary-top">
              <span className="inspect-v4-eyebrow">{vehicle.manufacturer}</span>
              <span className={"inspect-v4-stock-pill " + vehicle.stock}>
                <i />
                {vehicle.stockLabel}
              </span>
            </div>

            <div className="inspect-v4-title-block">
              <span>{vehicle.className}</span>
              <h1>{vehicle.name}</h1>
              <p>{vehicle.tagline}</p>
            </div>

            <div className="inspect-v4-price">
              <div>
                <span>{vehicle.originalPrice ? "CURRENT OFFER" : "CATALOG PRICE"}</span>
                {vehicle.originalPrice && <del>{money(vehicle.originalPrice)}</del>}
                <strong>{money(vehicle.price)}</strong>
              </div>
              {vehicle.saleLabel && (
                <div className="inspect-v4-price-badge">
                  <span>{vehicle.saleLabel}</span>
                  {savings > 0 && <small>Save {money(savings)}</small>}
                </div>
              )}
            </div>

            <div className="inspect-v4-stat-strip">
              {vehicle.stats.slice(0, 3).map((stat) => (
                <div key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>

            <div className="inspect-v4-summary-copy">
              <p>{vehicle.description}</p>
            </div>

            <div className="inspect-v4-acquire">
              <button onClick={onPurchase}>
                <span>Acquire {vehicle.name}</span>
                <ArrowRight size={15} />
              </button>
              <div>
                <span><ShieldCheck size={12} /> Secure handoff</span>
                <span>{vehicle.delivery}</span>
              </div>
            </div>
          </aside>
        </section>

        <nav className="inspect-v4-nav" aria-label="Vehicle inspection sections">
          <div className="inspect-v4-nav-scroll">
            {tabMeta.map((item) => (
              <button
                key={item.id}
                className={tab === item.id ? "active" : ""}
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? "page" : undefined}
              >
                <span>{item.short}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="inspect-v4-nav-hint">
            <kbd>←</kbd><kbd>→</kbd>
            <span>Navigate</span>
          </div>
        </nav>

        <section className="inspect-v4-content">
          <div className="inspect-v4-content-head">
            <div>
              <span className="inspect-v4-eyebrow">{activeMeta.short} / 05</span>
              <h2>
                {tab === "overview" && <>A closer look.</>}
                {tab === "finish" && <>Make the surface yours.</>}
                {tab === "performance" && <>Numbers with purpose.</>}
                {tab === "equipment" && <>The details that matter.</>}
                {tab === "specifications" && <>Everything, in context.</>}
              </h2>
            </div>
            <div className="inspect-v4-content-progress">
              <span>{activeIndex + 1}</span>
              <i><b style={{ width: (((activeIndex + 1) / tabMeta.length) * 100) + "%" }} /></i>
              <span>{tabMeta.length}</span>
            </div>
          </div>

          {tab === "overview" && (
            <div className="inspect-v4-overview">
              <article className="inspect-v4-story-card story-main">
                <span>THE MACHINE</span>
                <h3>{vehicle.tagline}</h3>
                <p>{vehicle.description}</p>
                <div className="inspect-v4-story-meta">
                  <span>{vehicle.brand}</span>
                  <i />
                  <span>{vehicle.catalogId}</span>
                </div>
              </article>

              <article className="inspect-v4-info-card">
                <div className="inspect-v4-info-icon"><Sparkles size={15} /></div>
                <span>CHARACTER</span>
                <strong>{vehicle.className}</strong>
                <p>Designed as a complete object, with the details considered from the first interaction to the last.</p>
              </article>

              <article className="inspect-v4-info-card">
                <div className="inspect-v4-info-icon"><CircleDot size={15} /></div>
                <span>AVAILABILITY</span>
                <strong>{vehicle.stockLabel}</strong>
                <p>{vehicle.delivery}</p>
              </article>
            </div>
          )}

          {tab === "finish" && (
            <div className="inspect-v4-finish-view">
              <div className="inspect-v4-finish-intro">
                <div>
                  <span className="inspect-v4-eyebrow">CURRENT FINISH</span>
                  <h3>{finishCode}</h3>
                </div>
                <p>Select a finish to change the light around the vehicle before you continue.</p>
              </div>

              <div className="inspect-v4-finish-grid">
                {vehicle.colors.map((color, index) => (
                  <button
                    key={color}
                    className={finish === color ? "selected" : ""}
                    onClick={() => setFinish(color)}
                    style={{ "--swatch": color } as CSSProperties}
                    aria-label={"Finish " + (index + 1) + ", " + color}
                  >
                    <span className="inspect-v4-swatch" />
                    <div>
                      <small>FINISH {String(index + 1).padStart(2, "0")}</small>
                      <strong>{color.toUpperCase()}</strong>
                    </div>
                    {finish === color && <Check size={14} />}
                  </button>
                ))}
              </div>

              <div className="inspect-v4-finish-note">
                <Palette size={14} />
                <span>Finish preferences are retained while this inspection is open.</span>
              </div>
            </div>
          )}

          {tab === "performance" && (
            <div className="inspect-v4-performance-view">
              <div className="inspect-v4-performance-lead">
                <Gauge size={17} />
                <div>
                  <span>PERFORMANCE PROFILE</span>
                  <strong>{vehicle.className}</strong>
                </div>
              </div>
              <div className="inspect-v4-performance-grid">
                {vehicle.stats.map((stat, index) => (
                  <article key={stat.label} style={{ "--delay": (index * 45) + "ms" } as CSSProperties}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <div><i style={{ width: Math.min(94, 46 + index * 8) + "%" }} /></div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "equipment" && (
            <div className="inspect-v4-equipment-view">
              <div className="inspect-v4-equipment-intro">
                <span className="inspect-v4-eyebrow">{vehicle.features.length} INCLUDED SYSTEMS</span>
                <h3>Nothing extra to explain.</h3>
                <p>Everything below is part of the vehicle as presented in this catalog.</p>
              </div>
              <div className="inspect-v4-equipment-grid">
                {vehicle.features.map((feature, index) => (
                  <article key={feature}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div className="inspect-v4-check"><Check size={12} /></div>
                    <strong>{feature}</strong>
                    <ArrowRight size={13} />
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "specifications" && (
            <div className="inspect-v4-spec-view">
              <div className="inspect-v4-spec-sidebar">
                <span className="inspect-v4-eyebrow">TECHNICAL RECORD</span>
                <h3>{vehicle.catalogId}</h3>
                <p>Published vehicle data, kept in one calm view.</p>
                <div className="inspect-v4-spec-sidebar-meta">
                  <span>MANUFACTURER</span>
                  <strong>{vehicle.manufacturer}</strong>
                  <span>CLASS</span>
                  <strong>{vehicle.className}</strong>
                </div>
              </div>
              <div className="inspect-v4-spec-table">
                {vehicle.stats.map((stat, index) => (
                  <div key={stat.label}>
                    <span>{String(index + 1).padStart(2, "0")} / {stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
                <div><span>07 / DELIVERY</span><strong>{vehicle.delivery}</strong></div>
                <div><span>08 / STOCK</span><strong>{vehicle.stockLabel}</strong></div>
              </div>
            </div>
          )}
        </section>

        <footer className="inspect-v4-footer">
          <div className="inspect-v4-footer-title">
            <div className="inspect-v4-footer-dot" />
            <div>
              <span>{vehicle.name}</span>
              <small>{vehicle.catalogId} · {vehicle.delivery}</small>
            </div>
          </div>

          <div className="inspect-v4-footer-center">
            <span>{tabMeta[activeIndex].label}</span>
            <i />
            <span>Session-only inspection</span>
          </div>

          <div className="inspect-v4-footer-actions">
            <button onClick={() => goTab(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous section">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => goTab(activeIndex + 1)} disabled={activeIndex === tabMeta.length - 1} aria-label="Next section">
              <ChevronRight size={14} />
            </button>
            <button className="inspect-v4-footer-acquire" onClick={onPurchase}>
              <Heart size={13} />
              Continue
              <ArrowRight size={13} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

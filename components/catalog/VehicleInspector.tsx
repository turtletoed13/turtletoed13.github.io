"use client";

import {
  ArrowLeft,
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
import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent } from "react";
import type { Vehicle } from "../../types/catalog";
import { Arashi3D } from "./Arashi3D";

type InspectTab = "overview" | "finish" | "performance" | "equipment" | "specifications";

const tabs: Array<{ id: InspectTab; label: string; number: string }> = [
  { id: "overview", label: "Overview", number: "01" },
  { id: "finish", label: "Finish", number: "02" },
  { id: "performance", label: "Performance", number: "03" },
  { id: "equipment", label: "Equipment", number: "04" },
  { id: "specifications", label: "Specifications", number: "05" },
];

const money = (value: number) => "$" + value.toLocaleString("en-US");

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
  const [stageFocus, setStageFocus] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 48 });

  const index = tabs.findIndex((item) => item.id === tab);
  const activeIndex = Math.max(0, index);
  const activeTab = tabs[activeIndex];
  const savings = vehicle.originalPrice ? vehicle.originalPrice - vehicle.price : 0;
  const finishCode = finish.replace("#", "").toUpperCase();
  const isArashi = vehicle.id === "arashi";

  const statSummary = useMemo(() => vehicle.stats.slice(0, 4), [vehicle.stats]);
  const features = useMemo(() => vehicle.features.slice(0, 8), [vehicle.features]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setTab(tabs[Math.min(tabs.length - 1, activeIndex + 1)].id);
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setTab(tabs[Math.max(0, activeIndex - 1)].id);
        return;
      }

      const number = Number(event.key);
      if (number >= 1 && number <= tabs.length) {
        setTab(tabs[number - 1].id);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, onClose]);

  const moveStage = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
    });
  };

  const resetStage = () => setPointer({ x: 50, y: 48 });

  const changeTab = (nextIndex: number) => {
    setTab(tabs[Math.max(0, Math.min(tabs.length - 1, nextIndex))].id);
  };

  return (
    <div
      className="noline-inspect-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={"Inspect " + vehicle.name}
      onPointerDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="noline-inspect">
        <header className="noline-inspect-topbar">
          <div className="noline-inspect-brand">
            <button className="noline-inspect-back" onClick={onClose} aria-label="Close inspection">
              <ArrowLeft size={15} />
            </button>
            <div>
              <span>NOLINE / VEHICLES</span>
              <strong>{vehicle.catalogId}</strong>
            </div>
          </div>

          <div className="noline-inspect-top-title">
            <span>VEHICLE INSPECTION</span>
            <strong>{activeTab.number} / {String(tabs.length).padStart(2, "0")}</strong>
          </div>

          <div className="noline-inspect-top-actions">
            <span className="noline-inspect-status"><i /> LIVE</span>
            <button className="noline-inspect-close" onClick={onClose} aria-label="Close inspection">
              <X size={16} />
            </button>
          </div>
        </header>

        <div className="noline-inspect-main">
          <section
            className={"noline-inspect-stage" + (stageFocus ? " is-focused" : "")}
            style={{
              "--inspect-x": pointer.x + "%",
              "--inspect-y": pointer.y + "%",
              "--inspect-finish": finish,
            } as CSSProperties}
            onPointerMove={moveStage}
            onPointerLeave={resetStage}
          >
            <div className="noline-inspect-stage-backdrop" />
            <div className="noline-inspect-stage-grid" />
            <div className="noline-inspect-stage-plane" />
            <div className="noline-inspect-stage-vignette" />

            <div className="noline-inspect-stage-head">
              <div className="noline-inspect-stage-marker">
                <span>01</span>
                <div>
                  <strong>{vehicle.manufacturer}</strong>
                  <small>{vehicle.category}</small>
                </div>
              </div>
              <button
                className={stageFocus ? "is-active" : ""}
                onClick={() => setStageFocus((value) => !value)}
                aria-label={stageFocus ? "Exit focused view" : "Focus vehicle"}
              >
                <Maximize2 size={14} />
              </button>
            </div>

            <div className="noline-inspect-model">
              {isArashi ? (
                <Arashi3D />
              ) : (
                <div
                  className="noline-inspect-image"
                  style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined}
                />
              )}
            </div>

            <div className="noline-inspect-stage-caption">
              <div>
                <span>{isArashi ? "INTERACTIVE 3D MODEL" : "VEHICLE PRESENTATION"}</span>
                <strong>{isArashi ? "Drag to rotate · wheel to zoom" : "Move across the stage to shift the light"}</strong>
              </div>
              <div className="noline-inspect-coordinates">
                <span>X {String(Math.round(pointer.x)).padStart(3, "0")}</span>
                <span>Y {String(Math.round(pointer.y)).padStart(3, "0")}</span>
              </div>
            </div>

            <div className="noline-inspect-stage-corner top-left" />
            <div className="noline-inspect-stage-corner top-right" />
            <div className="noline-inspect-stage-corner bottom-left" />
            <div className="noline-inspect-stage-corner bottom-right" />
          </section>

          <aside className="noline-inspect-panel">
            <div className="noline-inspect-panel-top">
              <div>
                <span className="noline-inspect-kicker">{vehicle.manufacturer}</span>
                <div className="noline-inspect-stock"><i /> {vehicle.stockLabel}</div>
              </div>
            </div>

            <div className="noline-inspect-identity">
              <span>{vehicle.className}</span>
              <h1>{vehicle.name}</h1>
              <p>{vehicle.tagline}</p>
            </div>

            <div className="noline-inspect-price">
              <div>
                <span>{vehicle.originalPrice ? "CURRENT OFFER" : "CATALOG PRICE"}</span>
                {vehicle.originalPrice && <del>{money(vehicle.originalPrice)}</del>}
                <strong>{money(vehicle.price)}</strong>
              </div>
              {vehicle.saleLabel && (
                <div className="noline-inspect-sale">
                  <strong>{vehicle.saleLabel}</strong>
                  {savings > 0 && <span>Save {money(savings)}</span>}
                </div>
              )}
            </div>

            <div className="noline-inspect-quick-stats">
              {statSummary.map((stat, statIndex) => (
                <div key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <i style={{ "--stat-fill": (54 + statIndex * 11) + "%" } as CSSProperties} />
                </div>
              ))}
            </div>

            <p className="noline-inspect-description">{vehicle.description}</p>

            <div className="noline-inspect-panel-action">
              <button onClick={onPurchase}>
                <span>Acquire {vehicle.name}</span>
                <ArrowRight size={15} />
              </button>
              <div>
                <span><ShieldCheck size={12} /> Secure handoff</span>
                <strong>{vehicle.delivery}</strong>
              </div>
            </div>

            <div className="noline-inspect-panel-note">
              <Sparkles size={14} />
              <span>Explore every section before you commit.</span>
            </div>
          </aside>
        </div>

        <nav className="noline-inspect-tabs" aria-label="Vehicle inspection sections">
          <div className="noline-inspect-tabs-scroll">
            {tabs.map((item) => (
              <button
                key={item.id}
                className={tab === item.id ? "is-active" : ""}
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? "page" : undefined}
              >
                <span>{item.number}</span>
                <strong>{item.label}</strong>
              </button>
            ))}
          </div>
          <div className="noline-inspect-key-hint">
            <kbd>1—5</kbd>
            <span>Sections</span>
          </div>
        </nav>

        <section className="noline-inspect-content">
          <div className="noline-inspect-content-heading">
            <div>
              <span className="noline-inspect-kicker">{activeTab.number} / {String(tabs.length).padStart(2, "0")}</span>
              <h2>
                {tab === "overview" && "A closer look."}
                {tab === "finish" && "Make the surface yours."}
                {tab === "performance" && "Numbers with purpose."}
                {tab === "equipment" && "The details that matter."}
                {tab === "specifications" && "Everything in one place."}
              </h2>
            </div>
            <div className="noline-inspect-progress">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <i><b style={{ width: (((activeIndex + 1) / tabs.length) * 100) + "%" }} /></i>
              <span>{String(tabs.length).padStart(2, "0")}</span>
            </div>
          </div>

          {tab === "overview" && (
            <div className="noline-inspect-overview">
              <article className="noline-inspect-editorial">
                <span>THE MACHINE</span>
                <h3>{vehicle.tagline}</h3>
                <p>{vehicle.description}</p>
                <div>
                  <span>{vehicle.brand}</span>
                  <i />
                  <span>{vehicle.catalogId}</span>
                </div>
              </article>

              <article className="noline-inspect-mini">
                <div><Sparkles size={15} /></div>
                <span>CHARACTER</span>
                <strong>{vehicle.className}</strong>
                <p>Designed as a complete object, from the first glance to the moment it leaves the showroom.</p>
              </article>

              <article className="noline-inspect-mini">
                <div><CircleDot size={15} /></div>
                <span>AVAILABILITY</span>
                <strong>{vehicle.stockLabel}</strong>
                <p>{vehicle.delivery}</p>
              </article>
            </div>
          )}

          {tab === "finish" && (
            <div className="noline-inspect-finish">
              <div className="noline-inspect-finish-lead">
                <div>
                  <span className="noline-inspect-kicker">CURRENT FINISH</span>
                  <strong>{finishCode}</strong>
                </div>
                <p>Choose a finish and see the stage respond. Your selection stays with this inspection session.</p>
              </div>

              <div className="noline-inspect-swatches">
                {vehicle.colors.map((color, colorIndex) => (
                  <button
                    key={color}
                    className={finish === color ? "is-active" : ""}
                    style={{ "--swatch": color } as CSSProperties}
                    onClick={() => setFinish(color)}
                    aria-label={"Finish " + (colorIndex + 1) + ", " + color}
                  >
                    <span />
                    <div>
                      <small>FINISH {String(colorIndex + 1).padStart(2, "0")}</small>
                      <strong>{color.toUpperCase()}</strong>
                    </div>
                    {finish === color && <Check size={14} />}
                  </button>
                ))}
              </div>

              <div className="noline-inspect-finish-note">
                <Palette size={14} />
                <span>Finish selection changes the inspection environment. Vehicle paint integration can be connected to the 3D asset later.</span>
              </div>
            </div>
          )}

          {tab === "performance" && (
            <div className="noline-inspect-performance">
              <div className="noline-inspect-performance-lead">
                <Gauge size={17} />
                <div>
                  <span>PERFORMANCE PROFILE</span>
                  <strong>{vehicle.className}</strong>
                </div>
              </div>
              <div className="noline-inspect-performance-grid">
                {vehicle.stats.map((stat, statIndex) => (
                  <article key={stat.label} style={{ "--bar-delay": (statIndex * 60) + "ms", "--bar-fill": Math.min(94, 48 + statIndex * 9) + "%" } as CSSProperties}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <div><i /></div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "equipment" && (
            <div className="noline-inspect-equipment">
              <div className="noline-inspect-equipment-lead">
                <span className="noline-inspect-kicker">{features.length} INCLUDED SYSTEMS</span>
                <h3>Nothing extra to explain.</h3>
                <p>Everything listed here is part of the vehicle as it is presented in this catalog.</p>
              </div>
              <div className="noline-inspect-equipment-grid">
                {features.map((feature, featureIndex) => (
                  <article key={feature}>
                    <span>{String(featureIndex + 1).padStart(2, "0")}</span>
                    <div><Check size={11} /></div>
                    <strong>{feature}</strong>
                    <ArrowRight size={13} />
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === "specifications" && (
            <div className="noline-inspect-specifications">
              <aside>
                <span className="noline-inspect-kicker">TECHNICAL RECORD</span>
                <h3>{vehicle.catalogId}</h3>
                <p>Published vehicle data, arranged without the noise.</p>
                <div>
                  <span>MANUFACTURER</span>
                  <strong>{vehicle.manufacturer}</strong>
                  <span>CLASS</span>
                  <strong>{vehicle.className}</strong>
                  <span>STOCK</span>
                  <strong>{vehicle.stockLabel}</strong>
                </div>
              </aside>
              <div className="noline-inspect-spec-grid">
                {vehicle.stats.map((stat, statIndex) => (
                  <div key={stat.label}>
                    <span>{String(statIndex + 1).padStart(2, "0")} / {stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
                <div>
                  <span>07 / DELIVERY</span>
                  <strong>{vehicle.delivery}</strong>
                </div>
                <div>
                  <span>08 / PRICE</span>
                  <strong>{money(vehicle.price)}</strong>
                </div>
              </div>
            </div>
          )}
        </section>

        <footer className="noline-inspect-footer">
          <div className="noline-inspect-footer-identity">
            <div className="noline-inspect-footer-mark">N</div>
            <div>
              <strong>{vehicle.name}</strong>
              <span>{vehicle.catalogId} · {vehicle.delivery}</span>
            </div>
          </div>

          <div className="noline-inspect-footer-middle">
            <span>{activeTab.label}</span>
            <i />
            <span>Inspection session</span>
          </div>

          <div className="noline-inspect-footer-actions">
            <button onClick={() => changeTab(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Previous section">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => changeTab(activeIndex + 1)} disabled={activeIndex === tabs.length - 1} aria-label="Next section">
              <ChevronRight size={14} />
            </button>
            <button className="noline-inspect-footer-cta" onClick={onPurchase}>
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

"use client";

import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Check, Copy, Heart, Info, ShoppingBag, Sparkles } from "lucide-react";
import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { Vehicle } from "../../types/catalog";

const money = (value: number) => "$" + value.toLocaleString("en-US");

export function VehicleDetail({
  vehicle,
  favorite,
  bookmarked,
  onBack,
  onFavorite,
  onBookmark,
  onInspect,
  onPurchase,
  onAdd,
}: {
  vehicle: Vehicle;
  favorite: boolean;
  bookmarked: boolean;
  onBack: () => void;
  onFavorite: () => void;
  onBookmark: () => void;
  onInspect: () => void;
  onPurchase: () => void;
  onAdd: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = ((x / rect.width) * 100).toFixed(2);
    const py = ((y / rect.height) * 100).toFixed(2);
    const parallaxX = ((x / rect.width) - 0.5) * 14;
    const parallaxY = ((y / rect.height) - 0.5) * 10;
    stage.style.setProperty("--spot-x", `${px}%`);
    stage.style.setProperty("--spot-y", `${py}%`);
    stage.style.setProperty("--parallax-x", `${parallaxX.toFixed(2)}px`);
    stage.style.setProperty("--parallax-y", `${parallaxY.toFixed(2)}px`);
  };

  const handleLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--spot-x", "50%");
    stage.style.setProperty("--spot-y", "45%");
    stage.style.setProperty("--parallax-x", "0px");
    stage.style.setProperty("--parallax-y", "0px");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const savings = vehicle.originalPrice ? vehicle.originalPrice - vehicle.price : 0;
  const stockTone = vehicle.stock === "limited" ? "limited" : vehicle.stock === "in-stock" ? "available" : "unavailable";

  return (
    <div className="vehicle-detail-page">
      <div className="detail-top">
        <button className="back-link" onClick={onBack}><ArrowLeft size={14}/> Back to showroom</button>
        <div className="detail-breadcrumb">NOLINE / VEHICLES / {vehicle.catalogId}</div>
        <div className="detail-actions">
          <button onClick={onBookmark} aria-label={bookmarked ? "Remove bookmark" : "Bookmark vehicle"} className={bookmarked ? "active" : ""}>{bookmarked ? <BookmarkCheck size={15}/> : <Bookmark size={15}/>}</button>
          <button onClick={onFavorite} aria-label={favorite ? "Remove favorite" : "Add favorite"} className={favorite ? "active favorite" : ""}>{favorite ? <Heart size={15} fill="currentColor"/> : <Heart size={15}/>}</button>
          <button onClick={copyLink} aria-label="Copy vehicle link" className={copied ? "active" : ""}><Copy size={15}/></button>
        </div>
      </div>

      <section className="detail-hero-grid">
        <div
          ref={stageRef}
          className={`detail-art-premium ${vehicle.id === "arashi" ? "heavy-detail" : vehicle.specialVehicle ? "special-detail" : ""}`}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <div className="detail-art-noise"/>
          <div className="detail-art-glow"/>
          <div className="detail-art-image" style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined}/>
          <div className="detail-art-vignette"/>
          <div className="detail-art-topline">
            <span className="detail-art-index">01</span>
            <span>OBJECT / {vehicle.category.toUpperCase()}</span>
          </div>
          <div className="detail-art-sidecopy">
            <span>ENGINEERED</span>
            <b>{vehicle.className}</b>
          </div>
          <div className="detail-art-status">
            <span className={`stock-dot ${vehicle.stock}`}/>
            <span>{vehicle.stockLabel}</span>
          </div>
          <div className="detail-art-caption">
            <span>{vehicle.manufacturer}</span>
            <strong>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</strong>
          </div>
          <div className="detail-art-scroll"><span/> Drag to explore</div>
        </div>

        <div className="detail-copy-premium">
          <div className="detail-copy-intro">
            <div className="detail-overline"><span className="pulse"/>{vehicle.manufacturer} / {vehicle.className}</div>
            <h1>{vehicle.name}</h1>
            <p className="detail-lead">{vehicle.tagline}</p>
            <p className="detail-description">{vehicle.description}</p>
          </div>

          <div className="detail-price-card">
            <div>
              <span className="price-label">{vehicle.originalPrice ? "CURRENT OFFER" : vehicle.specialVehicle ? "PRIVATE CATALOG" : "CATALOG PRICE"}</span>
              <div className="detail-pricing-premium">
                {vehicle.originalPrice && <del>{money(vehicle.originalPrice)}</del>}
                <strong>{money(vehicle.price)}</strong>
              </div>
            </div>
            {vehicle.saleLabel && <div className="price-badge"><span>{vehicle.saleLabel}</span>{savings > 0 && <small>Save {money(savings)}</small>}</div>}
          </div>

          <div className="detail-stock-line">
            <div><span className={`stock-beacon ${stockTone}`}/><strong>{vehicle.stockLabel}</strong></div>
            <span>{vehicle.delivery}</span>
          </div>

          <div className="detail-ctas-premium">
            <button className="button blue large purchase-primary" onClick={onPurchase}>
              <span><Sparkles size={14}/> Acquire {vehicle.name}</span>
              <ArrowRight size={15}/>
            </button>
            <button className="button secondary large" onClick={onAdd}><ShoppingBag size={14}/> Add to basket</button>
          </div>

          <button className="inspect-link-premium" onClick={onInspect}>
            <span><Info size={14}/><b>Explore every detail</b><small>Digital inspection · finishes · specifications</small></span>
            <ArrowRight size={14}/>
          </button>

          <div className="detail-trust">
            <span>SECURE GAME-SERVER HANDOFF</span>
            <i/>
            <span>NO ACCOUNT REQUIRED TO BROWSE</span>
          </div>
        </div>
      </section>

      <div className="detail-metrics-premium">
        {vehicle.stats.map((s, index) => (
          <div key={s.label} className={index === 0 ? "metric-featured" : ""}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
          </div>
        ))}
      </div>

      <section className="detail-editorial">
        <div className="detail-editorial-head">
          <div><span className="kicker">THE MACHINE</span><h2>Every number has a purpose.</h2></div>
          <p>Designed as a complete object—not a pile of features. The details below are the reasons this vehicle feels different when you actually live with it.</p>
        </div>
        <div className="detail-editorial-grid">
          <article className="detail-panel premium-panel feature-panel">
            <div className="panel-number">02</div>
            <span className="kicker">ENGINEERING</span>
            <h3>Built around the machine.</h3>
            <div className="feature-list">
              {vehicle.features.map((feature, index) => (
                <div className="feature-line-premium" key={feature}>
                  <span>0{index + 1}</span>
                  <Check size={13}/>
                  <strong>{feature}</strong>
                </div>
              ))}
            </div>
          </article>
          <article className="detail-panel premium-panel ownership-panel">
            <div className="panel-number">03</div>
            <span className="kicker">OWNERSHIP</span>
            <h3>Ready when you are.</h3>
            <div className="ownership ownership-premium"><span>Availability</span><strong>{vehicle.stockLabel}</strong></div>
            <div className="ownership ownership-premium"><span>Delivery</span><strong>{vehicle.delivery}</strong></div>
            <div className="ownership ownership-premium"><span>Catalog ID</span><strong>{vehicle.catalogId}</strong></div>
            <div className="ownership ownership-premium"><span>Manufacturer</span><strong>{vehicle.manufacturer}</strong></div>
          </article>
        </div>
      </section>

      <div className="detail-bottom-cta">
        <div><span className="kicker">NOLINE CATALOG</span><strong>Make this the next vehicle in your world.</strong></div>
        <div><span>{money(vehicle.price)}</span><button className="button blue" onClick={onPurchase}>Purchase <ArrowRight size={14}/></button></div>
      </div>

      <div className="detail-footer-line"><span>{vehicle.catalogId}</span><span>© NOLINE / 2026</span></div>
    </div>
  );
}

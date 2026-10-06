"use client";

import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Check, Copy, Heart, Info, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { Vehicle } from "../../types/catalog";
import { Arashi3D } from "./Arashi3D";

const money = (value: number) => "$" + value.toLocaleString("en-US");

function useAnimatedPrice(target: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const duration = 850;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

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
  const pageRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const animatedPrice = useAnimatedPrice(vehicle.price);
  const [copied, setCopied] = useState(false);
  const savings = vehicle.originalPrice ? vehicle.originalPrice - vehicle.price : 0;
  const stockTone = vehicle.stock === "limited" ? "limited" : vehicle.stock === "in-stock" ? "available" : "unavailable";

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -9% 0px", threshold: 0.08 });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [vehicle.id]);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xRatio = x / rect.width;
    const yRatio = y / rect.height;

    stage.style.setProperty("--spot-x", `${(xRatio * 100).toFixed(2)}%`);
    stage.style.setProperty("--spot-y", `${(yRatio * 100).toFixed(2)}%`);
    stage.style.setProperty("--parallax-x", `${((xRatio - 0.5) * 18).toFixed(2)}px`);
    stage.style.setProperty("--parallax-y", `${((yRatio - 0.5) * 13).toFixed(2)}px`);
    stage.style.setProperty("--tilt-x", `${((0.5 - yRatio) * 2.2).toFixed(2)}deg`);
    stage.style.setProperty("--tilt-y", `${((xRatio - 0.5) * 2.8).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--spot-x", "50%");
    stage.style.setProperty("--spot-y", "45%");
    stage.style.setProperty("--parallax-x", "0px");
    stage.style.setProperty("--parallax-y", "0px");
    stage.style.setProperty("--tilt-x", "0deg");
    stage.style.setProperty("--tilt-y", "0deg");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div ref={pageRef} className="vehicle-detail-page">
      <div className="detail-top" data-reveal="top">
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
          data-reveal="hero"
        >
          <div className="detail-art-noise"/>
          <div className="detail-art-glow"/>
          <div className="detail-art-halo"/>
          {vehicle.id === "arashi" ? <Arashi3D /> : <div className="detail-art-image" style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined}/>} 
          <div className="detail-art-reflection"/>
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
          <div className="detail-art-scroll"><span/><span>{vehicle.id === "arashi" ? "Drag the machine" : "Move to explore"}</span></div>
          <div className="detail-art-corners" aria-hidden="true"><i/><i/><i/><i/></div>
        </div>

        <div className="detail-copy-premium">
          <div className="detail-copy-intro" data-reveal="copy">
            <div className="detail-overline"><span className="pulse"/>{vehicle.manufacturer} / {vehicle.className}</div>
            <h1>{vehicle.name}</h1>
            <p className="detail-lead">{vehicle.tagline}</p>
            <p className="detail-description">{vehicle.description}</p>
          </div>

          <div className="detail-price-card" data-reveal="copy">
            <div>
              <span className="price-label">{vehicle.originalPrice ? "CURRENT OFFER" : vehicle.specialVehicle ? "PRIVATE CATALOG" : "CATALOG PRICE"}</span>
              <div className="detail-pricing-premium">
                {vehicle.originalPrice && <del>{money(vehicle.originalPrice)}</del>}
                <strong aria-label={`Price ${money(vehicle.price)}`}>{money(animatedPrice)}</strong>
              </div>
            </div>
            {vehicle.saleLabel && <div className="price-badge"><span>{vehicle.saleLabel}</span>{savings > 0 && <small>Save {money(savings)}</small>}</div>}
          </div>

          <div className="detail-stock-line" data-reveal="copy">
            <div><span className={`stock-beacon ${stockTone}`}/><strong>{vehicle.stockLabel}</strong></div>
            <span>{vehicle.delivery}</span>
          </div>

          <div className="detail-ctas-premium" data-reveal="copy">
            <button className="button blue large purchase-primary" onClick={onPurchase}>
              <span><Sparkles size={14}/> Acquire {vehicle.name}</span>
              <ArrowRight size={15}/>
            </button>
            <button className="button secondary large" onClick={onAdd}><ShoppingBag size={14}/> Add to basket</button>
          </div>

          <button className="inspect-link-premium" onClick={onInspect} data-reveal="copy">
            <span><Info size={14}/><b>Explore every detail</b><small>Digital inspection · finishes · specifications</small></span>
            <ArrowRight size={14}/>
          </button>

          <div className="detail-trust" data-reveal="copy">
            <span>SECURE GAME-SERVER HANDOFF</span>
            <i/>
            <span>NO ACCOUNT REQUIRED TO BROWSE</span>
          </div>
        </div>
      </section>

      <div className="detail-buy-dock" data-reveal="dock">
        <div className="buy-dock-copy">
          <span className={`stock-beacon ${stockTone}`}/>
          <div><strong>{vehicle.name}</strong><small>{vehicle.stockLabel} · {vehicle.delivery}</small></div>
        </div>
        <div className="buy-dock-price">{money(vehicle.price)}</div>
        <button className="button blue dock-buy" onClick={onPurchase}><span>Acquire</span><ArrowRight size={14}/></button>
      </div>

      <div className="detail-metrics-premium" data-reveal="section">
        {vehicle.stats.map((s, index) => (
          <div key={s.label} className={index === 0 ? "metric-featured" : ""} style={{ "--metric-index": index } as React.CSSProperties}>
            <span>{s.label}</span>
            <strong>{s.value}</strong>
            <i aria-hidden="true"/>
          </div>
        ))}
      </div>

      <section className="detail-story" data-reveal="section">
        <div className="detail-story-heading">
          <span className="kicker">THE EXPERIENCE</span>
          <h2>It should feel exceptional<br/><em>before you own it.</em></h2>
          <p>Every part of this page is designed around the same idea as the machine itself: restraint, precision and a sense that nothing was placed here by accident.</p>
        </div>
        <div className="experience-rail">
          <article className="experience-card experience-card-large">
            <span className="experience-number">A</span>
            <div className="experience-icon"><Sparkles size={16}/></div>
            <strong>Presence</strong>
            <p>The visual system lets the vehicle stay quiet while the details do the convincing.</p>
          </article>
          <article className="experience-card">
            <span className="experience-number">B</span>
            <div className="experience-icon"><ArrowRight size={16}/></div>
            <strong>Response</strong>
            <p>Every primary action moves, answers and settles back into place.</p>
          </article>
          <article className="experience-card">
            <span className="experience-number">C</span>
            <div className="experience-icon"><Check size={16}/></div>
            <strong>Confidence</strong>
            <p>Price, availability and delivery stay visible so the decision feels effortless.</p>
          </article>
        </div>
      </section>

      <section className="detail-editorial" data-reveal="section">
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

      <section className="detail-bottom-cta" data-reveal="section">
        <div><span className="kicker">NOLINE CATALOG</span><strong>Make this the next vehicle in your world.</strong></div>
        <div><span>{money(vehicle.price)}</span><button className="button blue" onClick={onPurchase}>Purchase <ArrowRight size={14}/></button></div>
      </section>

      <div className="detail-footer-line"><span>{vehicle.catalogId}</span><span>© NOLINE / 2026</span></div>
    </div>
  );
}

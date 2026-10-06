"use client";

import { ArrowRight, Check, ChevronRight, X, Zap } from "lucide-react";
import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { Vehicle } from "../../types/catalog";

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
  const stageRef = useRef<HTMLDivElement>(null);
  const [finish, setFinish] = useState(vehicle.colors[0]);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    stage.style.setProperty("--inspect-x", `${(x * 100).toFixed(1)}%`);
    stage.style.setProperty("--inspect-y", `${(y * 100).toFixed(1)}%`);
    stage.style.setProperty("--inspect-tx", `${((x - 0.5) * 16).toFixed(1)}px`);
    stage.style.setProperty("--inspect-ty", `${((y - 0.5) * 12).toFixed(1)}px`);
    stage.style.setProperty("--inspect-rx", `${((0.5 - y) * 2).toFixed(2)}deg`);
    stage.style.setProperty("--inspect-ry", `${((x - 0.5) * 2.6).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--inspect-x", "50%");
    stage.style.setProperty("--inspect-y", "45%");
    stage.style.setProperty("--inspect-tx", "0px");
    stage.style.setProperty("--inspect-ty", "0px");
    stage.style.setProperty("--inspect-rx", "0deg");
    stage.style.setProperty("--inspect-ry", "0deg");
  };

  return (
    <div className="modal-backdrop inspection-backdrop" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <div className="vehicle-inspector-premium">
        <div className="inspection-head">
          <div>
            <span className="kicker">DIGITAL INSPECTION / {vehicle.manufacturer}</span>
            <h2>{vehicle.name}</h2>
          </div>
          <button className="inspection-close" onClick={onClose} aria-label="Close inspection"><X size={17}/></button>
        </div>

        <div
          ref={stageRef}
          className={`inspection-stage-premium ${vehicle.id === "arashi" ? "inspection-heavy" : ""}`}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <div className="inspection-grid"/>
          <div className="inspection-light"/>
          <div className="inspection-ring inspection-ring-one"/>
          <div className="inspection-ring inspection-ring-two"/>
          <div
            className="inspection-machine-premium"
            style={{ "--machine-color": finish } as CSSProperties}
          >
            <div
              className="inspection-machine-art"
              style={vehicle.image ? { backgroundImage: `url(${vehicle.image})` } : undefined}
            />
            <span>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</span>
          </div>
          <div className="inspection-stage-top">
            <span>01 / VISUAL SYSTEM</span>
            <span>{vehicle.catalogId}</span>
          </div>
          <div className="inspection-live"><Zap size={11}/><span>LIVE SPEC VIEW</span></div>
          <div className="inspection-readout"><span>AVAILABILITY</span><strong>{vehicle.stockLabel}</strong></div>
        </div>

        <div className="inspection-spec-strip">
          {vehicle.stats.slice(0, 4).map((stat) => (
            <div key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        <div className="inspection-body-grid">
          <section className="inspection-finish-panel">
            <span className="kicker">FINISH</span>
            <h3>Make it yours.</h3>
            <p>Select the factory finish before acquisition.</p>
            <div className="premium-swatches">
              {vehicle.colors.map((color, index) => (
                <button
                  key={color}
                  onClick={() => setFinish(color)}
                  className={finish === color ? "selected" : ""}
                  style={{ "--swatch-color": color } as CSSProperties}
                  aria-label={`Select finish ${index + 1}`}
                >
                  <span/>
                  {finish === color && <Check size={11}/>}
                </button>
              ))}
            </div>
            <div className="selected-finish"><span>SELECTED FINISH</span><strong>{finish}</strong></div>
          </section>

          <section className="inspection-feature-panel">
            <span className="kicker">ENGINEERING</span>
            <h3>What you get.</h3>
            <div>
              {vehicle.features.map((feature, index) => (
                <div key={feature} className="inspection-feature-row">
                  <span>0{index + 1}</span><Check size={12}/><strong>{feature}</strong><ChevronRight size={11}/>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="inspection-footer">
          <div className="inspection-total"><span>TOTAL</span><strong>{money(vehicle.price)}</strong><small>{vehicle.delivery}</small></div>
          <button className="button blue inspection-buy" onClick={onPurchase}><span>Continue to acquisition</span><ArrowRight size={14}/></button>
        </div>
      </div>
    </div>
  );
}

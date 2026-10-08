"use client";

import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronDown,
  Command,
  Download,
  Grid2X2,
  History,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Settings,
  ShoppingBag,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { sites } from "../../data/sites";

export function BrowserChrome({
  title,
  address,
  onAddressChange,
  onSubmit,
  appsOpen,
  setAppsOpen,
  menuOpen,
  setMenuOpen,
  basketCount,
  onBasket,
  onCommand,
  onRoute,
  onRefresh,
}: {
  title: string;
  address: string;
  onAddressChange: (value: string) => void;
  onSubmit: (value?: string) => void;
  appsOpen: boolean;
  setAppsOpen: (value: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  basketCount: number;
  onBasket: () => void;
  onCommand: () => void;
  onRoute: (route: "history" | "bookmarks" | "downloads" | "settings" | "diagnostics") => void;
  onRefresh: () => void;
}) {
  return (
    <div className="premium-browser-chrome">
      <header className="browser-top premium-topbar">
        <div className="premium-window-controls" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <button className="premium-brand" aria-label="NOLINE">
          <span>N</span>
        </button>

        <div className="premium-identity">
          <strong>NOLINE</strong>
          <span>IN-WORLD CLIENT</span>
        </div>

        <div className="tab-strip premium-tabs">
          <button className="tab active premium-tab">
            <span className="tab-site-dot" />
            <span>{title}</span>
            <X size={12} />
          </button>
          <button className="new-tab premium-new-tab" aria-label="New tab">
            <Plus size={15} />
          </button>
        </div>

        <div className="premium-session">
          <span><i /> CONNECTION SECURE</span>
          <strong>NODE 07</strong>
        </div>

        <div className="top-tools premium-top-tools">
          <button className="premium-icon" onClick={onBasket} aria-label="Basket">
            <ShoppingBag size={16} />
            {basketCount > 0 && <b>{basketCount}</b>}
          </button>
          <button className="premium-icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Browser menu">
            <MoreHorizontal size={17} />
          </button>
        </div>
      </header>

      <section className="browser-toolbar premium-toolbar">
        <div className="nav-tools premium-nav">
          <button className="premium-icon" aria-label="Back"><ArrowLeft size={16} /></button>
          <button className="premium-icon" aria-label="Forward"><ArrowRight size={16} /></button>
          <button className="premium-icon" onClick={onRefresh} aria-label="Refresh"><RefreshCw size={15} /></button>
        </div>

        <form className="address-bar premium-address" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <span className="premium-address-lock"><LockKeyhole size={12} /></span>
          <input value={address} onChange={(event) => onAddressChange(event.target.value)} spellCheck={false} aria-label="Address bar" />
          {address && <button type="button" onClick={() => onAddressChange("")} aria-label="Clear"><X size={13} /></button>}
        </form>

        <div className="toolbar-actions premium-toolbar-actions">
          <button className={`toolbar-pill premium-toolbar-pill ${appsOpen ? "selected" : ""}`} onClick={() => setAppsOpen(!appsOpen)}>
            <Grid2X2 size={14} /><span>Network</span><ChevronDown size={11} />
          </button>
          <button className="toolbar-pill premium-toolbar-pill premium-cmd" onClick={onCommand}>
            <Command size={14} /><span>CMD</span><kbd>⌘K</kbd>
          </button>
        </div>

        {appsOpen && (
          <div className="popover premium-popover premium-network-popover">
            <div className="premium-popover-head">
              <div><span>NETWORK</span><strong>Connected services</strong></div>
              <button onClick={() => setAppsOpen(false)} aria-label="Close"><X size={14} /></button>
            </div>
            <div className="premium-network-grid">
              {sites.map((site, index) => (
                <button key={site.id} onClick={() => { setAppsOpen(false); onAddressChange(site.domain); onSubmit(site.domain); }}>
                  <span className="premium-network-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="premium-network-glyph">{site.glyph}</span>
                  <span><strong>{site.name}</strong><small>{site.category}</small></span>
                  <span className={`premium-network-state ${site.serviceStatus}`}>{site.serviceStatus === "live" ? "LIVE" : "SOON"}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="popover premium-popover premium-menu-popover">
            <div className="premium-popover-head">
              <div><span>NOLINE</span><strong>Client controls</strong></div>
              <button onClick={() => setMenuOpen(false)} aria-label="Close"><X size={14} /></button>
            </div>
            <div className="premium-menu-list">
              <PremiumMenuRow icon={History} text="History" suffix="Local" onClick={() => { setMenuOpen(false); onRoute("history"); }} />
              <PremiumMenuRow icon={Bookmark} text="Bookmarks" suffix="Local" onClick={() => { setMenuOpen(false); onRoute("bookmarks"); }} />
              <PremiumMenuRow icon={Download} text="Downloads" suffix="0" onClick={() => { setMenuOpen(false); onRoute("downloads"); }} />
              <PremiumMenuRow icon={Settings} text="Settings" onClick={() => { setMenuOpen(false); onRoute("settings"); }} />
              <PremiumMenuRow icon={Activity} text="Diagnostics" suffix="Ready" onClick={() => { setMenuOpen(false); onRoute("diagnostics"); }} />
              <div className="premium-menu-rule" />
              <PremiumMenuRow icon={UserRound} text="Account" suffix="Guest" onClick={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function PremiumMenuRow({ icon: Icon, text, suffix, onClick }: { icon: LucideIcon; text: string; suffix?: string; onClick: () => void }) {
  return (
    <button className="premium-menu-row" onClick={onClick}>
      <span className="premium-menu-icon"><Icon size={14} /></span>
      <span><strong>{text}</strong>{suffix && <small>{suffix}</small>}</span>
      <ArrowRight size={13} />
    </button>
  );
}

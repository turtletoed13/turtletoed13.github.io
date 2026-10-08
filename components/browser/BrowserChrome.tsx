"use client";

import {
  Activity, ArrowLeft, ArrowRight, Bookmark, ChevronDown, Command, Download,
  Grid2X2, History, LockKeyhole, MoreHorizontal, Plus, RefreshCw,
  Settings, ShoppingBag, UserRound, X, type LucideIcon
} from "lucide-react";
import { sites } from "../../data/sites";

export function BrowserChrome({
  title, address, onAddressChange, onSubmit, appsOpen, setAppsOpen, menuOpen,
  setMenuOpen, basketCount, onBasket, onCommand, onRoute, onRefresh,
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
    <div className="apple-chrome">
      <header className="apple-topbar">
        <div className="apple-window">
          <span /><span /><span />
        </div>
        <button className="apple-logo" aria-label="NOLINE"><span>N</span></button>
        <div className="apple-wordmark">NOLINE</div>

        <div className="apple-tabs">
          <button className="apple-tab">
            <span className="apple-tab-dot" />
            <span>{title}</span>
            <X size={12} />
          </button>
          <button className="apple-new-tab" aria-label="New tab"><Plus size={15} /></button>
        </div>

        <div className="apple-top-actions">
          <button className="apple-icon-button" onClick={onBasket} aria-label="Basket">
            <ShoppingBag size={16} />
            {basketCount > 0 && <b>{basketCount}</b>}
          </button>
          <button className="apple-icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <MoreHorizontal size={17} />
          </button>
        </div>
      </header>

      <div className="apple-toolbar">
        <div className="apple-nav">
          <button className="apple-icon-button" aria-label="Back"><ArrowLeft size={15} /></button>
          <button className="apple-icon-button" aria-label="Forward"><ArrowRight size={15} /></button>
          <button className="apple-icon-button" onClick={onRefresh} aria-label="Refresh"><RefreshCw size={14} /></button>
        </div>

        <form className="apple-address" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <LockKeyhole size={12} />
          <input value={address} onChange={(event) => onAddressChange(event.target.value)} spellCheck={false} aria-label="Address" />
          {address && <button type="button" onClick={() => onAddressChange("")} aria-label="Clear address"><X size={12} /></button>}
        </form>

        <div className="apple-toolbar-actions">
          <button className={`apple-toolbar-button ${appsOpen ? "active" : ""}`} onClick={() => setAppsOpen(!appsOpen)}>
            <Grid2X2 size={14} /><span>Browse</span><ChevronDown size={10} />
          </button>
          <button className="apple-toolbar-button command" onClick={onCommand}>
            <Command size={14} /><span>Search</span><kbd>⌘K</kbd>
          </button>
        </div>

        {appsOpen && (
          <div className="popover apple-popover apple-network-popover">
            <div className="apple-popover-title">
              <span>Network</span>
              <button onClick={() => setAppsOpen(false)} aria-label="Close"><X size={13} /></button>
            </div>
            <div className="apple-network-list">
              {sites.map((site) => (
                <button key={site.id} onClick={() => { setAppsOpen(false); onAddressChange(site.domain); onSubmit(site.domain); }}>
                  <span className="apple-site-symbol">{site.glyph}</span>
                  <span><strong>{site.name}</strong><small>{site.category}</small></span>
                  <span className={site.serviceStatus === "live" ? "available" : ""}>{site.serviceStatus === "live" ? "Available" : "Coming soon"}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="popover apple-popover apple-menu-popover">
            <div className="apple-popover-title">
              <span>NOLINE</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close"><X size={13} /></button>
            </div>
            <AppleMenuRow icon={History} text="History" suffix="Local" onClick={() => { setMenuOpen(false); onRoute("history"); }} />
            <AppleMenuRow icon={Bookmark} text="Bookmarks" suffix="Local" onClick={() => { setMenuOpen(false); onRoute("bookmarks"); }} />
            <AppleMenuRow icon={Download} text="Downloads" suffix="0" onClick={() => { setMenuOpen(false); onRoute("downloads"); }} />
            <AppleMenuRow icon={Settings} text="Settings" onClick={() => { setMenuOpen(false); onRoute("settings"); }} />
            <AppleMenuRow icon={Activity} text="Diagnostics" suffix="Ready" onClick={() => { setMenuOpen(false); onRoute("diagnostics"); }} />
            <div className="apple-menu-divider" />
            <AppleMenuRow icon={UserRound} text="Account" suffix="Guest" onClick={() => setMenuOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

function AppleMenuRow({ icon: Icon, text, suffix, onClick }: { icon: LucideIcon; text: string; suffix?: string; onClick: () => void }) {
  return (
    <button className="apple-menu-row" onClick={onClick}>
      <span className="apple-menu-row-icon"><Icon size={14} /></span>
      <span><strong>{text}</strong>{suffix && <small>{suffix}</small>}</span>
      <ArrowRight size={13} />
    </button>
  );
}

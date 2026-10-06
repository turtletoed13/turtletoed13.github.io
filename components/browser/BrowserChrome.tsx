"use client";

import { ChevronDown, Command, Grid2X2, History, Bookmark, Download, Settings, Activity, MoreHorizontal, Plus, RefreshCw, ArrowLeft, ArrowRight, LockKeyhole, ShoppingBag, UserRound, X, type LucideIcon } from "lucide-react";
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
  return <>
    <header className="browser-top game-browser-top">
      <div className="window-controls game-window-controls" aria-hidden="true"><span/><span/><span/></div>
      <div className="game-client-mark" aria-hidden="true"><span>N</span><i /></div><div className="game-client-identity"><strong>NOLINE</strong><span>IN-WORLD NETWORK</span></div><button className="brand" aria-label="NOLINE"><span>N</span></button>
      <div className="tab-strip game-tab-strip">
        <button className="tab active game-tab"><span className="tab-site-dot"/><span>{title}</span><X size={12}/></button>
        <button className="new-tab" aria-label="New tab"><Plus size={15}/></button>
      </div>
      <div className="game-top-telemetry"><span><i className="signal-core" />LINK STABLE</span><strong>LOCAL NODE 07</strong></div><div className="top-tools">
        <button className="icon" onClick={onBasket} aria-label="Basket"><ShoppingBag size={16}/>{basketCount > 0 && <b>{basketCount}</b>}</button>
        <button className="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Browser menu"><MoreHorizontal size={17}/></button>
      </div>
    </header>

    <section className="browser-toolbar game-browser-toolbar">
      <div className="nav-tools game-nav-tools">
        <button className="icon" onClick={() => {}} aria-label="Back"><ArrowLeft size={16}/></button>
        <button className="icon" onClick={() => {}} aria-label="Forward"><ArrowRight size={16}/></button>
        <button className="icon" onClick={onRefresh} aria-label="Refresh"><RefreshCw size={15}/></button>
      </div>
      <form className="address-bar game-address-bar" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <LockKeyhole size={13}/>
        <input value={address} onChange={(event) => onAddressChange(event.target.value)} spellCheck={false} aria-label="Address bar"/>
        <button type="button" onClick={() => onAddressChange("")}><X size={13}/></button>
      </form>
      <div className="toolbar-actions">
        <button className={`toolbar-pill ${appsOpen ? "selected" : ""}`} onClick={() => setAppsOpen(!appsOpen)}><Grid2X2 size={14}/> Services <ChevronDown size={12}/></button>
        <button className="toolbar-pill game-toolbar-pill cmd" onClick={onCommand}><Command size={14}/> CMD</button>
      </div>

      {appsOpen && <div className="popover apps-popover game-popover">
        <div className="popover-title"><span>NOLINE SERVICES</span><button onClick={() => setAppsOpen(false)}><X size={14}/></button></div>
        <div className="apps-grid game-apps-grid">{sites.map((site) => <button key={site.id} onClick={() => { setAppsOpen(false); onAddressChange(site.domain); onSubmit(site.domain); }}><span className="app-mark">{site.glyph}</span><b>{site.name}</b><small>{site.category}</small></button>)}</div>
      </div>}

      {menuOpen && <div className="popover browser-popover game-popover">
        <MenuRow icon={History} text="History" onClick={() => { setMenuOpen(false); onRoute("history"); }}/>
        <MenuRow icon={Bookmark} text="Bookmarks" onClick={() => { setMenuOpen(false); onRoute("bookmarks"); }}/>
        <MenuRow icon={Download} text="Downloads" onClick={() => { setMenuOpen(false); onRoute("downloads"); }}/>
        <MenuRow icon={Settings} text="Settings" onClick={() => { setMenuOpen(false); onRoute("settings"); }}/>
        <MenuRow icon={Activity} text="Diagnostics" onClick={() => { setMenuOpen(false); onRoute("diagnostics"); }}/>
        <div className="divider"/>
        <MenuRow icon={UserRound} text="Account" suffix="Guest" onClick={() => setMenuOpen(false)}/>
      </div>}
    </section>
  </>;
}

function MenuRow({ icon: Icon, text, suffix, onClick }: { icon: LucideIcon; text: string; suffix?: string; onClick: () => void }) {
  return <button className="menu-row game-menu-row" onClick={onClick}><Icon size={15}/><span>{text}</span>{suffix && <small>{suffix}</small>}<ChevronDown size={11} style={{ transform: "rotate(-90deg)" }}/></button>;
}

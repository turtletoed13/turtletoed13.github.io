"use client";

import { type Dispatch, type ElementType, type FormEvent, type ReactNode, type SetStateAction, type CSSProperties, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  BookmarkCheck,
  Car,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  FileClock,
  Globe2,
  Grid2X2,
  Heart,
  History,
  Home,
  Info,
  Laptop,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { createPurchase, type NolineProduct } from "../lib/store";

type Page = "home" | "sites" | "market" | "showroom" | "vehicle" | "history" | "bookmarks" | "downloads" | "settings" | "diagnostics";
type Site = { id: string; name: string; domain: string; category: string; tagline: string; description: string; glyph: string };
type Vehicle = NolineProduct & {
  manufacturer: string;
  brand: string;
  className: string;
  tagline: string;
  description: string;
  stats: { label: string; value: string }[];
  features: string[];
  colors: string[];
  status: string;
  delivery: string;
  featured?: boolean;
};

const sites: Site[] = [
  { id: "market", name: "Mercury Market", domain: "mercury.noline", category: "Commerce", tagline: "Everything in one place.", description: "A premium marketplace for products, services and city essentials.", glyph: "M" },
  { id: "ironclad", name: "Ironclad Exchange", domain: "ironclad.noline", category: "Mobility", tagline: "Machines built without compromise.", description: "Specialized heavy vehicles and high-mobility platforms.", glyph: "I" },
  { id: "aurelion", name: "Aurelion Motors", domain: "aurelion.noline", category: "Automotive", tagline: "Performance, elevated.", description: "Exotic, grand touring and executive vehicles.", glyph: "A" },
  { id: "keystone", name: "Keystone Estates", domain: "keystone.noline", category: "Property", tagline: "Own where you belong.", description: "Private residences, compounds and commercial property.", glyph: "K" },
  { id: "atlas", name: "Atlas Meridian", domain: "atlas.noline", category: "Travel", tagline: "Go further.", description: "Premium travel, aviation and city transport.", glyph: "A" },
  { id: "northline", name: "Northline Financial", domain: "northline.noline", category: "Finance", tagline: "Move money with confidence.", description: "Modern financial tools ready for a game economy.", glyph: "N" },
  { id: "vanta", name: "Vanta Customs", domain: "vanta.noline", category: "Automotive", tagline: "Make it yours.", description: "Factory options, custom finishes and vehicle upgrades.", glyph: "V" },
  { id: "vector", name: "Vector Works", domain: "vector.noline", category: "Engineering", tagline: "Tune the machine.", description: "Performance parts, engineering and fabrication.", glyph: "V" },
  { id: "signal", name: "Signal Current", domain: "signal.noline", category: "News", tagline: "Know what is happening.", description: "City reports, market movement and live events.", glyph: "S" },
  { id: "vantage", name: "Vantage Careers", domain: "vantage.noline", category: "Careers", tagline: "Make your next move.", description: "Contracts and opportunities across the city.", glyph: "V" },
  { id: "foundry", name: "Foundry Supply", domain: "foundry.noline", category: "Industrial", tagline: "Serious gear for serious work.", description: "Industrial equipment and specialist supply.", glyph: "F" },
];

const vehicles: Vehicle[] = [
  {
    id: "arashi",
    name: "Heavy, ST-17 Arashi",
    manufacturer: "Kuroda Heavy Industries",
    brand: "Kuroda",
    category: "Mobility",
    className: "HEAVY / HIGH-MOBILITY",
    tagline: "A machine designed to keep moving.",
    description: "The ST-17 Arashi is a heavy high-mobility platform engineered for difficult terrain, long-range logistics and operators who expect absolute mechanical confidence.",
    price: 184000,
    stats: [
      { label: "Power", value: "742 HP" }, { label: "Drive", value: "8×8" }, { label: "Range", value: "612 km" },
      { label: "Mass", value: "18.4 t" }, { label: "Clearance", value: "410 mm" }, { label: "Seats", value: "5" },
    ],
    features: ["Adaptive terrain suspension", "Reinforced composite body", "All-weather cabin", "High-capacity utility bay", "Dual-range transfer case", "Remote diagnostics suite"],
    colors: ["#111317", "#9c978e", "#555b57", "#d3cec5", "#243348"],
    status: "IN STOCK",
    delivery: "Same-day city delivery",
    featured: true,
  },
  {
    id: "solenne",
    name: "Solenne GT",
    manufacturer: "Aurelion",
    brand: "Aurelion",
    category: "Automotive",
    className: "GRAND TOURING",
    tagline: "Quiet speed, unmistakable presence.",
    description: "A long-distance grand tourer balancing effortless performance with a cabin designed for the highest tier of city life.",
    price: 238500,
    stats: [
      { label: "Power", value: "603 HP" }, { label: "Drive", value: "AWD" }, { label: "0–100", value: "3.7 s" },
      { label: "Range", value: "721 km" }, { label: "Seats", value: "4" }, { label: "Torque", value: "780 Nm" },
    ],
    features: ["Adaptive air suspension", "Panoramic smart glass", "Executive rear console", "Active aero", "Performance telemetry", "Acoustic cabin"],
    colors: ["#0e0f12", "#cccac3", "#73767b", "#ab9f91"],
    status: "2 AVAILABLE",
    delivery: "1–2 business days",
    featured: true,
  },
  {
    id: "vaelor",
    name: "Vaelor S",
    manufacturer: "Veyra",
    brand: "Veyra",
    category: "Automotive",
    className: "EXECUTIVE FASTBACK",
    tagline: "The city, at your pace.",
    description: "An athletic executive fastback with a minimal cabin and a chassis tuned for high-speed stability.",
    price: 146000,
    stats: [
      { label: "Power", value: "511 HP" }, { label: "Drive", value: "AWD" }, { label: "0–100", value: "4.1 s" },
      { label: "Range", value: "659 km" }, { label: "Seats", value: "5" }, { label: "Torque", value: "690 Nm" },
    ],
    features: ["Matrix lighting", "Active noise control", "Sport chassis", "Assisted parking", "Glass cockpit", "Wireless device dock"],
    colors: ["#17181c", "#d6d0c5", "#5b5f66"],
    status: "IN STOCK",
    delivery: "Same-day collection",
  },
  {
    id: "mercator",
    name: "Mercator LX",
    manufacturer: "Mercator",
    brand: "Mercator",
    category: "Automotive",
    className: "LUXURY UTILITY",
    tagline: "Space without compromise.",
    description: "A substantial luxury utility vehicle for commanding road presence without leaving premium comfort behind.",
    price: 119500,
    stats: [
      { label: "Power", value: "428 HP" }, { label: "Drive", value: "AWD" }, { label: "0–100", value: "5.6 s" },
      { label: "Range", value: "604 km" }, { label: "Seats", value: "7" }, { label: "Cargo", value: "1,980 L" },
    ],
    features: ["Air suspension", "Three-zone climate", "Electrochromic roof", "Hands-free liftgate", "Terrain modes", "360° camera suite"],
    colors: ["#101114", "#d2c7ba", "#70747a"],
    status: "AVAILABLE",
    delivery: "2–4 business days",
  },
];

const apps = [
  ["market", ShoppingBag], ["ironclad", ShieldCheck], ["aurelion", Car], ["keystone", Home], ["atlas", Globe2],
  ["northline", CreditCard], ["vanta", SlidersHorizontal], ["vector", Zap], ["signal", Activity], ["vantage", UserRound], ["foundry", PackageCheck],
] as const;

const money = (value: number) => "$" + value.toLocaleString("en-US");
const getSite = (id: string) => sites.find((s) => s.id === id) ?? sites[0];
const getVehicle = (id: string) => vehicles.find((v) => v.id === id) ?? vehicles[0];

function VehicleName({ vehicle }: { vehicle: Vehicle }) {
  if (vehicle.id === "arashi") return <><i>Heavy, <b>ST-17</b></i> <b>Arashi</b></>;
  return <>{vehicle.name}</>;
}

export default function Noline() {
  const [page, setPage] = useState<Page>("home");
  const [site, setSite] = useState("market");
  const [vehicleId, setVehicleId] = useState("arashi");
  const [address, setAddress] = useState("noline://home");
  const [draft, setDraft] = useState("noline://home");
  const [search, setSearch] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [basket, setBasket] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [settings, setSettings] = useState({ motion: true, glass: true, compact: false });
  const [notice, setNotice] = useState("");
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    try {
      const load = (key: string) => JSON.parse(localStorage.getItem(key) ?? "[]");
      setBasket(load("noline:basket")); setFavorites(load("noline:favorites")); setBookmarks(load("noline:bookmarks")); setHistory(load("noline:history"));
      const saved = JSON.parse(localStorage.getItem("noline:settings") ?? "null");
      if (saved) setSettings((s) => ({ ...s, ...saved }));
    } catch {}
  }, []);
  useEffect(() => localStorage.setItem("noline:basket", JSON.stringify(basket)), [basket]);
  useEffect(() => localStorage.setItem("noline:favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("noline:bookmarks", JSON.stringify(bookmarks)), [bookmarks]);
  useEffect(() => localStorage.setItem("noline:history", JSON.stringify(history.slice(0, 30))), [history]);
  useEffect(() => localStorage.setItem("noline:settings", JSON.stringify(settings)), [settings]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCommandOpen(true); }
      if (e.key === "Escape") { setCommandOpen(false); setAppsOpen(false); setMenuOpen(false); setInspectOpen(false); setCheckoutOpen(false); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeVehicle = getVehicle(vehicleId);
  const basketItems = basket.map(getVehicle);
  const basketTotal = basketItems.reduce((sum, v) => sum + v.price, 0);
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return [
      ...sites.filter((s) => [s.name, s.domain, s.category, s.tagline].join(" ").toLowerCase().includes(q)).map((s) => ({ type: "site" as const, ...s })),
      ...vehicles.filter((v) => [v.name, v.manufacturer, v.brand, v.category, v.className].join(" ").toLowerCase().includes(q)).map((v) => ({ type: "vehicle" as const, ...v })),
    ].slice(0, 10);
  }, [search]);

  function toast(message: string, success = false) {
    setNotice(message); setSuccessToast(success); window.setTimeout(() => setNotice(""), 2200);
  }
  function go(next: Page, nextSite = site) {
    setPage(next); setSite(nextSite); setCommandOpen(false); setAppsOpen(false); setMenuOpen(false);
    const paths: Partial<Record<Page, string>> = {
      home: "noline://home", sites: "noline://sites", history: "noline://history", bookmarks: "noline://bookmarks",
      downloads: "noline://downloads", settings: "noline://settings", diagnostics: "noline://diagnostics", market: "mercury.noline", showroom: getSite(nextSite).domain + "/vehicles",
    };
    if (next !== "vehicle") { setAddress(paths[next] ?? "noline://home"); setDraft(paths[next] ?? "noline://home"); }
  }
  function openSite(id: string) {
    const s = getSite(id); setSite(id); setPage(id === "market" ? "market" : ["ironclad", "aurelion", "vanta", "vector"].includes(id) ? "showroom" : "sites");
    setAddress(s.domain); setDraft(s.domain); setHistory((h) => [s.domain, ...h.filter((x) => x !== s.domain)].slice(0, 30)); setAppsOpen(false); setCommandOpen(false);
  }
  function openVehicle(id: string) {
    const v = getVehicle(id); const host = id === "arashi" ? "ironclad.noline" : "aurelion.noline";
    setVehicleId(id); setSite(id === "arashi" ? "ironclad" : "aurelion"); setPage("vehicle");
    setAddress(`${host}/vehicles/${id}`); setDraft(`${host}/vehicles/${id}`);
    setHistory((h) => [`${host}/vehicles/${id}`, ...h.filter((x) => x !== `${host}/vehicles/${id}`)].slice(0, 30));
  }
  function submitAddress(e: FormEvent) {
    e.preventDefault(); const value = draft.trim(); if (!value) return;
    if (value.toLowerCase() === "cmdrun5") { setCommandOpen(true); setSearch(""); setDraft(""); toast("Command interface opened", true); return; }
    const s = sites.find((x) => x.domain === value || x.id === value || x.name.toLowerCase() === value.toLowerCase());
    if (s) return openSite(s.id);
    const v = vehicles.find((x) => x.id === value.toLowerCase() || x.name.toLowerCase() === value.toLowerCase());
    if (v) return openVehicle(v.id);
    setAddress(value); toast("This address is not registered in NOLINE.");
  }
  function addBasket(id: string) { setBasket((b) => b.includes(id) ? b : [...b, id]); toast(`${getVehicle(id).name} added to basket`, true); }
  function toggleFavorite(id: string) { setFavorites((f) => f.includes(id) ? f.filter((x) => x !== id) : [...f, id]); }
  function toggleBookmark(id: string) { setBookmarks((b) => b.includes(id) ? b.filter((x) => x !== id) : [...b, id]); }
  async function startCheckout(item: Vehicle) {
    await createPurchase({ product: item, quantity: 1, total: item.price, source: "noline-checkout" });
    setCheckoutOpen(true); setPurchaseSuccess(false);
  }

  const title =
    page === "home" ? "The world, connected." :
    page === "sites" ? "NOLINE Services" :
    page === "market" ? "Mercury Market" :
    page === "showroom" ? getSite(site).name :
    page === "vehicle" ? activeVehicle.name :
    page[0].toUpperCase() + page.slice(1);

  return (
    <main className={`browser ${settings.glass ? "" : "no-glass"} ${settings.compact ? "compact" : ""} ${settings.motion ? "" : "no-motion"}`}>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />

      <header className="browser-top">
        <div className="window-controls"><span/><span/><span/></div>
        <button className="brand" onClick={() => go("home")} aria-label="NOLINE"><span>N</span></button>
        <div className="tab-strip">
          <button className="tab active"><Globe2 size={14}/><span>{title}</span><X size={12}/></button>
          <button className="new-tab" onClick={() => go("home")}><Plus size={15}/></button>
        </div>
        <div className="top-tools">
          <button className="icon" onClick={() => setBasketOpen(true)}><ShoppingBag size={16}/>{basket.length > 0 && <b>{basket.length}</b>}</button>
          <button className="icon" onClick={() => setMenuOpen((v) => !v)}><MoreHorizontal size={17}/></button>
        </div>
      </header>

      <section className="browser-toolbar">
        <div className="nav-tools">
          <button className="icon" onClick={() => toast("Back is ready for game navigation.")}><ArrowLeft size={16}/></button>
          <button className="icon" onClick={() => toast("Forward is ready for game navigation.")}><ArrowRight size={16}/></button>
          <button className="icon" onClick={() => toast("Page refreshed", true)}><RefreshCw size={15}/></button>
        </div>
        <form className="address-bar" onSubmit={submitAddress}>
          <LockKeyhole size={13}/><input value={draft} onChange={(e) => { setDraft(e.target.value); setSearch(e.target.value); }} placeholder="Search or enter address"/><button type="button" onClick={() => { setDraft(""); setSearch(""); }}><X size={13}/></button>
        </form>
        <div className="toolbar-actions">
          <button className={`toolbar-pill ${appsOpen ? "selected" : ""}`} onClick={() => setAppsOpen((v) => !v)}><Grid2X2 size={14}/> Services <ChevronDown size={12}/></button>
          <button className="toolbar-pill cmd" onClick={() => setCommandOpen(true)}><Command size={14}/> CMD</button>
        </div>
        {searchResults.length > 0 && draft.trim().toLowerCase() !== "cmdrun5" && (
          <div className="search-popover">
            {searchResults.map((r) => <button key={r.id} onClick={() => r.type === "site" ? openSite(r.id) : openVehicle(r.id)}><span className="result-icon">{r.type === "site" ? r.glyph : r.id === "arashi" ? "ST" : r.brand[0]}</span><span><strong>{r.name}</strong><small>{r.type === "site" ? r.domain : r.manufacturer}</small></span><ArrowRight size={13}/></button>)}
          </div>
        )}
        {appsOpen && <div className="popover apps-popover"><div className="popover-title">NOLINE SERVICES <button onClick={() => setAppsOpen(false)}><X size={14}/></button></div><div className="apps-grid">{apps.map(([id, Icon]) => <button key={id} onClick={() => openSite(id)}><span><Icon size={15}/></span><b>{getSite(id).name}</b><small>{getSite(id).category}</small></button>)}</div></div>}
        {menuOpen && <div className="popover browser-popover">
          <MenuRow icon={History} text="History" onClick={() => go("history")}/><MenuRow icon={Bookmark} text="Bookmarks" onClick={() => go("bookmarks")}/><MenuRow icon={Download} text="Downloads" onClick={() => go("downloads")}/><MenuRow icon={Settings} text="Settings" onClick={() => go("settings")}/><MenuRow icon={Activity} text="Diagnostics" onClick={() => go("diagnostics")}/><div className="divider"/><MenuRow icon={UserRound} text="Account" suffix="Guest — not connected" onClick={() => toast("Account system is intentionally offline.")}/>
        </div>}
      </section>

      <section className="browser-body">
        {page === "home" && <HomePage onMarket={() => go("market")} onSites={() => go("sites")} onVehicle={openVehicle} onSite={openSite}/>}
        {page === "sites" && <Directory onOpen={openSite}/>}
        {page === "market" && <Market onOpen={openVehicle} favorites={favorites} onFavorite={toggleFavorite} onAdd={addBasket}/>}
        {page === "showroom" && <Showroom site={getSite(site)} onOpen={openVehicle} favorites={favorites} onFavorite={toggleFavorite} onAdd={addBasket}/>}
        {page === "vehicle" && <VehiclePage vehicle={activeVehicle} favorite={favorites.includes(activeVehicle.id)} bookmarked={bookmarks.includes(activeVehicle.id)} onBack={() => go("showroom", site)} onFavorite={() => toggleFavorite(activeVehicle.id)} onBookmark={() => toggleBookmark(activeVehicle.id)} onAdd={() => addBasket(activeVehicle.id)} onInspect={() => setInspectOpen(true)} onPurchase={() => startCheckout(activeVehicle)}/>}
        {page === "history" && <UtilityPage kicker="BROWSER" title="History" description="Local browsing history until the game's identity service exists." icon={History}>{history.length ? history.map((h, i) => <button className="utility-row" key={h + i} onClick={() => { setDraft(h); toast(`Ready to open ${h}`); }}><Clock3 size={16}/><span><strong>{h}</strong><small>NOLINE visit</small></span><ExternalLink size={14}/></button>) : <Empty icon={History} title="Nothing here yet." body="Visit a NOLINE service and it will appear here."/>}</UtilityPage>}
        {page === "bookmarks" && <UtilityPage kicker="BROWSER" title="Bookmarks" description="Saved vehicles can be synced to a future profile system." icon={Bookmark}>{bookmarks.length ? bookmarks.map((id) => <button className="utility-row" key={id} onClick={() => openVehicle(id)}><BookmarkCheck size={16}/><span><strong>{getVehicle(id).name}</strong><small>{getVehicle(id).manufacturer} / {getVehicle(id).className}</small></span><ArrowRight size={14}/></button>) : <Empty icon={Bookmark} title="No bookmarks." body="Use the bookmark button on a vehicle inspection page."/>}</UtilityPage>}
        {page === "downloads" && <UtilityPage kicker="BROWSER" title="Downloads" description="A native surface for future receipts, documents and game-generated files." icon={Download}><Empty icon={Download} title="Your downloads are empty." body="Purchase receipts and exported files can appear here later." action="Browse market" onAction={() => go("market")}/></UtilityPage>}
        {page === "settings" && <SettingsPage settings={settings} setSettings={setSettings}/>}
        {page === "diagnostics" && <Diagnostics/>}
      </section>

      {commandOpen && <CommandCenter search={search} setSearch={setSearch} onClose={() => setCommandOpen(false)} onSites={() => go("sites")} onOpenSite={openSite} onMarket={() => go("market")} onShowroom={() => go("showroom", "aurelion")} onHistory={() => go("history")} onBookmarks={() => go("bookmarks")} onSettings={() => go("settings")} onDiagnostics={() => go("diagnostics")} onOpenVehicle={openVehicle}/>}
      {inspectOpen && <Inspector vehicle={activeVehicle} onClose={() => setInspectOpen(false)} onPurchase={() => startCheckout(activeVehicle)}/>}
      {basketOpen && <Basket items={basketItems} total={basketTotal} onClose={() => setBasketOpen(false)} onRemove={(id) => setBasket((b) => b.filter((x) => x !== id))} onContinue={() => basketItems[0] && startCheckout(basketItems[0])}/>}
      {checkoutOpen && <Checkout vehicle={activeVehicle} success={purchaseSuccess} onCancel={() => setCheckoutOpen(false)} onConfirm={async () => { await createPurchase({ product: activeVehicle, quantity: 1, total: activeVehicle.price, source: "noline-confirm" }); setPurchaseSuccess(true); toast("Purchase prepared for game handoff", true); }} onDone={() => { setCheckoutOpen(false); setPurchaseSuccess(false); }}/>}
      {notice && <div className={`toast ${successToast ? "success" : ""}`}><span>{successToast ? <Check size={14}/> : <Info size={14}/>}</span>{notice}</div>}
    </main>
  );
}

function HomePage({ onMarket, onSites, onVehicle, onSite }: { onMarket: () => void; onSites: () => void; onVehicle: (id: string) => void; onSite: (id: string) => void }) {
  return <div className="page home-page">
    <div className="hero">
      <div className="eyebrow"><span className="pulse"/> NOLINE NETWORK / ONLINE</div>
      <h1>The world,<br/><em>connected.</em></h1>
      <p>NOLINE is the city's browser for commerce, mobility, property, finance, travel, news and everything between.</p>
      <div className="actions"><button className="button primary" onClick={onMarket}>Explore Market <ArrowRight size={15}/></button><button className="button secondary" onClick={onSites}>Browse Services <Grid2X2 size={14}/></button></div>
    </div>
    <div className="feature-strip">
      <button onClick={() => onVehicle("arashi")}><span className="strip-art heavy"><b>ST-17</b></span><span><small>FEATURED VEHICLE</small><strong><i>Heavy, ST-17</i> Arashi</strong></span><ArrowRight size={15}/></button>
      <button onClick={() => onSite("signal")}><span className="strip-art signal"><Activity size={17}/></span><span><small>LIVE CITY SIGNAL</small><strong>Markets are moving</strong></span><ArrowRight size={15}/></button>
      <button onClick={onSites}><span className="strip-art cmd"><Command size={17}/></span><span><small>FAST ACCESS</small><strong>Type <b>cmdrun5</b> in the address bar</strong></span><ArrowRight size={15}/></button>
    </div>
    <section className="section"><SectionHead kicker="QUICK ACCESS" title="Jump in." action="View all" onAction={onSites}/><div className="service-grid">{apps.slice(0, 8).map(([id, Icon]) => <button className="service-card" key={id} onClick={() => onSite(id)}><span><Icon size={17}/></span><strong>{getSite(id).name}</strong><small>{getSite(id).tagline}</small><ArrowRight size={13}/></button>)}</div></section>
    <section className="section"><SectionHead kicker="EDITORIAL" title="Worth a look."/><div className="editorial-grid">
      <button className="editorial wide" onClick={() => onVehicle("arashi")}><span className="editorial-art arashi"><b>ST-17</b></span><div><small>IRONCLAD EXCHANGE / KURODA</small><h3><i>Heavy, ST-17</i> Arashi</h3><p>High-mobility engineering with no wasted motion.</p></div></button>
      <button className="editorial" onClick={() => onVehicle("solenne")}><span className="editorial-art solenne"><b>A</b></span><div><small>AURELION MOTORS</small><h3>Solenne GT</h3><p>Performance, elevated.</p></div></button>
      <button className="editorial" onClick={() => onSite("keystone")}><span className="editorial-art keystone"><b>K</b></span><div><small>KEYSTONE ESTATES</small><h3>Build your base.</h3><p>Private spaces, designed around you.</p></div></button>
    </div></section>
    <footer className="footer"><span>NOLINE / CLIENT 0.3</span><span>NO ACCOUNT REQUIRED</span><span>GAME INTEGRATION READY</span></footer>
  </div>;
}

function Directory({ onOpen }: { onOpen: (id: string) => void }) {
  return <div className="page"><PageHead kicker="NOLINE SERVICES" title="Everything is closer." description="A curated directory for the entire city. These sites are front-end ready today and can become game-backed endpoints later."/><div className="directory">{sites.map((s) => <button key={s.id} onClick={() => onOpen(s.id)}><span className="directory-icon">{s.glyph}</span><div><small>{s.category} / {s.domain}</small><h3>{s.name}</h3><p>{s.tagline}</p></div><ArrowRight size={16}/></button>)}</div></div>;
}

function Market({ onOpen, favorites, onFavorite, onAdd }: { onOpen: (id: string) => void; favorites: string[]; onFavorite: (id: string) => void; onAdd: (id: string) => void }) {
  return <div className="page"><PageHead kicker="MERCURY MARKET" title="Objects with purpose." description="A full storefront surface with inspect pages, favorites, basket, checkout and game-ready purchase hooks."/><div className="market-banner"><div><span>CURATED DROP / 04</span><h2>Move through the city.</h2><p>Four featured machines. Deep inspection built in.</p></div><span className="banner-mark"><ShoppingBag size={24}/></span></div><div className="vehicle-grid">{vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} onOpen={onOpen} favorite={favorites.includes(v.id)} onFavorite={onFavorite} onAdd={onAdd}/>)}</div></div>;
}

function Showroom({ site, onOpen, favorites, onFavorite, onAdd }: { site: Site; onOpen: (id: string) => void; favorites: string[]; onFavorite: (id: string) => void; onAdd: (id: string) => void }) {
  const list = site.id === "ironclad" ? vehicles.filter((v) => v.id === "arashi") : vehicles.filter((v) => v.category === "Automotive");
  return <div className="page"><PageHead kicker={site.category.toUpperCase()} title={site.name} description={site.description}/><div className="showroom-hero"><div><span>{site.tagline}</span><h2>Choose the machine that fits the moment.</h2><p>Every listing opens into a dedicated inspection page with manufacturer data, specs, options and checkout.</p></div><div className="showroom-mark">{site.glyph}</div></div><div className="vehicle-grid">{list.map((v) => <VehicleCard key={v.id} vehicle={v} onOpen={onOpen} favorite={favorites.includes(v.id)} onFavorite={onFavorite} onAdd={onAdd}/>)}</div></div>;
}

function VehicleCard({ vehicle, onOpen, favorite, onFavorite, onAdd }: { vehicle: Vehicle; onOpen: (id: string) => void; favorite: boolean; onFavorite: (id: string) => void; onAdd: (id: string) => void }) {
  return <article className="vehicle-card"><button className="vehicle-art" onClick={() => onOpen(vehicle.id)}><div className={`machine ${vehicle.id === "arashi" ? "machine-heavy" : "machine-luxe"}`}><span>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</span></div>{vehicle.featured && <b className="feature-tag">FEATURED</b>}</button><div className="vehicle-info"><div><small>{vehicle.manufacturer} / {vehicle.className}</small><h3><VehicleName vehicle={vehicle}/></h3><p>{vehicle.tagline}</p></div><strong>{money(vehicle.price)}</strong></div><div className="vehicle-actions"><button className={`round-action ${favorite ? "liked" : ""}`} onClick={() => onFavorite(vehicle.id)}><Heart size={14} fill={favorite ? "currentColor" : "none"}/></button><button className="button dark" onClick={() => onOpen(vehicle.id)}>Inspect <Info size={13}/></button><button className="button blue" onClick={() => onAdd(vehicle.id)}>Add <Plus size={13}/></button></div></article>;
}

function VehiclePage({ vehicle, favorite, bookmarked, onBack, onFavorite, onBookmark, onAdd, onInspect, onPurchase }: { vehicle: Vehicle; favorite: boolean; bookmarked: boolean; onBack: () => void; onFavorite: () => void; onBookmark: () => void; onAdd: () => void; onInspect: () => void; onPurchase: () => void }) {
  return <div className="vehicle-page">
    <div className="vehicle-top"><button className="back-link" onClick={onBack}><ArrowLeft size={14}/> Back to showroom</button><div className="detail-tools"><button onClick={onBookmark}>{bookmarked ? <BookmarkCheck size={15}/> : <Bookmark size={15}/>}</button><button onClick={onFavorite}>{favorite ? <Heart size={15} fill="currentColor"/> : <Heart size={15}/>}</button><button onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => undefined).catch(() => undefined)}><Copy size={15}/></button></div></div>
    <div className="vehicle-hero"><div className="hero-machine-stage"><div className={`hero-machine ${vehicle.id === "arashi" ? "heavy-machine" : "luxe-machine"}`}><span>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</span></div><div className="stage-badge"><span className="pulse"/> {vehicle.status}</div></div><div className="vehicle-copy"><span className="kicker">{vehicle.manufacturer} / {vehicle.className}</span><h1><VehicleName vehicle={vehicle}/></h1><p className="lead">{vehicle.tagline}</p><p>{vehicle.description}</p><div className="price"><span>Starting at</span><strong>{money(vehicle.price)}</strong></div><div className="actions"><button className="button blue large" onClick={onPurchase}>Purchase <ArrowRight size={15}/></button><button className="button secondary large" onClick={onAdd}>Add to basket <ShoppingBag size={14}/></button><button className="inspect-link" onClick={onInspect}><CircleHelp size={14}/> Full inspection</button></div></div></div>
    <div className="spec-grid">{vehicle.stats.map((s) => <div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}</div>
    <div className="detail-columns"><section className="detail-panel"><span className="kicker">ENGINEERING</span><h2>Built around the machine.</h2>{vehicle.features.map((f) => <div className="feature-line" key={f}><Check size={14}/><span>{f}</span></div>)}</section><section className="detail-panel"><span className="kicker">OWNERSHIP</span><h2>Ready when you are.</h2><Ownership label="Availability" value={vehicle.status}/><Ownership label="Delivery" value={vehicle.delivery}/><Ownership label="Inspection" value="Full digital report"/><Ownership label="Warranty" value="Game-configurable"/></section></div>
    <div className="manufacturer-bar"><span>MANUFACTURER</span><b>{vehicle.manufacturer}</b><span>CATALOG ID</span><b>NOLINE-{vehicle.id.toUpperCase()}</b><span>MODEL CLASS</span><b>{vehicle.className}</b></div>
  </div>;
}

function Ownership({ label, value }: { label: string; value: string }) { return <div className="ownership"><span>{label}</span><strong>{value}</strong></div>; }

function Inspector({ vehicle, onClose, onPurchase }: { vehicle: Vehicle; onClose: () => void; onPurchase: () => void }) {
  const [color, setColor] = useState(vehicle.colors[0]);
  return <div className="modal-backdrop" onMouseDown={(e) => e.currentTarget === e.target && onClose()}><div className="inspector"><div className="modal-head"><div><span className="kicker">DIGITAL INSPECTION / {vehicle.manufacturer}</span><h2><VehicleName vehicle={vehicle}/></h2></div><button onClick={onClose}><X size={18}/></button></div><div className="inspection-stage"><div className={`inspection-machine ${vehicle.id === "arashi" ? "heavy-machine" : "luxe-machine"}`} style={{ "--machine-color": color } as CSSProperties}><span>{vehicle.id === "arashi" ? "ST-17" : vehicle.brand}</span></div><div className="inspection-readout"><span>LIVE SPEC VIEW</span><b>{vehicle.status}</b></div></div><div className="inspection-meta">{vehicle.stats.map((s) => <div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}</div><div className="color-row"><div><span>Factory finish</span><small>{color}</small></div><div className="swatches">{vehicle.colors.map((c) => <button key={c} style={{ background: c }} className={color === c ? "selected" : ""} onClick={() => setColor(c)}/>)}</div></div><div className="inspection-features">{vehicle.features.map((f, i) => <div key={f} style={{ animationDelay: `${i * 35}ms` }}><Check size={13}/>{f}</div>)}</div><div className="modal-footer"><div><span>Total</span><strong>{money(vehicle.price)}</strong></div><button className="button blue" onClick={onPurchase}>Purchase vehicle <ArrowRight size={15}/></button></div></div></div>;
}

function Checkout({ vehicle, success, onCancel, onConfirm, onDone }: { vehicle: Vehicle; success: boolean; onCancel: () => void; onConfirm: () => Promise<void>; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  async function confirm() { setBusy(true); await new Promise((r) => setTimeout(r, 560)); await onConfirm(); setBusy(false); }
  return <div className="modal-backdrop"><div className={`checkout ${success ? "checkout-success" : ""}`}>{!success ? <><div className="checkout-emblem">{vehicle.id === "arashi" ? "ST" : vehicle.brand[0]}</div><span className="kicker">SECURE CHECKOUT</span><h2>Confirm your order.</h2><p><VehicleName vehicle={vehicle}/></p><div className="checkout-lines"><Ownership label="Vehicle" value={money(vehicle.price)}/><Ownership label="Delivery" value={vehicle.delivery}/><Ownership label="Status" value="Game handoff ready"/></div><button className={`button blue full ${busy ? "busy" : ""}`} disabled={busy} onClick={confirm}>{busy ? <><RefreshCw size={15} className="spin"/> Preparing order…</> : <>Confirm purchase <ArrowRight size={15}/></>}</button><button className="cancel" onClick={onCancel}>Not now</button></> : <><div className="success-orb"><Check size={28}/></div><span className="kicker">ORDER READY</span><h2>You're all set.</h2><p>The transaction surface is complete. Your future server-side economy can take over the authoritative purchase step here.</p><div className="receipt"><Ownership label="Item" value={vehicle.name}/><Ownership label="Manufacturer" value={vehicle.manufacturer}/><Ownership label="Total" value={money(vehicle.price)}/><Ownership label="Status" value="INTEGRATION READY"/></div><button className="button blue full" onClick={onDone}>Done</button></>}</div></div>;
}

function Basket({ items, total, onClose, onRemove, onContinue }: { items: Vehicle[]; total: number; onClose: () => void; onRemove: (id: string) => void; onContinue: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(e) => e.currentTarget === e.target && onClose()}><aside className="basket-drawer"><div className="modal-head"><div><span className="kicker">BASKET</span><h2>Your order</h2></div><button onClick={onClose}><X size={18}/></button></div><div className="basket-list">{items.length ? items.map((v) => <div className="basket-row" key={v.id}><div className="basket-art">{v.id === "arashi" ? "ST" : v.brand[0]}</div><div><strong>{v.name}</strong><small>{v.manufacturer}</small></div><b>{money(v.price)}</b><button onClick={() => onRemove(v.id)}><Trash2 size={13}/></button></div>) : <Empty icon={ShoppingBag} title="Your basket is empty." body="Add a vehicle to begin."/ >}</div><div className="basket-total"><Ownership label="Subtotal" value={money(total)}/><Ownership label="Delivery" value="Calculated by the game"/><button className="button blue full" disabled={!items.length} onClick={onContinue}>Continue <ArrowRight size={15}/></button><small>Currency, inventory and ownership remain game-authoritative.</small></div></aside></div>;
}

function CommandCenter({ search, setSearch, onClose, onSites, onOpenSite, onMarket, onShowroom, onHistory, onBookmarks, onSettings, onDiagnostics, onOpenVehicle }: { search: string; setSearch: (v: string) => void; onClose: () => void; onSites: () => void; onOpenSite: (id: string) => void; onMarket: () => void; onShowroom: () => void; onHistory: () => void; onBookmarks: () => void; onSettings: () => void; onDiagnostics: () => void; onOpenVehicle: (id: string) => void }) {
  const q = search.trim().toLowerCase();
  const results = [
    ...sites.filter((s) => [s.name, s.domain, s.category, s.tagline].join(" ").toLowerCase().includes(q)).map((s) => ({ type: "site" as const, id: s.id, title: s.name, sub: s.domain, glyph: s.glyph })),
    ...vehicles.filter((v) => [v.name, v.manufacturer, v.className].join(" ").toLowerCase().includes(q)).map((v) => ({ type: "vehicle" as const, id: v.id, title: v.name, sub: v.manufacturer, glyph: v.id === "arashi" ? "ST" : v.brand[0] })),
  ];
  return <div className="modal-backdrop command-layer" onMouseDown={(e) => e.currentTarget === e.target && onClose()}><div className="command-center"><div className="modal-head"><div><span className="kicker">NOLINE COMMAND</span><h2>Find anything.</h2></div><button onClick={onClose}><X size={17}/></button></div><div className="command-search"><Search size={17}/><input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services, vehicles or commands…"/><kbd>ESC</kbd></div>{!q ? <><div className="command-label">SHORTCUTS</div><div className="command-grid"><CommandTile icon={Grid2X2} title="All services" hint="Browse the network" onClick={onSites}/><CommandTile icon={ShoppingBag} title="Marketplace" hint="Shop the city" onClick={onMarket}/><CommandTile icon={Car} title="Vehicle showroom" hint="Inspect machines" onClick={onShowroom}/><CommandTile icon={History} title="History" hint="Recent browsing" onClick={onHistory}/><CommandTile icon={Bookmark} title="Bookmarks" hint="Saved vehicles" onClick={onBookmarks}/><CommandTile icon={Settings} title="Settings" hint="Tune the browser" onClick={onSettings}/><CommandTile icon={Activity} title="Diagnostics" hint="System status" onClick={onDiagnostics}/><CommandTile icon={KeyboardIcon} title="cmdrun5" hint="Open this interface from the address bar" onClick={() => onClose()}/></div><div className="command-foot"><span><kbd>⌘ K</kbd> Command</span><span><kbd>ESC</kbd> Close</span></div></> : <div className="command-results">{results.length ? results.map((r) => <button key={r.type + r.id} onClick={() => r.type === "site" ? onOpenSite(r.id) : onOpenVehicle(r.id)}><span className="result-icon">{r.glyph}</span><span><strong>{r.title}</strong><small>{r.sub}</small></span><ArrowRight size={14}/></button>) : <Empty icon={Search} title="No results." body={`Nothing matches “${search}”.`}/>}</div>}</div></div>;
}

function KeyboardIcon({ size }: { size?: number }) { return <span style={{ display: "inline-flex" }}><Command size={size ?? 16}/></span>; }

function CommandTile({ icon: Icon, title, hint, onClick }: { icon: ElementType; title: string; hint: string; onClick: () => void }) { return <button className="command-tile" onClick={onClick}><span><Icon size={16}/></span><strong>{title}</strong><small>{hint}</small><ArrowRight size={13}/></button>; }
function MenuRow({ icon: Icon, text, suffix, onClick }: { icon: ElementType; text: string; suffix?: string; onClick: () => void }) { return <button className="menu-row" onClick={onClick}><Icon size={15}/><span>{text}</span>{suffix && <small>{suffix}</small>}<ArrowRight size={13}/></button>; }
function SectionHead({ kicker, title, action, onAction }: { kicker: string; title: string; action?: string; onAction?: () => void }) { return <div className="section-head"><div><span className="kicker">{kicker}</span><h2>{title}</h2></div>{action && onAction && <button className="text-link" onClick={onAction}>{action}<ArrowRight size={13}/></button>}</div>; }
function PageHead({ kicker, title, description }: { kicker: string; title: string; description: string }) { return <div className="page-head"><span className="kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div>; }
function UtilityPage({ kicker, title, description, icon: Icon, children }: { kicker: string; title: string; description: string; icon: ElementType; children: ReactNode }) { return <div className="page"><PageHead kicker={kicker} title={title} description={description}/><div className="utility-card"><div className="utility-icon"><Icon size={18}/></div>{children}</div></div>; }
function Empty({ icon: Icon, title, body, action, onAction }: { icon: ElementType; title: string; body: string; action?: string; onAction?: () => void }) { return <div className="empty"><span><Icon size={21}/></span><h3>{title}</h3><p>{body}</p>{action && onAction && <button className="button primary" onClick={onAction}>{action}<ArrowRight size={14}/></button>}</div>; }
function SettingsPage({ settings, setSettings }: { settings: { motion: boolean; glass: boolean; compact: boolean }; setSettings: Dispatch<SetStateAction<{ motion: boolean; glass: boolean; compact: boolean }>> }) { return <div className="page"><PageHead kicker="BROWSER" title="Settings" description="Local now. Profile-backed later."/><div className="settings-card"><Setting icon={Sparkles} title="Motion" desc="Smooth transitions and purchase effects." on={settings.motion} toggle={() => setSettings((s) => ({ ...s, motion: !s.motion }))}/><Setting icon={Laptop} title="Liquid glass" desc="Layered translucent browser chrome." on={settings.glass} toggle={() => setSettings((s) => ({ ...s, glass: !s.glass }))}/><Setting icon={SlidersHorizontal} title="Compact mode" desc="Tighter spacing for smaller screens." on={settings.compact} toggle={() => setSettings((s) => ({ ...s, compact: !s.compact }))}/><div className="settings-note"><Info size={14}/> NOLINE intentionally has no account system yet.</div></div></div>; }
function Setting({ icon: Icon, title, desc, on, toggle }: { icon: ElementType; title: string; desc: string; on: boolean; toggle: () => void }) { return <div className="setting"><span className="setting-icon"><Icon size={16}/></span><div><strong>{title}</strong><p>{desc}</p></div><button className={`switch ${on ? "on" : ""}`} onClick={toggle}><span/></button></div>; }
function Diagnostics() { return <div className="page"><PageHead kicker="NOLINE / INTERNAL" title="Diagnostics" description="A browser-side health panel for future game integration."/><div className="diag-grid"><Diag label="Browser shell" value="Operational"/><Diag label="Local storage" value="Available"/><Diag label="Account service" value="Not connected"/><Diag label="Game bridge" value="Awaiting game"/><Diag label="Catalog" value={`${vehicles.length} vehicles / ${sites.length} services`}/><Diag label="Checkout" value="Adapter ready"/></div><div className="diag-log"><div><span/> UI initialized</div><div><span/> Identity layer intentionally disabled</div><div><span/> Local persistence enabled</div><div><span/> Purchase calls routed through integration boundary</div></div></div>; }
function Diag({ label, value }: { label: string; value: string }) { return <div className="diag"><span>{label}</span><strong>{value}</strong><small className={value === "Operational" || value === "Available" || value === "Adapter ready" ? "good" : ""}>{value === "Operational" || value === "Available" || value === "Adapter ready" ? "READY" : "STATUS"}</small></div>; }

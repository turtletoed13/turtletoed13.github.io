"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BrowserChrome } from "./BrowserChrome";
import { CommandCenter } from "./CommandCenter";
import { BasketDrawer } from "./BasketDrawer";
import { CheckoutModal } from "./CheckoutModal";
import { VehicleInspector } from "../catalog/VehicleInspector";
import { VehicleDetail } from "../catalog/VehicleDetail";
import { HomePage } from "../pages/HomePage";
import { ServicesPage } from "../pages/ServicesPage";
import { MarketPage } from "../pages/MarketPage";
import { ShowroomPage } from "../pages/ShowroomPage";
import { SitePage } from "../pages/SitePage";
import { HistoryPage, BookmarksPage, DownloadsPage, SettingsPage, DiagnosticsPage } from "../pages/UtilityPages";
import { sites } from "../../data/sites";
import { getSiteById } from "../../data/site-queries";
import { browserRoutes } from "../../data/navigation";
import { getVehicleById, vehicles } from "../../data/vehicle-queries";
import { ConfigBrowserPage } from "../pages/ConfigBrowserPage";

export type BrowserPage =
  | "home" | "services" | "market" | "sale" | "full-price" | "special"
  | "showroom" | "site" | "vehicle" | "history" | "bookmarks" | "downloads"
  | "settings" | "config" | "diagnostics";

const internalByAddress: Record<string, BrowserPage> = {
  "noline://home": "home",
  "noline://services": "services",
  "mercury.noline": "market",
  "noline://catalog/sale": "sale",
  "noline://catalog/full-price": "full-price",
  "noline://catalog/special": "special",
  "aurelion.noline": "showroom",
  "aurelion.noline/vehicles": "showroom",
  "ironclad.noline": "showroom",
  "vanta.noline": "showroom",
  "noline://history": "history",
  "noline://bookmarks": "bookmarks",
  "noline://downloads": "downloads",
  "noline://settings": "settings",
  "noline://config": "config",
  "noline://diagnostics": "diagnostics",
};

export function NolineBrowser() {
  const [page, setPage] = useState<BrowserPage>("home");
  const [siteId, setSiteId] = useState("aurelion");
  const [vehicleId, setVehicleId] = useState("arashi");
  const [address, setAddress] = useState(browserRoutes.home);
  const [draft, setDraft] = useState(browserRoutes.home);
  const [commandOpen, setCommandOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [checkoutVehicle, setCheckoutVehicle] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [basket, setBasket] = useState<string[]>([]);
  const [settings, setSettings] = useState({ motion: true, glass: true, compact: false });
  const [notice, setNotice] = useState("");
  const [noticeGood, setNoticeGood] = useState(false);
  const [addressSearch, setAddressSearch] = useState("");

  useEffect(() => {
    try {
      const read = (key: string) => JSON.parse(localStorage.getItem(key) ?? "[]");
      setFavorites(read("noline:favorites"));
      setBookmarks(read("noline:bookmarks"));
      setHistory(read("noline:history"));
      setBasket(read("noline:basket"));
      const saved = JSON.parse(localStorage.getItem("noline:settings") ?? "null");
      if (saved) setSettings((current) => ({ ...current, ...saved }));
    } catch {}
  }, []);

  useEffect(() => localStorage.setItem("noline:favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("noline:bookmarks", JSON.stringify(bookmarks)), [bookmarks]);
  useEffect(() => localStorage.setItem("noline:history", JSON.stringify(history.slice(0, 30))), [history]);
  useEffect(() => localStorage.setItem("noline:basket", JSON.stringify(basket)), [basket]);
  useEffect(() => localStorage.setItem("noline:settings", JSON.stringify(settings)), [settings]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setAppsOpen(false);
        setMenuOpen(false);
        setInspectOpen(false);
        setBasketOpen(false);
        setCheckoutVehicle(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeVehicle = getVehicleById(vehicleId);
  const activeSite = getSiteById(siteId);
  const basketItems = basket.map(getVehicleById);

  function flash(message: string, good = false) {
    setNotice(message);
    setNoticeGood(good);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function record(url: string) {
    setHistory((current) => [url, ...current.filter((item) => item !== url)].slice(0, 30));
  }

  function setLocation(nextPage: BrowserPage, nextAddress: string, nextSite = siteId) {
    setPage(nextPage);
    setSiteId(nextSite);
    setAddress(nextAddress);
    setDraft(nextAddress);
    setAppsOpen(false);
    setMenuOpen(false);
    setCommandOpen(false);
    record(nextAddress);
  }

  function openSite(id: string) {
    const site = getSiteById(id);
    if (["aurelion", "ironclad", "vanta"].includes(id)) {
      setLocation(id === "ironclad" ? "showroom" : "showroom", site.domain + (id === "aurelion" ? "/vehicles" : ""), id);
      return;
    }
    setLocation("site", site.domain, id);
  }

  function openVehicle(id: string) {
    const vehicle = getVehicleById(id);
    const host = id === "arashi" ? "ironclad.noline" : "aurelion.noline";
    setVehicleId(vehicle.id);
    setSiteId(id === "arashi" ? "ironclad" : "aurelion");
    setPage("vehicle");
    const next = host + "/vehicles/" + vehicle.id;
    setAddress(next);
    setDraft(next);
    record(next);
    setCommandOpen(false);
    setAppsOpen(false);
  }

  function navigateInternal(next: BrowserPage) {
    const map: Record<Exclude<BrowserPage, "vehicle" | "site">, string> = {
      home: browserRoutes.home,
      services: browserRoutes.services,
      market: browserRoutes.market,
      sale: browserRoutes.sale,
      "full-price": browserRoutes.fullPrice,
      special: browserRoutes.special,
      showroom: browserRoutes.showroom,
      history: browserRoutes.history,
      bookmarks: browserRoutes.bookmarks,
      downloads: browserRoutes.downloads,
      settings: browserRoutes.settings,
      config: browserRoutes.config,
      diagnostics: browserRoutes.diagnostics,
    };
    setLocation(next, map[next]);
  }

  function submitAddress(valueOverride?: string, event?: FormEvent) {
    event?.preventDefault();
    const value = (valueOverride ?? draft).trim();
    if (!value) return;
    setAddressSearch("");
    if (value.toLowerCase() === "cmdrun5") {
      setCommandOpen(true);
      setDraft("");
      flash("Command interface opened", true);
      return;
    }
    if (value.toLowerCase() === "noline://config") {
      navigateInternal("config");
      return;
    }
    const route = internalByAddress[value.toLowerCase()];
    if (route) {
      navigateInternal(route);
      return;
    }
    const site = sites.find((item) => item.domain.toLowerCase() === value.toLowerCase() || item.id === value.toLowerCase() || item.name.toLowerCase() === value.toLowerCase());
    if (site) {
      openSite(site.id);
      return;
    }
    const vehicle = vehicles.find((item) => item.id === value.toLowerCase() || item.name.toLowerCase() === value.toLowerCase() || item.catalogId.toLowerCase() === value.toLowerCase());
    if (vehicle) {
      openVehicle(vehicle.id);
      return;
    }
    setAddress(value);
    flash("That address is not registered in NOLINE.");
  }

  function addVehicle(id: string) {
    if (basket.includes(id)) {
      flash("Already in your basket.");
      return;
    }
    setBasket((current) => [...current, id]);
    flash("Added to basket", true);
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleBookmark(id: string) {
    setBookmarks((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  const title =
    page === "home" ? "The world, connected." :
    page === "services" ? "NOLINE Services" :
    page === "market" ? "Mercury Market" :
    page === "sale" ? "On sale" :
    page === "full-price" ? "Full price" :
    page === "special" ? "Special vehicles" :
    page === "showroom" ? activeSite.name :
    page === "site" ? activeSite.name :
    page === "vehicle" ? activeVehicle.name :
    page === "config" ? "NOLINE Configuration" :
    page[0].toUpperCase() + page.slice(1);

  return <main className={`browser ${settings.glass ? "" : "no-glass"} ${settings.compact ? "compact" : ""} ${settings.motion ? "" : "no-motion"}`}>
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <BrowserChrome title={title} address={draft} onAddressChange={(value) => { setDraft(value); setAddressSearch(value); }} onSubmit={(value) => submitAddress(value)} appsOpen={appsOpen} setAppsOpen={setAppsOpen} menuOpen={menuOpen} setMenuOpen={setMenuOpen} basketCount={basket.length} onBasket={() => setBasketOpen(true)} onCommand={() => setCommandOpen(true)} onRoute={navigateInternal} onRefresh={() => flash("Page refreshed", true)}/>

    <section className="browser-body">
      {page === "home" && <HomePage onMarket={() => navigateInternal("market")} onServices={() => navigateInternal("services")} onVehicle={() => openVehicle("arashi")} onSite={openSite}/>}
      {page === "services" && <ServicesPage onOpen={openSite}/>}
      {page === "market" && <MarketPage favorites={favorites} onFavorite={toggleFavorite} onOpenVehicle={openVehicle} onAdd={addVehicle} onService={(id) => flash("Service request staged for game integration.", true)} initialFilter="all"/>}
      {page === "sale" && <MarketPage favorites={favorites} onFavorite={toggleFavorite} onOpenVehicle={openVehicle} onAdd={addVehicle} onService={(id) => flash("Service request staged for game integration.", true)} initialFilter="sale"/>}
      {page === "full-price" && <MarketPage favorites={favorites} onFavorite={toggleFavorite} onOpenVehicle={openVehicle} onAdd={addVehicle} onService={(id) => flash("Service request staged for game integration.", true)} initialFilter="full"/>}
      {page === "special" && <MarketPage favorites={favorites} onFavorite={toggleFavorite} onOpenVehicle={openVehicle} onAdd={addVehicle} onService={(id) => flash("Service request staged for game integration.", true)} initialFilter="special"/>}
      {page === "showroom" && <ShowroomPage mode={siteId === "ironclad" ? "heavy" : siteId === "vanta" ? "special" : "luxury"} favorites={favorites} onFavorite={toggleFavorite} onOpenVehicle={openVehicle} onAdd={addVehicle}/>}
      {page === "site" && <SitePage site={activeSite} onOpenShowroom={() => setLocation("showroom", activeSite.domain + "/vehicles")} onMarket={() => navigateInternal("market")}/>}
      {page === "vehicle" && <VehicleDetail vehicle={activeVehicle} favorite={favorites.includes(activeVehicle.id)} bookmarked={bookmarks.includes(activeVehicle.id)} onBack={() => navigateInternal("showroom")} onFavorite={() => toggleFavorite(activeVehicle.id)} onBookmark={() => toggleBookmark(activeVehicle.id)} onInspect={() => setInspectOpen(true)} onPurchase={() => setCheckoutVehicle(activeVehicle.id)} onAdd={() => addVehicle(activeVehicle.id)}/>}
      {page === "history" && <HistoryPage items={history} onOpen={(url) => { setDraft(url); submitAddress(url); }}/>}
      {page === "bookmarks" && <BookmarksPage items={bookmarks} onOpen={openVehicle}/>}
      {page === "downloads" && <DownloadsPage/>}
      {page === "settings" && <SettingsPage settings={settings} setSettings={setSettings}/>}
      {page === "config" && <ConfigBrowserPage/>}
      {page === "diagnostics" && <DiagnosticsPage/>}
    </section>

    {commandOpen && <CommandCenter search={addressSearch} setSearch={setAddressSearch} onClose={() => setCommandOpen(false)} onSite={openSite} onPage={navigateInternal} onVehicle={openVehicle}/>}
    {inspectOpen && <VehicleInspector vehicle={activeVehicle} onClose={() => setInspectOpen(false)} onPurchase={() => { setInspectOpen(false); setCheckoutVehicle(activeVehicle.id); }}/>}
    {basketOpen && <BasketDrawer items={basketItems} onClose={() => setBasketOpen(false)} onRemove={(id) => setBasket((current) => current.filter((item) => item !== id))} onCheckout={(vehicle) => { setBasketOpen(false); setCheckoutVehicle(vehicle.id); }}/>}
    {checkoutVehicle && <CheckoutModal vehicle={getVehicleById(checkoutVehicle)} onClose={() => setCheckoutVehicle(null)}/>}
    {notice && <div className={`toast ${noticeGood ? "success" : ""}`}><span>{noticeGood ? "✓" : "i"}</span>{notice}</div>}
  </main>;
}

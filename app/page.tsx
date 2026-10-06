"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock3,
  Globe2,
  LockKeyhole,
  Plus,
  RotateCw,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";

type Site = {
  id: string;
  name: string;
  domain: string;
  category: string;
  description: string;
  accent: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  featured?: boolean;
};

const sites: Site[] = [
  { id: "noline", name: "NOLINE", domain: "noline://home", category: "Home", description: "Your private in-world gateway.", accent: "#f2f2f2" },
  { id: "market", name: "NOLINE Market", domain: "market.noline", category: "Commerce", description: "Browse products and services.", accent: "#b9ffce" },
  { id: "motors", name: "Apex Motors", domain: "apexmotors.noline", category: "Motors", description: "Vehicles, upgrades and parts.", accent: "#b9c7ff" },
  { id: "property", name: "Northstar Properties", domain: "northstar.noline", category: "Property", description: "Browse premium properties.", accent: "#ffd6a8" },
  { id: "finance", name: "Civic Finance", domain: "civic.noline", category: "Finance", description: "Financial services for the future.", accent: "#b7f6ff" },
  { id: "travel", name: "NoLine Travel", domain: "travel.noline", category: "Travel", description: "Tickets, hotels and destinations.", accent: "#d5c5ff" },
];

const products: Product[] = [
  { id: "nline-pass", name: "NOLINE Pass", description: "Priority access across participating services.", price: 1200, category: "Services", featured: true },
  { id: "apex-service", name: "Apex Service Package", description: "Full service package for your next vehicle.", price: 850, category: "Motors" },
  { id: "northstar-suite", name: "Northstar Residence Suite", description: "Premium residence package.", price: 12500, category: "Property", featured: true },
  { id: "travel-card", name: "Travel Credit", description: "Flexible travel credit for supported destinations.", price: 2500, category: "Travel" },
];

function money(value: number) {
  return "$" + value.toLocaleString("en-US");
}

export default function Noline() {
  const [tabs, setTabs] = useState(["noline"]);
  const [activeTab, setActiveTab] = useState("noline");
  const [address, setAddress] = useState("noline://home");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showApps, setShowApps] = useState(false);
  const [category, setCategory] = useState("All");
  const [notice, setNotice] = useState("");

  const activeSite = sites.find((site) => site.id === activeTab) ?? sites[0];

  const filteredProducts = useMemo(
    () => products.filter((product) => category === "All" || product.category === category),
    [category],
  );

  const cartProducts = cart.map((id) => products.find((product) => product.id === id)).filter(Boolean) as Product[];
  const total = cartProducts.reduce((sum, product) => sum + product.price, 0);

  function openSite(site: Site) {
    setActiveTab(site.id);
    setAddress(site.domain);
    setShowApps(false);
  }

  function newTab() {
    const id = `tab-${Date.now()}`;
    setTabs((current) => [...current, id]);
    setActiveTab(id);
    setAddress("");
  }

  function closeTab(id: string) {
    if (tabs.length === 1) return;
    const next = tabs.filter((tab) => tab !== id);
    setTabs(next);
    if (activeTab === id) setActiveTab(next[Math.max(0, next.length - 1)]);
  }

  function submitAddress(value: string) {
    const clean = value.trim();
    if (!clean) return;
    const matched = sites.find((site) => site.domain === clean || site.id === clean || site.name.toLowerCase() === clean.toLowerCase());
    if (matched) {
      openSite(matched);
      return;
    }
    setAddress(clean.startsWith("http") ? clean : `https://${clean}`);
    setNotice("External navigation is reserved for the game integration.");
    window.setTimeout(() => setNotice(""), 2600);
  }

  function addToCart(product: Product) {
    setCart((current) => current.includes(product.id) ? current : [...current, product.id]);
    setNotice(`${product.name} added to basket`);
    window.setTimeout(() => setNotice(""), 1800);
  }

  return (
    <main className="browser">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="chrome">
        <div className="traffic">
          <span />
          <span />
          <span />
        </div>

        <div className="brand-mark">N</div>

        <div className="tabs">
          {tabs.map((tab, index) => (
            <button key={tab} className={activeTab === tab ? "tab active" : "tab"} onClick={() => setActiveTab(tab)}>
              <Globe2 size={13} />
              <span>{tab === "noline" ? "NOLINE" : tab.startsWith("tab-") ? "New Tab" : activeSite.name}</span>
              {tabs.length > 1 && <X size={12} onClick={(event) => { event.stopPropagation(); closeTab(tab); }} />}
            </button>
          ))}
          <button className="new-tab" onClick={newTab} aria-label="New tab"><Plus size={16} /></button>
        </div>

        <div className="chrome-actions">
          <button onClick={() => setShowCart(true)} className="icon-button cart-button">
            <ShoppingBag size={17} />
            {cart.length > 0 && <b>{cart.length}</b>}
          </button>
          <button className="avatar">N</button>
        </div>
      </header>

      <section className="toolbar">
        <div className="nav-actions">
          <button><ArrowLeft size={17} /></button>
          <button><ArrowRight size={17} /></button>
          <button><RotateCw size={16} /></button>
        </div>

        <form className="address-bar" onSubmit={(event) => { event.preventDefault(); submitAddress(address); }}>
          <LockKeyhole size={14} />
          <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Search or enter address" />
          <button type="button" onClick={() => setAddress("")} className="address-clear"><X size={13} /></button>
        </form>

        <button className="apps-button" onClick={() => setShowApps((value) => !value)}>
          <Sparkles size={15} /> Apps <ChevronDown size={14} />
        </button>

        {showApps && (
          <div className="apps-menu">
            <div className="menu-heading">NOLINE SERVICES</div>
            {sites.slice(1).map((site) => (
              <button key={site.id} onClick={() => openSite(site)}>
                <span className="site-icon" style={{ color: site.accent }}><Globe2 size={15} /></span>
                <span><strong>{site.name}</strong><small>{site.domain}</small></span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="viewport">
        {activeTab !== "noline" && !activeTab.startsWith("tab-") ? (
          <div className="site-page">
            <div className="site-topline"><span>{activeSite.category}</span><span>{activeSite.domain}</span></div>
            <h1>{activeSite.name}</h1>
            <p>{activeSite.description}</p>
            <div className="site-card-grid">
              <div className="feature-card large" style={{ "--accent": activeSite.accent } as React.CSSProperties}>
                <span>FEATURED</span>
                <h2>Built for the world inside your game.</h2>
                <p>This is a plug-in browser surface. Replace the catalog and handlers when your game backend is ready.</p>
                <button onClick={() => openSite(sites.find((site) => site.id === "market")!)}>Open Market</button>
              </div>
              <div className="feature-card">
                <Clock3 size={18} />
                <h3>Recent activity</h3>
                <p>No account required. Local browser state only.</p>
              </div>
              <div className="feature-card">
                <Star size={18} />
                <h3>Saved services</h3>
                <p>Your favorites can later be synced to the game account layer.</p>
              </div>
            </div>
          </div>
        ) : activeTab.startsWith("tab-") ? (
          <div className="newtab">
            <div className="newtab-inner">
              <div className="wordmark">NOLINE</div>
              <p>THE WORLD, CONNECTED.</p>
              <form onSubmit={(event) => { event.preventDefault(); submitAddress(query); }} className="hero-search">
                <Search size={18} />
                <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search NOLINE" />
                <kbd>⌘ K</kbd>
              </form>
              <div className="quick-sites">
                {sites.slice(1, 5).map((site) => (
                  <button key={site.id} onClick={() => openSite(site)}>
                    <span style={{ background: site.accent }}><Globe2 size={15} /></span>
                    {site.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="home">
            <div className="hero">
              <div className="eyebrow"><span className="pulse" /> NOLINE NETWORK</div>
              <h1>The world,<br /><em>connected.</em></h1>
              <p>A premium in-world browser for services, commerce and everything your city has to offer.</p>
              <div className="hero-actions">
                <button className="primary" onClick={() => openSite(sites.find((site) => site.id === "market")!)}>Explore Market</button>
                <button className="secondary" onClick={() => setShowApps(true)}>Browse Services</button>
              </div>
            </div>

            <div className="market-section">
              <div className="section-head">
                <div><span className="section-kicker">NOLINE MARKET</span><h2>Selected for you.</h2></div>
                <div className="filters">
                  {["All", "Services", "Motors", "Property", "Travel"].map((item) => (
                    <button key={item} className={category === item ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>
                  ))}
                </div>
              </div>
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article className="product" key={product.id}>
                    <div className="product-visual">
                      {product.featured && <span className="featured">FEATURED</span>}
                      <div className="product-glyph">{product.name.charAt(0)}</div>
                    </div>
                    <div className="product-info">
                      <div><span>{product.category}</span><h3>{product.name}</h3></div>
                      <strong>{money(product.price)}</strong>
                    </div>
                    <p>{product.description}</p>
                    <button onClick={() => addToCart(product)}>Add to basket <Plus size={14} /></button>
                  </article>
                ))}
              </div>
            </div>

            <footer>
              <span>NOLINE / CLIENT 0.1</span>
              <span>NO ACCOUNT REQUIRED</span>
              <span>GAME INTEGRATION READY</span>
            </footer>
          </div>
        )}
      </section>

      {showCart && (
        <div className="overlay" onClick={() => setShowCart(false)}>
          <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head"><div><span className="section-kicker">BASKET</span><h2>Your order</h2></div><button onClick={() => setShowCart(false)}><X /></button></div>
            <div className="cart-items">
              {cartProducts.length === 0 ? <div className="empty-cart"><ShoppingBag size={25} /><p>Your basket is empty.</p></div> : cartProducts.map((product) => (
                <div className="cart-item" key={product.id}>
                  <span>{product.name.charAt(0)}</span><div><strong>{product.name}</strong><small>{product.category}</small></div><b>{money(product.price)}</b>
                </div>
              ))}
            </div>
            <div className="checkout">
              <div><span>Total</span><strong>{money(total)}</strong></div>
              <button disabled={!cartProducts.length} onClick={() => {
                setNotice("Checkout adapter is ready — connect your game purchase handler.");
                setShowCart(false);
                window.setTimeout(() => setNotice(""), 3000);
              }}>Continue to checkout</button>
              <small>Payments are intentionally not connected yet. The checkout surface is ready for your game's economy/API.</small>
            </div>
          </aside>
        </div>
      )}

      {notice && <div className="toast">{notice}</div>}
    </main>
  );
}
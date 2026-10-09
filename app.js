import { brands } from "./brands/registry.js";
import { resolveAssetConfig } from "./brands/resolve-config.js";

const app = document.getElementById("app");
const storageKey = "eyefind:saved-sites:v1";
const state = {
  page: "home",
  brandId: null,
  assetId: null,
  query: "",
  filter: "all",
  saved: loadSaved(),
  assetCache: Object.create(null),
  loadingBrandId: null,
  catalogErrors: Object.create(null),
  toastTimer: null,
};

const icon = {
  search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.7"/><path d="m16 16 4.1 4.1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  open: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.5 4.8c0-.7.6-1.3 1.3-1.3h8.4c.7 0 1.3.6 1.3 1.3v16l-5.5-3.4-5.5 3.4v-16Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function loadSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}
function saveSaved() {
  try { localStorage.setItem(storageKey, JSON.stringify(state.saved)); } catch { /* Private browsing can disable storage. */ }
}
function getBrand(id) { return brands.find((brand) => brand.id === id) || null; }
function isSaved(id) { return state.saved.includes(id); }
function routeToHash(page, brandId, assetId) {
  if (page === "brand" && brandId) return "#/brand/" + encodeURIComponent(brandId);
  if (page === "asset" && brandId && assetId) return "#/brand/" + encodeURIComponent(brandId) + "/asset/" + encodeURIComponent(assetId);
  if (page === "saved") return "#/saved";
  return "#/discover";
}
function parseRoute() {
  const parts = decodeURIComponent((location.hash || "#/discover").replace(/^#\/?/, "")).split("/");
  if (parts[0] === "saved") return { page: "saved", brandId: null, assetId: null };
  if (parts[0] === "brand" && parts[1] && getBrand(parts[1])) {
    if (parts[2] === "asset" && parts[3]) return { page: "asset", brandId: parts[1], assetId: parts[3] };
    return { page: "brand", brandId: parts[1], assetId: null };
  }
  return { page: "home", brandId: null, assetId: null };
}
function navigate(page, options, replace) {
  const opts = options || {};
  state.page = page;
  state.brandId = opts.brandId || null;
  state.assetId = opts.assetId || null;
  const hash = routeToHash(state.page, state.brandId, state.assetId);
  if (replace) history.replaceState({ page: state.page, brandId: state.brandId, assetId: state.assetId }, "", hash);
  else if (location.hash !== hash) history.pushState({ page: state.page, brandId: state.brandId, assetId: state.assetId }, "", hash);
  else history.replaceState({ page: state.page, brandId: state.brandId, assetId: state.assetId }, "", hash);
  render();
  if (page === "brand" || page === "asset") void ensureBrandAssets(state.brandId);
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
function toast(message) {
  let element = document.querySelector(".toast");
  if (!element) {
    element = document.createElement("div");
    element.className = "toast";
    element.setAttribute("role", "status");
    element.innerHTML = '<span class="status-dot"></span><span class="toast-message"></span>';
    document.body.appendChild(element);
  }
  element.querySelector(".toast-message").textContent = message;
  element.classList.add("is-visible");
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => element.classList.remove("is-visible"), 2400);
}
function toggleSaved(id) {
  const brand = getBrand(id);
  if (!brand) return;
  if (isSaved(id)) {
    state.saved = state.saved.filter((savedId) => savedId !== id);
    toast(brand.name + " removed from Saved.");
  } else {
    state.saved = state.saved.concat(id);
    toast(brand.name + " saved for later.");
  }
  saveSaved();
  render();
}
function formatMoney(value, currency) {
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) return "Price on request";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD", maximumFractionDigits: 0 }).format(Number(value));
  } catch {
    return "$" + Math.round(Number(value)).toLocaleString("en-US");
  }
}
function salePrice(asset) {
  if (asset.salePrice !== null && asset.salePrice !== undefined && asset.salePrice !== "") return Number(asset.salePrice);
  if (asset.onSale && Number(asset.salePercent) > 0 && asset.price !== null && asset.price !== undefined) {
    return Math.round(Number(asset.price) * (1 - Number(asset.salePercent) / 100));
  }
  return asset.price;
}
function assetsFor(id) { return state.assetCache[id] || []; }

async function ensureBrandAssets(brandId) {
  const brand = getBrand(brandId);
  if (!brand || Object.prototype.hasOwnProperty.call(state.assetCache, brandId)) {
    if (state.page === "asset" && brand) render();
    return;
  }
  state.loadingBrandId = brandId;
  state.catalogErrors[brandId] = false;
  render();
  const assetIds = Array.isArray(brand.assets) ? brand.assets.filter((id) => /^[a-z0-9][a-z0-9_-]*$/i.test(id) && id.toLowerCase() !== "_template") : [];
  const results = await Promise.all(assetIds.map(async (assetId) => {
    try {
      const modulePath = "./brands/" + brand.folder + "/Assets/" + assetId + "/config.js";
      const module = await import(modulePath);
      const raw = module.default || module.asset;
      if (!raw || typeof raw !== "object") return null;
      const resolved = resolveAssetConfig(brand, raw);
      return Object.assign({}, resolved, {
        brandId: brand.id,
        folder: brand.folder,
        basePath: "./brands/" + brand.folder + "/Assets/" + assetId + "/",
      });
    } catch (error) {
      state.catalogErrors[brandId] = true;
      console.error("EYEFIND could not load asset config:", brand.folder + "/" + assetId, error);
      return null;
    }
  }));
  state.assetCache[brandId] = results.filter((asset) => asset && asset.visible !== false);
  if (state.loadingBrandId === brandId) state.loadingBrandId = null;
  render();
}
function artMarkup(brand, large) {
  const scorpion = brand.id === "scorpion";
  const classes = "brand-hero-art" + (scorpion ? " brand-hero--scorpion" : "");
  if (large) {
    return '<div class="' + classes + '" aria-hidden="true"><span class="brand-art-ring"></span><span class="brand-art-shape"></span></div>';
  }
  return scorpion
    ? '<div class="card-art card-art--scorpion" aria-hidden="true"><span class="scorpion-wheel"></span></div>'
    : '<div class="card-art card-art--morsa" aria-hidden="true"><span class="morsa-contour"></span><span class="card-orientation"></span></div>';
}
function renderHeader() {
  const filter = state.page === "home" ? state.filter : "all";
  return '<header class="site-header"><div class="header-inner">' +
    '<a class="wordmark" href="#/discover" data-action="discover" aria-label="EYEFIND home">' +
      '<span class="eyefind-mark" aria-hidden="true"><i></i></span><span class="wordmark-name">eyefind</span></a>' +
    '<nav class="site-nav" aria-label="Main navigation">' +
      '<button class="nav-link ' + (state.page === "home" && filter === "all" ? "is-active" : "") + '" data-action="category" data-filter="all">Discover</button>' +
      '<button class="nav-link ' + (state.page === "home" && filter === "automotive" ? "is-active" : "") + '" data-action="category" data-filter="automotive">Automotive</button>' +
      '<button class="nav-link ' + (state.page === "home" && filter === "specialist" ? "is-active" : "") + '" data-action="category" data-filter="specialist">Specialist supply</button>' +
    '</nav><span class="header-spacer"></span>' +
    '<button class="header-search" data-action="focus-search" aria-label="Focus search">' + icon.search + '<span>Search</span><kbd>⌘ K</kbd></button>' +
    '<button class="nav-link ' + (state.page === "saved" ? "is-active" : "") + '" data-action="saved">Saved <span class="chip-count">' + String(state.saved.length).padStart(2, "0") + '</span></button>' +
    '<div class="network-status"><span class="status-dot"></span> NETWORK ONLINE</div>' +
    '</div></header>';
}
function renderFooter() {
  return '<footer class="site-footer"><div class="footer-left"><span class="eyefind-mark" aria-hidden="true"><i></i></span><span>EYEFIND</span></div>' +
    '<span class="footer-caption">A quieter way to find your world.</span><span>DIRECTORY / 2026</span></footer>';
}
function renderShell(content) {
  return '<div class="app-shell">' + renderHeader() + '<main class="page-wrap">' + content + '</main>' + renderFooter() + '</div>';
}
function renderSearchForm() {
  return '<div class="search-zone"><form class="search-form" id="search-form" role="search">' +
    '<span class="search-icon">' + icon.search + '</span>' +
    '<input id="site-search" name="q" type="search" value="' + escapeHtml(state.query) + '" placeholder="Search destinations, services and showrooms" autocomplete="off" aria-label="Search destinations, services and showrooms">' +
    '<kbd>⌘ K</kbd><button class="search-submit" type="submit" aria-label="Search EYEFIND">' + icon.arrow + '</button></form>' +
    '<div class="search-caption"><span>Search the directory</span><span class="caption-separator"></span><span>Names, categories and descriptions</span></div></div>';
}
function matchesBrand(brand, query) {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return true;
  const content = [brand.name, brand.legalName, brand.category, brand.tagline, brand.description, brand.domain].join(" ").toLocaleLowerCase();
  return content.includes(term);
}
function brandMatchesFilter(brand, filter) {
  return filter === "all" || brand.categoryId === filter;
}
function filteredBrands() {
  let list = brands.filter((brand) => brandMatchesFilter(brand, state.filter) && matchesBrand(brand, state.query));
  if (state.page === "saved") list = list.filter((brand) => isSaved(brand.id));
  return list;
}
function renderBrandCard(brand, index) {
  const saved = isSaved(brand.id);
  const cls = brand.id === "scorpion" ? "destination-card--scorpion" : "destination-card--morsa";
  return '<article class="destination-card ' + cls + ' arrive arrive-delay-' + Math.min(index + 1, 3) + '" data-brand-card="' + escapeHtml(brand.id) + '">' +
    '<div class="card-top"><span class="card-category"><span class="category-mark"></span>' + escapeHtml(brand.category) + '</span>' +
      '<button class="icon-button ' + (saved ? "is-saved" : "") + '" data-action="toggle-saved" data-id="' + escapeHtml(brand.id) + '" aria-label="' + (saved ? "Remove " + escapeHtml(brand.name) + " from Saved" : "Save " + escapeHtml(brand.name)) + '" aria-pressed="' + (saved ? "true" : "false") + '">' + icon.bookmark + '</button></div>' +
    artMarkup(brand, false) +
    '<div class="card-copy"><div class="card-brand-row"><span class="brand-logo"><img src="' + escapeHtml(brand.logo) + '" alt="" loading="lazy"></span><span class="brand-overline">' + escapeHtml(brand.domain) + '</span></div>' +
      '<h3>' + escapeHtml(brand.name) + '</h3><p class="legal-name">' + escapeHtml(brand.legalName) + '</p>' +
      '<p class="card-description">' + escapeHtml(brand.description) + '</p></div>' +
    '<div class="card-bottom"><span class="card-domain">' + escapeHtml(brand.tagline) + '</span>' +
      '<button class="card-open" data-action="open-brand" data-id="' + escapeHtml(brand.id) + '">Visit site ' + icon.open + '</button></div>' +
    '</article>';
}
function renderFilters() {
  const categories = [
    { id: "all", label: "All destinations", count: brands.length },
    { id: "automotive", label: "Automotive", count: brands.filter((b) => b.categoryId === "automotive").length },
    { id: "specialist", label: "Specialist supply", count: brands.filter((b) => b.categoryId === "specialist").length },
  ];
  return '<div class="filter-list" aria-label="Filter destinations">' + categories.map((category) =>
    '<button class="filter-chip ' + (state.filter === category.id ? "is-active" : "") + '" data-action="category" data-filter="' + category.id + '">' +
    escapeHtml(category.label) + '<span class="chip-count">' + String(category.count).padStart(2, "0") + '</span></button>'
  ).join("") + '</div>';
}
function renderDirectoryContent() {
  const results = filteredBrands();
  const grid = results.length
    ? '<div class="destination-grid">' + results.map(renderBrandCard).join("") + '</div>'
    : '<div class="no-results"><span class="empty-glyph">' + icon.search + '</span><h3>No destinations found.</h3><p>Try another name or broaden the category filter. Only published destinations appear in this directory.</p><button class="small-link" data-action="clear-search">Clear search and filters ' + icon.arrow + '</button></div>';
  const query = state.query.trim();
  const heading = query ? 'Search results for “' + escapeHtml(query) + '”' : (state.filter === "automotive" ? "Automotive destinations." : state.filter === "specialist" ? "Specialist supply." : "Destinations worth knowing.");
  const countLabel = String(results.length).padStart(2, "0") + (results.length === 1 ? " DESTINATION" : " DESTINATIONS");
  return '<div id="directory-heading-row" class="section-head"><div><span class="eyebrow">The directory</span><h2 id="directory-heading">' + heading + '</h2><p>Independent destinations, considered in one place.</p></div><span class="section-count" id="result-count">' + countLabel + '</span></div>' +
    '<div class="directory-toolbar">' + renderFilters() + '</div><div id="brand-grid">' + grid + '</div>';
}
function renderFeaturedArashi() {
  const brand = getBrand("morsa");
  if (!brand) return "";
  const assetId = brand.featuredAsset || "arashi";
  const modelPath = "./brands/" + brand.folder + "/" + (brand.featuredModel || "Assets/arashi/model/arx_apc.glb");
  return '<section class="featured-vehicle arrive" aria-label="Featured vehicle">' +
    '<div class="featured-vehicle-copy"><span class="eyebrow"><span class="status-dot"></span> FEATURED FROM MORSA</span>' +
    '<h2>Heavy, <em>ST-17</em><br>Arashi.</h2>' +
    '<p>A closer look at MORSA’s armored high-mobility vehicle. Explore the model, discover the listing and inspect it from every angle.</p>' +
    '<div class="featured-vehicle-meta"><span>MODEL VIEW / 001</span><span class="featured-meta-dot"></span><span>INTERACTIVE 3D</span></div>' +
    '<button class="button button-primary" data-action="open-configured-asset" data-brand="' + escapeHtml(brand.id) + '" data-id="' + escapeHtml(assetId) + '">Explore the Arashi ' + icon.arrow + '</button></div>' +
    '<div class="featured-vehicle-stage"><div class="featured-stage-grid" aria-hidden="true"></div>' +
    '<div class="featured-stage-glow" aria-hidden="true"></div>' +
    '<model-viewer class="featured-model" src="' + escapeHtml(modelPath) + '" alt="Heavy, ST-17 Arashi armored vehicle 3D model" camera-controls auto-rotate rotation-per-second="3deg" shadow-intensity="1.1" exposure="0.88" environment-image="neutral" camera-orbit="25deg 72deg 105%" interaction-prompt="none" loading="lazy"></model-viewer>' +
    '<div class="model-chip"><span class="model-chip-dot"></span> LIVE MODEL <span class="model-chip-divider"></span> DRAG TO ROTATE</div>' +
    '<span class="model-coordinate model-coordinate-top">MORSA / VEHICLE 001</span><span class="model-coordinate model-coordinate-bottom">ST-17 / ARASHI</span></div>' +
    '<div class="featured-vehicle-foot"><span>ENGINEERING / FIELD MOBILITY</span><span>MODEL SOURCE · MORSA ASSETS</span></div></section>';
}

function renderHome() {
  ensureModelViewer();
  return '<section class="home-hero">' +
    '<div class="hero-topline"><span class="status-dot"></span> THE CITY NETWORK <span class="caption-separator"></span> DIRECTORY 001</div>' +
    '<div class="hero-grid"><div class="hero-copy arrive"><h1>Find your<br><em>world.</em></h1><p>The city’s showrooms and specialist destinations, brought together in one beautifully direct place.</p>' +
    renderSearchForm() + '</div>' +
    '<div class="hero-aside" aria-hidden="true"><div class="hero-orbit"><span class="orbit-ring ring-a"></span><span class="orbit-ring ring-b"></span><span class="orbit-ring ring-c"></span><span class="orbit-core"></span><span class="orbit-node node-a"></span><span class="orbit-node node-b"></span><span class="orbit-caption">Everywhere, closer</span></div></div></div>' +
    '</section><hr class="hero-divider">' +
    renderFeaturedArashi() +
    '<section class="section" aria-label="Directory destinations">' + renderDirectoryContent() + '</section>' +
    '<section class="info-strip" aria-label="About EYEFIND">' +
      '<div class="info-cell"><span class="info-index">01</span><div><strong>One clear entry point</strong><span>' + String(brands.length).padStart(2, "0") + ' curated destinations</span></div></div>' +
      '<div class="info-cell"><span class="info-index">02</span><div><strong>Built around discovery</strong><span>Search by name or category</span></div></div>' +
      '<div class="info-cell"><span class="info-index">03</span><div><strong>Always evolving</strong><span>More destinations can be added</span></div></div>' +
    '</section>';
}
function renderBrandAssets(brand) {
  if (state.loadingBrandId === brand.id) {
    return '<div class="empty-state catalog-empty"><span class="boot-mark" aria-hidden="true"></span><h3>Opening the catalogue…</h3><p>Preparing published listings for this destination.</p></div>';
  }
  const assets = assetsFor(brand.id);
  if (!assets.length) {
    const error = state.catalogErrors[brand.id];
    return '<div class="empty-state catalog-empty"><span class="empty-glyph">✳</span><span class="eyebrow">' + (error ? "CATALOGUE TEMPORARILY UNAVAILABLE" : "CATALOGUE / IN PREPARATION") + '</span>' +
      '<h3>' + (error ? "Listings could not be loaded." : "The next listing will appear here.") + '</h3>' +
      '<p>' + (error ? "This destination is available, but one of its listing configurations could not be read. Please try again shortly." : "This destination is online. Published vehicles, stock and specialist items will appear here when they are added to the catalogue.") + '</p>' +
      (error ? '<button class="small-link" data-action="retry-brand" data-id="' + escapeHtml(brand.id) + '">Try again ' + icon.arrow + '</button>' : '') +
      '</div>';
  }
  return '<div class="asset-grid">' + assets.map(renderAssetCard).join("") + '</div>';
}
function renderAssetCard(asset) {
  const modelSrc = asset.model && asset.model.src ? asset.basePath + asset.model.src.replace(/^\.?\//, "") : "";
  const previewSrc = asset.poster ? asset.basePath + asset.poster.replace(/^\.?\//, "") : (asset.images && asset.images[0] ? asset.basePath + asset.images[0].replace(/^\.?\//, "") : "");
  const price = salePrice(asset);
  const badge = asset.onSale ? "ON SALE" : (asset.badge || asset.stockStatus || "AVAILABLE");
  let preview = modelSrc
    ? '<model-viewer src="' + escapeHtml(modelSrc) + '" poster="' + escapeHtml(previewSrc) + '" alt="' + escapeHtml(asset.name) + '" camera-controls auto-rotate rotation-per-second="7deg" disable-zoom></model-viewer>'
    : (previewSrc
      ? '<img src="' + escapeHtml(previewSrc) + '" alt="" loading="lazy">'
      : '<div class="asset-placeholder-art" aria-hidden="true"></div>');
  if (modelSrc) ensureModelViewer();
  return '<article class="asset-card"><button class="asset-preview" data-action="open-asset" data-id="' + escapeHtml(asset.id) + '" aria-label="Inspect ' + escapeHtml(asset.name) + '">' +
    '<span class="asset-badge">' + escapeHtml(badge) + '</span>' + preview + '</button>' +
    '<div class="asset-copy"><h3>' + escapeHtml(asset.name) + '</h3><p>' + escapeHtml(asset.description || "") + '</p></div>' +
    '<div class="asset-bottom"><span class="asset-price">' + (asset.onSale && asset.price != null ? '<s>' + formatMoney(asset.price, asset.currency) + '</s>' : '') + escapeHtml(formatMoney(price, asset.currency)) + '</span>' +
    '<span class="asset-stock">' + escapeHtml(asset.stockStatus || "Available") + '</span></div></article>';
}
function renderBrandPage() {
  const brand = getBrand(state.brandId);
  if (!brand) return renderHome();
  const saved = isSaved(brand.id);
  const assets = assetsFor(brand.id);
  const scorpion = brand.id === "scorpion";
  return '<section class="brand-page">' +
    '<div class="brand-page-head"><button class="back-link" data-action="discover">' + icon.back + ' All destinations</button><span class="section-count">DESTINATION / ' + escapeHtml(brand.id.toUpperCase()) + '</span></div>' +
    '<section class="brand-hero ' + (scorpion ? "brand-hero--scorpion" : "brand-hero--morsa") + '" style="--brand-accent:' + escapeHtml(brand.accent) + '">' +
      '<div class="brand-hero-copy"><div class="brand-verification"><span class="status-dot"></span> PUBLISHED DESTINATION</div>' +
      '<div class="brand-heading-row"><span class="brand-heading-logo"><img src="' + escapeHtml(brand.logo) + '" alt=""></span><div><p class="brand-sector">' + escapeHtml(brand.category) + '</p><h1>' + escapeHtml(brand.name) + '</h1></div></div>' +
      '<p class="brand-legal-name">' + escapeHtml(brand.legalName) + '</p><p class="brand-description">' + escapeHtml(brand.description) + '</p>' +
      '<div class="brand-action-row"><button class="button button-secondary" data-action="toggle-saved" data-id="' + escapeHtml(brand.id) + '">' + (saved ? icon.check : icon.bookmark) + (saved ? "Saved" : "Save destination") + '</button><span class="brand-domain">' + escapeHtml(brand.domain) + '</span></div></div>' +
      artMarkup(brand, true) +
    '</section>' +
    '<section class="catalog-section"><div class="catalog-header"><div><span class="eyebrow">Explore the destination</span><h2>Catalogue</h2><p>Published listings, product details and availability.</p></div><span class="catalog-meta">' + String(assets.length).padStart(2, "0") + ' LISTINGS</span></div>' +
      renderBrandAssets(brand) +
      '<p class="brand-page-footnote"><strong>EYEFIND note.</strong> Catalogue availability is supplied by the destination and may change as listings are published.</p>' +
    '</section></section>';
}
function renderSavedPage() {
  const savedBrands = brands.filter((brand) => isSaved(brand.id));
  const content = savedBrands.length
    ? '<div class="destination-grid">' + savedBrands.map(renderBrandCard).join("") + '</div>'
    : '<div class="empty-state empty-saved"><span class="empty-glyph">' + icon.bookmark + '</span><span class="eyebrow">YOUR SHORTLIST</span><h3>Nothing saved yet.</h3><p>Save a destination to keep it close. Your shortlist stays on this device.</p><button class="button button-primary" data-action="discover">Explore destinations ' + icon.arrow + '</button></div>';
  return '<section class="saved-view"><div class="section-head"><div><span class="eyebrow">Your collection</span><h2>Saved destinations.</h2><p>A personal shortlist of places you want to return to.</p></div><span class="section-count">' + String(savedBrands.length).padStart(2, "0") + ' SAVED</span></div><section class="section">' + content + '</section></section>';
}
function ensureModelViewer() {
  if (customElements.get("model-viewer") || document.querySelector('script[data-model-viewer="true"]')) return;
  const script = document.createElement("script");
  script.type = "module";
  script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
  script.dataset.modelViewer = "true";
  document.head.appendChild(script);
}
function renderAssetPage() {
  const brand = getBrand(state.brandId);
  const asset = assetsFor(state.brandId).find((item) => item.id === state.assetId);
  if (!brand) return renderHome();
  if (!asset) {
    return '<section class="asset-detail"><div class="asset-detail-top"><button class="back-link" data-action="open-brand" data-id="' + escapeHtml(brand.id) + '">' + icon.back + ' Back to ' + escapeHtml(brand.name) + '</button></div><div class="empty-state"><h3>Listing not found.</h3><p>This item is not currently published in the catalogue.</p><button class="button button-primary" data-action="open-brand" data-id="' + escapeHtml(brand.id) + '">Return to catalogue ' + icon.arrow + '</button></div></section>';
  }
  const modelSrc = asset.model && asset.model.src ? asset.basePath + asset.model.src.replace(/^\.?\//, "") : "";
  const imageSrc = asset.poster ? asset.basePath + asset.poster.replace(/^\.?\//, "") : (asset.images && asset.images[0] ? asset.basePath + asset.images[0].replace(/^\.?\//, "") : "");
  if (modelSrc) ensureModelViewer();
  const stage = modelSrc
    ? '<model-viewer src="' + escapeHtml(modelSrc) + '" poster="' + escapeHtml(imageSrc) + '" alt="' + escapeHtml(asset.name) + '" camera-controls auto-rotate shadow-intensity="0.55" exposure="0.9" environment-image="neutral"></model-viewer>'
    : (imageSrc
      ? '<img src="' + escapeHtml(imageSrc) + '" alt="' + escapeHtml(asset.name) + '">'
      : '<div class="asset-placeholder-art" aria-hidden="true"></div>');
  const price = salePrice(asset);
  const metadata = [
    ["Catalogue ID", asset.catalogId || asset.id],
    ["Availability", asset.stockStatus || "Available"],
    ["Configuration", asset.configSourceResolved || "brand"],
  ];
  if (asset.category) metadata.push(["Category", asset.category]);
  return '<section class="asset-detail"><div class="asset-detail-top"><button class="back-link" data-action="open-brand" data-id="' + escapeHtml(brand.id) + '">' + icon.back + ' Back to ' + escapeHtml(brand.name) + '</button><span class="section-count">LISTING / ' + escapeHtml(String(asset.id).toUpperCase()) + '</span></div>' +
    '<div class="asset-detail-grid"><div class="asset-stage">' + stage + '<div class="asset-stage-caption"><span>' + escapeHtml(brand.name) + ' / PRODUCT VIEW</span><span>' + (modelSrc ? "INTERACTIVE MODEL" : "PRODUCT PREVIEW") + '</span></div></div>' +
    '<aside class="asset-info"><span class="eyebrow">' + escapeHtml(brand.name) + ' CATALOGUE</span><h1>' + escapeHtml(asset.name) + '</h1><p class="asset-description">' + escapeHtml(asset.description || "Details supplied by the destination.") + '</p>' +
    '<div class="asset-price-large">' + (asset.onSale && asset.price != null ? '<s>' + formatMoney(asset.price, asset.currency) + '</s> ' : '') + escapeHtml(formatMoney(price, asset.currency)) + '</div>' +
    '<span class="asset-stock">' + escapeHtml(asset.stockStatus || "Available") + (asset.onSale ? " / ON SALE" : "") + '</span>' +
    '<div class="asset-meta-list">' + metadata.map((row) => '<div class="asset-meta-row"><span>' + escapeHtml(row[0]) + '</span><strong>' + escapeHtml(row[1]) + '</strong></div>').join("") + '</div>' +
    '<button class="button button-primary" data-action="listing-notice">Listing details ' + icon.open + '</button></aside></div></section>';
}
function render() {
  if (!brands.length) {
    app.innerHTML = '<main class="page-wrap"><div class="empty-state"><h1>No destinations configured.</h1><p>Add a brand config to the directory registry.</p></div></main>';
    return;
  }
  if (state.page === "home") app.innerHTML = renderShell(renderHome());
  else if (state.page === "saved") app.innerHTML = renderShell(renderSavedPage());
  else if (state.page === "brand") app.innerHTML = renderShell(renderBrandPage());
  else if (state.page === "asset") app.innerHTML = renderShell(renderAssetPage());
  else app.innerHTML = renderShell(renderHome());
  document.title = state.page === "brand" && getBrand(state.brandId)
    ? getBrand(state.brandId).name + " — EYEFIND"
    : state.page === "asset" ? "Product details — EYEFIND"
    : state.page === "saved" ? "Saved destinations — EYEFIND"
    : "EYEFIND — The city, connected.";
  document.body.classList.toggle("is-detail-page", state.page === "brand" || state.page === "asset");
}
function updateDirectory() {
  const heading = document.getElementById("directory-heading");
  const count = document.getElementById("result-count");
  const grid = document.getElementById("brand-grid");
  const toolbar = document.querySelector(".directory-toolbar");
  if (!grid || !heading || !count) return;
  const results = filteredBrands();
  const term = state.query.trim();
  heading.textContent = term ? "Search results for “" + term + "”" : (state.filter === "automotive" ? "Automotive destinations." : state.filter === "specialist" ? "Specialist supply." : "Destinations worth knowing.");
  count.textContent = String(results.length).padStart(2, "0") + (results.length === 1 ? " DESTINATION" : " DESTINATIONS");
  grid.innerHTML = results.length
    ? '<div class="destination-grid">' + results.map(renderBrandCard).join("") + '</div>'
    : '<div class="no-results"><span class="empty-glyph">' + icon.search + '</span><h3>No destinations found.</h3><p>Try another name or broaden the category filter. Only published destinations appear in this directory.</p><button class="small-link" data-action="clear-search">Clear search and filters ' + icon.arrow + '</button></div>';
  if (toolbar) {
    toolbar.querySelectorAll("[data-filter]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === state.filter);
    });
  }
  document.querySelectorAll(".site-nav [data-action='category']").forEach((button) => {
    button.classList.toggle("is-active", state.page === "home" && button.dataset.filter === state.filter && button.dataset.filter !== "specialist");
  });
}
function focusSearch() {
  if (state.page !== "home") navigate("home");
  window.setTimeout(() => {
    const input = document.getElementById("site-search");
    if (input) { input.focus(); input.select(); }
  }, 0);
}
function runSearch() {
  const input = document.getElementById("site-search");
  if (input) state.query = input.value;
  const matches = brands.filter((brand) => matchesBrand(brand, state.query));
  if (matches.length === 1 && state.query.trim()) {
    navigate("brand", { brandId: matches[0].id });
    return;
  }
  updateDirectory();
}
function clearSearch() {
  state.query = "";
  state.filter = "all";
  const input = document.getElementById("site-search");
  if (input) input.value = "";
  updateDirectory();
  focusSearch();
}
function openBrand(brandId) {
  if (!getBrand(brandId)) return;
  navigate("brand", { brandId: brandId });
}
function openAsset(assetId) {
  const brandId = state.brandId;
  if (!brandId || !assetsFor(brandId).some((asset) => asset.id === assetId)) return;
  navigate("asset", { brandId: brandId, assetId: assetId });
}
function activateCurrentRoute() {
  const route = parseRoute();
  state.page = route.page;
  state.brandId = route.brandId;
  state.assetId = route.assetId;
  render();
  if (route.brandId) {
    void ensureBrandAssets(route.brandId).then(() => {
      if (route.page === "asset" && !assetsFor(route.brandId).some((asset) => asset.id === route.assetId)) render();
    });
  }
}
app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) {
    const card = event.target.closest("[data-brand-card]");
    if (card && !event.target.closest("button, a")) openBrand(card.dataset.brandCard);
    return;
  }
  const action = target.dataset.action;
  if (action === "discover") {
    state.query = "";
    state.filter = "all";
    navigate("home");
  } else if (action === "saved") {
    navigate("saved");
  } else if (action === "category") {
    state.filter = target.dataset.filter || "all";
    state.query = "";
    if (state.page !== "home") navigate("home");
    else {
      const input = document.getElementById("site-search");
      if (input) input.value = "";
      updateDirectory();
      window.scrollTo({ top: 460, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  } else if (action === "open-brand") {
    openBrand(target.dataset.id);
  } else if (action === "toggle-saved") {
    event.preventDefault();
    event.stopPropagation();
    toggleSaved(target.dataset.id);
  } else if (action === "focus-search") {
    focusSearch();
  } else if (action === "clear-search") {
    clearSearch();
  } else if (action === "open-asset") {
    openAsset(target.dataset.id);
  } else if (action === "open-configured-asset") {
    const brandId = target.dataset.brand;
    const assetId = target.dataset.id;
    void ensureBrandAssets(brandId).then(() => {
      if (assetsFor(brandId).some((asset) => asset.id === assetId)) navigate("asset", { brandId, assetId });
      else openBrand(brandId);
    });
  } else if (action === "retry-brand") {
    delete state.assetCache[target.dataset.id];
    delete state.catalogErrors[target.dataset.id];
    void ensureBrandAssets(target.dataset.id);
  } else if (action === "listing-notice") {
    toast("Listing actions will be connected when the game commerce bridge is added.");
  }
});

app.addEventListener("pointermove", (event) => {
  const target = event.target.closest(".destination-card, .asset-card, .featured-vehicle, .brand-hero, .search-form, .asset-info");
  if (!target) return;
  const rect = target.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
  target.style.setProperty("--pointer-x", (x * 100).toFixed(2) + "%");
  target.style.setProperty("--pointer-y", (y * 100).toFixed(2) + "%");
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      (target.classList.contains("destination-card") || target.classList.contains("asset-card"))) {
    target.style.setProperty("--tilt-x", ((x - .5) * 2.2).toFixed(2) + "deg");
    target.style.setProperty("--tilt-y", ((.5 - y) * 2.0).toFixed(2) + "deg");
  }
});
app.addEventListener("pointerout", (event) => {
  const target = event.target.closest(".destination-card, .asset-card, .featured-vehicle, .brand-hero, .search-form, .asset-info");
  if (!target || (event.relatedTarget && target.contains(event.relatedTarget))) return;
  target.style.setProperty("--tilt-x", "0deg");
  target.style.setProperty("--tilt-y", "0deg");
});

app.addEventListener("submit", (event) => {
  if (event.target.id !== "search-form") return;
  event.preventDefault();
  runSearch();
});
app.addEventListener("input", (event) => {
  if (event.target.id !== "site-search") return;
  state.query = event.target.value;
  updateDirectory();
});
document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if ((event.metaKey || event.ctrlKey) && key === "k") {
    event.preventDefault();
    focusSearch();
  } else if (event.key === "Escape") {
    const input = document.getElementById("site-search");
    if (input && document.activeElement === input && input.value) {
      input.value = "";
      state.query = "";
      updateDirectory();
      input.blur();
    }
  }
});
window.addEventListener("popstate", activateCurrentRoute);
window.addEventListener("hashchange", () => {
  const route = parseRoute();
  const alreadyMatches = state.page === route.page && state.brandId === route.brandId && state.assetId === route.assetId;
  if (!alreadyMatches) activateCurrentRoute();
});
if (!location.hash) history.replaceState({ page: "home" }, "", "#/discover");
activateCurrentRoute();

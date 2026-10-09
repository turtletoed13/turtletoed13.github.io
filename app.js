import { brands } from "./brands/registry.js";
import { resolveAssetConfig } from "./brands/resolve-config.js";

const root = document.getElementById("app");
const STORAGE_KEY = "eyefind:saved-sites:v1";
const MODEL_VIEWER_URL = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js";
const SEARCH_SHORTCUT = /Mac|iPhone|iPad/.test(navigator.platform || "") ? "⌘ K" : "Ctrl K";
const state = {
  page: "home",
  brandId: null,
  assetId: null,
  query: "",
  filter: "all",
  saved: loadSaved(),
  assets: Object.create(null),
  loading: Object.create(null),
  loadPromises: Object.create(null),
  catalogErrors: Object.create(null),
  paletteOpen: false,
  toastTimer: 0,
  headerCompact: false,
};

const icons = {
  search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7" stroke="currentColor" stroke-width="1.65"/><path d="m16 16 4.1 4.1" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 4.8c0-.72.58-1.3 1.3-1.3h7.4c.72 0 1.3.58 1.3 1.3v15.8l-5-3.2-5 3.2V4.8Z" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="6" height="6" rx="1.4" stroke="currentColor" stroke-width="1.5"/><rect x="14.5" y="3.5" width="6" height="6" rx="1.4" stroke="currentColor" stroke-width="1.5"/><rect x="3.5" y="14.5" width="6" height="6" rx="1.4" stroke="currentColor" stroke-width="1.5"/><rect x="14.5" y="14.5" width="6" height="6" rx="1.4" stroke="currentColor" stroke-width="1.5"/></svg>',
};

function e(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function loadSaved() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? [...new Set(value.filter((id) => typeof id === "string"))] : [];
  } catch (error) {
    console.warn("EYEFIND saved destinations are unavailable in this browser.", error);
    return [];
  }
}
function persistSaved() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.saved)); }
  catch (error) { console.warn("EYEFIND could not persist saved destinations.", error); }
}
function getBrand(id) { return brands.find((item) => item.id === id) || null; }
function isSaved(id) { return state.saved.includes(id); }
function getAssets(id) { return state.assets[id] || []; }
function routeFor(page, brandId, assetId) {
  if (page === "saved") return "#/saved";
  if (page === "not-found") return "#/not-found";
  if (page === "brand" && brandId) return "#/brand/" + encodeURIComponent(brandId);
  if (page === "asset" && brandId && assetId) return "#/brand/" + encodeURIComponent(brandId) + "/asset/" + encodeURIComponent(assetId);
  return "#/discover";
}
function readRoute() {
  const parts = decodeURIComponent((location.hash || "#/discover").replace(/^#\/?/, "")).split("/");
  if (parts[0] === "saved") return { page: "saved" };
  if (parts[0] === "brand" && getBrand(parts[1])) {
    if (parts[2] === "asset" && parts[3]) return { page: "asset", brandId: parts[1], assetId: parts[3] };
    if (parts.length === 2) return { page: "brand", brandId: parts[1] };
  }
  if (!parts[0] || parts[0] === "discover") return { page: "home" };
  return { page: "not-found" };
}
function navigate(page, options = {}, replace = false) {
  state.page = page;
  state.brandId = options.brandId || null;
  state.assetId = options.assetId || null;
  const hash = routeFor(page, state.brandId, state.assetId);
  if (replace) history.replaceState({ page, ...options }, "", hash);
  else if (location.hash !== hash) history.pushState({ page, ...options }, "", hash);
  closePalette(false);
  render();
  if (page === "brand" || page === "asset") void ensureBrandAssets(state.brandId);
  if (page === "home" && state.query) updateDirectory();
  window.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
}
function activateCurrentRoute() {
  const route = readRoute();
  state.page = route.page;
  state.brandId = route.brandId || null;
  state.assetId = route.assetId || null;
  render();
  if (route.page === "brand" || route.page === "asset") void ensureBrandAssets(route.brandId);
}
function reducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

let modelViewerPromise = null;
function ensureModelViewer() {
  if (customElements.get("model-viewer")) return Promise.resolve(true);
  if (modelViewerPromise) return modelViewerPromise;
  modelViewerPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-eyefind-model-viewer]');
    const script = existing || document.createElement("script");
    const finish = (ok) => resolve(ok && !!customElements.get("model-viewer"));
    script.addEventListener("load", () => finish(true), { once: true });
    script.addEventListener("error", () => {
      console.error("EYEFIND could not load the 3D viewer library from", MODEL_VIEWER_URL);
      finish(false);
    }, { once: true });
    if (!existing) {
      script.type = "module";
      script.src = MODEL_VIEWER_URL;
      script.dataset.eyefindModelViewer = "true";
      document.head.appendChild(script);
    } else if (customElements.get("model-viewer")) finish(true);
  }).then((ok) => {
    if (!ok) document.querySelectorAll("model-viewer").forEach((viewer) => showModelError(viewer, "3D preview unavailable", "The viewer could not be started in this browser."));
    return ok;
  });
  return modelViewerPromise;
}
function showModelError(viewer, title, message) {
  const stage = viewer.closest(".model-stage");
  if (!stage) return;
  stage.classList.add("model-failed");
  const status = stage.querySelector(".model-status");
  if (status) status.innerHTML = '<span class="status-glyph">' + icons.external + '</span><strong>' + e(title) + '</strong><span>' + e(message) + '</span>';
}
function wireModelViewers(scope = document) {
  const viewers = scope.querySelectorAll("model-viewer[data-model-src]");
  if (!viewers.length) return;
  viewers.forEach((viewer) => {
    if (viewer.dataset.wired === "true") return;
    viewer.dataset.wired = "true";
    const stage = viewer.closest(".model-stage");
    let settled = false;
    const ready = () => {
      settled = true;
      if (stage) {
        stage.classList.add("model-ready");
        stage.classList.remove("model-failed");
      }
    };
    viewer.addEventListener("load", ready, { once: true });
    viewer.addEventListener("error", () => {
      settled = true;
      showModelError(viewer, "Preview could not load", "The listing remains available without the 3D viewer.");
    }, { once: true });
    window.setTimeout(() => {
      if (!settled && viewer.isConnected && stage && !stage.classList.contains("model-ready")) {
        showModelError(viewer, "Taking longer than expected", "Check your connection or continue to the listing details.");
      }
    }, 24000);
  });
  void ensureModelViewer();
}
function modelStage(src, alt, mode = "hero", options = {}) {
  if (!src) return '<div class="model-stage model-stage--fallback ' + e(mode) + '"><div class="stage-light"></div><div class="model-fallback-mark" aria-hidden="true">' + icons.grid + '</div><div class="model-status"><strong>3D preview unavailable</strong><span>No model is registered for this listing.</span></div></div>';
  const controls = options.controls !== false ? "camera-controls" : "";
  const autoRotate = options.autoRotate && !reducedMotion() ? 'auto-rotate rotation-per-second="2.1deg"' : "";
  const zoom = options.zoom === false ? "disable-zoom" : "";
  const loading = options.loading || (mode === "card" ? "lazy" : "eager");
  const poster = options.poster ? 'poster="' + e(options.poster) + '"' : "";
  return '<div class="model-stage model-stage--' + e(mode) + '"><div class="stage-light" aria-hidden="true"></div><div class="stage-grid" aria-hidden="true"></div>' +
    '<model-viewer data-model-src="true" src="' + e(src) + '" ' + poster + ' alt="' + e(alt) + '" ' + controls + ' ' + autoRotate + ' ' + zoom +
    ' loading="' + e(loading) + '" reveal="auto" interaction-prompt="none" shadow-intensity="0.72" exposure="1" environment-image="neutral" tone-mapping="commerce" camera-orbit="24deg 72deg 105%" style="--poster-color: transparent;"></model-viewer>' +
    '<div class="model-status" role="status"><span class="loader-orbit" aria-hidden="true"></span><strong>Preparing 3D view</strong><span>Loading the original listing model</span></div>' +
    (options.label ? '<div class="stage-label">' + e(options.label) + '</div>' : '') +
    (controls ? '<div class="stage-hint"><span class="stage-hint-dot"></span> DRAG TO INSPECT</div>' : '') + '</div>';
}

async function ensureBrandAssets(brandId) {
  const brand = getBrand(brandId);
  if (!brand) return [];
  if (Object.prototype.hasOwnProperty.call(state.assets, brandId)) return state.assets[brandId];
  if (state.loadPromises[brandId]) return state.loadPromises[brandId];

  state.loading[brandId] = true;
  state.catalogErrors[brandId] = false;
  if (state.page === "brand" || state.page === "asset") render();
  const task = (async () => {
    try {
      const ids = Array.isArray(brand.assets)
        ? brand.assets.filter((id) => typeof id === "string" && /^[a-z0-9][a-z0-9_-]*$/i.test(id) && id.toLowerCase() !== "_template")
        : [];
      const items = await Promise.all(ids.map(async (id) => {
        try {
          const module = await import("./brands/" + brand.folder + "/Assets/" + id + "/config.js");
          const raw = module.default || module.asset;
          if (!raw || typeof raw !== "object" || raw.id !== id) throw new Error("Listing configuration ID does not match its registered folder.");
          const resolved = resolveAssetConfig(brand, raw);
          return { ...resolved, brandId: brand.id, folder: brand.folder, basePath: "./brands/" + brand.folder + "/Assets/" + id + "/" };
        } catch (error) {
          state.catalogErrors[brandId] = true;
          console.error("EYEFIND could not load listing configuration:", brand.folder + "/" + id, error);
          return null;
        }
      }));
      state.assets[brandId] = items.filter((item) => item && item.visible !== false);
      return state.assets[brandId];
    } catch (error) {
      state.catalogErrors[brandId] = true;
      console.error("EYEFIND catalogue loading failed for " + brandId, error);
      state.assets[brandId] = [];
      return [];
    } finally {
      state.loading[brandId] = false;
      state.loadPromises[brandId] = null;
      if ((state.page === "brand" || state.page === "asset") && state.brandId === brandId) render();
    }
  })();
  state.loadPromises[brandId] = task;
  return task;
}
function regularPrice(asset) {
  const value = asset.originalPrice != null && asset.originalPrice !== "" ? asset.originalPrice : asset.price;
  return value == null || value === "" || !Number.isFinite(Number(value)) || Number(value) < 0 ? null : Number(value);
}
function salePrice(asset) {
  const normal = regularPrice(asset);
  const configuredPrice = asset.price == null || asset.price === "" ? null : Number(asset.price);
  if (asset.onSale !== true) return configuredPrice == null || !Number.isFinite(configuredPrice) || configuredPrice < 0 ? normal : configuredPrice;
  const explicit = asset.salePrice == null || asset.salePrice === "" ? null : Number(asset.salePrice);
  if (explicit != null && Number.isFinite(explicit) && explicit >= 0 && (normal == null || explicit < normal)) return explicit;
  const percent = Number(asset.salePercent);
  if (normal != null && Number.isFinite(percent) && percent > 0 && percent <= 100) return Math.round(normal * (1 - percent / 100));
  if (configuredPrice != null && Number.isFinite(configuredPrice) && configuredPrice >= 0 && (normal == null || configuredPrice < normal)) return configuredPrice;
  return normal;
}
function isValidSale(asset) {
  const normal = regularPrice(asset), current = salePrice(asset);
  return asset.onSale === true && normal != null && current != null && Number.isFinite(Number(current)) && Number(current) >= 0 && Number(current) < normal;
}
function actualDiscountPercent(asset) {
  const normal = regularPrice(asset), current = salePrice(asset);
  if (!isValidSale(asset) || normal == null || normal <= 0 || current == null) return 0;
  return Math.round((normal - current) / normal * 100);
}
function money(value, currency) {
  if (value == null || value === "" || !Number.isFinite(Number(value))) return "Price on request";
  try { return new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD", maximumFractionDigits: 0 }).format(Number(value)); }
  catch (error) { return Number(value).toLocaleString("en-US"); }
}
function assetModelUrl(asset) {
  return asset.model && asset.model.src ? asset.basePath + String(asset.model.src).replace(/^\.?\//, "") : "";
}
function assetPosterUrl(asset) {
  const path = asset.poster || (Array.isArray(asset.images) && asset.images.length ? asset.images[0] : "");
  return path ? asset.basePath + String(path).replace(/^\.?\//, "") : "";
}
function normalizeSearch(value) { return String(value || "").trim().toLocaleLowerCase().replace(/\s+/g, " "); }
function searchableBrand(brand) {
  return normalizeSearch([brand.name, brand.legalName, brand.domain, brand.category, brand.tagline, brand.description].join(" "));
}
function filteredBrands() {
  const query = normalizeSearch(state.query);
  return brands.filter((brand) => {
    const matchesCategory = state.filter === "all" || brand.categoryId === state.filter;
    return matchesCategory && (!query || searchableBrand(brand).includes(query));
  });
}
function matchingAssets(queryValue = state.query) {
  const query = normalizeSearch(queryValue);
  if (!query) return [];
  return brands.flatMap((brand) => getAssets(brand.id).filter((asset) => {
    const text = normalizeSearch([asset.name, asset.catalogId, asset.category, asset.description,
      brand.name, brand.legalName, ...(Array.isArray(asset.tags) ? asset.tags : [])].join(" "));
    return text.includes(query);
  }));
}
function filteredAssets() {
  if (!normalizeSearch(state.query)) return [];
  return matchingAssets().filter((asset) => {
    const brand = getBrand(asset.brandId);
    return state.filter === "all" || (brand && brand.categoryId === state.filter);
  });
}
function renderDirectoryResults() {
  const brandMatches = filteredBrands();
  const assetMatches = filteredAssets();
  const sections = [];
  if (brandMatches.length) sections.push('<div class="destination-grid">' + brandMatches.map(renderBrandCard).join("") + '</div>');
  if (assetMatches.length) sections.push('<section class="listing-search-results"><div class="listing-search-heading"><span class="eyebrow">Published listings</span><h3>Matching catalogue items</h3></div><div class="asset-grid">' + assetMatches.map(renderAssetCard).join("") + '</div></section>');
  if (!sections.length) return '<div class="empty-state no-results"><span class="empty-state-icon">' + icons.search + '</span><h3>No destinations found.</h3><p>Try another name or clear the active filters. Only published destinations and listings appear here.</p><button class="button button-secondary" data-action="clear-search">Clear search and filters ' + icons.arrow + '</button></div>';
  return sections.join("");
}
function toast(message) {
  let node = document.querySelector(".toast");
  if (!node) {
    node = document.createElement("div");
    node.className = "toast";
    node.setAttribute("role", "status");
    node.setAttribute("aria-live", "polite");
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.classList.add("is-visible");
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => node.classList.remove("is-visible"), 2600);
}
function toggleSaved(id) {
  const brand = getBrand(id);
  if (!brand) return;
  state.saved = isSaved(id) ? state.saved.filter((savedId) => savedId !== id) : state.saved.concat(id);
  persistSaved();
  toast(isSaved(id) ? brand.name + " saved for later." : brand.name + " removed from Saved.");
  render();
}
function logo(brand, className = "brand-logo") {
  return '<span class="' + e(className) + '"><img src="' + e(brand.logo) + '" alt="" loading="lazy"></span>';
}
function header() {
  const homeActive = state.page === "home";
  const savedActive = state.page === "saved";
  return '<header class="site-header"><div class="header-inner">' +
    '<a class="wordmark" href="#/discover" data-action="discover" aria-label="EYEFIND home"><span class="eyefind-mark"><i></i></span><span class="wordmark-name">EYEFIND</span></a>' +
    '<nav class="site-nav" aria-label="Main navigation">' +
      '<a href="#/discover" class="nav-link ' + (homeActive ? "is-active" : "") + '" data-action="discover">Discover</a>' +
      '<button class="nav-link" data-action="browse">Destinations</button>' +
      '<a href="#/saved" class="nav-link ' + (savedActive ? "is-active" : "") + '" data-action="saved">Saved <span class="saved-count">' + state.saved.length + '</span></a>' +
    '</nav><span class="header-spacer"></span>' +
    '<span class="network-label"><i></i> CITY NETWORK</span>' +
    '<button class="header-search" data-action="focus-search" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">' + icons.search + '<span>Search</span><kbd>' + e(SEARCH_SHORTCUT) + '</kbd></button>' +
    '<button class="mobile-search" data-action="focus-search" aria-label="Search EYEFIND">' + icons.search + '</button>' +
  '</div></header>';
}
function footer() {
  return '<footer class="site-footer"><a class="footer-brand" href="#/discover" data-action="discover"><span class="eyefind-mark"><i></i></span> EYEFIND</a>' +
    '<span class="footer-note">The city, connected.</span><span class="footer-copy">A fictional in-world directory</span><a class="footer-top" href="#/discover" data-action="discover">Back to top ' + icons.arrow + '</a></footer>';
}
function shell(content) {
  return '<div class="app-shell">' + header() + '<main id="main-content" class="page-wrap">' + content + '</main>' + footer() + '</div>' + paletteMarkup();
}
function paletteMarkup() {
  return '<div class="search-overlay" id="search-overlay" hidden><button class="palette-backdrop" data-action="close-search" aria-label="Close search"></button>' +
    '<section class="search-palette" role="dialog" aria-modal="true" aria-labelledby="palette-title">' +
    '<div class="palette-title-row"><span id="palette-title">Search EYEFIND</span><button class="icon-button" data-action="close-search" aria-label="Close search">' + icons.close + '</button></div>' +
    '<form id="palette-form" class="palette-input-wrap">' + icons.search + '<input id="palette-search" type="search" autocomplete="off" placeholder="Destinations, services, vehicles…" aria-label="Search all destinations"><kbd>ENTER</kbd></form>' +
    '<div class="palette-results" id="palette-results"><p class="palette-hint">Search the city&#39;s published destinations.</p></div>' +
    '<div class="palette-foot"><span>Navigate the city</span><span><kbd>ESC</kbd> to close</span></div></section></div>';
}
function renderBrandCard(brand, index = 0) {
  const saved = isSaved(brand.id);
  const style = brand.id === "scorpion" ? "destination-card--scorpion" : "destination-card--morsa";
  return '<article class="destination-card ' + style + '" style="--card-index:' + Math.min(index, 5) + '">' +
    '<div class="destination-card-top"><span class="destination-kind"><span class="kind-mark"></span>' + e(brand.category) + '</span>' +
    '<button class="icon-button bookmark-button ' + (saved ? "is-saved" : "") + '" data-action="toggle-saved" data-id="' + e(brand.id) + '" aria-label="' + (saved ? "Remove " + e(brand.name) + " from saved" : "Save " + e(brand.name)) + '" aria-pressed="' + String(saved) + '">' + icons.bookmark + '</button></div>' +
    '<button class="destination-art" data-action="open-brand" data-id="' + e(brand.id) + '" aria-label="Visit ' + e(brand.name) + '">' +
      '<span class="art-halo"></span><span class="art-orbit art-orbit-a"></span><span class="art-orbit art-orbit-b"></span>' +
      '<span class="art-emblem art-emblem--' + e(brand.id) + '">' + logo(brand, "brand-logo") + '</span><span class="art-coordinate">' + e(brand.id === "morsa" ? "SPECIALIST DIVISION" : "MOTORING / PERFORMANCE") + '</span>' +
    '</button><div class="destination-copy"><div class="destination-brandline">' + logo(brand, "brand-logo brand-logo--small") + '<span>' + e(brand.domain) + '</span></div>' +
      '<h3>' + e(brand.name) + '</h3><p class="destination-legal">' + e(brand.legalName) + '</p><p class="destination-description">' + e(brand.description) + '</p></div>' +
    '<div class="destination-card-bottom"><span class="destination-tagline">' + e(brand.tagline) + '</span><button class="text-action" data-action="open-brand" data-id="' + e(brand.id) + '">Visit site ' + icons.arrow + '</button></div></article>';
}
function categoryFilters() {
  const categories = [
    { id: "all", label: "All destinations" },
    { id: "automotive", label: "Automotive" },
    { id: "specialist", label: "Specialist supply" },
  ];
  return '<div class="filter-list" role="group" aria-label="Filter destinations">' + categories.map((item) =>
    '<button class="filter-chip ' + (state.filter === item.id ? "is-active" : "") + '" data-action="category" data-filter="' + item.id + '" aria-pressed="' + String(state.filter === item.id) + '">' +
    e(item.label) + '</button>').join("") + '</div>';
}
function renderDirectory() {
  const results = filteredBrands();
  const productResults = filteredAssets();
  const title = state.query.trim() ? 'Results for “' + e(state.query.trim()) + '”' :
    state.filter === "automotive" ? "Made to move." : state.filter === "specialist" ? "Specialist destinations." : "Destinations worth knowing.";
  const resultMarkup = renderDirectoryResults();
  const totalResults = results.length + productResults.length;
  return '<section class="directory-section" id="directory" aria-labelledby="directory-title"><div class="section-heading">' +
    '<div><span class="eyebrow">The directory</span><h2 id="directory-title">' + title + '</h2><p>Independent destinations, connected in one place.</p></div>' +
    '<span class="result-counter">' + String(totalResults).padStart(2, "0") + ' <span>' + (totalResults === 1 ? "MATCH" : "MATCHES") + '</span></span></div>'
    '<div class="directory-tools">' + categoryFilters() + '<span class="directory-note">' +
      (state.query.trim() ? String(results.length + productResults.length).padStart(2, "0") + " MATCHES" : "Curated for the city") +
    '</span></div><div id="directory-results" aria-live="polite">' + resultMarkup + '</div></section>';
}
function featuredVehicle() {
  const brand = getBrand("morsa");
  const asset = brand ? getAssets(brand.id).find((item) => item.id === brand.featuredAsset) : null;
  const src = asset ? assetModelUrl(asset) : "./brands/MORSA/Assets/arashi/model/arx_apc.glb";
  const poster = asset ? assetPosterUrl(asset) : "";
  return '<section class="featured-vehicle" aria-labelledby="featured-title"><div class="featured-copy">' +
    '<span class="eyebrow"><span class="eyebrow-dot"></span> Featured from MORSA</span><div class="featured-index">01 <span>—</span> VEHICLE STUDY</div>' +
    '<h2 id="featured-title">Heavy, <span>ST-17</span><br>Arashi.</h2>' +
    '<p>The original 3D model, ready to inspect. Explore the vehicle from every angle in an immersive product stage.</p>' +
    '<div class="featured-facts"><span><i></i> INTERACTIVE MODEL</span><span>LISTING 517</span></div>' +
    '<button class="button button-primary" data-action="open-configured-asset" data-brand="morsa" data-id="arashi">Explore the Arashi ' + icons.arrow + '</button></div>' +
    '<div class="featured-visual">' + modelStage(src, "Heavy, ST-17 Arashi 3D model", "hero", { poster, autoRotate: true, label: "MORSA / 517" }) +
    '<div class="featured-visual-bottom"><span>HEAVY / ST-17</span><span>DRAG TO ROTATE <b>↗</b></span></div></div>' +
    '<div class="featured-foot"><span>PRODUCT INSPECTION / 001</span><span>CANONICAL ASSET · ARX_APC.GLb</span></div></section>';
}
function renderHome() {
  return '<section class="home-hero"><div class="hero-background" aria-hidden="true"><span class="hero-glow"></span><span class="hero-contour contour-one"></span><span class="hero-contour contour-two"></span></div>' +
    '<div class="hero-overline"><span class="eyebrow-dot"></span> YOUR CITY, AT A GLANCE <span class="overline-divider"></span> EYEFIND NETWORK</div>' +
    '<div class="hero-layout"><div class="hero-copy"><p class="hero-kicker">A better way to get around.</p><h1>The city is<br><em>closer than ever.</em></h1>' +
    '<p class="hero-description">Discover the showrooms, specialists and services that shape your world. All the places worth knowing, one search away.</p>' +
    '<form id="home-search-form" class="home-search"><span class="search-icon">' + icons.search + '</span><input id="home-search" name="q" type="search" autocomplete="off" placeholder="What are you looking for?" value="' + e(state.query) + '" aria-label="Search EYEFIND destinations"><kbd>' + e(SEARCH_SHORTCUT) + '</kbd><button type="submit" aria-label="Search">' + icons.arrow + '</button></form>' +
    '<div class="hero-search-note"><span>Try “automotive” or “MORSA”</span><span class="hero-note-line"></span><span>' + String(brands.length).padStart(2, "0") + ' destinations</span></div></div>' +
    '<div class="hero-aside"><div class="network-visual" aria-hidden="true"><span class="network-ring network-ring--one"></span><span class="network-ring network-ring--two"></span><span class="network-ring network-ring--three"></span>' +
    '<span class="network-core"><span class="network-core-mark"></span></span><span class="network-node node-one"></span><span class="network-node node-two"></span><span class="network-node node-three"></span><span class="network-caption caption-top">CITY / NETWORK 01</span><span class="network-caption caption-bottom">CONNECTED BY EYEFIND</span></div></div></div>' +
    '<div class="hero-bottomline"><span>DISCOVER MORE. GO FURTHER.</span><span class="hero-scroll-cue">SCROLL TO EXPLORE <span>↓</span></span></div></section>' +
    featuredVehicle() + renderDirectory() +
    '<section class="closing-note"><span class="closing-mark"><span class="eyefind-mark"><i></i></span></span><div><span class="eyebrow">A city in motion</span><h2>Find the next place<br>you want to be.</h2></div><button class="text-action" data-action="focus-search">Search EYEFIND ' + icons.arrow + '</button></section>';
}
function renderAssetCard(asset) {
  const src = assetModelUrl(asset);
  const poster = assetPosterUrl(asset);
  const currentPrice = salePrice(asset);
  const badge = isValidSale(asset) ? "ON SALE" : (asset.badge || asset.stockStatus || "AVAILABLE");
  const preview = src
    ? modelStage(src, asset.name + " 3D model preview", "card", { poster, controls: false, zoom: false, loading: "lazy", label: "3D MODEL" })
    : poster ? '<div class="image-preview"><img src="' + e(poster) + '" alt="' + e(asset.name) + '" loading="lazy"></div>'
    : '<div class="model-stage model-stage--card model-stage--fallback"><div class="stage-light"></div><div class="stage-grid"></div><div class="model-fallback-mark" aria-hidden="true">' + icons.grid + '</div><span class="preview-label">LISTING / ' + e(String(asset.id).toUpperCase()) + '</span></div>';
  return '<article class="asset-card"><button class="asset-preview-button" data-action="open-asset" data-brand="' + e(asset.brandId) + '" data-id="' + e(asset.id) + '" aria-label="Inspect ' + e(asset.name) + '">' +
    '<span class="asset-badge ' + (isValidSale(asset) ? "asset-badge--sale" : "") + '">' + e(badge) + '</span>' + preview + '<span class="preview-arrow">' + icons.arrow + '</span></button>' +
    '<div class="asset-card-copy"><div class="asset-card-kicker">' + e(asset.category || "Catalogue listing") + '<span>' + e(asset.catalogId ? "NO. " + asset.catalogId : String(asset.id).toUpperCase()) + '</span></div>' +
    '<h3>' + e(asset.name) + '</h3><p>' + e(asset.description || "Further details will be published by this destination.") + '</p></div>' +
    '<div class="asset-card-bottom"><div class="asset-price">' + (isValidSale(asset) ? '<s>' + e(money(regularPrice(asset), asset.currency)) + '</s>' : '') + '<strong>' + e(money(currentPrice, asset.currency)) + '</strong></div>' +
    '<span class="stock-status"><i></i>' + e(asset.stockStatus || "Availability not specified") + '</span></div></article>';
}
function renderCatalog(brand) {
  if (state.loading[brand.id]) return '<div class="catalog-state"><span class="loader-orbit" aria-hidden="true"></span><h3>Preparing the catalogue</h3><p>Loading published listing information.</p></div>';
  const assets = getAssets(brand.id);
  if (!assets.length) {
    const failed = state.catalogErrors[brand.id];
    return '<div class="catalog-state catalog-state--empty"><span class="empty-state-icon">' + icons.grid + '</span><span class="eyebrow">' + (failed ? "CATALOGUE UNAVAILABLE" : "CATALOGUE / IN PREPARATION") + '</span>' +
      '<h3>' + (failed ? "The catalogue could not be loaded." : "Something worth seeing will be here.") + '</h3><p>' +
      (failed ? "The destination is available, but its listing configuration could not be read. You can retry without losing your place." : "This destination is online. Listings will appear here as actual vehicles and products are registered.") + '</p>' +
      (failed ? '<button class="button button-secondary" data-action="retry-brand" data-id="' + e(brand.id) + '">Try again ' + icons.arrow + '</button>' : '') + '</div>';
  }
  return '<div class="asset-grid">' + assets.map(renderAssetCard).join("") + '</div>';
}
function renderBrandPage() {
  const brand = getBrand(state.brandId);
  if (!brand) return renderNotFound();
  const scorpion = brand.id === "scorpion";
  const saved = isSaved(brand.id);
  const assets = getAssets(brand.id);
  const heroAsset = assets.find((item) => item.id === brand.featuredAsset);
  const heroModel = heroAsset ? assetModelUrl(heroAsset) : "";
  return '<section class="brand-page brand-page--' + e(brand.id) + '" style="--brand-accent:' + e(brand.accent) + '">' +
    '<div class="page-breadcrumb"><button class="back-link" data-action="discover">' + icons.back + ' All destinations</button><span>DESTINATION <b>/</b> ' + e(brand.id.toUpperCase()) + '</span></div>' +
    '<section class="brand-hero"><div class="brand-hero-glow" aria-hidden="true"></div><div class="brand-hero-main"><div class="brand-logo-lockup">' + logo(brand, "brand-heading-logo") + '<span class="brand-domain">' + e(brand.domain) + '</span></div>' +
    '<span class="eyebrow"><span class="eyebrow-dot"></span> PUBLISHED DESTINATION</span><h1>' + e(brand.name) + '<span class="brand-period">.</span></h1><p class="brand-legal">' + e(brand.legalName) + '</p><p class="brand-intro">' + e(brand.description) + '</p>' +
    '<div class="brand-actions"><button class="button button-primary" data-action="browse">Explore catalogue ' + icons.arrow + '</button><button class="button button-secondary save-brand-button ' + (saved ? "is-saved" : "") + '" data-action="toggle-saved" data-id="' + e(brand.id) + '" aria-pressed="' + String(saved) + '">' + icons.bookmark + (saved ? "Saved" : "Save destination") + '</button></div></div>' +
    '<div class="brand-hero-art" aria-hidden="true"><span class="brand-art-light"></span><span class="brand-art-ring ring-a"></span><span class="brand-art-ring ring-b"></span><span class="brand-art-ring ring-c"></span><span class="brand-art-logo">' + logo(brand, "brand-logo") + '</span><span class="brand-art-caption">' + (scorpion ? "PERFORMANCE / PRECISION" : "SPECIALIST / MOBILITY") + '</span><span class="brand-art-coordinate">EYEFIND / ' + e(brand.id.toUpperCase()) + '</span></div></section>' +
    (heroAsset && heroModel ? '<section class="brand-featured"><div class="brand-featured-copy"><span class="eyebrow">THE FEATURED LISTING</span><h2>' + e(heroAsset.name) + '</h2><p>' + e(heroAsset.description) + '</p><button class="text-action" data-action="open-asset" data-id="' + e(heroAsset.id) + '">Inspect listing ' + icons.arrow + '</button></div><div class="brand-featured-model">' + modelStage(heroModel, heroAsset.name + " 3D model", "brand-feature", { poster: assetPosterUrl(heroAsset), autoRotate: true, label: "LISTING / " + (heroAsset.catalogId || heroAsset.id) }) + '</div></section>' : '') +
    '<section class="catalog-section" id="catalog"><div class="section-heading"><div><span class="eyebrow">' + e(brand.name) + ' / CATALOGUE</span><h2>Explore the collection.</h2><p>Published listings with details supplied by the destination.</p></div><span class="result-counter">' + String(assets.length).padStart(2, "0") + ' <span>LISTINGS</span></span></div>' +
    '<div id="catalog-content">' + renderCatalog(brand) + '</div></section></section>';
}
function renderAssetPage() {
  const brand = getBrand(state.brandId);
  const asset = brand && getAssets(brand.id).find((item) => item.id === state.assetId);
  if (!brand) return renderNotFound();
  if (!Object.prototype.hasOwnProperty.call(state.assets, brand.id) || state.loading[brand.id]) return '<section class="loading-page"><span class="loader-orbit"></span><h1>Opening the listing</h1><p>Preparing product information.</p></section>';
  if (!asset) return '<section class="not-found-card"><span class="eyebrow">LISTING NOT FOUND</span><h1>This listing is unavailable.</h1><p>The listing may have been unpublished or its identifier may be incorrect.</p><button class="button button-primary" data-action="open-brand" data-id="' + e(brand.id) + '">Return to ' + e(brand.name) + ' ' + icons.arrow + '</button></section>';
  const model = assetModelUrl(asset);
  const poster = assetPosterUrl(asset);
  const price = salePrice(asset);
  const meta = [
    ["Catalogue ID", asset.catalogId || asset.id],
    ["Category", asset.category || ""],
    ["Availability", asset.stockStatus || "Not specified"],
  ].filter((entry) => entry[1]);
  const onSale = isValidSale(asset);
  const discountPercent = actualDiscountPercent(asset);
  return '<section class="product-page"><div class="page-breadcrumb"><button class="back-link" data-action="open-brand" data-id="' + e(brand.id) + '">' + icons.back + ' Back to ' + e(brand.name) + '</button><span>PRODUCT INSPECTION <b>/</b> ' + e(String(asset.id).toUpperCase()) + '</span></div>' +
    '<div class="product-layout"><div class="product-visual-column"><div class="product-stage-wrap">' + modelStage(model, asset.name + " 3D model", "detail", { poster, autoRotate: false, label: (brand.name + " / " + (asset.catalogId || asset.id)).toUpperCase() }) + '</div>' +
    '<div class="product-visual-note"><span>INTERACTIVE MODEL</span><span>DRAG TO ROTATE · SCROLL TO ZOOM</span></div><div class="product-asset-path"><span>MODEL SOURCE</span><code>' + e(brand.folder + "/Assets/" + asset.id + "/" + (asset.model?.src || "No model registered")) + '</code></div></div>' +
    '<aside class="product-info"><span class="eyebrow"><span class="eyebrow-dot"></span> ' + e(brand.name) + ' / CATALOGUE</span>' +
    '<div class="product-title-row"><h1>' + e(asset.name) + '</h1>' + (onSale ? '<span class="sale-pill">ON SALE</span>' : '') + '</div>' +
    '<p class="product-description">' + e(asset.description || "Further details will be published by this destination.") + '</p>' +
    '<div class="product-price-block">' + (onSale ? '<span class="product-old-price">' + e(money(regularPrice(asset), asset.currency)) + '</span>' : '') + '<strong>' + e(money(price, asset.currency)) + '</strong>' +
    (onSale && discountPercent > 0 ? '<span class="sale-description">' + e(String(discountPercent)) + '% configured discount</span>' : '') + '</div>' +
    '<div class="product-status"><span class="stock-indicator"><i></i>' + e(asset.stockStatus || "Availability not specified") + '</span><span>' + e(asset.badge || "CATALOGUE LISTING") + '</span></div>' +
    '<div class="product-metadata"><span class="eyebrow">LISTING DETAILS</span>' + meta.map((row) => '<div class="metadata-row"><span>' + e(row[0]) + '</span><strong>' + e(row[1]) + '</strong></div>').join("") + '</div>' +
    '<button class="button button-primary button-wide" data-action="listing-notice">View listing availability ' + icons.external + '</button><p class="product-action-note">Purchasing is not connected. This page displays catalogue information only.</p>' +
    '<button class="product-save-link ' + (isSaved(brand.id) ? "is-saved" : "") + '" data-action="toggle-saved" data-id="' + e(brand.id) + '" aria-pressed="' + String(isSaved(brand.id)) + '">' + icons.bookmark + (isSaved(brand.id) ? "Destination saved" : "Save destination") + '</button></aside></div></section>';
}
function renderSavedPage() {
  const list = brands.filter((brand) => isSaved(brand.id));
  return '<section class="saved-page"><div class="subpage-intro"><span class="eyebrow">YOUR EYEFIND</span><h1>Places to<br><em>come back to.</em></h1><p>Your saved destinations stay on this device, ready when you need them.</p></div>' +
    (list.length ? '<div class="destination-grid">' + list.map(renderBrandCard).join("") + '</div>' :
      '<div class="empty-state saved-empty"><span class="empty-state-icon">' + icons.bookmark + '</span><h2>Nothing saved yet.</h2><p>Save a destination to keep it close. Your list is private to this browser.</p><button class="button button-primary" data-action="discover">Discover destinations ' + icons.arrow + '</button></div>') +
    '</section>';
}
function renderNotFound() {
  return '<section class="not-found-card"><span class="eyebrow">404 / DESTINATION UNAVAILABLE</span><h1>Looks like a wrong turn.</h1><p>This address does not lead to a registered destination. Return to EYEFIND to find your way.</p><button class="button button-primary" data-action="discover">Back to discover ' + icons.arrow + '</button></section>';
}
function render() {
  if (!root) return;
  const content = state.page === "home" ? renderHome() : state.page === "saved" ? renderSavedPage()
    : state.page === "brand" ? renderBrandPage() : state.page === "asset" ? renderAssetPage() : renderNotFound();
  root.innerHTML = shell(content);
  document.title = state.page === "brand" && getBrand(state.brandId) ? getBrand(state.brandId).name + " — EYEFIND"
    : state.page === "asset" ? ((getAssets(state.brandId).find((item) => item.id === state.assetId)?.name || "Listing") + " — EYEFIND")
    : state.page === "saved" ? "Saved destinations — EYEFIND" : state.page === "not-found" ? "Destination unavailable — EYEFIND" : "EYEFIND — The city, connected.";
  document.body.classList.toggle("is-detail-page", state.page === "asset");
  document.body.classList.toggle("is-scrolled", window.scrollY > 12);
  if (state.paletteOpen) openPalette(false);
  wireModelViewers(root);
}
function updateDirectory() {
  const result = document.getElementById("directory-results");
  const heading = document.getElementById("directory-title");
  const count = document.querySelector(".result-counter");
  if (!result || !heading || !count) return;
  const matches = filteredBrands();
  const productMatches = filteredAssets();
  heading.textContent = state.query.trim() ? 'Results for "' + state.query.trim() + '"' :
    state.filter === "automotive" ? "Made to move." : state.filter === "specialist" ? "Specialist destinations." : "Destinations worth knowing.";
  count.innerHTML = String(matches.length + productMatches.length).padStart(2, "0") + ' <span>' + (matches.length + productMatches.length === 1 ? "MATCH" : "MATCHES") + '</span>';
  result.innerHTML = renderDirectoryResults();
  const note = document.querySelector(".directory-note");
  if (note) note.textContent = state.query.trim() ? String(matches.length + productMatches.length).padStart(2, "0") + " MATCHES" : "Curated for the city";
  document.querySelectorAll("[data-action='category']").forEach((button) => {
    const active = button.dataset.filter === state.filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
function updatePaletteResults() {
  const target = document.getElementById("palette-results");
  if (!target) return;
  const query = normalizeSearch(state.query);
  const found = brands.filter((brand) => !query || searchableBrand(brand).includes(query));
  const products = matchingAssets(state.query);
  const brandRows = found.map((brand) =>
    '<button class="palette-result" data-action="open-brand" data-id="' + e(brand.id) + '">' + logo(brand, "brand-logo brand-logo--small") +
    '<span><strong>' + e(brand.name) + '</strong><small>' + e(brand.legalName) + '</small></span><span class="palette-result-arrow">' + icons.arrow + '</span></button>'
  );
  const productRows = products.map((asset) => {
    const brand = getBrand(asset.brandId);
    return '<button class="palette-result palette-result--product" data-action="open-asset" data-brand="' + e(asset.brandId) + '" data-id="' + e(asset.id) + '">' +
      '<span class="palette-product-mark">' + icons.grid + '</span><span><strong>' + e(asset.name) + '</strong><small>' + e((brand ? brand.name + " · " : "") + (asset.category || "Catalogue listing")) + '</small></span><span class="palette-result-arrow">' + icons.arrow + '</span></button>';
  });
  const rows = brandRows.concat(productRows);
  target.innerHTML = rows.length ? rows.join("") :
    '<div class="palette-empty"><strong>No matching destinations.</strong><span>Try a name, category or description.</span><button data-action="clear-search">Clear search</button></div>';
}
function openPalette(focus = true) {
  const overlay = document.getElementById("search-overlay");
  if (!overlay) return;
  state.paletteOpen = true;
  overlay.hidden = false;
  document.body.classList.add("palette-open");
  const input = document.getElementById("palette-search");
  if (input) {
    input.value = state.query;
    updatePaletteResults();
    if (focus) requestAnimationFrame(() => input.focus());
  }
}
function closePalette(restoreFocus = true) {
  state.paletteOpen = false;
  const overlay = document.getElementById("search-overlay");
  if (overlay) overlay.hidden = true;
  document.body.classList.remove("palette-open");
  const homeInput = document.getElementById("home-search");
  if (homeInput) homeInput.value = state.query;
  if (state.page === "home") updateDirectory();
  if (restoreFocus) {
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    (mobile ? document.querySelector(".mobile-search") : document.querySelector(".header-search"))?.focus();
  }
}
function focusSearch() {
  if (state.page !== "home" && state.page !== "saved") {
    navigate("home");
    openPalette(true);
  } else openPalette(true);
}
function browseDirectory() {
  if (state.page !== "home") {
    navigate("home");
    requestAnimationFrame(() => document.getElementById("directory")?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" }));
  } else {
    document.getElementById("directory")?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
    document.querySelector(".directory-section .filter-chip")?.focus({ preventScroll: true });
  }
}
function runSearch(query = state.query) {
  state.query = String(query || "").trim();
  state.filter = "all";
  if (state.page !== "home") navigate("home");
  else {
    const input = document.getElementById("home-search");
    if (input) input.value = state.query;
    updateDirectory();
  }
  closePalette(false);
  if (state.query) document.getElementById("directory")?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
}
function clearSearch() {
  state.query = "";
  state.filter = "all";
  const input = document.getElementById("home-search");
  if (input) input.value = "";
  const palette = document.getElementById("palette-search");
  if (palette) palette.value = "";
  updateDirectory();
  updatePaletteResults();
}
function openBrand(id) {
  if (!getBrand(id)) { navigate("not-found"); return; }
  navigate("brand", { brandId: id });
}
function openAsset(id) {
  const brand = getBrand(state.brandId);
  if (!brand) return;
  navigate("asset", { brandId: brand.id, assetId: id });
  void ensureBrandAssets(brand.id);
}
async function openConfiguredAsset(brandId, assetId) {
  if (!getBrand(brandId)) return;
  await ensureBrandAssets(brandId);
  if (getAssets(brandId).some((asset) => asset.id === assetId)) navigate("asset", { brandId, assetId });
  else openBrand(brandId);
}
function handleAction(target, event) {
  const action = target.dataset.action;
  if (!action) return;
  if (action === "discover") { event.preventDefault(); navigate("home"); }
  else if (action === "saved") { event.preventDefault(); navigate("saved"); }
  else if (action === "browse") { event.preventDefault(); browseDirectory(); }
  else if (action === "focus-search") { event.preventDefault(); focusSearch(); }
  else if (action === "close-search") { event.preventDefault(); closePalette(); }
  else if (action === "open-brand") { event.preventDefault(); openBrand(target.dataset.id); }
  else if (action === "toggle-saved") { event.preventDefault(); event.stopPropagation(); toggleSaved(target.dataset.id); }
  else if (action === "category") { event.preventDefault(); state.filter = target.dataset.filter || "all"; updateDirectory(); }
  else if (action === "clear-search") { event.preventDefault(); clearSearch(); closePalette(false); if (state.page !== "home") navigate("home"); }
  else if (action === "open-asset") {
    event.preventDefault();
    const brandId = target.dataset.brand || state.brandId;
    if (brandId && brandId !== state.brandId) navigate("asset", { brandId, assetId: target.dataset.id });
    else openAsset(target.dataset.id);
  }
  else if (action === "open-configured-asset") { event.preventDefault(); void openConfiguredAsset(target.dataset.brand, target.dataset.id); }
  else if (action === "retry-brand") {
    event.preventDefault();
    delete state.assets[target.dataset.id];
    delete state.catalogErrors[target.dataset.id];
    void ensureBrandAssets(target.dataset.id);
    render();
  } else if (action === "listing-notice") {
    event.preventDefault();
    toast("Catalogue inspection only. Purchasing is not connected to the game.");
  }
}
root.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (target) handleAction(target, event);
});
root.addEventListener("submit", (event) => {
  if (event.target.id === "home-search-form") {
    event.preventDefault();
    runSearch(document.getElementById("home-search")?.value || "");
  }
});
root.addEventListener("input", (event) => {
  if (event.target.id === "home-search") {
    state.query = event.target.value;
    updateDirectory();
  }
});
document.addEventListener("input", (event) => {
  if (event.target.id === "palette-search") {
    state.query = event.target.value;
    updatePaletteResults();
  }
});
document.addEventListener("submit", (event) => {
  if (event.target.id === "palette-form") {
    event.preventDefault();
    runSearch(document.getElementById("palette-search")?.value || "");
  }
});
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target || root.contains(target)) return;
  handleAction(target, event);
});
document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if ((event.metaKey || event.ctrlKey) && key === "k") {
    event.preventDefault();
    openPalette(true);
  } else if (event.key === "Escape" && state.paletteOpen) {
    event.preventDefault();
    closePalette();
  } else if (event.key === "Escape" && document.activeElement?.id === "home-search") {
    const input = document.getElementById("home-search");
    if (input?.value) { clearSearch(); input.blur(); }
  } else if (event.key === "Tab" && state.paletteOpen) {
    const overlay = document.getElementById("search-overlay");
    const focusable = overlay ? [...overlay.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')].filter((node) => node.offsetParent !== null) : [];
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
window.addEventListener("popstate", activateCurrentRoute);
window.addEventListener("hashchange", () => {
  const route = readRoute();
  if (route.page !== state.page || route.brandId !== state.brandId || route.assetId !== state.assetId) activateCurrentRoute();
});
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY > 12;
  if (document.body.classList.contains("is-scrolled") !== scrolled) document.body.classList.toggle("is-scrolled", scrolled);
}, { passive: true });
root.addEventListener("pointermove", (event) => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const surface = event.target.closest(".destination-card, .featured-vehicle, .brand-hero, .product-info");
  if (!surface) return;
  const rect = surface.getBoundingClientRect();
  surface.style.setProperty("--pointer-x", ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + "%");
  surface.style.setProperty("--pointer-y", ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + "%");
});
if (!location.hash) history.replaceState({ page: "home" }, "", "#/discover");
activateCurrentRoute();
void Promise.all(brands.map((brand) => ensureBrandAssets(brand.id))).then(() => {
  if (state.page === "home") updateDirectory();
});

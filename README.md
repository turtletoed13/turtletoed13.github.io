# EYEFIND

EYEFIND is the fictional city internet used by the game: a curated directory for in-world destinations, automotive showrooms, specialist suppliers, and interactive listings. The interface uses a restrained graphite palette, editorial typography, subtle environmental lighting, and a consistent motion system.

## Hosting architecture

The root directory is the canonical static experience.

- **GitHub Pages** serves the static entry, styles, application module, and brand assets directly from the repository root.
- **Vercel** uses the thin Next.js shell in the app directory. The prebuild sync script copies the same root assets and the complete brands tree into public; the app does not maintain a second copy of the interface.
- Both hosts use the same hash routes, catalogue data, model URL convention, and browser-local saved-destination storage.

The sync script validates required files and verifies that the original Arashi GLB is copied without changing its size before the Next.js build proceeds.

## Current registered destinations

Only the two destinations in brands/registry.js are published:

- **MORSA** — Military Ordnance, Restricted Stock & Acquisition
- **Scorpion** — Scorpion Automotive Dealership & Performance

Scorpion starts with an empty catalogue by design. No placeholder cars, prices, reviews, or stock are presented as real listings.

The featured model is **Heavy, ST-17 Arashi** at brands/MORSA/Assets/arashi/model/arx_apc.glb. The homepage feature, catalogue card, and detail page all point to this one canonical GLB; the model is not duplicated between presentations.

## Main project layout

    index.html                         GitHub Pages entry point
    styles.css                         design tokens, responsive layout and motion
    app.js                             navigation, search, catalogue and model viewer
    app/
      layout.tsx                       Vercel document shell
      page.tsx                         Vercel entry point
      globals.css                      minimal Next.js reset
    scripts/
      sync-static.mjs                  deterministic, validated static-asset sync
    brands/
      registry.js                      explicit destination registration
      resolve-config.js                shared listing metadata resolver
      MORSA/
        config.js                      brand identity and generated catalog defaults
        Brand/                         logo and brand-wide identity assets
        Assets/
          _TEMPLATE/                   copyable starter configuration; never inventory
          arashi/
            config.js                  dedicated Heavy, ST-17 Arashi listing
            model/arx_apc.glb          canonical GLB model
      Scorpion/
        config.js
        Brand/
        Assets/_TEMPLATE/

## Run and build

Use Node.js 22 or newer and install the dependencies in package.json.

~~~sh
npm install
npm run dev
npm run lint
npm run build
~~~

The build synchronizes the root static experience into public before running next build. The root GitHub Pages app does not require a Next.js build.

## Add a listing

1. Copy a brand's Assets/_TEMPLATE/ directory to a new lowercase, URL-safe listing ID.
2. Edit that folder's config.js, keeping id identical to the folder name.
3. Add listing imagery and/or a browser-compatible GLB file under the listing's own images/ and model/ directories.
4. Register the folder ID in the assets array in the parent brand's config.js.

Only IDs explicitly listed in assets are loaded. The generic _TEMPLATE folder is always excluded from live catalogue inventory. All pages consume the same normalized listing object from resolve-config.js.

## Listing configuration modes

A brand's catalog.configSource selects the default mode. An individual listing can use "inherit", "brand", or "generated".

- **brand** uses the listing's own fields for description, visibility, sale state, price, stock status, and badge.
- **generated** uses catalog.generatedConfig for shared description templates, visibility, sale state, discount percentage, shared prices, currency, and badge.
- **inherit** follows the brand-level switch.

Generated description templates safely interpolate {name}, {brandName}, {legalName}, and {category}; they do not evaluate JavaScript. An unset generated price may fall back to a listing's configured price. The effective sale and visibility state still comes from the selected mode.

The homepage, catalogue cards, search suggestions, and product inspection page use shared resolution and pricing rules. A sale must be explicitly enabled and yield a real lower effective price before sale styling or a strikethrough is shown. Missing prices display as **Price on request**.

## 3D model behavior

The interactive GLB viewer is initialized only when a page contains a registered model preview. The featured Arashi stage is prioritized; below-the-fold preview cards use lazy loading. Model errors and slow loads have clear UI fallbacks, and the rest of the site remains navigable if WebGL or the external viewer library is unavailable.

The site loads Google's browser-compatible model-viewer library from its public CDN. The app itself and all brand configuration/model assets remain on the selected host.

## Product scope

This repository contains fictional game-world interface and catalogue presentation. It does not implement accounts, payment processing, inventory ownership, or a game commerce bridge. Listing action controls state that limitation rather than simulating a completed transaction. Saved destinations are stored locally in the user's current browser only.

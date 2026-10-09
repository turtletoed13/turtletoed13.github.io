# EYEFIND

EYEFIND is a dark, premium, responsive in-world directory for fictional city destinations — inspired by the usefulness of a game-world web portal, with a calmer editorial interface.

The GitHub Pages entry is a static app served directly from the repository root; it has no client build requirement. The companion Vercel deployment uses a thin Next.js shell and copies the same root assets into public/ at build time, so both hosts serve the same EYEFIND experience.

## Current destinations

Only these two destinations are registered:

- **MORSA** — Military Ordnance, Restricted Stock & Acquisition
- **Scorpion** — Scorpion Automotive Dealership & Performance

Their catalogues intentionally start empty. No extra brands or placeholder vehicles are shown as real listings. New listings appear when their asset folders are registered in the relevant brand config.

## Project layout

    index.html                  EYEFIND app entry
    styles.css                  responsive visual system, motion and browser styles
    app.js                      search, routes, saved destinations and catalogue renderer
    favicon.svg                 site icon
    404.html                    branded not-found page
    brands/
      registry.js               registered destinations
      resolve-config.js         shared brand/generated listing config resolver
      MORSA/
        config.js               MORSA identity + catalog defaults
        Brand/
          brand.json            identity metadata
          logo.svg              brand mark
          images/               brand-level artwork and identity images
        Assets/
          _TEMPLATE/
            config.js           copy this for each listing
            model/              3D model slot
            images/             listing previews and gallery
          <listing-id>/         one folder per real listing
            config.js
            model/
            images/
      Scorpion/
        config.js
        Brand/
        Assets/
          _TEMPLATE/
          <listing-id>/

## Add a listing

1. Copy the relevant brand's Assets/_TEMPLATE directory to a new folder. Use a lowercase URL-safe ID, for example sport-coupe-01.
2. Edit the new folder's config.js. Set its id, name, catalogue ID, description, price, sale flags, stock status and model path.
3. Put a browser-ready GLB/glTF file in that listing's model/ folder. The default model path is model/model.glb. Place the preview image at images/preview.webp, or change poster and images in the config.
4. Add the folder ID to the assets array in the parent brand's config.js.

The app imports configured listing files, resolves their settings, and builds the catalogue automatically. Unregistered folders — including _TEMPLATE — are not treated as live inventory.

## Brand config vs. generated config

Each brand's config.js exposes a single catalog mode switch:

    catalog: {
      configSource: "generated",
      generatedConfig: {
        descriptionTemplate: "{name} is part of the {brandName} catalogue.",
        visible: true,
        onSale: false,
        salePercent: 0,
        price: null,
        stockStatus: "Available"
      }
    }

Set catalog.configSource to:

- **brand** — a listing's own Assets/<id>/config.js controls its description, visibility, sale state, pricing overrides, stock status and badge.
- **generated** — the brand's generatedConfig controls shared defaults including generated descriptions, visibility, on-sale state and sale percentage.

Each listing can override the brand-wide switch using configSource: "inherit", "brand" or "generated". Inherit is the normal choice. In generated mode, a null generated price falls back to the listing's configured price; generated sale and visibility settings remain authoritative. This is what makes the on-sale controls predictable across an entire brand.

The shared resolver is brands/resolve-config.js. Keep brand-specific identity and defaults in the brand config, and item-specific model paths and metadata in the item's own config.

## Brand files vs. listing assets

- Brand/ holds a destination's identity: logos, campaign imagery, wordmarks, textures and reference artwork.
- Assets/<listing-id>/ holds one vehicle or stock listing: its config, 3D model, preview poster and product images.
- Assets/_TEMPLATE/ is a starter folder, not a published product.

For interactive 3D previews, the site lazy-loads Google's model-viewer component only when a listing includes a model. GLB is the simplest portable format; use compatible glTF files when their referenced resources are available at their configured paths.

## Add another brand later

Create its own config.js, Brand/ and Assets/ tree following either existing destination as the template. Then import the new config and add it to the brands array in brands/registry.js. Do not place listing configuration in the registry; the registry only discovers destinations.

## UX features

- Responsive directory, search and category filtering
- Search by destination name, official name, category, domain and description
- Direct shareable routes using hash URLs
- Local Saved destinations, stored only in the current browser
- Accessible focus states, reduced-motion support, responsive layouts and no-build static deployment
- Brand-specific pages with generated catalogue entries and interactive 3D viewer support

Purchases, inventory ownership and in-game delivery are not simulated by EYEFIND. Those require a future game/server integration.


## Featured vehicle: Heavy, ST-17 Arashi

The MORSA catalogue now includes the Heavy, ST-17 Arashi in the arashi listing folder. Its uploaded GLB was moved out of the template into that real listing's model folder. The homepage features an interactive 3D viewer, and the MORSA listing page includes the same model in its catalogue and detail view. The model can be rotated and inspected in the browser; no purchase or inventory authority is simulated.

The MORSA config points to the featured listing with featuredAsset, featuredModel, and assets. Leave _TEMPLATE generic so it can be copied for the next listing.

# NOLINE

Premium in-world browser client for the future game.

## Repository layout

```
app/
  page.tsx                 # browser entry
  config/page.tsx          # standalone configuration view

components/
  animations/              # reusable motion primitives
    FadeScale.tsx
    Pressable.tsx
  browser/                 # browser chrome + orchestration
    BrowserChrome.tsx
    BasketDrawer.tsx
    CheckoutModal.tsx
    CommandCenter.tsx
    NolineBrowser.tsx
  catalog/                 # vehicle commerce UI
    VehicleCard.tsx
    VehicleDetail.tsx
    VehicleInspector.tsx
  pages/                   # product/site/browser pages
    HomePage.tsx
    ServicesPage.tsx
    MarketPage.tsx
    ShowroomPage.tsx
    SitePage.tsx
    UtilityPages.tsx
    ConfigBrowserPage.tsx

config/
  noline.config.ts         # central behavior/integration config

data/
  navigation.ts             # browser route registry
  sites.ts                  # in-world website registry
  site-queries.ts           # website lookup helpers
  vehicles.ts               # vehicle catalog
  vehicle-queries.ts        # vehicle lookup/search helpers
  sales.ts                  # on-sale/full-price/special groupings
  products.ts               # non-vehicle commerce

public/images/vehicles/     # catalog artwork assets

types/
  catalog.ts                # shared catalog/site types

lib/
  store.ts                  # purchase + future game bridge
```

## Browser features

NOLINE currently includes browser chrome, tabs, address/search behavior, services, command center, history, bookmarks, downloads, settings, diagnostics, local persistence, catalog filters, full vehicle inspection and checkout.

### Command trigger

Type:

`cmdrun5`

into the NOLINE address bar.

It opens the command interface. `⌘K` / `Ctrl+K` is also supported.

### Catalog states

Mercury Market has explicit sections for:

- **On sale**
- **Full price**
- **Special vehicles**

Every vehicle carries a stable catalog ID, manufacturer, class, stock state, price, optional original price, sale metadata, tags, specs, features, factory finishes and artwork.

Featured special vehicle:

**Heavy, *ST-17* Arashi**

Manufacturer:

**Kuroda Heavy Industries**

### Purchase architecture

The UI never becomes the authority for currency, inventory or ownership.

`lib/store.ts` is the handoff boundary. The future game can install:

```ts
window.NOLINE_GAME_BRIDGE = {
  purchase: async (context) => gamePurchase(context),
  navigate: (url) => gameNavigate(url),
  getState: () => gameState,
};
```

That lets the game provide identity, wallet, inventory, ownership, delivery and server-authoritative purchasing later without rebuilding the browser.

## Configuration

Central browser behavior lives in:

`config/noline.config.ts`

The dedicated configuration view is available at:

`/config`

The in-browser route is:

`noline://config`

## Design system

NOLINE is intentionally dark, restrained and spatial:

- obsidian/graphite surfaces instead of flat gray
- layered liquid glass browser chrome
- subtle blur and saturation
- restrained edge lighting
- blue interaction states for actionable controls
- dimmed unavailable states
- press feedback
- pop/slide/reveal motion
- reduced-motion support
- responsive layouts

The animation primitives are isolated under `components/animations`, so additional motion can be added without scattering animation logic throughout the catalog.

## Development

```bash
npm install
npm run dev
```

NOLINE has no account system yet. Browser preferences and lightweight browsing state are local until the future game identity layer is connected.

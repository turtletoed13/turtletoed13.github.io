# NOLINE

**NOLINE** is the premium in-world browser client for the future game.

## Included now

- Full dark, glass-heavy browser chrome with responsive desktop/mobile layouts
- Tabs, address/search bar, navigation controls, service launcher and browser menu
- Hidden command trigger: type `cmdrun5` into the address bar to reveal the command interface
- Command search for services and vehicles
- Local history, bookmarks, basket and browser preferences
- Service directory with 11 fictional in-world sites
- Mercury Market storefront
- Ironclad Exchange for heavy/high-mobility vehicles
- Aurelion Motors luxury/exotic showroom
- Dedicated vehicle inspection pages
- Full digital inspection modal with specifications, factory finishes, feature list and availability
- Favorites + bookmarks
- Basket drawer with removal and subtotal
- Premium checkout flow with loading state, success transition and receipt
- Purchase UI that turns into a future game handoff instead of inventing an account or payment backend
- Diagnostics surface for checking local storage, catalog, checkout and future game bridge
- Reduced-motion support
- Local persistence via `localStorage`

## Featured vehicle

**Heavy, *ST-17* Arashi**

Manufacturer: **Kuroda Heavy Industries**

Catalog ID: `NOLINE-ARASHI`

The vehicle is intentionally fictional and uses a dedicated inspection experience so the game can later replace the catalog data without rebuilding the UI.

## Plug-in game architecture

The browser does **not** own authoritative currency, inventory, ownership or account state.

The integration boundary is `lib/store.ts`.

At game launch, wire a bridge like:

```ts
window.NOLINE_GAME_BRIDGE = {
  purchase: async (context) => {
    // Call your server-authoritative purchase/economy layer.
    return gamePurchase(context);
  },
  navigate: (url) => {
    // Optional game-side routing.
    gameNavigate(url);
  },
  getState: () => {
    // Optional current player/game state.
    return gameState;
  },
};
```

The existing UI can stay intact while the future game supplies:

- player identity
- wallet/balance
- ownership
- inventory
- purchase authorization
- delivery/garage assignment
- game-side website routing
- player-specific settings/profile sync

## Current browser behavior

NOLINE is intentionally usable without an account. Browser preferences and lightweight browsing data are local until the game account layer exists.

`cmdrun5` is a real browser command, not placeholder copy.

## Development

```bash
npm install
npm run dev
```

The project uses Next.js App Router and a single client-side browser surface so the game integration point stays easy to replace or embed later.

## Branding

Browser name: **NOLINE**

Vehicle naming example:

**Heavy, *ST-17* Arashi**

# NOLINE Architecture

NOLINE is split into layers so the future game can replace data and backend behavior without forcing a UI rewrite.

## Layers

### app
Next.js route entry points only. The root page mounts the browser. The config route exposes central configuration in a standalone view.

### components/browser
Browser behavior and chrome live here:

- address bar
- service launcher
- browser menu
- command center
- basket
- checkout
- top-level state orchestration

### components/pages
Screen-level experiences live here:

- home
- service directory
- generic site pages
- market
- showroom
- utility pages
- configuration

### components/catalog
Vehicle-specific presentation:

- cards
- detail pages
- digital inspection
- stock, sale and special-state presentation

### components/animations
Reusable motion primitives. Keep new popup, button and reveal behavior here when possible.

### data
Pure content and lookup logic:

- sites.ts — websites
- vehicles.ts — vehicles
- products.ts — non-vehicle commerce
- sales.ts — catalog groupings
- navigation.ts — browser addresses
- query modules — stable lookup and search helpers

### config
Central browser and future integration switches.

### types
Shared domain types. Do not duplicate catalog shapes inside components.

### lib
Integration boundaries. Currency, inventory, ownership and purchases should eventually resolve here or behind the game bridge.

### public/images
Artwork and image assets. Vehicle records point at assets without changing card or detail components.

## Game integration boundary

The future game owns:

`identity -> wallet -> inventory -> ownership -> purchase authorization -> delivery`

NOLINE owns:

`presentation -> browsing -> local UX state -> checkout ceremony`

This keeps the browser usable before the game exists while giving the game a clean attachment point later.

## Catalog lifecycle

A vehicle can move between:

`regular -> sale -> special -> unavailable`

without changing the component tree. Catalog data determines labels, filters and purchase presentation.

## Command surface

The browser command surface is address-bar driven:

`cmdrun5`

This can later expand into commands for navigation, marketplace actions, account features, diagnostics and game-specific tools.
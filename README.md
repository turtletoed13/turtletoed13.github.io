# NOLINE

NOLINE is the premium in-world browser client for the game.

## Current scope

- Premium dark browser shell
- Tabs, address bar and service launcher
- NOLINE home / new-tab experience
- In-world service directory
- Local basket and purchase UI
- No account system
- No real payment processing
- Plug-in purchase boundary for the future game backend
- Responsive desktop/mobile presentation
- Reduced-motion support

## Architecture

The client deliberately keeps game identity and commerce outside the UI.

`lib/store.ts` is the integration boundary. When the game exists, connect:

- account/session state
- player balance
- inventory
- ownership
- purchases
- server-authoritative checkout
- website routing

The browser UI should not be trusted with currency or ownership decisions.

## Development

```bash
npm install
npm run dev
```

Then open the local Next.js development server.

## Branding

Browser name: **NOLINE**

Vehicle naming format example:

**Heavy, ST-17 Arashi**

NOLINE is the browser/product name and is intentionally independent from the future game's account system.
export const nolineConfig = {
  brand: {
    name: "NOLINE",
    protocol: "noline://",
    commandTrigger: "cmdrun5",
    commandShortcut: "Mod+K",
  },
  browser: {
    defaultRoute: "noline://home",
    glass: true,
    motion: true,
    compact: false,
    persistLocalState: true,
  },
  commerce: {
    currency: "USD",
    allowGuestBrowsing: true,
    accountRequired: false,
    authoritativeOwner: "game-server",
    purchaseBoundary: "lib/store.ts",
  },
  catalog: {
    featuredVehicleId: "arashi",
    showSalePrices: true,
    showUnavailableStock: true,
    showSpecialVehicles: true,
  },
  integration: {
    bridgeKey: "NOLINE_GAME_BRIDGE",
    identity: "future",
    inventory: "future",
    wallet: "future",
    ownership: "future",
    delivery: "future",
  },
} as const;

export type NolineConfig = typeof nolineConfig;

export type NolineProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  manufacturer?: string;
};

export type PurchaseContext = {
  product: NolineProduct;
  quantity: number;
  total: number;
  source?: string;
};

/**
 * Browser ↔ game purchase boundary.
 *
 * Until the game exists, NOLINE does not own authoritative currency,
 * inventory, ownership, identity, or payment state.
 */
export async function createPurchase(context: PurchaseContext) {
  if (typeof window !== "undefined") {
    const bridge = (window as typeof window & {
      NOLINE_GAME_BRIDGE?: NolineGameBridge;
    }).NOLINE_GAME_BRIDGE;

    if (bridge?.purchase) {
      return await bridge.purchase(context);
    }
  }

  return {
    ok: true,
    status: "integration_pending" as const,
    context,
  };
}

export function navigateToGame(url: string) {
  if (typeof window === "undefined") return false;

  const bridge = (window as typeof window & {
    NOLINE_GAME_BRIDGE?: NolineGameBridge;
  }).NOLINE_GAME_BRIDGE;

  const handler = bridge?.navigate ?? bridge?.open;
  if (handler) {
    handler(url);
    return true;
  }

  return false;
}

export type NolineGameBridge = {
  purchase?: (context: PurchaseContext) => Promise<unknown> | unknown;
  navigate?: (url: string) => void;
  open?: (url: string) => void;
  getState?: () => unknown;
};

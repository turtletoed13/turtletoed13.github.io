export type NolineProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

export type PurchaseContext = {
  product: NolineProduct;
  quantity: number;
  total: number;
};

/**
 * Plug-in purchase boundary.
 *
 * The browser intentionally does not own accounts, balances, or payment logic.
 * When the game backend exists, replace this function with the game's purchase
 * bridge/API call. The UI can remain unchanged.
 */
export async function createPurchase(context: PurchaseContext) {
  return {
    ok: true,
    status: "ready",
    context,
  };
}

/**
 * Optional game bridge. A host application can assign:
 * window.NOLINE_GAME_BRIDGE = { purchase, open, getState }
 */
export type NolineGameBridge = {
  purchase?: (context: PurchaseContext) => Promise<unknown> | unknown;
  open?: (url: string) => void;
  getState?: () => unknown;
};
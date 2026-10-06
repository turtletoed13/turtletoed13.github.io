import { sites } from "./sites";
import type { NolineSite } from "../types/catalog";

export function getSiteById(id: string): NolineSite {
  return sites.find((site) => site.id === id) ?? sites[0];
}

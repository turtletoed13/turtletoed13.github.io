export type SaleStatus = "sale" | "regular" | "special";
export type StockStatus = "in-stock" | "limited" | "unavailable";

export type VehicleStat = {
  label: string;
  value: string;
};

export type Vehicle = {
  id: string;
  name: string;
  manufacturer: string;
  brand: string;
  category: "Heavy" | "Luxury" | "Performance" | "Utility";
  className: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  saleStatus: SaleStatus;
  saleLabel?: string;
  stock: StockStatus;
  stockLabel: string;
  specialVehicle?: boolean;
  featured?: boolean;
  delivery: string;
  catalogId: string;
  image?: string;
  stats: VehicleStat[];
  features: string[];
  colors: string[];
  tags: string[];
};

export type NolineSite = {
  id: string;
  name: string;
  domain: string;
  category: string;
  tagline: string;
  description: string;
  glyph: string;
  serviceStatus: "live" | "planned";
};

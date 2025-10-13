// Core data types matching Directus schema

export interface AppUser {
  id: string;
  email: string;
  display_name?: string;
  currency: string; // e.g., "EUR", "USD"
  unit_system: "metric" | "imperial";
  distance_unit: "km" | "mi"; // Derived from unit_system
  volume_unit: "L" | "gal"; // Derived from unit_system
  time_zone: string; // e.g., "Europe/Berlin"
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  name: string;
  make?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  created_at: string;
  updated_at: string;
}

export interface FuelEntry {
  id: string;
  user_id: string;
  vehicle_id: string;
  entry_date: string; // ISO date
  odometer: number; // in km (stored)
  station: string;
  brand: string;
  grade: string;
  liters: number; // stored in L
  total: number; // cost in user's currency
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Derived/computed metrics (not stored, calculated client-side)
export interface FuelEntryWithMetrics extends FuelEntry {
  distance_since_last?: number;
  unit_price: number;
  consumption_l_per_100km?: number;
  consumption_mpg?: number;
  cost_per_km?: number;
  cost_per_mile?: number;
}

// Directus-style API response wrapper
export interface DirectusResponse<T> {
  data: T;
}

export interface DirectusListResponse<T> {
  data: T[];
}

// Statistics types
export interface RollingStats {
  avg_cost_per_liter: number;
  avg_consumption: number;
  avg_distance_per_day: number;
  avg_cost_per_km: number;
  total_spend: number;
  total_distance: number;
  period_days: number;
}

export interface BrandGradeStats {
  brand: string;
  grade: string;
  avg_cost_per_liter: number;
  avg_consumption: number;
  fillup_count: number;
}

// UI state types
export type PeriodType = "30" | "90" | "ytd" | "custom";

export interface DateRange {
  start: string;
  end: string;
}

// Fuel consumption and cost calculation utilities

import { FuelEntry, FuelEntryWithMetrics, RollingStats, BrandGradeStats } from "@/types";

// Unit conversion constants
export const LITERS_PER_GALLON = 3.78541;
export const KM_PER_MILE = 1.60934;

/**
 * Calculate derived metrics for a single fuel entry
 * Requires previous entry for distance calculation
 */
export function calculateMetrics(
  entry: FuelEntry,
  previousEntry: FuelEntry | null
): FuelEntryWithMetrics {
  const distance_since_last = previousEntry
    ? entry.odometer - previousEntry.odometer
    : undefined;

  const unit_price = parseFloat((entry.total / entry.liters).toFixed(2));

  let consumption_l_per_100km: number | undefined;
  let consumption_mpg: number | undefined;
  let cost_per_km: number | undefined;
  let cost_per_mile: number | undefined;

  if (distance_since_last && distance_since_last > 0) {
    // Metric consumption: L/100km
    consumption_l_per_100km = parseFloat(
      ((entry.liters / distance_since_last) * 100).toFixed(1)
    );

    // Imperial consumption: MPG
    const miles = distance_since_last / KM_PER_MILE;
    const gallons = entry.liters / LITERS_PER_GALLON;
    consumption_mpg = parseFloat((miles / gallons).toFixed(1));

    // Cost per distance
    cost_per_km = parseFloat((entry.total / distance_since_last).toFixed(2));
    cost_per_mile = parseFloat((cost_per_km * KM_PER_MILE).toFixed(2));
  }

  return {
    ...entry,
    distance_since_last,
    unit_price,
    consumption_l_per_100km,
    consumption_mpg,
    cost_per_km,
    cost_per_mile,
  };
}

/**
 * Calculate metrics for all entries (sorted by date ascending)
 */
export function calculateAllMetrics(entries: FuelEntry[]): FuelEntryWithMetrics[] {
  // Sort by vehicle and date
  const sortedByVehicle = entries.reduce((acc, entry) => {
    if (!acc[entry.vehicle_id]) {
      acc[entry.vehicle_id] = [];
    }
    acc[entry.vehicle_id].push(entry);
    return acc;
  }, {} as Record<string, FuelEntry[]>);

  const results: FuelEntryWithMetrics[] = [];

  // Process each vehicle's entries separately
  Object.values(sortedByVehicle).forEach((vehicleEntries) => {
    const sorted = [...vehicleEntries].sort(
      (a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
    );

    sorted.forEach((entry, index) => {
      const previousEntry = index > 0 ? sorted[index - 1] : null;
      results.push(calculateMetrics(entry, previousEntry));
    });
  });

  return results;
}

/**
 * Calculate rolling statistics for a given period
 */
export function calculateRollingStats(
  entries: FuelEntryWithMetrics[],
  days: number
): RollingStats {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  const periodEntries = entries.filter(
    (e) => new Date(e.entry_date) >= startDate
  );

  if (periodEntries.length === 0) {
    return {
      avg_cost_per_liter: 0,
      avg_consumption: 0,
      avg_distance_per_day: 0,
      avg_cost_per_km: 0,
      total_spend: 0,
      total_distance: 0,
      period_days: days,
    };
  }

  const total_spend = periodEntries.reduce((sum, e) => sum + e.total, 0);
  const total_liters = periodEntries.reduce((sum, e) => sum + e.liters, 0);
  const total_distance = periodEntries.reduce(
    (sum, e) => sum + (e.distance_since_last || 0),
    0
  );

  const entriesWithConsumption = periodEntries.filter(
    (e) => e.consumption_l_per_100km !== undefined
  );
  const avg_consumption =
    entriesWithConsumption.length > 0
      ? parseFloat(
          (
            entriesWithConsumption.reduce(
              (sum, e) => sum + (e.consumption_l_per_100km || 0),
              0
            ) / entriesWithConsumption.length
          ).toFixed(1)
        )
      : 0;

  const entriesWithCostPerKm = periodEntries.filter(
    (e) => e.cost_per_km !== undefined
  );
  const avg_cost_per_km =
    entriesWithCostPerKm.length > 0
      ? parseFloat(
          (
            entriesWithCostPerKm.reduce((sum, e) => sum + (e.cost_per_km || 0), 0) /
            entriesWithCostPerKm.length
          ).toFixed(2)
        )
      : 0;

  return {
    avg_cost_per_liter: parseFloat((total_spend / total_liters).toFixed(2)),
    avg_consumption,
    avg_distance_per_day: Math.round(total_distance / days),
    avg_cost_per_km,
    total_spend: parseFloat(total_spend.toFixed(2)),
    total_distance: Math.round(total_distance),
    period_days: days,
  };
}

/**
 * Calculate statistics grouped by brand and grade
 */
export function calculateBrandGradeStats(
  entries: FuelEntryWithMetrics[]
): BrandGradeStats[] {
  const grouped = entries.reduce((acc, entry) => {
    const key = `${entry.brand}|${entry.grade}`;
    if (!acc[key]) {
      acc[key] = {
        brand: entry.brand,
        grade: entry.grade,
        entries: [],
      };
    }
    acc[key].entries.push(entry);
    return acc;
  }, {} as Record<string, { brand: string; grade: string; entries: FuelEntryWithMetrics[] }>);

  return Object.values(grouped).map(({ brand, grade, entries }) => {
    const total_liters = entries.reduce((sum, e) => sum + e.liters, 0);
    const total_cost = entries.reduce((sum, e) => sum + e.total, 0);
    const entriesWithConsumption = entries.filter(
      (e) => e.consumption_l_per_100km !== undefined
    );

    return {
      brand,
      grade,
      avg_cost_per_liter: parseFloat((total_cost / total_liters).toFixed(2)),
      avg_consumption:
        entriesWithConsumption.length > 0
          ? parseFloat(
              (
                entriesWithConsumption.reduce(
                  (sum, e) => sum + (e.consumption_l_per_100km || 0),
                  0
                ) / entriesWithConsumption.length
              ).toFixed(1)
            )
          : 0,
      fillup_count: entries.length,
    };
  });
}

/**
 * Convert volume between units
 */
export function convertVolume(
  liters: number,
  toUnit: "L" | "gal"
): number {
  if (toUnit === "gal") {
    return parseFloat((liters / LITERS_PER_GALLON).toFixed(2));
  }
  return parseFloat(liters.toFixed(2));
}

/**
 * Convert distance between units
 */
export function convertDistance(
  km: number,
  toUnit: "km" | "mi"
): number {
  if (toUnit === "mi") {
    return Math.round(km / KM_PER_MILE);
  }
  return Math.round(km);
}

/**
 * Get consumption label based on unit system
 */
export function getConsumptionLabel(distanceUnit: "km" | "mi"): string {
  return distanceUnit === "km" ? "L/100km" : "MPG";
}

/**
 * Get consumption value based on unit system
 */
export function getConsumptionValue(
  entry: FuelEntryWithMetrics,
  distanceUnit: "km" | "mi"
): number | undefined {
  return distanceUnit === "km"
    ? entry.consumption_l_per_100km
    : entry.consumption_mpg;
}

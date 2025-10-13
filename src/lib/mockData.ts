// Mock data for development - matches Directus response structure
import { AppUser, Vehicle, FuelEntry } from "@/types";

export const mockUser: AppUser = {
  id: "user-1",
  email: "demo@fueltracker.app",
  display_name: "Demo User",
  currency: "EUR",
  unit_system: "metric",
  distance_unit: "km",
  volume_unit: "L",
  time_zone: "Europe/Berlin",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-1",
    user_id: "user-1",
    name: "My Honda Civic",
    make: "Honda",
    model: "Civic",
    year: 2020,
    fuel_type: "Petrol",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "vehicle-2",
    user_id: "user-1",
    name: "Work Van",
    make: "Ford",
    model: "Transit",
    year: 2019,
    fuel_type: "Diesel",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
];

// Generate realistic fuel entries for the last 90 days
const generateMockFuelEntries = (): FuelEntry[] => {
  const entries: FuelEntry[] = [];
  const brands = ["Shell", "BP", "Total", "Esso"];
  const grades = ["Regular 95", "Premium 98", "Diesel"];
  const stations = ["Shell Station A", "BP Downtown", "Total Highway", "Esso Central"];
  
  let currentOdometer1 = 45000;
  let currentOdometer2 = 78000;
  const today = new Date();
  
  // Vehicle 1 entries (every 5-7 days)
  for (let i = 0; i < 12; i++) {
    const daysAgo = 7 * i + Math.floor(Math.random() * 3);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const distance = 300 + Math.floor(Math.random() * 200);
    currentOdometer1 += distance;
    const liters = 35 + Math.random() * 15;
    const pricePerLiter = 1.45 + Math.random() * 0.3;
    
    entries.push({
      id: `entry-1-${i}`,
      user_id: "user-1",
      vehicle_id: "vehicle-1",
      entry_date: date.toISOString().split('T')[0],
      odometer: currentOdometer1,
      station: stations[Math.floor(Math.random() * stations.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      grade: grades[0],
      liters: parseFloat(liters.toFixed(2)),
      total: parseFloat((liters * pricePerLiter).toFixed(2)),
      notes: i % 3 === 0 ? "Regular fill-up" : undefined,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
    });
  }
  
  // Vehicle 2 entries (every 4-5 days, work vehicle)
  for (let i = 0; i < 18; i++) {
    const daysAgo = 5 * i + Math.floor(Math.random() * 2);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const distance = 200 + Math.floor(Math.random() * 150);
    currentOdometer2 += distance;
    const liters = 45 + Math.random() * 20;
    const pricePerLiter = 1.35 + Math.random() * 0.25;
    
    entries.push({
      id: `entry-2-${i}`,
      user_id: "user-1",
      vehicle_id: "vehicle-2",
      entry_date: date.toISOString().split('T')[0],
      odometer: currentOdometer2,
      station: stations[Math.floor(Math.random() * stations.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      grade: grades[2], // Diesel
      liters: parseFloat(liters.toFixed(2)),
      total: parseFloat((liters * pricePerLiter).toFixed(2)),
      notes: i % 4 === 0 ? "Company refill" : undefined,
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
    });
  }
  
  return entries.sort((a, b) => 
    new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
  );
};

export const mockFuelEntries = generateMockFuelEntries();

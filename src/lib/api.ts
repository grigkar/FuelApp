// API service layer - will connect to Directus REST API
// For now uses mock data matching Directus response format

import { 
  AppUser, 
  Vehicle, 
  FuelEntry, 
  DirectusResponse, 
  DirectusListResponse 
} from "@/types";
import { mockUser, mockVehicles, mockFuelEntries } from "./mockData";

// Base URL from environment variable (for future Directus integration)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication APIs
export const authApi = {
  async login(email: string, password: string): Promise<DirectusResponse<AppUser>> {
    await delay(500);
    // Mock successful login
    return { data: mockUser };
  },
  
  async signup(email: string, password: string, display_name?: string): Promise<DirectusResponse<AppUser>> {
    await delay(500);
    // Mock successful signup
    return { 
      data: { 
        ...mockUser, 
        email, 
        display_name: display_name || mockUser.display_name 
      } 
    };
  },
  
  async logout(): Promise<void> {
    await delay(300);
    // Mock logout
  },
  
  async getCurrentUser(): Promise<DirectusResponse<AppUser>> {
    await delay(200);
    return { data: mockUser };
  },
};

// User/Profile APIs
export const userApi = {
  async getProfile(): Promise<DirectusResponse<AppUser>> {
    await delay(300);
    return { data: mockUser };
  },
  
  async updateProfile(updates: Partial<AppUser>): Promise<DirectusResponse<AppUser>> {
    await delay(400);
    return { data: { ...mockUser, ...updates } };
  },
};

// Vehicle APIs
export const vehicleApi = {
  async getAll(): Promise<DirectusListResponse<Vehicle>> {
    await delay(300);
    return { data: mockVehicles };
  },
  
  async getById(id: string): Promise<DirectusResponse<Vehicle>> {
    await delay(200);
    const vehicle = mockVehicles.find(v => v.id === id);
    if (!vehicle) throw new Error("Vehicle not found");
    return { data: vehicle };
  },
  
  async create(vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">): Promise<DirectusResponse<Vehicle>> {
    await delay(400);
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `vehicle-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: newVehicle };
  },
  
  async update(id: string, updates: Partial<Vehicle>): Promise<DirectusResponse<Vehicle>> {
    await delay(400);
    const vehicle = mockVehicles.find(v => v.id === id);
    if (!vehicle) throw new Error("Vehicle not found");
    return { data: { ...vehicle, ...updates, updated_at: new Date().toISOString() } };
  },
  
  async delete(id: string): Promise<void> {
    await delay(300);
    // Mock delete
  },
};

// Fuel Entry APIs
export const fuelEntryApi = {
  async getAll(filters?: {
    vehicle_id?: string;
    start_date?: string;
    end_date?: string;
    brand?: string;
    grade?: string;
    station?: string;
  }): Promise<DirectusListResponse<FuelEntry>> {
    await delay(300);
    
    let filtered = [...mockFuelEntries];
    
    if (filters?.vehicle_id) {
      filtered = filtered.filter(e => e.vehicle_id === filters.vehicle_id);
    }
    if (filters?.start_date) {
      filtered = filtered.filter(e => e.entry_date >= filters.start_date!);
    }
    if (filters?.end_date) {
      filtered = filtered.filter(e => e.entry_date <= filters.end_date!);
    }
    if (filters?.brand) {
      filtered = filtered.filter(e => e.brand === filters.brand);
    }
    if (filters?.grade) {
      filtered = filtered.filter(e => e.grade === filters.grade);
    }
    if (filters?.station) {
      filtered = filtered.filter(e => e.station === filters.station);
    }
    
    return { data: filtered };
  },
  
  async getById(id: string): Promise<DirectusResponse<FuelEntry>> {
    await delay(200);
    const entry = mockFuelEntries.find(e => e.id === id);
    if (!entry) throw new Error("Fuel entry not found");
    return { data: entry };
  },
  
  async create(entry: Omit<FuelEntry, "id" | "created_at" | "updated_at">): Promise<DirectusResponse<FuelEntry>> {
    await delay(400);
    const newEntry: FuelEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { data: newEntry };
  },
  
  async update(id: string, updates: Partial<FuelEntry>): Promise<DirectusResponse<FuelEntry>> {
    await delay(400);
    const entry = mockFuelEntries.find(e => e.id === id);
    if (!entry) throw new Error("Fuel entry not found");
    return { data: { ...entry, ...updates, updated_at: new Date().toISOString() } };
  },
  
  async delete(id: string): Promise<void> {
    await delay(300);
    // Mock delete
  },
};

// Export API base URL for reference
export { API_BASE_URL };

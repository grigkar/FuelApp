// API service layer for Supabase integration
// All calculations are done client-side in calculations.ts

import { supabase } from "@/integrations/supabase/client";
import type {
  Vehicle,
  FuelEntry,
  AppUser,
  DirectusListResponse,
  DirectusResponse,
} from "@/types";
import { logger as baseLogger, createComponentLogger } from "./logger";

const logger = createComponentLogger("API");

// Vehicle API
export const vehicleApi = {
  async getAll(): Promise<DirectusListResponse<Vehicle>> {
    const correlationId = baseLogger.generateCorrelationId();
    logger.info("Fetching all vehicles", { correlationId, action: "getAll" });
    
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch vehicles", error, { correlationId });
      throw error;
    }
    return { data: data || [] };
  },

  async getById(id: string): Promise<DirectusResponse<Vehicle>> {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { data };
  },

  async create(
    vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">
  ): Promise<DirectusResponse<Vehicle>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        ...vehicle,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return { data };
  },

  async update(
    id: string,
    vehicle: Partial<Vehicle>
  ): Promise<DirectusResponse<Vehicle>> {
    const { data, error } = await supabase
      .from("vehicles")
      .update(vehicle)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// Fuel Entry API
export const fuelEntryApi = {
  async getAll(filters?: {
    vehicle_id?: string;
    start_date?: string;
    end_date?: string;
    brand?: string;
    grade?: string;
    station?: string;
  }): Promise<DirectusListResponse<FuelEntry>> {
    let query = supabase
      .from("fuel_entries")
      .select("*")
      .order("entry_date", { ascending: false });

    if (filters?.vehicle_id) {
      query = query.eq("vehicle_id", filters.vehicle_id);
    }
    if (filters?.start_date) {
      query = query.gte("entry_date", filters.start_date);
    }
    if (filters?.end_date) {
      query = query.lte("entry_date", filters.end_date);
    }
    if (filters?.brand) {
      query = query.eq("brand", filters.brand);
    }
    if (filters?.grade) {
      query = query.eq("grade", filters.grade);
    }
    if (filters?.station) {
      query = query.eq("station", filters.station);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data || [] };
  },

  async getById(id: string): Promise<DirectusResponse<FuelEntry>> {
    const { data, error } = await supabase
      .from("fuel_entries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return { data };
  },

  async create(
    entry: Omit<FuelEntry, "id" | "created_at" | "updated_at">
  ): Promise<DirectusResponse<FuelEntry>> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("fuel_entries")
      .insert({
        ...entry,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return { data };
  },

  async update(
    id: string,
    entry: Partial<FuelEntry>
  ): Promise<DirectusResponse<FuelEntry>> {
    const { data, error } = await supabase
      .from("fuel_entries")
      .update(entry)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("fuel_entries")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};

// User/Profile API
export const userApi = {
  async getProfile(userId: string): Promise<DirectusResponse<AppUser>> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    
    // Ensure unit_system is derived from distance_unit if not set
    const userData = data as any;
    if (!userData.unit_system && userData.distance_unit) {
      userData.unit_system = userData.distance_unit === "km" ? "metric" : "imperial";
    }
    
    return { data: userData as AppUser };
  },

  async updateProfile(
    userId: string,
    profile: Partial<AppUser>
  ): Promise<DirectusResponse<AppUser>> {
    // Derive distance_unit and volume_unit from unit_system
    const updateData: any = { ...profile };
    if (profile.unit_system) {
      updateData.distance_unit = profile.unit_system === "metric" ? "km" : "mi";
      updateData.volume_unit = profile.unit_system === "metric" ? "L" : "gal";
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    
    // Ensure returned data has unit_system derived
    const userData = data as any;
    if (!userData.unit_system && userData.distance_unit) {
      userData.unit_system = userData.distance_unit === "km" ? "metric" : "imperial";
    }
    
    return { data: userData as AppUser };
  },
};

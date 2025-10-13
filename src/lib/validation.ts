// Form validation utilities
import { z } from "zod";

// Auth validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  display_name: z.string().optional(),
});

// Vehicle validation
export const vehicleSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  make: z.string().max(50).optional(),
  model: z.string().max(50).optional(),
  year: z
    .number()
    .int()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future")
    .optional(),
  fuel_type: z.string().max(50).optional(),
});

// Fuel entry validation
export const fuelEntrySchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  entry_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date")
    .refine(
      (date) => new Date(date) <= new Date(),
      "Date cannot be in the future"
    ),
  odometer: z
    .number()
    .positive("Odometer must be positive")
    .int("Odometer must be a whole number"),
  station: z.string().min(1, "Station is required").max(100),
  brand: z.string().min(1, "Brand is required").max(50),
  grade: z.string().min(1, "Grade is required").max(50),
  liters: z.number().positive("Liters must be positive"),
  total: z.number().positive("Total cost must be positive"),
  notes: z.string().max(500, "Notes too long (max 500 characters)").optional(),
});

// Profile/Settings validation
export const profileSchema = z.object({
  display_name: z.string().max(100).optional(),
  currency: z.string().length(3, "Currency must be 3 letters (e.g., EUR)"),
  unit_system: z.enum(["metric", "imperial"]),
  time_zone: z.string().min(1, "Time zone is required"),
});

/**
 * Validate odometer is greater than previous reading
 */
export function validateOdometerIncrease(
  newOdometer: number,
  previousOdometer: number | undefined,
  vehicleId: string
): { valid: boolean; error?: string } {
  if (previousOdometer === undefined) {
    return { valid: true };
  }

  if (newOdometer <= previousOdometer) {
    return {
      valid: false,
      error: `Odometer must be greater than previous reading (${previousOdometer} km)`,
    };
  }

  return { valid: true };
}

/**
 * Validate date is not in the future
 */
export function validateDateNotFuture(date: string): boolean {
  return new Date(date) <= new Date();
}

/**
 * Common validation error messages
 */
export const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  POSITIVE: "Must be a positive number",
  EMAIL: "Invalid email address",
  PASSWORD_LENGTH: "Password must be at least 8 characters",
  PASSWORD_LETTER: "Password must contain at least one letter",
  PASSWORD_NUMBER: "Password must contain at least one number",
  DATE_FUTURE: "Date cannot be in the future",
  ODOMETER_DECREASE: "Odometer must be greater than previous reading",
} as const;

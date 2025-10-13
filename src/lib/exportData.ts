import { supabase } from "@/integrations/supabase/client";

export async function exportUserDataAsCSV(userId: string) {
  try {
    // Fetch all user data
    const [profileResult, vehiclesResult, entriesResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("vehicles").select("*").eq("user_id", userId),
      supabase.from("fuel_entries").select("*").eq("user_id", userId),
    ]);

    if (profileResult.error) throw profileResult.error;
    if (vehiclesResult.error) throw vehiclesResult.error;
    if (entriesResult.error) throw entriesResult.error;

    const profile = profileResult.data;
    const vehicles = vehiclesResult.data || [];
    const entries = entriesResult.data || [];

    // Create CSV content
    let csvContent = "";

    // Profile section
    csvContent += "=== USER PROFILE ===\n";
    csvContent += "Field,Value\n";
    if (profile) {
      Object.entries(profile).forEach(([key, value]) => {
        csvContent += `${key},"${value || ""}"\n`;
      });
    }
    csvContent += "\n";

    // Vehicles section
    csvContent += "=== VEHICLES ===\n";
    if (vehicles.length > 0) {
      const vehicleHeaders = Object.keys(vehicles[0]);
      csvContent += vehicleHeaders.join(",") + "\n";
      vehicles.forEach((vehicle) => {
        const row = vehicleHeaders.map((header) => {
          const value = vehicle[header];
          return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value || "";
        });
        csvContent += row.join(",") + "\n";
      });
    } else {
      csvContent += "No vehicles found\n";
    }
    csvContent += "\n";

    // Fuel entries section
    csvContent += "=== FUEL ENTRIES ===\n";
    if (entries.length > 0) {
      const entryHeaders = Object.keys(entries[0]);
      csvContent += entryHeaders.join(",") + "\n";
      entries.forEach((entry) => {
        const row = entryHeaders.map((header) => {
          const value = entry[header];
          return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value || "";
        });
        csvContent += row.join(",") + "\n";
      });
    } else {
      csvContent += "No fuel entries found\n";
    }

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `fuelapp-data-export-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fuelEntryApi, vehicleApi } from "@/lib/api";
import { calculateAllMetrics } from "@/lib/calculations";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { VehicleSelector } from "@/components/VehicleSelector";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { convertDistance, convertVolume, getConsumptionLabel, getConsumptionValue } from "@/lib/calculations";

export default function History() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all");

  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApi.getAll(),
  });

  const { data: entriesData, isLoading } = useQuery({
    queryKey: ["fuelEntries", selectedVehicleId],
    queryFn: () =>
      fuelEntryApi.getAll(
        selectedVehicleId !== "all" ? { vehicle_id: selectedVehicleId } : undefined
      ),
  });

  const vehicles = vehiclesData?.data || [];
  const entries = entriesData?.data || [];
  const entriesWithMetrics = calculateAllMetrics(entries);

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const getVehicleName = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Fill-Up History</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your fuel entries
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <VehicleSelector
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelect={setSelectedVehicleId}
            />
            <Button onClick={() => navigate("/fillup")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Fill-Up
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading history...</div>
        ) : entriesWithMetrics.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">No fill-ups recorded yet</p>
            <Button onClick={() => navigate("/fillup")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Fill-Up
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  {selectedVehicleId === "all" && <TableHead>Vehicle</TableHead>}
                  <TableHead>Odometer</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Station</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>€/L</TableHead>
                  <TableHead>{getConsumptionLabel(user?.distance_unit || "km")}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entriesWithMetrics.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {format(new Date(entry.entry_date), "MMM d, yyyy")}
                    </TableCell>
                    {selectedVehicleId === "all" && (
                      <TableCell>{getVehicleName(entry.vehicle_id)}</TableCell>
                    )}
                    <TableCell>
                      {convertDistance(entry.odometer, user?.distance_unit || "km")}{" "}
                      {user?.distance_unit || "km"}
                    </TableCell>
                    <TableCell>
                      {entry.distance_since_last
                        ? `${convertDistance(entry.distance_since_last, user?.distance_unit || "km")} ${user?.distance_unit || "km"}`
                        : "-"}
                    </TableCell>
                    <TableCell>{entry.station}</TableCell>
                    <TableCell>{entry.brand}</TableCell>
                    <TableCell>{entry.grade}</TableCell>
                    <TableCell>
                      {convertVolume(entry.liters, user?.volume_unit || "L")}{" "}
                      {user?.volume_unit || "L"}
                    </TableCell>
                    <TableCell>
                      {user?.currency} {entry.total.toFixed(2)}
                    </TableCell>
                    <TableCell>{entry.unit_price.toFixed(2)}</TableCell>
                    <TableCell>
                      {getConsumptionValue(entry, user?.distance_unit || "km")?.toFixed(1) || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/fillup/${entry.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Sticky Add Button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        onClick={() => navigate("/fillup")}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}

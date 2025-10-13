import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fuelEntryApi, vehicleApi } from "@/lib/api";
import { calculateAllMetrics, calculateBrandGradeStats } from "@/lib/calculations";
import Navbar from "@/components/Navbar";
import { VehicleSelector } from "@/components/VehicleSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BarChart3 } from "lucide-react";

export default function Statistics() {
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
  const brandGradeStats = calculateBrandGradeStats(entriesWithMetrics);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Brand & Grade Statistics</h1>
            <p className="text-muted-foreground mt-1">
              Compare fuel consumption and costs across brands and grades
            </p>
          </div>
          <VehicleSelector
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelect={setSelectedVehicleId}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading statistics...</div>
        ) : brandGradeStats.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data yet</h3>
              <p className="text-muted-foreground">
                Add fuel entries to see brand and grade comparisons
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Brand × Grade Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Avg Cost/L</TableHead>
                    <TableHead className="text-right">Avg Consumption</TableHead>
                    <TableHead className="text-right"># Fill-ups</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brandGradeStats
                    .sort((a, b) => b.fillup_count - a.fillup_count)
                    .map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{stat.brand}</TableCell>
                        <TableCell>{stat.grade}</TableCell>
                        <TableCell className="text-right">
                          {user?.currency} {stat.avg_cost_per_liter.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {stat.avg_consumption > 0
                            ? `${stat.avg_consumption.toFixed(1)} L/100km`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">{stat.fillup_count}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        {brandGradeStats.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Most Used Brand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {brandGradeStats.sort((a, b) => b.fillup_count - a.fillup_count)[0].brand}
                </div>
                <p className="text-xs text-muted-foreground">
                  {brandGradeStats.sort((a, b) => b.fillup_count - a.fillup_count)[0].fillup_count} fill-ups
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Best Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {brandGradeStats
                    .filter((s) => s.avg_consumption > 0)
                    .sort((a, b) => a.avg_consumption - b.avg_consumption)[0]?.brand || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {brandGradeStats
                    .filter((s) => s.avg_consumption > 0)
                    .sort((a, b) => a.avg_consumption - b.avg_consumption)[0]?.avg_consumption.toFixed(1) || "0"} L/100km
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Lowest Cost/L</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {brandGradeStats.sort((a, b) => a.avg_cost_per_liter - b.avg_cost_per_liter)[0].brand}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user?.currency} {brandGradeStats.sort((a, b) => a.avg_cost_per_liter - b.avg_cost_per_liter)[0].avg_cost_per_liter.toFixed(2)}/L
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

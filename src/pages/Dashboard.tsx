import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fuelEntryApi, vehicleApi } from "@/lib/api";
import { calculateAllMetrics, calculateRollingStats, getConsumptionLabel } from "@/lib/calculations";
import { PeriodType } from "@/types";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { VehicleSelector } from "@/components/VehicleSelector";
import { PeriodSelector } from "@/components/PeriodSelector";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { Plus, TrendingUp, DollarSign, Gauge, Calendar, Route, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser();
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("30");
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date }>();

  // Fetch vehicles
  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApi.getAll(),
  });

  // Fetch fuel entries
  const { data: entriesData, isLoading } = useQuery({
    queryKey: ["fuelEntries", selectedVehicleId],
    queryFn: () =>
      fuelEntryApi.getAll(
        selectedVehicleId !== "all" ? { vehicle_id: selectedVehicleId } : undefined
      ),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const vehicles = vehiclesData?.data || [];
  const entries = entriesData?.data || [];
  const entriesWithMetrics = calculateAllMetrics(entries);

  // Calculate period days and date range
  let periodDays = 30;
  let startDate: Date;
  let endDate = new Date();

  if (selectedPeriod === "90") {
    periodDays = 90;
    startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  } else if (selectedPeriod === "ytd") {
    startDate = new Date(new Date().getFullYear(), 0, 1);
    periodDays = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  } else if (selectedPeriod === "custom" && customRange) {
    startDate = customRange.start;
    endDate = customRange.end;
    periodDays = Math.floor(
      (customRange.end.getTime() - customRange.start.getTime()) / (1000 * 60 * 60 * 24)
    );
  } else {
    // Default 30 days
    startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  // Filter entries by date range
  const filteredEntries = entriesWithMetrics.filter((e) => {
    const entryDate = new Date(e.entry_date);
    return entryDate >= startDate && entryDate <= endDate;
  });

  // Calculate rolling stats
  const stats = calculateRollingStats(filteredEntries, periodDays);

  // Prepare chart data (last 10 entries for trend within selected period, sorted by date)
  const sortedForConsumption = [...filteredEntries]
    .filter((e) => e.consumption_l_per_100km)
    .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime());
  
  console.log('Consumption chart entries (sorted):', sortedForConsumption.map(e => ({
    entry_date: e.entry_date,
    timestamp: new Date(e.entry_date).getTime()
  })));

  const consumptionChartData = sortedForConsumption
    .slice(-10)
    .map((e) => ({
      date: format(new Date(e.entry_date), "MMM d"),
      consumption: user?.distance_unit === "mi" 
        ? Number((235.215 / e.consumption_l_per_100km!).toFixed(1))
        : e.consumption_l_per_100km,
    }));

  const sortedForPrice = [...filteredEntries]
    .sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime());
  
  console.log('Price chart entries (sorted):', sortedForPrice.map(e => ({
    entry_date: e.entry_date,
    timestamp: new Date(e.entry_date).getTime()
  })));

  const priceChartData = sortedForPrice
    .slice(-10)
    .map((e) => ({
      date: format(new Date(e.entry_date), "MMM d"),
      price: user?.volume_unit === "gal" 
        ? e.unit_price * 3.78541  // Convert €/L to €/gal
        : e.unit_price,
    }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your fuel consumption and costs
            </p>
          </div>
          <Button onClick={() => navigate("/fillup")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Fill-Up
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap items-center">
          <VehicleSelector
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onSelect={setSelectedVehicleId}
          />
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading dashboard...</div>
        ) : entriesWithMetrics.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first fill-up to start tracking
              </p>
              <Button onClick={() => navigate("/fillup")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Fill-Up
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <StatCard
                title="Avg Consumption"
                value={
                  stats.avg_consumption > 0
                    ? `${stats.avg_consumption} ${getConsumptionLabel(user?.distance_unit || "km")}`
                    : "N/A"
                }
                icon={Gauge}
                description={`Last ${periodDays} days`}
                tooltip="Average fuel consumption - lower is better"
              />

              <StatCard
                title={`Avg Cost per ${user?.volume_unit === "gal" ? "Gallon" : "Liter"}`}
                value={
                  stats.avg_cost_per_liter > 0
                    ? `${user?.currency || "€"} ${
                        user?.volume_unit === "gal"
                          ? (stats.avg_cost_per_liter * 3.78541).toFixed(2)
                          : stats.avg_cost_per_liter.toFixed(2)
                      }`
                    : "N/A"
                }
                icon={DollarSign}
                description={`Last ${periodDays} days`}
              />

              <StatCard
                title="Total Distance"
                value={`${
                  user?.distance_unit === "mi"
                    ? Math.round(stats.total_distance * 0.621371)
                    : stats.total_distance
                } ${user?.distance_unit || "km"}`}
                icon={Route}
                description={`Last ${periodDays} days`}
              />

              <StatCard
                title="Total Spend"
                value={`${user?.currency || "€"} ${stats.total_spend.toFixed(2)}`}
                icon={TrendingUp}
                description={`Last ${periodDays} days`}
              />

              <StatCard
                title={`Avg Cost per ${user?.distance_unit === "mi" ? "mile" : "km"}`}
                value={
                  stats.avg_cost_per_km > 0
                    ? `${user?.currency || "€"} ${
                        user?.distance_unit === "mi"
                          ? (stats.avg_cost_per_km * 1.60934).toFixed(2)
                          : stats.avg_cost_per_km.toFixed(2)
                      }`
                    : "N/A"
                }
                icon={DollarSign}
                description={`Last ${periodDays} days`}
              />

              <StatCard
                title="Avg Distance/Day"
                value={`${
                  user?.distance_unit === "mi"
                    ? Math.round(stats.avg_distance_per_day * 0.621371)
                    : stats.avg_distance_per_day
                } ${user?.distance_unit || "km"}`}
                icon={Calendar}
                description={`Last ${periodDays} days`}
              />
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {/* Consumption Chart */}
              {consumptionChartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Consumption Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={consumptionChartData} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" padding={{ left: 20, right: 20 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="consumption"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          name={getConsumptionLabel(user?.distance_unit || "km")}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Price Chart */}
              {priceChartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Price per {user?.volume_unit === "gal" ? "Gallon" : "Liter"} Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={priceChartData} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" padding={{ left: 20, right: 20 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={2}
                          name={`${user?.currency || "€"}/${user?.volume_unit || "L"}`}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/fillup")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Fill-Up
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/history")}
                  >
                    View History
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/vehicles")}
                  >
                    Manage Vehicles
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/statistics")}
                  >
                    View Statistics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
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

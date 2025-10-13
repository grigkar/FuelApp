import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fuelEntryApi, vehicleApi } from "@/lib/api";
import { calculateAllMetrics } from "@/lib/calculations";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { VehicleSelector } from "@/components/VehicleSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { convertDistance, convertVolume, getConsumptionLabel, getConsumptionValue } from "@/lib/calculations";

export default function History() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [stationFilter, setStationFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const itemsPerPage = 20;

  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApi.getAll(),
  });

  const { data: entriesData, isLoading } = useQuery({
    queryKey: ["fuelEntries", selectedVehicleId, startDate, endDate, brandFilter, gradeFilter, stationFilter],
    queryFn: () =>
      fuelEntryApi.getAll({
        ...(selectedVehicleId !== "all" && { vehicle_id: selectedVehicleId }),
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
        ...(brandFilter && { brand: brandFilter }),
        ...(gradeFilter && { grade: gradeFilter }),
        ...(stationFilter && { station: stationFilter }),
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fuelEntryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuelEntries"] });
      toast({
        title: "Fill-up deleted",
        description: "The fuel entry has been removed.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete fill-up. Please try again.",
        variant: "destructive",
      });
    },
  });

  const vehicles = vehiclesData?.data || [];
  const entries = entriesData?.data || [];
  const entriesWithMetrics = calculateAllMetrics(entries).sort((a, b) => 
    new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
  );
  
  // Pagination
  const totalPages = Math.ceil(entriesWithMetrics.length / itemsPerPage);
  const paginatedEntries = entriesWithMetrics.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  // Get unique values for filters
  const brands = Array.from(new Set(entries.map(e => e.brand))).sort();
  const grades = Array.from(new Set(entries.map(e => e.grade))).sort();
  const stations = Array.from(new Set(entries.map(e => e.station))).sort();
  
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setBrandFilter("");
    setGradeFilter("");
    setStationFilter("");
    setPage(1);
  };
  
  const hasActiveFilters = startDate || endDate || brandFilter || gradeFilter || stationFilter;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
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
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <VehicleSelector
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelect={(id) => {
                setSelectedVehicleId(id);
                setPage(1);
              }}
            />
            <Button onClick={() => navigate("/fillup")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Fill-Up
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border rounded-lg p-4 mb-6 bg-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filter Options</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select value={brandFilter || "all"} onValueChange={(val) => {
                  setBrandFilter(val === "all" ? "" : val);
                  setPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All brands</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select value={gradeFilter || "all"} onValueChange={(val) => {
                  setGradeFilter(val === "all" ? "" : val);
                  setPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All grades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All grades</SelectItem>
                    {grades.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="station">Station</Label>
                <Select value={stationFilter || "all"} onValueChange={(val) => {
                  setStationFilter(val === "all" ? "" : val);
                  setPage(1);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All stations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stations</SelectItem>
                    {stations.map(station => (
                      <SelectItem key={station} value={station}>{station}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

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
          <>
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
                    <TableHead>{user?.currency || "€"}/{user?.volume_unit || "L"}</TableHead>
                    <TableHead>{getConsumptionLabel(user?.distance_unit || "km")}</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEntries.map((entry) => (
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
                      <TableCell>
                        {(user?.volume_unit === "gal" 
                          ? entry.unit_price * 3.78541 
                          : entry.unit_price
                        ).toFixed(2)}
                      </TableCell>
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
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setDeleteId(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Fill-Up</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this fuel entry? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

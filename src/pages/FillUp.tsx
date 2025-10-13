import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fuelEntryApi, vehicleApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fuelEntrySchema } from "@/lib/validation";
import { z } from "zod";
import { useEffect } from "react";

type FuelEntryFormData = z.infer<typeof fuelEntrySchema>;

export default function FillUp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isEditing = !!id;

  // Fetch vehicles
  const { data: vehiclesData } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApi.getAll(),
  });

  // Fetch existing entry if editing
  const { data: entryData } = useQuery({
    queryKey: ["fuelEntry", id],
    queryFn: () => fuelEntryApi.getById(id!),
    enabled: isEditing,
  });

  const vehicles = vehiclesData?.data || [];

  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<FuelEntryFormData>({
    resolver: zodResolver(fuelEntrySchema),
  });
  
  // Get selected vehicle's entries for odometer validation
  const selectedVehicle = watch("vehicle_id");
  const { data: vehicleEntriesData } = useQuery({
    queryKey: ["vehicleEntries", selectedVehicle],
    queryFn: () => selectedVehicle ? fuelEntryApi.getAll({ vehicle_id: selectedVehicle }) : Promise.resolve({ data: [] }),
    enabled: !!selectedVehicle,
  });

  const liters = watch("liters");
  const total = watch("total");
  const unitPrice = liters && total ? (total / liters).toFixed(2) : "0.00";

  useEffect(() => {
    if (entryData?.data) {
      const entry = entryData.data;
      reset({
        vehicle_id: entry.vehicle_id,
        entry_date: entry.entry_date,
        odometer: entry.odometer,
        station: entry.station,
        brand: entry.brand,
        grade: entry.grade,
        liters: entry.liters,
        total: entry.total,
        notes: entry.notes || "",
      });
    }
  }, [entryData, reset]);

  const saveMutation = useMutation({
    mutationFn: (data: FuelEntryFormData) => {
      if (isEditing) {
        return fuelEntryApi.update(id!, data);
      }
      return fuelEntryApi.create({ 
        user_id: "user-1",
        vehicle_id: data.vehicle_id,
        entry_date: data.entry_date,
        odometer: data.odometer,
        station: data.station,
        brand: data.brand,
        grade: data.grade,
        liters: data.liters,
        total: data.total,
        notes: data.notes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuelEntries"] });
      toast({
        title: isEditing ? "Fill-up updated" : "Fill-up added",
        description: "Your fuel entry has been saved.",
      });
      navigate("/history");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save fill-up. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FuelEntryFormData) => {
    // Validate odometer against previous entries
    const vehicleEntries = vehicleEntriesData?.data || [];
    const sortedEntries = vehicleEntries
      .filter(e => !isEditing || e.id !== id) // Exclude current entry if editing
      .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());
    
    const previousEntry = sortedEntries.find(
      e => new Date(e.entry_date) <= new Date(data.entry_date)
    );
    
    if (previousEntry && data.odometer <= previousEntry.odometer) {
      toast({
        title: "Invalid Odometer",
        description: `Odometer must be greater than previous reading (${previousEntry.odometer} km)`,
        variant: "destructive",
      });
      return;
    }
    
    saveMutation.mutate(data);
  };

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Fill-Up" : "Add New Fill-Up"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Vehicle Selection */}
              <div className="space-y-2">
                <Label htmlFor="vehicle_id">Vehicle *</Label>
                <Controller
                  name="vehicle_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.vehicle_id && (
                  <p className="text-sm text-destructive">{errors.vehicle_id.message}</p>
                )}
              </div>

              {/* Date and Odometer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entry_date">Date *</Label>
                  <Input
                    id="entry_date"
                    type="date"
                    {...register("entry_date")}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.entry_date && (
                    <p className="text-sm text-destructive">{errors.entry_date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="odometer">Odometer (km) *</Label>
                  <Input
                    id="odometer"
                    type="number"
                    placeholder="e.g., 45000"
                    {...register("odometer", { valueAsNumber: true })}
                  />
                  {errors.odometer && (
                    <p className="text-sm text-destructive">{errors.odometer.message}</p>
                  )}
                </div>
              </div>

              {/* Station */}
              <div className="space-y-2">
                <Label htmlFor="station">Station *</Label>
                <Input
                  id="station"
                  placeholder="e.g., Shell Station Downtown"
                  {...register("station")}
                />
                {errors.station && (
                  <p className="text-sm text-destructive">{errors.station.message}</p>
                )}
              </div>

              {/* Brand and Grade */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Shell, BP"
                    {...register("brand")}
                  />
                  {errors.brand && (
                    <p className="text-sm text-destructive">{errors.brand.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade *</Label>
                  <Input
                    id="grade"
                    placeholder="e.g., Regular 95"
                    {...register("grade")}
                  />
                  {errors.grade && (
                    <p className="text-sm text-destructive">{errors.grade.message}</p>
                  )}
                </div>
              </div>

              {/* Liters and Total */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="liters">Liters *</Label>
                  <Input
                    id="liters"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 42.50"
                    {...register("liters", { valueAsNumber: true })}
                  />
                  {errors.liters && (
                    <p className="text-sm text-destructive">{errors.liters.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total">Total Cost (€) *</Label>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 65.50"
                    {...register("total", { valueAsNumber: true })}
                  />
                  {errors.total && (
                    <p className="text-sm text-destructive">{errors.total.message}</p>
                  )}
                </div>
              </div>

              {/* Unit Price (calculated) */}
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Unit Price: <span className="font-semibold">€{unitPrice}/L</span>
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes..."
                  rows={3}
                  {...register("notes")}
                />
                {errors.notes && (
                  <p className="text-sm text-destructive">{errors.notes.message}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/history")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : "Save Fill-Up"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

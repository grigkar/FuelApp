import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "@/lib/api";
import { Vehicle } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Car, Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema } from "@/lib/validation";
import { z } from "zod";

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function Vehicles() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Fetch vehicles
  const { data: vehiclesData, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => vehicleApi.getAll(),
  });

  const vehicles = vehiclesData?.data || [];

  // Form handling
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: (data: VehicleFormData) => {
      if (editingVehicle) {
        return vehicleApi.update(editingVehicle.id, data);
      }
      return vehicleApi.create({ 
        user_id: "user-1",
        name: data.name,
        make: data.make,
        model: data.model,
        year: data.year,
        fuel_type: data.fuel_type
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast({
        title: editingVehicle ? "Vehicle updated" : "Vehicle added",
        description: "Your changes have been saved.",
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save vehicle. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehicleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast({
        title: "Vehicle deleted",
        description: "The vehicle has been removed.",
      });
    },
  });

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      reset({
        name: vehicle.name,
        make: vehicle.make || "",
        model: vehicle.model || "",
        year: vehicle.year,
        fuel_type: vehicle.fuel_type || "",
      });
    } else {
      setEditingVehicle(null);
      reset({
        name: "",
        make: "",
        model: "",
        year: undefined,
        fuel_type: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingVehicle(null);
    reset();
  };

  const onSubmit = (data: VehicleFormData) => {
    saveMutation.mutate(data);
  };

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Vehicles</h1>
            <p className="text-muted-foreground mt-1">
              Manage your vehicles and track fuel consumption for each one
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No vehicles yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first vehicle to start tracking fuel consumption
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      {vehicle.name}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(vehicle.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-1 text-sm">
                    {vehicle.make && (
                      <div>
                        <dt className="text-muted-foreground inline">Make: </dt>
                        <dd className="inline font-medium">{vehicle.make}</dd>
                      </div>
                    )}
                    {vehicle.model && (
                      <div>
                        <dt className="text-muted-foreground inline">Model: </dt>
                        <dd className="inline font-medium">{vehicle.model}</dd>
                      </div>
                    )}
                    {vehicle.year && (
                      <div>
                        <dt className="text-muted-foreground inline">Year: </dt>
                        <dd className="inline font-medium">{vehicle.year}</dd>
                      </div>
                    )}
                    {vehicle.fuel_type && (
                      <div>
                        <dt className="text-muted-foreground inline">Fuel: </dt>
                        <dd className="inline font-medium">{vehicle.fuel_type}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
            </DialogTitle>
            <DialogDescription>
              {editingVehicle
                ? "Update your vehicle information"
                : "Add a new vehicle to track fuel consumption"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., My Honda Civic"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  placeholder="e.g., Honda"
                  {...register("make")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., Civic"
                  {...register("model")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g., 2020"
                  {...register("year", { valueAsNumber: true })}
                />
                {errors.year && (
                  <p className="text-sm text-destructive">{errors.year.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuel_type">Fuel Type</Label>
                <Input
                  id="fuel_type"
                  placeholder="e.g., Petrol, Diesel, Electric"
                  {...register("fuel_type")}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

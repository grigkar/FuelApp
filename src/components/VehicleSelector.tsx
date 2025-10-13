import { Vehicle } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car } from "lucide-react";

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | "all";
  onSelect: (vehicleId: string) => void;
  showAllOption?: boolean;
}

export function VehicleSelector({
  vehicles,
  selectedVehicleId,
  onSelect,
  showAllOption = true,
}: VehicleSelectorProps) {
  return (
    <Select value={selectedVehicleId} onValueChange={onSelect}>
      <SelectTrigger className="w-[200px]">
        <Car className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Select vehicle" />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && (
          <SelectItem value="all">All Vehicles</SelectItem>
        )}
        {vehicles.map((vehicle) => (
          <SelectItem key={vehicle.id} value={vehicle.id}>
            {vehicle.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

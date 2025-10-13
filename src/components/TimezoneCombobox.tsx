import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { timezones, getTimezoneByValue, regionOrder } from "@/lib/timezones";

interface TimezoneComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimezoneCombobox({ value, onChange }: TimezoneComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedTimezone = getTimezoneByValue(value);

  // Group timezones by region
  const timezonesByRegion = React.useMemo(() => {
    const grouped = timezones.reduce((acc, tz) => {
      if (!acc[tz.region]) {
        acc[tz.region] = [];
      }
      acc[tz.region].push(tz);
      return acc;
    }, {} as Record<string, typeof timezones>);

    return grouped;
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTimezone ? selectedTimezone.display : "Select timezone..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search timezone (city, country, region)..." />
          <CommandList>
            <CommandEmpty>No timezone found.</CommandEmpty>
            {regionOrder.map((region) => {
              const regionTimezones = timezonesByRegion[region];
              if (!regionTimezones || regionTimezones.length === 0) return null;

              return (
                <CommandGroup key={region} heading={region}>
                  {regionTimezones.map((tz) => (
                    <CommandItem
                      key={tz.value}
                      value={`${tz.label} ${tz.display} ${tz.value} ${region}`}
                      onSelect={() => {
                        onChange(tz.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === tz.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tz.display}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

import { PeriodType } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  customRange?: { start: Date; end: Date };
  onCustomRangeChange?: (range: { start: Date; end: Date }) => void;
}

export function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
}: PeriodSelectorProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({
    start: customRange?.start,
    end: customRange?.end,
  });

  const periods: { value: PeriodType; label: string }[] = [
    { value: "30", label: "30 Days" },
    { value: "90", label: "90 Days" },
    { value: "ytd", label: "YTD" },
    { value: "custom", label: "Custom" },
  ];

  const handleCustomRangeApply = () => {
    if (dateRange.start && dateRange.end && onCustomRangeChange) {
      onCustomRangeChange({ start: dateRange.start, end: dateRange.end });
      onPeriodChange("custom");
      setShowCalendar(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {periods.map((period) => (
        period.value === "custom" ? (
          <Popover key={period.value} open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {period.label}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Date</label>
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.start}
                    onSelect={(date) => setDateRange({ ...dateRange, start: date })}
                    className={cn("rounded-md border pointer-events-auto")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Date</label>
                  <CalendarComponent
                    mode="single"
                    selected={dateRange.end}
                    onSelect={(date) => setDateRange({ ...dateRange, end: date })}
                    disabled={(date) => !dateRange.start || date < dateRange.start}
                    className={cn("rounded-md border pointer-events-auto")}
                  />
                </div>
                {dateRange.start && dateRange.end && (
                  <div className="text-sm text-muted-foreground">
                    {format(dateRange.start, "PP")} - {format(dateRange.end, "PP")}
                  </div>
                )}
                <Button
                  onClick={handleCustomRangeApply}
                  disabled={!dateRange.start || !dateRange.end}
                  className="w-full"
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            key={period.value}
            variant={selectedPeriod === period.value ? "default" : "outline"}
            size="sm"
            onClick={() => onPeriodChange(period.value)}
          >
            {period.label}
          </Button>
        )
      ))}
    </div>
  );
}


import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Suggested frequency presets
const PRESETS = [
  { label: "Every 30 minutes", value: { value: 30, unit: "minutes" } },
  { label: "Hourly", value: { value: 1, unit: "hours" } },
  { label: "Every 6 hours", value: { value: 6, unit: "hours" } },
  { label: "Daily", value: { value: 1, unit: "days" } },
  { label: "Weekly", value: { value: 7, unit: "days" } },
];

type TimeUnit = "minutes" | "hours" | "days";

export interface FrequencySelectorProps {
  value: { interval: number; unit: TimeUnit };
  onChange: (val: { interval: number; unit: TimeUnit }) => void;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({ value, onChange }) => {
  const [interval, setInterval] = useState<number>(value.interval);
  const [unit, setUnit] = useState<TimeUnit>(value.unit);

  const handlePreset = (preset: typeof PRESETS[0]["value"]) => {
    setInterval(preset.value);
    setUnit(preset.unit as TimeUnit);
    onChange({ interval: preset.value, unit: preset.unit as TimeUnit });
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setInterval(v);
    onChange({ interval: v, unit });
  };

  const handleUnitChange = (v: string) => {
    setUnit(v as TimeUnit);
    onChange({ interval, unit: v as TimeUnit });
  };

  return (
    <div>
      <Label className="mb-1">Lead Search & Nurture Frequency</Label>
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="number"
          min={1}
          value={interval}
          onChange={handleIntervalChange}
          className="w-20"
          aria-label="Frequency interval"
        />
        <Select value={unit} onValueChange={handleUnitChange}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="hours">Hours</SelectItem>
            <SelectItem value="days">Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 flex-wrap">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            type="button"
            onClick={() => handlePreset(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

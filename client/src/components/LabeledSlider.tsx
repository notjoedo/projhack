import { useState } from "react";
import { Slider } from "./ui/slider";

interface LabeledSliderProps {
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}

export function LabeledSlider({ leftLabel, rightLabel, value, onChange }: LabeledSliderProps) {
  const [sliderValue, setSliderValue] = useState(value);

  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="px-3">
        <Slider
          value={[sliderValue]}
          onValueChange={handleValueChange}
          max={100}
          min={0}
          step={1}
          className="w-full"
        />
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
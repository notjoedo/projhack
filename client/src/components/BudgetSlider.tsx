import { useState } from "react";
import { Slider } from "./ui/slider";

interface BudgetSliderProps {
  minValue: number;
  maxValue: number;
  onChange: (values: [number, number]) => void;
}

export function BudgetSlider({ minValue, maxValue, onChange }: BudgetSliderProps) {
  const [values, setValues] = useState<[number, number]>([minValue, maxValue]);

  const handleValueChange = (newValues: number[]) => {
    const updatedValues: [number, number] = [newValues[0], newValues[1]];
    setValues(updatedValues);
    onChange(updatedValues);
  };

  return (
    <div className="space-y-4">
      <div className="px-3">
        <Slider
          value={values}
          onValueChange={handleValueChange}
          max={3000}
          min={300}
          step={50}
          className="w-full"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-sm text-gray-600">Min</p>
          <p className="font-semibold text-gray-900">${values[0]}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Max</p>
          <p className="font-semibold text-gray-900">${values[1]}</p>
        </div>
      </div>
    </div>
  );
}
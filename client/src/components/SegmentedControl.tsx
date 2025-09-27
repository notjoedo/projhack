import { useState } from "react";

interface SegmentedControlProps {
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}

export function SegmentedControl({ options, selectedOption, onChange }: SegmentedControlProps) {
  const [selected, setSelected] = useState(selectedOption);

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange(option);
  };

  return (
    <div className="bg-gray-100 p-1 rounded-xl flex">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
            selected === option
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
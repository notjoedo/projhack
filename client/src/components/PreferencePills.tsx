import { useState } from "react";

interface PreferencePillsProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

export function PreferencePills({ options, selectedOptions, onChange }: PreferencePillsProps) {
  const [selected, setSelected] = useState<string[]>(selectedOptions);

  const toggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => toggleOption(option)}
          className={`px-4 py-2 rounded-xl border transition-colors ${
            selected.includes(option)
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
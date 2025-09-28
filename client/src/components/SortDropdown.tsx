import "./SortDropdown.css";

type SortDropdownProps = {
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
};

const SortDropdown = ({
  options,
  selectedOption,
  onSelect,
}: SortDropdownProps) => {
  return (
    <div className="sort-dropdown">
      <ul>
        {options.map((option) => (
          <li
            key={option}
            className={`sort-option ${
              selectedOption === option ? "selected" : ""
            }`}
            onClick={() => onSelect(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SortDropdown;

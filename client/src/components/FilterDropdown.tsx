import {
  FiWifi,
  FiCoffee,
  FiZap,
  FiWind,
  FiSun,
  FiDroplet,
} from "react-icons/fi";
import { FaParking, FaDumbbell } from "react-icons/fa";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import "./FilterDropdown.css";

type FilterDropdownProps = {
  filters: any;
  onFilterChange: (filters: any) => void;
  onClose: () => void;
  onClear: () => void;
};

const FilterDropdown = ({
  filters,
  onFilterChange,
  onClose,
  onClear,
}: FilterDropdownProps) => {
  const amenities = [
    { name: "In-Unit Laundry", icon: <CgSmartHomeWashMachine /> },
    { name: "Parking", icon: <FaParking /> },
    { name: "Gym", icon: <FaDumbbell /> },
    { name: "Wifi", icon: <FiWifi /> },
    { name: "Coffee Bar", icon: <FiCoffee /> },
    { name: "Utilities", icon: <FiZap /> },
  ];

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a: string) => a !== amenity)
      : [...filters.amenities, amenity];
    onFilterChange({ ...filters, amenities: newAmenities });
  };

  const handleBedsChange = (bedOption: string) => {
    onFilterChange({ ...filters, beds: bedOption });
  };

  const handleBathsChange = (bathOption: string) => {
    onFilterChange({ ...filters, baths: bathOption });
  };

  return (
    <div className="filter-dropdown">
      <div className="filter-section">
        <h4>Your Preference Filters</h4>
        <div className="saved-preferences">
          <div>
            <h5>Apply My Saved Preferences</h5>
            <p>Use your profile settings as filters</p>
          </div>
          <button
            className={`toggle-btn ${filters.useSaved ? "active" : ""}`}
            onClick={() =>
              onFilterChange({ ...filters, useSaved: !filters.useSaved })
            }
          >
            <span />
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h5>Beds & Baths</h5>
        <div className="beds-baths-container">
          <div className="beds-baths-selector">
            <p>Bedrooms</p>
            <div className="options">
              {["Any", "1", "2", "3+"].map((o) => (
                <button
                  key={o}
                  className={filters.beds === o ? "active" : ""}
                  onClick={() =>
                    handleBedsChange(filters.beds === o ? null : o)
                  }
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div className="beds-baths-selector">
            <p>Bathrooms</p>
            <div className="options">
              {["Any", "1", "2", "3+"].map((o) => (
                <button
                  key={o}
                  className={filters.baths === o ? "active" : ""}
                  onClick={() =>
                    handleBathsChange(filters.baths === o ? null : o)
                  }
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h5>Key Amenities</h5>
        <div className="amenities-grid">
          {amenities.map((amenity) => (
            <button
              key={amenity.name}
              className={`amenity-btn ${
                filters.amenities.includes(amenity.name) ? "active" : ""
              }`}
              onClick={() => handleAmenityToggle(amenity.name)}
            >
              {amenity.icon}
              <span>{amenity.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn-primary" onClick={onClose}>
          Apply Filters
        </button>
        <button className="btn-secondary" onClick={onClear}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;

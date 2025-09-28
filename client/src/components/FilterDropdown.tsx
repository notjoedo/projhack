import { useState } from "react";
import "./FilterDropdown.css";

type FilterDropdownProps = {
  initialFilters: any;
  onApply: (filters: any) => void;
  onClose: () => void;
};

const FilterDropdown = ({
  initialFilters,
  onApply,
  onClose,
}: FilterDropdownProps) => {
  const [filters, setFilters] = useState(initialFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      useSaved: false,
      priceRange: [400, 1200],
      beds: "Any",
      baths: "Any",
      amenities: [],
    };
    setFilters(clearedFilters);
    onApply(clearedFilters);
    onClose();
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
              setFilters({ ...filters, useSaved: !filters.useSaved })
            }
          >
            <span />
          </button>
        </div>
      </div>

      <div className="filter-section">
        <h5>Price Range</h5>
        {/* Placeholder for price range slider */}
        <div className="price-range-placeholder">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
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
                  onClick={() => setFilters({ ...filters, beds: o })}
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
                  onClick={() => setFilters({ ...filters, baths: o })}
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
        <div className="amenities-grid">{/* Placeholder for amenities */}</div>
      </div>

      <div className="filter-actions">
        <button className="btn-primary" onClick={handleApply}>
          Apply Filters
        </button>
        <button className="btn-secondary" onClick={handleClear}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;

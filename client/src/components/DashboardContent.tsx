import { FiHeart, FiFilter, FiChevronDown } from "react-icons/fi";
import "./DashboardContent.css";
import FilterDropdown from "./FilterDropdown";
import SortDropdown from "./SortDropdown";
import { useState, useRef } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

const DashboardContent = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [filters, setFilters] = useState({
    useSaved: false,
    priceRange: [500, 1500],
    beds: null,
    baths: null,
    amenities: [],
  });
  const [sortOption, setSortOption] = useState("match");
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(filterRef, () => setIsFilterOpen(false));
  useOnClickOutside(sortRef, () => setIsSortOpen(false));

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      useSaved: false,
      priceRange: [0, 2000],
      beds: null,
      baths: null,
      amenities: [],
    });
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.useSaved) count++;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 2000) count++;
    if (filters.beds) count++;
    if (filters.baths) count++;
    if (filters.amenities.length > 0) count++;
    return count;
  };

  return (
    <section className="dashboard-content">
      <div className="listings-header">
        <h2>Showing 4 of 124 listings</h2>
        <div className="listings-actions">
          <button className="btn-icon">
            <FiHeart />
          </button>
          <div className="filter-wrapper" ref={filterRef}>
            <button
              className={`btn filters-btn ${isFilterOpen ? "active" : ""}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter />
              <span>
                Filters {getFilterCount() > 0 && `(${getFilterCount()})`}
              </span>
              <FiChevronDown />
            </button>
            {isFilterOpen && (
              <FilterDropdown
                filters={filters}
                onFilterChange={handleFilterChange}
                onClose={() => setIsFilterOpen(false)}
                onClear={handleClearFilters}
              />
            )}
          </div>
          <div className="sort-wrapper" ref={sortRef}>
            <button
              className={`btn sort-btn ${isSortOpen ? "active" : ""}`}
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <div className="sort-icon-placeholder" />
              <span>Sort</span>
              <FiChevronDown />
            </button>
            {isSortOpen && (
              <SortDropdown
                selectedOption={sortOption}
                onSelect={(option) => {
                  setSortOption(option);
                  setIsSortOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardContent;

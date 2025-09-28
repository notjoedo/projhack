import { useState, useRef } from "react";
import { FiHeart, FiFilter, FiChevronDown } from "react-icons/fi";
import { FaSort } from "react-icons/fa";
import SortDropdown from "./SortDropdown";
import FilterDropdown from "./FilterDropdown";
import useOnClickOutside from "../hooks/useOnClickOutside";
import "./Listings.css";

const Listings = () => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortOptions = [
    "Best Match",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
    "Distance",
  ];
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    useSaved: false,
    priceRange: [400, 1200],
    beds: "Any",
    baths: "Any",
    amenities: ["In-Unit Laundry", "Parking"],
  });

  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(sortRef, () => setIsSortOpen(false));
  useOnClickOutside(filterRef, () => setIsFilterOpen(false));

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setIsSortOpen(false);
  };

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
  };

  const getFilterCount = () => {
    let count = 0;
    if (filters.useSaved) count++;
    if (filters.priceRange[0] !== 400 || filters.priceRange[1] !== 1200)
      count++;
    if (filters.beds !== "Any") count++;
    if (filters.baths !== "Any") count++;
    count += filters.amenities.length;
    return count;
  };

  const filterCount = getFilterCount();

  return (
    <section className="listings-container">
      <div className="listings-header">
        <h2>Showing 4 of 124 listings</h2>
        <div className="listings-actions">
          <button className="btn-icon">
            <FiHeart />
          </button>
          <div className="filter-container" ref={filterRef}>
            <button
              className="btn filters-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              type="button"
            >
              <FiFilter />
              <span>Filters {filterCount > 0 ? `(${filterCount})` : ""}</span>
              <FiChevronDown />
            </button>
            {isFilterOpen && (
              <FilterDropdown
                initialFilters={filters}
                onApply={handleFilterApply}
                onClose={() => setIsFilterOpen(false)}
              />
            )}
          </div>
          <div className="sort-container" ref={sortRef}>
            <button className="btn" onClick={() => setIsSortOpen(!isSortOpen)}>
              <FaSort />
              <span>{selectedSort || "Sort"}</span>
              <FiChevronDown />
            </button>
            {isSortOpen && (
              <SortDropdown
                options={sortOptions}
                selectedOption={selectedSort}
                onSelect={handleSortSelect}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listings;

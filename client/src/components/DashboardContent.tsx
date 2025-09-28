import { FiHeart, FiFilter, FiChevronDown } from "react-icons/fi";
import "./DashboardContent.css";

const DashboardContent = () => {
  return (
    <section className="dashboard-content">
      <div className="listings-header">
        <h2>Showing 4 of 124 listings</h2>
        <div className="listings-actions">
          <button className="btn-icon">
            <FiHeart />
          </button>
          <button className="btn filters-btn">
            <FiFilter />
            <span>Filters (1)</span>
            <FiChevronDown />
          </button>
          <button className="btn">
            <div className="sort-icon-placeholder" />
            <span>Sort</span>
            <FiChevronDown />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DashboardContent;

import { useState } from "react";
import {
  FiHome,
  FiMessageSquare,
  FiFileText,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import "./Sidebar.css";

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  };

  const handleMouseEnter = () => {
    setTooltip((prev) => ({ ...prev, visible: true }));
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <>
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
        >
          Feature coming soon
        </div>
      )}
      <aside className={`sidebar ${isMinimized ? "minimized" : ""}`}>
        <div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FiChevronLeft />
          </button>
          <div className="sidebar-header">
            <div className="logo">H</div>
            <h1>Harbor</h1>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li className="active">
                <a href="#">
                  <FiHome />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <FiMessageSquare />
                  <span>Inquiries & Groups</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <FiFileText />
                  <span>My Listings</span>
                </a>
              </li>
            </ul>
            <ul className="nav-section-bottom">
              <li
                className="disabled"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#">
                  <FiBell />
                  <span>Notifications</span>
                </a>
              </li>
              <li
                className="disabled"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#">
                  <FiSettings />
                  <span>Settings</span>
                </a>
              </li>
              <li
                className="disabled"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <a href="#">
                  <FiHelpCircle />
                  <span>Support</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-info">
              <img src="/PFP.jpg" alt="User Avatar" className="user-avatar" />
              <span className="user-name">Joe Do</span>
            </div>
            <FiChevronRight />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

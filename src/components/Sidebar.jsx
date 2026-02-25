import React from "react";
import { FaHome, FaCashRegister, FaBoxes, FaChartBar, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ activePage, onChangePage, onLogout }) => {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const menuItems = [
    { key: "home", label: "Home", icon: <FaHome /> },
    { key: "payment", label: "Payment", icon: <FaCashRegister /> },
    role === "admin" && { key: "inventory", label: "Inventory", icon: <FaBoxes /> },
    { key: "insights", label: "Insights", icon: <FaChartBar /> },
  ].filter(Boolean); // Remove null if cashier

  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>SmartPOS</h2>
        <p className="user-info">
          👤 {name} ({role})
        </p>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`menu-item ${activePage === item.key ? "active" : ""}`}
            onClick={() => onChangePage(item.key)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;

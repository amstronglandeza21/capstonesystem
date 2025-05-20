import React, { useState } from 'react';
import './Sidebar.css';
import { Menu, Home, Book } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <Menu />
      </button>
      <nav>
        <div className="nav-item">
          <span className="nav-icon"><Home /></span>
          <span className="nav-label">Home</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon"><Book /></span>
          <span className="nav-label">Theses</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

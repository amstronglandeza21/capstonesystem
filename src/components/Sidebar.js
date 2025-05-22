import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Menu, Home, Book } from 'lucide-react';

const Sidebar = () => {
  // Initialize state from localStorage or default to false (not collapsed)
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save to localStorage when collapsed changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <Menu />
      </button>

      <nav>
        <div className="nav-item">
          <span className="nav-icon"><Home size={20} /></span>
          <span className="nav-label">Home</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon"><Book size={20} /></span>
          <span className="nav-label">Theses</span>
        </div>
      </nav>

      <div className="profile">
        <img src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" alt="User" />
        <div className="info">
          <strong>Luiese Amstrong</strong>
          <small>luieseamstrong@gmail.com</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

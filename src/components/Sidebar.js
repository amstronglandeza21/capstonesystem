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
      <button className="toggle-button" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <Menu />
      </button>

      <nav>
        <button className="nav-item" onClick={() => alert('Home clicked')}>
          <span className="nav-icon"><Home size={20} /></span>
          <span className="nav-label">Home</span>
        </button>
        <button className="nav-item" onClick={() => alert('Theses clicked')}>
          <span className="nav-icon"><Book size={20} /></span>
          <span className="nav-label">Theses</span>
        </button>
      </nav>

      <div className="profile">
        <img
          src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
          alt="User"
        />
        <div className="info">
          <p className="name">Luiese Amstrong</p>
          <p className="email">luieseamstrong@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

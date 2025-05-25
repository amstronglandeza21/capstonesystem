// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { Menu, Home, Book, Upload } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

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
        <Link to="/" className="nav-item">
          <span className="nav-icon"><Home size={20} /></span>
          <span className="nav-label">Home</span>
        </Link>

        <Link to="/admin" className="nav-item">
          <span className="nav-icon"><Book size={20} /></span>
          <span className="nav-label">Theses</span>
        </Link>

        <Link to="/upload" className="nav-item">
          <span className="nav-icon"><Upload size={20} /></span>
          <span className="nav-label">Upload</span>
        </Link>
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

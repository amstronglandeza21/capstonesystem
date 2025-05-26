// src/components/Sidebar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Home, Book, Upload, Bell, X } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications');
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };
    fetchNotifications();
  }, []);

  // Close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

  return (
    <>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <Menu />
        </button>

        <nav>
          <Link to="/" className="nav-item">
            <span className="nav-icon"><Home size={20} /></span>
            <span className="nav-label">Home</span>
          </Link>

          <Link to="/" className="nav-item">
            <span className="nav-icon"><Book size={20} /></span>
            <span className="nav-label">Theses</span>
          </Link>

          <Link to="/upload" className="nav-item">
            <span className="nav-icon"><Upload size={20} /></span>
            <span className="nav-label">Upload</span>
          </Link>

          <Link to="#" className="nav-item" onClick={() => setShowNotif(!showNotif)}>
            <span className="nav-icon">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="notif-badge">{notifications.length}</span>
              )}
            </span>
            <span className="nav-label">Notifications</span>
          </Link>

        </nav>

        {/* 👤 Profile Section */}
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

      {/* 🧊 Notification Panel */}
      {showNotif && (
        <div
          ref={notifRef}
          className={`notif-panel ${collapsed ? 'shifted-collapsed' : 'shifted'}`}
        >
          <div className="notif-header">
            <h4>Notifications</h4>
            <button className="close-button" onClick={() => setShowNotif(false)}>
              <X size={20} />
            </button>
          </div>
          <ul>
            {notifications.length === 0 ? (
              <li className="notif-item">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li key={n._id} className="notif-item">
                  {n.message}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;

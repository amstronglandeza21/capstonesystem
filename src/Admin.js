// src/Admin.js
import React, { useEffect, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import './Admin.css';

const Admin = () => {
  const [theses, setTheses] = useState([]);

  useEffect(() => {
    fetch('/api/theses')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Fetched theses:', data); // Debug thumbnailPath
        setTheses(data);
      })
      .catch(err => console.error('❌ Fetch error:', err));
  }, []);

  return (
    <DashboardLayout>
      <div className="admin-container">
        <h2>Uploaded Theses</h2>
        <p className="total-count">Total: {theses.length}</p>

        <div className="thesis-grid">
          {theses.map((thesis) => {
            const thumbnailUrl = thesis.thumbnailPath
              ? `http://localhost:5000/${thesis.thumbnailPath}`
              : '/book-cover.png';

            return (
              <div className="thesis-card" key={thesis._id}>
                <div className="thumbnail">
                  <img
                    src={thumbnailUrl}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/book-cover.png';
                    }}
                    alt={`${thesis.title} thumbnail`}
                    className="thumbnail-img"
                    style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                  />
                </div>
                <div className="thesis-info">
                  <h1 className="thesis-title">{thesis.title}</h1>
                  <p><strong>Author:</strong> {thesis.author}</p>
                  <p><strong>Email:</strong> {thesis.email}</p>
                  <button
                    className="view-button"
                    onClick={() =>
                      window.open(`http://localhost:5000/${thesis.filePath}`, '_blank')
                    }
                  >
                    View PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;

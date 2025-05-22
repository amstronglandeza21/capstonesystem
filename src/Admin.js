// src/Admin.js
import React, { useEffect, useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { Trash2 } from 'lucide-react';
import SearchBar from './components/SearchBar'; // or './SearchBar' depending on your file structure
import './Admin.css';

const Admin = () => {
  const [theses, setTheses] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/theses')
      .then(res => res.json())
      .then(data => setTheses(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  // ... your existing functions (toggleSelectMode, toggleSelection, applyDelete)...

  const filteredTheses = theses.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleSelection = (id) => {
  setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(_id => _id !== id) : [...prev, id]
  );
};

const applyDelete = async () => {
  if (!window.confirm('Are you sure you want to delete selected theses?')) return;

  try {
    const res = await fetch('/api/theses/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (res.ok) {
      setTheses(prev => prev.filter(thesis => !selectedIds.includes(thesis._id)));
      setSelectedIds([]);
      setSelectMode(false);
    } else {
      console.error('Failed to delete');
    }
  } catch (err) {
    console.error('Delete error:', err);
  }
};


  return (
    <DashboardLayout>
    
      <div className="admin-container" style={{ position: 'relative' }}>

         <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <div className="admin-header" style={{ position: 'relative' }}>
          
       

          <h2>Uploaded Capstone</h2>
          <div className="admin-actions">
            {!selectMode ? (
              <button className="delete-icon-button" onClick={() => {
                setSelectMode(true);
                setSelectedIds([]);
              }}>
                <Trash2 size={20} />
              </button>
            ) : (
              <>
                <button className="cancel-button" onClick={() => {
                  setSelectMode(false);
                  setSelectedIds([]);
                }}>
                  Cancel
                </button>
                <button
                  className="apply-delete-button"
                  onClick={applyDelete}
                  disabled={selectedIds.length === 0}
                >
                  Apply
                </button>
              </>
            )}
          </div>
        </div>

        <p className="total-count">Total: {filteredTheses.length}</p>

        <div className="thesis-grid">
          {filteredTheses.map(thesis => (
            <div
              className={`thesis-card ${selectMode ? 'select-mode' : ''} ${
                selectedIds.includes(thesis._id) ? 'selected' : ''
              }`}
              key={thesis._id}
              onClick={() => selectMode && toggleSelection(thesis._id)}
            >
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(thesis._id)}
                  readOnly
                  className="selection-checkbox"
                />
              )}
              <div className="thumbnail">
                <img
                  src={`http://localhost:5000/${thesis.thumbnailPath}`}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/book-cover.png';
                  }}
                  alt={`${thesis.title} thumbnail`}
                  className="thumbnail-img"
                />
              </div>
              <div className="thesis-info">
                <h1 className="thesis-title">{thesis.title}</h1>
                <p><strong>Author:</strong> {thesis.author}</p>
                <p><strong>Email:</strong> {thesis.email}</p>
                <button
                  className="view-button"
                  onClick={e => {
                    e.stopPropagation();
                    window.open(`http://localhost:5000/${thesis.filePath}`, '_blank');
                  }}
                >
                  View PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;

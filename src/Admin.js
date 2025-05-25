import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import SearchBar from './components/SearchBar';
import DeleteControls from './components/DeleteControls';
import ThesisGrid from './components/ThesisGrid';
import { useTheses } from './context/ThesisContext';
import './Admin.css';

const Admin = () => {
  const { theses, setTheses } = useTheses();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalContent, setModalContent] = useState(null);

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

  const showMRAD = (thesis) => {
    setModalContent(
      <div className="modal-content">
        <h2>IMRAD for {thesis.title}</h2>
        <p><strong>Introduction:</strong> {thesis.introduction || 'N/A'}</p>
        <p><strong>Methodology:</strong> {thesis.methodology || 'N/A'}</p>
        <p><strong>Results:</strong> {thesis.results || 'N/A'}</p>
        <p><strong>Analysis:</strong> {thesis.analysis || 'N/A'}</p>
        <p><strong>Discussion:</strong> {thesis.discussion || 'N/A'}</p>
      </div>
    );
  };

  const showFullText = (thesis) => {
    setModalContent(
      <div className="modal-content">
        <h2>Full Text for {thesis.title}</h2>
        <pre className="full-text">{thesis.textContent || 'N/A'}</pre>
      </div>
    );
  };

  const closeModal = () => setModalContent(null);

const filteredTheses = theses.filter(t =>
  (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (t.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (t.textContent || '').toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <DashboardLayout>
      <div className="admin-container">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="admin-header">
          <h2>Uploaded Capstone</h2>
          <DeleteControls
            selectMode={selectMode}
            setSelectMode={setSelectMode}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            applyDelete={applyDelete}
          />
        </div>

        <p className="total-count">Total: {filteredTheses.length}</p>

        <ThesisGrid
          theses={filteredTheses}
          selectMode={selectMode}
          selectedIds={selectedIds}
          toggleSelection={toggleSelection}
          showMRAD={showMRAD}
          showFullText={showFullText}
        />

        {modalContent && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-window" onClick={e => e.stopPropagation()}>
              <button className="close-button" onClick={closeModal}>×</button>
              {modalContent}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Admin;

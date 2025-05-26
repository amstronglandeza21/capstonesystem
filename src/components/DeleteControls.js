// src/components/DeleteControls.js
import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteControls = ({ 
  selectMode, 
  setSelectMode, 
  selectedIds, 
  setSelectedIds, 
  applyDelete,
  allIds
}) => {
  const allSelected = allIds.length > 0 && selectedIds.length === allIds.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  return (
    <div className="admin-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {!selectMode ? (
        <button className="delete-icon-button" onClick={() => {
          setSelectMode(true);
          setSelectedIds([]);
        }}>
          <Trash2 size={20} />
        </button>
      ) : (
        <>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              checked={allSelected} 
              onChange={toggleSelectAll} 
            />
            Select All
          </label>

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
  );
};


export default DeleteControls;

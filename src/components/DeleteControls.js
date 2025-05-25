// src/components/DeleteControls.js
import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteControls = ({ selectMode, setSelectMode, selectedIds, setSelectedIds, applyDelete }) => {
  return (
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
  );
};

export default DeleteControls;

// src/components/ThesisCard.js
import React from 'react';
import ModalButtons from './ModalButtons';

const ThesisCard = ({ thesis, selectMode, isSelected, toggleSelection, showMRAD, showFullText }) => {
  return (
    <div
      className={`thesis-card ${selectMode ? 'select-mode' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => selectMode && toggleSelection(thesis._id)}
    >
      {selectMode && (
        <input
          type="checkbox"
          checked={isSelected}
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
        <ModalButtons
          onShowMRAD={() => showMRAD(thesis)}
          onShowFullText={() => showFullText(thesis)}
        />
      </div>
    </div>
  );
};

export default ThesisCard;

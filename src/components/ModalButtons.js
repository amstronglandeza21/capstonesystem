// src/components/ModalButtons.js
import React from 'react';
import './ModalButtons.css';

const ModalButtons = ({ onShowMRAD, onShowFullText }) => {
  return (
    <>
      <button className="view-mrad-button" onClick={e => {
        e.stopPropagation();
        onShowMRAD();
      }}>
        View IMRAD
      </button>
      <button className="view-fulltext-button" onClick={e => {
        e.stopPropagation();
        onShowFullText();
      }}>
        View Full Text
      </button>
    </>
  );
};

export default ModalButtons;

// src/components/ThesisGrid.js
import React from 'react';
import ThesisCard from './ThesisCard';

const ThesisGrid = ({
  theses,
  selectMode,
  selectedIds,
  toggleSelection,
  showMRAD,
  showFullText,
  showFullDetails,  // <-- add here
}) => {
  return (
    <div className="thesis-grid">
      {theses.map(thesis => (
        <ThesisCard
          key={thesis._id}
          thesis={thesis}
          selectMode={selectMode}
          isSelected={selectedIds.includes(thesis._id)}
          toggleSelection={toggleSelection}
          showMRAD={showMRAD}
          showFullText={showFullText}
          showFullDetails={showFullDetails}  // <-- pass it here
        />
      ))}
    </div>
  );
};

export default ThesisGrid;

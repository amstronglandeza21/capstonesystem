// SearchBar.js
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef(null);

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowSearch(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-bar-wrapper">
      <div className={`search-icon-box ${showSearch ? 'expanded' : ''}`} ref={inputRef}>
        <div className="icon-holder" onClick={() => setShowSearch(true)}>
          <Search className="search-icon" size={20} />
        </div>
        {showSearch && (
          <>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <button className="clear-button" onClick={() => setSearchTerm('')}>×</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

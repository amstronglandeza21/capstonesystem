// src/context/ThesisContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThesisContext = createContext();

export const useTheses = () => useContext(ThesisContext);

export const ThesisProvider = ({ children }) => {
  const [theses, setTheses] = useState([]);

  useEffect(() => {
    fetch('/api/theses')
      .then(res => res.json())
      .then(data => setTheses(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <ThesisContext.Provider value={{ theses, setTheses }}>
      {children}
    </ThesisContext.Provider>
  );
};

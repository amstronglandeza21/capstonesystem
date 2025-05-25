// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CapstoneUpload from './CapstoneUpload';
import Admin from './Admin';
import { ThesisProvider } from './context/ThesisContext';

function App() {
  return (
    <ThesisProvider>
      <Router>
        <Routes>
          <Route path="/upload" element={<CapstoneUpload />} />
          <Route path="/" element={<Admin />} />
        </Routes>
      </Router>
    </ThesisProvider>
  );
}

export default App;

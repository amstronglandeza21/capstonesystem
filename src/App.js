import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CapstoneUpload from './CapstoneUpload';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<CapstoneUpload />} />
        <Route path="/" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;

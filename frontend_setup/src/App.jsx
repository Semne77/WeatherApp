import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FrontendPage from './pages/FrontendPage';
import BackendPage from './pages/BackendPage';

function App() {
  return (
    <Router>
      <nav style={{ margin: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Map view</Link>
        <Link to="/backend">Date Ranges view</Link>
      </nav>

      <Routes>
        <Route path="/" element={<FrontendPage />} />
        <Route path="/backend" element={<BackendPage />} />
      </Routes>
    </Router>
  );
}

export default App;

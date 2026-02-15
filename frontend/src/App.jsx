import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LiveWeatherPage from './pages/LiveWeatherPage';
import HistoryForecastPage from './pages/HistoryForecastPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <nav style={{ margin: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/map" style={{ marginRight: '1rem' }}>Map view</Link>
        <Link to="/ranges">Date Ranges view</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<LiveWeatherPage />} />
        <Route path="/ranges" element={<HistoryForecastPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Destinations from './pages/Destinations';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/destinations" element={<Destinations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

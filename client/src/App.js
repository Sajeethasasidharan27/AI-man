import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SubmitPage from './pages/SubmitPage';
import DashboardPage from './pages/DashboardPage';
import ReviewerPage from './pages/ReviewerPage';
import ClaimDetailPage from './pages/ClaimDetailPage';
import { getClaims } from './utils/api';

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getClaims()
      .then(r => {
        const pending = r.data.data.filter(c => ['submitted', 'needs_review'].includes(c.status)).length;
        setPendingCount(pending);
      })
      .catch(() => {});
  }, [location.pathname]);

  return (
    <div className="page">
      <Navbar pendingCount={pendingCount} />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reviewer" element={<ReviewerPage />} />
          <Route path="/claim/:id" element={<ClaimDetailPage />} />
          <Route path="*" element={
            <div className="main main--narrow" style={{ textAlign: 'center', paddingTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24 }}>Page not found</h2>
              <p style={{ color: '#6b7280', marginBottom: 20 }}>This page doesn't exist.</p>
              <a href="/" className="btn btn--primary">Go Home</a>
            </div>
          } />
        </Routes>
      </div>
      <footer style={{ background: '#0d0f14', color: '#6b7280', textAlign: 'center', padding: '24px', fontSize: 13 }}>
        <strong style={{ color: 'white', fontFamily: 'Syne' }}>AIMan Knowledge Commons</strong>
        {' '}· Human-validated knowledge for better AI · Built with React + Node.js + MongoDB
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

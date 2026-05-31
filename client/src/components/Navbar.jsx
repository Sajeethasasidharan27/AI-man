import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ pendingCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Submit Claim', path: '/submit' },
    { label: 'My Dashboard', path: '/dashboard' },
    { label: 'Reviewer', path: '/reviewer', badge: pendingCount },
  ];

  return (
    <nav className="nav">
      <div className="nav__inner">
        <div className="nav__brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="nav__brand-dot" />
          AIMan<span style={{ color: '#2563eb' }}>KC</span>
        </div>
        <div className="nav__links">
          {links.map((l) => (
            <span
              key={l.path}
              className={`nav__link ${path === l.path ? 'nav__link--active' : ''}`}
              onClick={() => navigate(l.path)}
            >
              {l.label}
              {l.badge > 0 && <span className="nav__badge">{l.badge}</span>}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}

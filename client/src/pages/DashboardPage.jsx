import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClaims } from '../utils/api';
import { StatusBadge, CategoryPill, ScoreBar } from '../components/Badges';
import { timeAgo, CATEGORIES } from '../utils/helpers';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');

  useEffect(() => {
    getClaims()
      .then(r => setClaims(r.data.data))
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = claims.filter(c => {
    const statusOk = filter === 'all' || c.status === filter;
    const catOk = catFilter === 'all' || c.category === catFilter;
    return statusOk && catOk;
  });

  const stats = {
    total: claims.length,
    verified: claims.filter(c => c.status === 'verified').length,
    pending: claims.filter(c => ['submitted', 'needs_review'].includes(c.status)).length,
    avgScore: claims.length ? Math.round(claims.reduce((a, c) => a + c.knowledgeValueScore, 0) / claims.length) : 0,
  };

  return (
    <div className="main">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="page-header__eyebrow">My Contributions</div>
          <h1 className="page-header__title">Knowledge Dashboard</h1>
          <p className="page-header__subtitle">Track your submitted claims and their review status.</p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate('/submit')}>+ Submit New Claim</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-card--accent">
          <div className="stat-card__value">{stats.total}</div>
          <div className="stat-card__label">Total Claims</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: '#059669' }}>{stats.verified}</div>
          <div className="stat-card__label">Verified</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value" style={{ color: '#d97706' }}>{stats.pending}</div>
          <div className="stat-card__label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{stats.avgScore}</div>
          <div className="stat-card__label">Avg. Score</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['all', 'submitted', 'needs_review', 'verified', 'rejected', 'needs_more_evidence'].map(s => (
          <button key={s} className={`btn btn--sm ${filter === s ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <select className="form-control" style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
            value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading"><span className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📭</div>
          <div className="empty-state__title">No claims found</div>
          <p style={{ marginBottom: 16 }}>
            {claims.length === 0 ? "You haven't submitted anything yet." : "No claims match your filters."}
          </p>
          {claims.length === 0 && (
            <button className="btn btn--primary" onClick={() => navigate('/submit')}>Submit Your First Claim</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(claim => (
            <div key={claim._id} className="card card--hover fade-in"
              onClick={() => navigate(`/claim/${claim._id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                    <StatusBadge status={claim.status} />
                    <CategoryPill category={claim.category} />
                    {claim.location && <span style={{ fontSize: 12, color: '#9ca3af' }}>📍 {claim.location}</span>}
                  </div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{claim.title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, marginBottom: 12 }}>
                    {claim.description.length > 160 ? claim.description.slice(0, 160) + '…' : claim.description}
                  </p>
                  <ScoreBar score={claim.knowledgeValueScore} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, color: claim.knowledgeValueScore >= 75 ? '#059669' : claim.knowledgeValueScore >= 50 ? '#d97706' : '#dc2626' }}>
                    {claim.knowledgeValueScore}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>score</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>{timeAgo(claim.createdAt)}</div>
                </div>
              </div>
              {claim.reviewerFeedback && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0f9ff', borderRadius: 6, borderLeft: '3px solid #2563eb' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 2 }}>REVIEWER FEEDBACK</div>
                  <div style={{ fontSize: 13, color: '#374151' }}>{claim.reviewerFeedback}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

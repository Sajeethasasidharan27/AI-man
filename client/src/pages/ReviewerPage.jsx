import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClaims, getStats } from '../utils/api';
import { StatusBadge, CategoryPill } from '../components/Badges';
import { timeAgo } from '../utils/helpers';

export default function ReviewerPage() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  const load = () => {
    Promise.all([getClaims(), getStats()])
      .then(([c, s]) => {
        setClaims(c.data.data);
        setStats(s.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const tabs = [
    { key: 'pending', label: 'Pending Review', filter: c => ['submitted', 'needs_review'].includes(c.status) },
    { key: 'verified', label: 'Verified', filter: c => c.status === 'verified' },
    { key: 'rejected', label: 'Rejected', filter: c => c.status === 'rejected' },
    { key: 'all', label: 'All Claims', filter: () => true },
  ];

  const activeTab = tabs.find(t => t.key === tab);
  const filtered = claims.filter(activeTab.filter);

  const prioritySort = (a, b) => {
    const order = { needs_review: 0, submitted: 1, needs_more_evidence: 2, verified: 3, rejected: 4 };
    return (order[a.status] ?? 99) - (order[b.status] ?? 99);
  };

  return (
    <div className="main main--wide">
      <div className="page-header">
        <div className="page-header__eyebrow">Admin</div>
        <h1 className="page-header__title">Reviewer Dashboard</h1>
        <p className="page-header__subtitle">Validate knowledge claims submitted by contributors.</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card stat-card--accent">
            <div className="stat-card__value">{stats.total}</div>
            <div className="stat-card__label">Total Claims</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: '#d97706' }}>{stats.pending}</div>
            <div className="stat-card__label">Awaiting Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: '#059669' }}>{stats.verified}</div>
            <div className="stat-card__label">Verified</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: '#dc2626' }}>{stats.rejected}</div>
            <div className="stat-card__label">Rejected</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.avgScore}</div>
            <div className="stat-card__label">Avg Score</div>
          </div>
        </div>
      )}

      <div className="tabs">
        {tabs.map(t => (
          <div key={t.key} className={`tab ${tab === t.key ? 'tab--active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
            <span style={{ marginLeft: 6, background: tab === t.key ? '#dbeafe' : '#f3f4f6', color: tab === t.key ? '#2563eb' : '#6b7280', padding: '1px 7px', borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
              {claims.filter(t.filter).length}
            </span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading"><span className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">✅</div>
          <div className="empty-state__title">Nothing here</div>
          <p>No claims in this category.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Claim</th>
                  <th>Category</th>
                  <th>Contributor</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...filtered].sort(prioritySort).map(claim => (
                  <tr key={claim._id} onClick={() => navigate(`/claim/${claim._id}`)}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, maxWidth: 300 }}>
                        {claim.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#9ca3af' }}>
                        {claim.description.slice(0, 80)}…
                      </div>
                    </td>
                    <td><CategoryPill category={claim.category} /></td>
                    <td style={{ fontSize: 13 }}>{claim.contributorName}</td>
                    <td>
                      <div style={{
                        fontFamily: 'Syne', fontWeight: 800, fontSize: 18,
                        color: claim.knowledgeValueScore >= 75 ? '#059669' : claim.knowledgeValueScore >= 50 ? '#d97706' : '#dc2626'
                      }}>
                        {claim.knowledgeValueScore}
                      </div>
                    </td>
                    <td><StatusBadge status={claim.status} /></td>
                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{timeAgo(claim.createdAt)}</td>
                    <td>
                      <button className="btn btn--sm btn--primary" onClick={e => { e.stopPropagation(); navigate(`/claim/${claim._id}`); }}>
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

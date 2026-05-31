import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClaimById, reviewClaim } from '../utils/api';
import { StatusBadge, CategoryPill, ScoreRing } from '../components/Badges';
import { getCategoryInfo, REVIEWER_USES, SUGGESTED_USES, formatDate, timeAgo } from '../utils/helpers';

export default function ClaimDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    status: '',
    reviewerName: '',
    reviewerScore: 70,
    reviewerFeedback: '',
    reviewerUse: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getClaimById(id)
      .then(r => {
        setClaim(r.data.data);
        setReviewForm(prev => ({ ...prev, status: r.data.data.status }));
      })
      .catch(() => setError('Claim not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReview = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await reviewClaim(id, reviewForm);
      setClaim(res.data.data);
      setReviewMode(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.response?.data?.error || 'Review failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading main"><span className="spinner" /></div>;
  if (!claim && error) return (
    <div className="main main--narrow">
      <div className="alert alert--error">{error}</div>
      <button className="btn btn--secondary" onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
  if (!claim) return null;

  const catInfo = getCategoryInfo(claim.category);

  return (
    <div className="main">
      {/* Back & breadcrumb */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <button className="btn btn--ghost btn--sm" onClick={() => navigate(-1)}>← Back</button>
        <span style={{ fontSize: 13, color: '#9ca3af', alignSelf: 'center' }}>/ Claim Detail</span>
      </div>

      {saved && <div className="alert alert--success">✅ Review submitted successfully!</div>}
      {error && <div className="alert alert--error">{error}</div>}

      <div className="detail-grid">
        {/* Left: Claim content */}
        <div>
          {/* Header */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              <StatusBadge status={claim.status} />
              <CategoryPill category={claim.category} />
              {claim.location && <span style={{ fontSize: 12, color: '#9ca3af', alignSelf: 'center' }}>📍 {claim.location}</span>}
              {claim.date && <span style={{ fontSize: 12, color: '#9ca3af', alignSelf: 'center' }}>📅 {formatDate(claim.date)}</span>}
            </div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, letterSpacing: -0.3, marginBottom: 8 }}>
              {catInfo.icon} {claim.title}
            </h1>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>
              By <strong style={{ color: '#374151' }}>{claim.contributorName}</strong> · {timeAgo(claim.createdAt)}
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title">📝 Description</div>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#374151' }}>{claim.description}</p>
          </div>

          {/* Why useful */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title">💡 Why This Is Useful</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151' }}>{claim.whyUseful}</p>
          </div>

          {/* Evidence */}
          {claim.evidence && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-title">📎 Evidence</div>
              {(claim.evidence.startsWith('http') || claim.evidence.startsWith('data:')) ? (
                <a href={claim.evidence} target="_blank" rel="noreferrer"
                  download={claim.evidenceFileName || ''}
                  style={{ color: '#2563eb', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {claim.evidence.startsWith('http') ? '🔗' : '📁'} {claim.evidenceFileName || (claim.evidence.startsWith('data:') ? 'View uploaded file' : claim.evidence)}
                </a>
              ) : (
                <span style={{ color: '#6b7280', fontSize: 14 }}>Evidence unavailable</span>
              )}
            </div>
          )}

          {/* Reviewer feedback */}
          {claim.reviewerFeedback && (
            <div className="card" style={{ marginBottom: 16, borderLeft: '4px solid #2563eb' }}>
              <div className="section-title">👤 Reviewer Feedback</div>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>{claim.reviewerFeedback}</p>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>
                {claim.reviewerName && <span>By {claim.reviewerName} · </span>}
                {formatDate(claim.reviewedAt)}
                {claim.reviewerUse && (
                  <span style={{ marginLeft: 8, color: '#2563eb', fontWeight: 600 }}>
                    → {claim.reviewerUse.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Score & Review panel */}
        <div>
          {/* Score card */}
          <div className="card" style={{ marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Knowledge Value Score
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <ScoreRing score={claim.knowledgeValueScore} />
            </div>
            <div className="divider" />
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>Suggested Use</div>
            <div style={{ fontWeight: 700, color: SUGGESTED_USES[claim.suggestedUse]?.color || '#374151', fontSize: 14 }}>
              {SUGGESTED_USES[claim.suggestedUse]?.label || claim.suggestedUse}
            </div>
            {claim.reviewerScore && (
              <>
                <div className="divider" />
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Reviewer Score</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: '#7c3aed' }}>
                  {claim.reviewerScore}/100
                </div>
              </>
            )}
          </div>

          {/* Quick info */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title" style={{ fontSize: 14 }}>ℹ️ Claim Info</div>
            {[
              ['Category', `${catInfo.icon} ${catInfo.label}`],
              ['Status', null],
              ['Submitted', timeAgo(claim.createdAt)],
              ['Evidence', claim.evidence ? 'Yes ✅' : 'No ❌'],
              ['Location', claim.location || '—'],
              ['Consent', claim.consent ? 'Given ✅' : 'Not given'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between" style={{ padding: '7px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                <span style={{ color: '#6b7280' }}>{k}</span>
                {k === 'Status' ? <StatusBadge status={claim.status} /> : <span style={{ fontWeight: 500 }}>{v}</span>}
              </div>
            ))}
          </div>

          {/* Review actions */}
          {!reviewMode ? (
            <div className="card">
              <div className="section-title" style={{ fontSize: 14 }}>🔍 Reviewer Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn--success btn--full"
                  onClick={() => { setReviewForm(prev => ({ ...prev, status: 'verified' })); setReviewMode(true); }}>
                  ✅ Approve & Verify
                </button>
                <button className="btn btn--danger btn--full"
                  onClick={() => { setReviewForm(prev => ({ ...prev, status: 'rejected' })); setReviewMode(true); }}>
                  ❌ Reject
                </button>
                <button className="btn btn--secondary btn--full"
                  onClick={() => { setReviewForm(prev => ({ ...prev, status: 'needs_more_evidence' })); setReviewMode(true); }}>
                  🔎 Needs More Evidence
                </button>
                <button className="btn btn--secondary btn--full"
                  onClick={() => { setReviewForm(prev => ({ ...prev, status: 'needs_review' })); setReviewMode(true); }}>
                  📋 Mark for Review
                </button>
              </div>
            </div>
          ) : (
            <div className="card fade-in">
              <div className="section-title" style={{ fontSize: 14 }}>✍️ Write Review</div>
              <div style={{ padding: '8px 12px', borderRadius: 6, marginBottom: 16, fontSize: 13, fontWeight: 600,
                background: reviewForm.status === 'verified' ? '#ecfdf5' : reviewForm.status === 'rejected' ? '#fef2f2' : '#fffbeb',
                color: reviewForm.status === 'verified' ? '#059669' : reviewForm.status === 'rejected' ? '#dc2626' : '#d97706',
              }}>
                Decision: {reviewForm.status.replace(/_/g, ' ').toUpperCase()}
              </div>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className="form-control" placeholder="Reviewer name" value={reviewForm.reviewerName}
                  onChange={e => setReviewForm(p => ({ ...p, reviewerName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Reviewer Score: {reviewForm.reviewerScore}</label>
                <input type="range" min="0" max="100" value={reviewForm.reviewerScore}
                  onChange={e => setReviewForm(p => ({ ...p, reviewerScore: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#2563eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
                  <span>0</span><span>100</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Feedback / Comments</label>
                <textarea className="form-control" style={{ minHeight: 80 }}
                  placeholder="Explain your decision, what's missing, or how this could be improved..."
                  value={reviewForm.reviewerFeedback}
                  onChange={e => setReviewForm(p => ({ ...p, reviewerFeedback: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Useful For</label>
                <select className="form-control" value={reviewForm.reviewerUse}
                  onChange={e => setReviewForm(p => ({ ...p, reviewerUse: e.target.value }))}>
                  <option value="">— Select use case —</option>
                  {REVIEWER_USES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn--secondary" onClick={() => setReviewMode(false)}>Cancel</button>
                <button className="btn btn--primary" style={{ flex: 1 }} disabled={saving} onClick={handleReview}>
                  {saving ? <><span className="spinner" /> Saving…</> : 'Submit Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

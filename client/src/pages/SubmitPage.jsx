import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClaim } from '../utils/api';
import { CATEGORIES } from '../utils/helpers';
import { ScoreRing } from '../components/Badges';

const initialForm = {
  title: '',
  category: '',
  description: '',
  whyUseful: '',
  evidenceUrl: '',
  location: '',
  date: '',
  contributorName: '',
  consent: false,
};

function computePreviewScore(form, file) {
  let score = 20;
  if (form.description.length > 100) score += 15;
  if (form.description.length > 300) score += 10;
  if (form.evidenceUrl || file) score += 20;
  if (form.location) score += 10;
  if (form.date) score += 5;
  if (form.whyUseful.length > 50) score += 10;
  if (form.consent) score += 5;
  const highVal = ['ai_correction', 'expert_knowledge', 'field_observation'];
  if (highVal.includes(form.category)) score += 10;
  return Math.min(score, 100);
}

export default function SubmitPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const fileRef = useRef();

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));
  const previewScore = computePreviewScore(form, file);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('evidenceFile', file);
      const res = await createClaim(fd);
      setSubmitted(res.data.data);
    } catch (e) {
      setError(e.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="main main--narrow fade-in">
        <div className="card" style={{ textAlign: 'center', padding: '48px 40px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
            Knowledge Claim Submitted!
          </h2>
          <p style={{ color: '#6b7280', marginBottom: 32 }}>
            Thank you, {submitted.contributorName}! Your claim has been received and is pending review.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <ScoreRing score={submitted.knowledgeValueScore} />
          </div>
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
            <div className="flex justify-between mb-2">
              <span style={{ fontSize: 13, color: '#6b7280' }}>Status</span>
              <span className="badge badge--submitted">Submitted</span>
            </div>
            <div className="flex justify-between mb-2">
              <span style={{ fontSize: 13, color: '#6b7280' }}>Category</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {CATEGORIES.find(c => c.value === submitted.category)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: 13, color: '#6b7280' }}>Suggested Use</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', textTransform: 'capitalize' }}>
                {submitted.suggestedUse?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={() => navigate('/dashboard')}>
              View My Dashboard
            </button>
            <button className="btn btn--secondary" onClick={() => { setSubmitted(null); setForm(initialForm); setStep(1); setFile(null); }}>
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main main--narrow">
      <div className="page-header">
        <div className="page-header__eyebrow">Knowledge Contribution</div>
        <h1 className="page-header__title">Submit a Knowledge Claim</h1>
        <p className="page-header__subtitle">
          Share what you know. Every observation, correction, or insight matters.
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 12, fontWeight: 700,
              background: step >= s ? '#2563eb' : '#e5e7eb',
              color: step >= s ? 'white' : '#9ca3af', flexShrink: 0
            }}>{s}</div>
            <div style={{ fontSize: 12, color: step >= s ? '#2563eb' : '#9ca3af', fontWeight: 500 }}>
              {['Basic Info', 'Details & Evidence', 'Review & Submit'][s - 1]}
            </div>
            {s < 3 && <div style={{ flex: 1, height: 2, background: step > s ? '#2563eb' : '#e5e7eb', borderRadius: 2 }} />}
          </div>
        ))}
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="card">
        {/* Step 1 */}
        {step === 1 && (
          <div className="fade-in">
            <div className="section-title">📋 Basic Information</div>
            <div className="form-group">
              <label className="form-label">Claim Title <span>*</span></label>
              <input className="form-control" placeholder="E.g. Rare Black Flamingo spotted near Kodaikanal" value={form.title} onChange={e => update('title', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Category <span>*</span></label>
              <select className="form-control" value={form.category} onChange={e => update('category', e.target.value)}>
                <option value="">— Select a category —</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description <span>*</span></label>
              <textarea className="form-control" style={{ minHeight: 120 }}
                placeholder="Describe what you observed or know. Be as specific as possible — include dates, quantities, comparisons, and context."
                value={form.description} onChange={e => update('description', e.target.value)} />
              <div className="form-hint">{form.description.length} chars — aim for 100+ for a higher score</div>
            </div>
            <div className="form-group">
              <label className="form-label">Contributor Name <span>*</span></label>
              <input className="form-control" placeholder="Your name or organization" value={form.contributorName} onChange={e => update('contributorName', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn--primary"
                disabled={!form.title || !form.category || form.description.length < 10 || !form.contributorName}
                onClick={() => setStep(2)}>
                Next: Add Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="fade-in">
            <div className="section-title">📎 Details & Evidence</div>
            <div className="form-group">
              <label className="form-label">Why is this useful? <span>*</span></label>
              <textarea className="form-control"
                placeholder="How could this knowledge help AI systems, researchers, or decision-makers?"
                value={form.whyUseful} onChange={e => update('whyUseful', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-control" placeholder="E.g. Ooty, Tamil Nadu" value={form.location} onChange={e => update('location', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Observation</label>
                <input className="form-control" type="date" value={form.date} onChange={e => update('date', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Evidence URL</label>
              <input className="form-control" placeholder="https://... (article, photo, dataset link)" value={form.evidenceUrl} onChange={e => update('evidenceUrl', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Upload Evidence File</label>
              <div className="upload-zone" onClick={() => fileRef.current.click()}>
                <div className="upload-zone__icon">{file ? '✅' : '📁'}</div>
                <div className="upload-zone__text">
                  {file
                    ? <><strong>{file.name}</strong> ({(file.size / 1024).toFixed(0)}KB)</>
                    : <><strong>Click to upload</strong> or drag and drop — images, PDFs, docs</>
                  }
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                Uploads are stored directly in the database for Vercel deployment. Maximum file size is 2 MB.
              </div>
              <input ref={fileRef} type="file" style={{ display: 'none' }}
                accept="image/*,.pdf,.doc,.docx,.csv,.txt"
                onChange={e => setFile(e.target.files[0])} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn--secondary" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn--primary" disabled={!form.whyUseful} onClick={() => setStep(3)}>
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="fade-in">
            <div className="section-title">✅ Review & Submit</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start', marginBottom: 24 }}>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{form.title}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span className="category-pill">{CATEGORIES.find(c => c.value === form.category)?.icon} {CATEGORIES.find(c => c.value === form.category)?.label}</span>
                  {form.location && <span className="category-pill">📍 {form.location}</span>}
                  {form.date && <span className="category-pill">📅 {form.date}</span>}
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, marginBottom: 8 }}>{form.description}</p>
                <p style={{ fontSize: 13, color: '#6b7280' }}><strong>Why useful:</strong> {form.whyUseful}</p>
                {(form.evidenceUrl || file) && (
                  <p style={{ fontSize: 13, color: '#2563eb', marginTop: 6 }}>
                    📎 {file ? file.name : form.evidenceUrl}
                  </p>
                )}
              </div>
              <ScoreRing score={previewScore} />
            </div>
            <div className="checkbox-row" style={{ marginBottom: 20 }}>
              <input type="checkbox" id="consent" checked={form.consent}
                onChange={e => update('consent', e.target.checked)} />
              <label htmlFor="consent">
                I confirm this information is accurate to the best of my knowledge. I consent to this data being used for AI research, training, and evaluation purposes under the AIMan Knowledge Commons terms.
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn--secondary" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn--primary btn--lg"
                disabled={!form.consent || loading}
                onClick={handleSubmit}>
                {loading ? <><span className="spinner" /> Submitting...</> : '🚀 Submit Knowledge Claim'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

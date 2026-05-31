import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: '🔭',
    title: 'Field Observations',
    desc: 'Rare animal sightings, weather anomalies, environmental changes — witnessed firsthand.'
  },
  {
    icon: '🤖',
    title: 'AI Corrections',
    desc: 'Spotted an AI mistake? Submit the correction and help improve future AI responses.'
  },
  {
    icon: '🎓',
    title: 'Expert Knowledge',
    desc: 'Domain expertise, specialized processes, and technical know-how that AI lacks.'
  },
  {
    icon: '📍',
    title: 'Local Knowledge',
    desc: 'Hyperlocal info about communities, infrastructure, culture, and real-world workflows.'
  },
  {
    icon: '🏗️',
    title: 'Infrastructure Issues',
    desc: 'Document problems with roads, utilities, public systems, and civic infrastructure.'
  },
  {
    icon: '🌍',
    title: 'Climate Observations',
    desc: 'Ground-level environmental data, seasonal changes, and ecological observations.'
  }
];

const steps = [
  { num: '01', title: 'Submit', desc: 'Share your knowledge claim with context, evidence, and location details.' },
  { num: '02', title: 'Score', desc: 'Get an instant Knowledge Value Score based on completeness and relevance.' },
  { num: '03', title: 'Review', desc: 'Human reviewers validate, enrich, and assess your contribution.' },
  { num: '04', title: 'Impact', desc: 'Verified knowledge gets used for AI training, evaluation, or knowledge bases.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0f14 0%, #1e2230 50%, #0d1a3a 100%)',
        color: 'white',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(37,99,235,0.2)',
            border: '1px solid rgba(37,99,235,0.4)',
            borderRadius: 20,
            padding: '4px 14px',
            fontSize: 12,
            fontWeight: 700,
            color: '#93c5fd',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 20
          }}>
            Human × AI Collaboration
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(36px, 6vw, 60px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
            marginBottom: 20
          }}>
            AIMan Knowledge<br />
            <span style={{ color: '#3b82f6' }}>Commons</span>
          </h1>
          <p style={{ fontSize: 18, color: '#9ca3af', lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
            AI doesn't know everything. You do. Submit your knowledge, get it validated by experts, and help make AI smarter — one claim at a time.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--primary btn--lg" onClick={() => navigate('/submit')}>
              Submit a Knowledge Claim →
            </button>
            <button className="btn btn--secondary btn--lg" onClick={() => navigate('/dashboard')}
              style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              View Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: '#1e2230', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            { val: '6+', label: 'Knowledge Categories' },
            { val: '5', label: 'Review Stages' },
            { val: '100', label: 'Max Score' },
            { val: '4', label: 'AI Use Cases' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 28, color: '#3b82f6' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        {/* How it works */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="page-header__eyebrow">How It Works</div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>
            From insight to impact
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 72 }}>
          {steps.map((s, i) => (
            <div key={i} className="card" style={{ position: 'relative' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 40, color: '#e5e7eb', marginBottom: 12 }}>{s.num}</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="page-header__eyebrow">Categories</div>
          <h2 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>
            What knowledge can you share?
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 72 }}>
          {features.map((f, i) => (
            <div key={i} className="card card--hover" style={{ display: 'flex', gap: 16 }}
              onClick={() => navigate('/submit')}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
          border: '1px solid #c7d2fe',
          borderRadius: 20,
          padding: '48px 40px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, letterSpacing: -0.5, marginBottom: 12 }}>
            Ready to contribute your knowledge?
          </h2>
          <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 28 }}>
            Every verified contribution helps build better, more accurate AI systems.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn--primary btn--lg" onClick={() => navigate('/submit')}>
              Submit Knowledge Claim
            </button>
            <button className="btn btn--secondary btn--lg" onClick={() => navigate('/reviewer')}>
              Go to Reviewer Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

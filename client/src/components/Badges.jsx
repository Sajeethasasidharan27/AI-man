import React from 'react';
import { STATUSES, getCategoryInfo, getScoreColor } from '../utils/helpers';

export function StatusBadge({ status }) {
  const info = STATUSES[status] || { label: status, className: '' };
  return <span className={`badge ${info.className}`}>{info.label}</span>;
}

export function CategoryPill({ category }) {
  const info = getCategoryInfo(category);
  return (
    <span className="category-pill">
      {info.icon} {info.label}
    </span>
  );
}

export function ScoreBar({ score }) {
  const color = getScoreColor(score);
  return (
    <div>
      <div className="flex justify-between mb-2" style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
        <span>Knowledge Value Score</span>
        <span style={{ fontWeight: 700, color }}>{score}/100</span>
      </div>
      <div className="score-bar">
        <div
          className="score-bar__fill"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function ScoreRing({ score }) {
  const color = getScoreColor(score);
  return (
    <div className="score-ring">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${2 * Math.PI * 40}`}
          strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="50" y="56" textAnchor="middle" fontSize="22" fontWeight="800" fill={color} fontFamily="Syne, sans-serif">
          {score}
        </text>
      </svg>
      <span className="score-ring__label">Score / 100</span>
    </div>
  );
}

export const CATEGORIES = [
  { value: 'field_observation', label: 'Field Observation', icon: '🔭' },
  { value: 'local_knowledge', label: 'Local Knowledge', icon: '📍' },
  { value: 'ai_correction', label: 'AI Correction', icon: '🤖' },
  { value: 'expert_knowledge', label: 'Expert Knowledge', icon: '🎓' },
  { value: 'creative_idea', label: 'Creative Idea', icon: '💡' },
  { value: 'infrastructure_issue', label: 'Infrastructure Issue', icon: '🏗️' },
  { value: 'environment_climate', label: 'Environment / Climate', icon: '🌍' },
  { value: 'other', label: 'Other', icon: '📌' },
];

export const STATUSES = {
  submitted: { label: 'Submitted', className: 'badge--submitted' },
  needs_review: { label: 'Needs Review', className: 'badge--needs_review' },
  verified: { label: 'Verified', className: 'badge--verified' },
  rejected: { label: 'Rejected', className: 'badge--rejected' },
  needs_more_evidence: { label: 'Needs More Evidence', className: 'badge--needs_more_evidence' },
};

export const SUGGESTED_USES = {
  ai_training: { label: 'AI Training Data', color: '#2563eb' },
  ai_evaluation: { label: 'AI Evaluation', color: '#7c3aed' },
  knowledge_base: { label: 'Knowledge Base', color: '#059669' },
  not_suitable: { label: 'Not Suitable', color: '#dc2626' },
};

export const REVIEWER_USES = [
  { value: 'model_training', label: 'Model Training' },
  { value: 'ai_evaluation', label: 'AI Evaluation' },
  { value: 'knowledge_base', label: 'Knowledge Base' },
  { value: 'correction_feedback', label: 'Correction Feedback' },
  { value: 'not_useful', label: 'Not Useful' },
];

export const getCategoryInfo = (val) =>
  CATEGORIES.find((c) => c.value === val) || { label: val, icon: '📌' };

export const getScoreColor = (score) => {
  if (score >= 75) return '#059669';
  if (score >= 50) return '#d97706';
  return '#dc2626';
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

export const timeAgo = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const mongoose = require('mongoose');

const knowledgeClaimSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'field_observation',
      'local_knowledge',
      'ai_correction',
      'expert_knowledge',
      'creative_idea',
      'infrastructure_issue',
      'environment_climate',
      'other'
    ],
    required: true
  },
  description: { type: String, required: true },
  whyUseful: { type: String, required: true },
  evidence: { type: String }, // URL or base64 data URL
  evidenceFileName: { type: String },
  location: { type: String },
  date: { type: Date },
  contributorName: { type: String, required: true },
  consent: { type: Boolean, default: false },

  // System-generated
  status: {
    type: String,
    enum: ['submitted', 'needs_review', 'verified', 'rejected', 'needs_more_evidence'],
    default: 'submitted'
  },
  knowledgeValueScore: { type: Number, default: 0 },
  suggestedUse: {
    type: String,
    enum: ['ai_training', 'ai_evaluation', 'knowledge_base', 'not_suitable'],
    default: 'knowledge_base'
  },

  // Reviewer fields
  reviewerName: { type: String },
  reviewerScore: { type: Number },
  reviewerFeedback: { type: String },
  reviewerUse: {
    type: String,
    enum: ['model_training', 'ai_evaluation', 'knowledge_base', 'correction_feedback', 'not_useful']
  },
  reviewedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-score on save
knowledgeClaimSchema.pre('save', function (next) {
  if (this.isNew) {
    this.knowledgeValueScore = computeScore(this);
    this.suggestedUse = computeSuggestedUse(this);
  }
  this.updatedAt = new Date();
  next();
});

function computeScore(claim) {
  let score = 20; // base
  if (claim.description && claim.description.length > 100) score += 15;
  if (claim.description && claim.description.length > 300) score += 10;
  if (claim.evidence) score += 20;
  if (claim.location) score += 10;
  if (claim.date) score += 5;
  if (claim.whyUseful && claim.whyUseful.length > 50) score += 10;
  if (claim.consent) score += 5;
  const highValueCategories = ['ai_correction', 'expert_knowledge', 'field_observation'];
  if (highValueCategories.includes(claim.category)) score += 10;
  return Math.min(score, 100);
}

function computeSuggestedUse(claim) {
  if (claim.category === 'ai_correction') return 'ai_evaluation';
  if (claim.category === 'expert_knowledge') return 'ai_training';
  if (claim.category === 'field_observation') return 'ai_training';
  if (claim.category === 'local_knowledge') return 'knowledge_base';
  return 'knowledge_base';
}

module.exports = mongoose.model('KnowledgeClaim', knowledgeClaimSchema);

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const KnowledgeClaim = require('../models/KnowledgeClaim');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// GET all claims (with optional filters)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    const claims = await KnowledgeClaim.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: claims });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET stats
router.get('/stats', async (req, res) => {
  try {
    const total = await KnowledgeClaim.countDocuments();
    const verified = await KnowledgeClaim.countDocuments({ status: 'verified' });
    const pending = await KnowledgeClaim.countDocuments({ status: { $in: ['submitted', 'needs_review'] } });
    const rejected = await KnowledgeClaim.countDocuments({ status: 'rejected' });
    const avgScore = await KnowledgeClaim.aggregate([
      { $group: { _id: null, avg: { $avg: '$knowledgeValueScore' } } }
    ]);
    const byCategory = await KnowledgeClaim.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json({
      success: true,
      data: {
        total,
        verified,
        pending,
        rejected,
        avgScore: avgScore[0]?.avg?.toFixed(1) || 0,
        byCategory
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single claim
router.get('/:id', async (req, res) => {
  try {
    const claim = await KnowledgeClaim.findById(req.params.id);
    if (!claim) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: claim });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create claim
router.post('/', upload.single('evidenceFile'), async (req, res) => {
  try {
    const body = req.body;
    const claim = new KnowledgeClaim({
      title: body.title,
      category: body.category,
      description: body.description,
      whyUseful: body.whyUseful,
      evidence: req.file
        ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
        : body.evidenceUrl || '',
      evidenceFileName: req.file ? req.file.originalname : undefined,
      location: body.location,
      date: body.date ? new Date(body.date) : undefined,
      contributorName: body.contributorName,
      consent: body.consent === 'true' || body.consent === true,
      status: 'submitted'
    });
    await claim.save();
    res.status(201).json({ success: true, data: claim });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH review a claim
router.patch('/:id/review', async (req, res) => {
  try {
    const { status, reviewerName, reviewerScore, reviewerFeedback, reviewerUse } = req.body;
    const claim = await KnowledgeClaim.findById(req.params.id);
    if (!claim) return res.status(404).json({ success: false, error: 'Not found' });

    if (status) claim.status = status;
    if (reviewerName) claim.reviewerName = reviewerName;
    if (reviewerScore !== undefined) claim.reviewerScore = reviewerScore;
    if (reviewerFeedback) claim.reviewerFeedback = reviewerFeedback;
    if (reviewerUse) claim.reviewerUse = reviewerUse;
    claim.reviewedAt = new Date();

    // Blend scores if reviewer gave one
    if (reviewerScore !== undefined) {
      claim.knowledgeValueScore = Math.round(
        (claim.knowledgeValueScore + reviewerScore) / 2
      );
    }

    await claim.save();
    res.json({ success: true, data: claim });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE a claim
router.delete('/:id', async (req, res) => {
  try {
    await KnowledgeClaim.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

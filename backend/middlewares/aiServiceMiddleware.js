/**
 * AI Service Middleware
 * Integrates with FastAPI AI service for classification, clustering, prioritization, sentiment
 */

const axios = require('axios');

// AI Service configuration
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001/api/v1';
const AI_SERVICE_TIMEOUT = 30000; // 30 seconds

// Create axios instance for AI service
const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: AI_SERVICE_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Classification Middleware
 * Automatically classifies issues into civic categories
 */
const classifyIssue = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.description) {
      return next(); // Skip if no text to classify
    }

    const text = `${req.body.title}. ${req.body.description}`;

    // Call AI service classification endpoint
    const response = await aiClient.post('/classify', {
      text: text,
      threshold: 0.5,
    });

    // Attach AI classification results to request
    req.aiClassification = {
      category: response.data.category,
      confidence: response.data.confidence,
      allCategories: response.data.scores, // All category scores
    };

    next();
  } catch (error) {
    console.error('Classification middleware error:', error.message);
    // Continue without classification if AI service fails
    req.aiClassification = null;
    next();
  }
};

/**
 * Clustering Middleware
 * Detects duplicate/similar issues
 */
const detectDuplicates = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.description) {
      return next();
    }

    const text = `${req.body.title}. ${req.body.description}`;

    // Get embedding for current issue
    const embeddingResponse = await aiClient.post('/embeddings', {
      text: text,
    });

    req.aiEmbedding = {
      vector: embeddingResponse.data.embedding,
    };

    next();
  } catch (error) {
    console.error('Clustering middleware error:', error.message);
    req.aiEmbedding = null;
    next();
  }
};

/**
 * Prioritization Middleware
 * Calculates priority score based on multiple factors
 */
const calculatePriority = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.description) {
      return next();
    }

    // Prepare data for prioritization
    const priorityData = {
      title: req.body.title,
      description: req.body.description,
      category: req.aiClassification?.category || 'other',
      location: req.body.location || 'unknown',
      upvotes: req.body.upvotes || 0,
      commentCount: req.body.comments?.length || 0,
    };

    // Call AI service prioritization endpoint
    const response = await aiClient.post('/prioritize', priorityData);

    req.aiPriority = {
      priorityScore: response.data.priority_score,
      priorityLevel: response.data.priority_level, // High, Medium, Low
      factors: response.data.factors,
      reasoning: response.data.reasoning,
      slaDeadlineHours: response.data.sla_hours || 24,
    };

    next();
  } catch (error) {
    console.error('Prioritization middleware error:', error.message);
    req.aiPriority = null;
    next();
  }
};

/**
 * Sentiment Analysis Middleware
 * Analyzes sentiment of feedback/comments
 */
const analyzeSentiment = async (req, res, next) => {
  try {
    if (!req.body.feedbackText && !req.body.comment) {
      return next();
    }

    const text = req.body.feedbackText || req.body.comment;

    // Call AI service sentiment endpoint
    const response = await aiClient.post('/sentiment', {
      text: text,
    });

    req.aiSentiment = {
      sentiment: response.data.sentiment, // Positive, Negative, Neutral
      score: response.data.score, // 0-1
      confidence: response.data.confidence,
      keywords: response.data.keywords || [],
    };

    next();
  } catch (error) {
    console.error('Sentiment middleware error:', error.message);
    req.aiSentiment = null;
    next();
  }
};

/**
 * Batch Clustering
 * Finds similar issues in database
 */
const findSimilarIssues = async (issueData, similarityThreshold = 0.85) => {
  try {
    const response = await aiClient.post('/cluster', {
      issues: [issueData],
      threshold: similarityThreshold,
    });

    return response.data;
  } catch (error) {
    console.error('Clustering error:', error.message);
    return null;
  }
};

/**
 * Health check for AI service
 */
const checkAIServiceHealth = async () => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`);
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('AI service health check failed:', error.message);
    return false;
  }
};

module.exports = {
  classifyIssue,
  detectDuplicates,
  calculatePriority,
  analyzeSentiment,
  findSimilarIssues,
  checkAIServiceHealth,
  AI_SERVICE_URL,
};

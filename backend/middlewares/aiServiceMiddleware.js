/**
 * AI Service Middleware
 * Integrates with Google Gemini API for classification, clustering, prioritization, sentiment
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const GEMINI_EMBEDDING_URL = "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent";

const callGemini = async (prompt) => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    const data = await response.json();
    if (data.error) {
      console.error("Gemini API Error:", data.error);
      return null;
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("Gemini Call Failed:", error);
    return null;
  }
};

/**
 * Classification Middleware
 * Automatically classifies issues into civic categories
 */
const classifyIssue = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.description) {
      return next();
    }

    const text = `${req.body.title}. ${req.body.description}`;
    const prompt = `Classify the following civic issue into one of these categories: Roads, Water, Electricity, Waste, Public Amenities, Environment, Others. 
    Return ONLY the category name.
    Issue: ${text}`;

    const category = await callGemini(prompt);

    req.aiClassification = {
      category: category ? category.trim() : "Others",
      confidence: 0.9, // Mock confidence
      allCategories: [],
    };

    next();
  } catch (error) {
    console.error('Classification middleware error:', error.message);
    req.aiClassification = null;
    next();
  }
};

/**
 * Clustering Middleware
 * Detects duplicate/similar issues using Embeddings
 */
const detectDuplicates = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.description) {
      return next();
    }

    const text = `${req.body.title}. ${req.body.description}`;

    // Call Gemini Embedding API
    const response = await fetch(`${GEMINI_EMBEDDING_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/embedding-001",
        content: { parts: [{ text: text }] },
      }),
    });
    
    const data = await response.json();

    if (data.embedding) {
      req.aiEmbedding = {
        vector: data.embedding.values,
      };
    } else {
        req.aiEmbedding = null;
    }

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

    const text = `${req.body.title}. ${req.body.description}`;
    const prompt = `Analyze the following civic issue and determine its priority (High, Medium, Low) and a score (0-100).
    Return JSON format: { "priority_level": "High", "priority_score": 85, "reasoning": "..." }
    Issue: ${text}`;

    const resultText = await callGemini(prompt);
    
    let result = { priority_level: "Medium", priority_score: 50, reasoning: "Default" };
    try {
        // Try to parse JSON from the response (Gemini might wrap in markdown)
        const jsonMatch = resultText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            result = JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error("Failed to parse Gemini priority response");
    }

    req.aiPriority = {
      priorityScore: result.priority_score,
      priorityLevel: result.priority_level,
      factors: {},
      reasoning: result.reasoning,
      slaDeadlineHours: result.priority_level === 'High' ? 24 : 48,
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
    const prompt = `Analyze the sentiment of this text (Positive, Negative, Neutral). Return ONLY the sentiment. Text: ${text}`;

    const sentiment = await callGemini(prompt);

    req.aiSentiment = {
      sentiment: sentiment ? sentiment.trim() : "Neutral",
      score: 0.5,
      confidence: 0.8,
      keywords: [],
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
    // Placeholder: In a real app, you'd query a vector DB (like Pinecone or MongoDB Atlas Vector Search)
    // using the embedding from issueData.
    return [];
};

/**
 * Health check for AI service
 */
const checkAIServiceHealth = async () => {
  return true; // Always true as we use external API
};

module.exports = {
  classifyIssue,
  detectDuplicates,
  calculatePriority,
  analyzeSentiment,
  findSimilarIssues,
  checkAIServiceHealth,
};

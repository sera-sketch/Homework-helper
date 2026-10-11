import './env.js';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to determine if an error is temporary / retryable
function isRetryableError(err) {
  if (!err) return false;

  const status = Number(err.status || err.statusCode || err.code || err.response?.status);

  // Non-retryable 4xx client errors (auth, bad request, forbidden, not found, etc.)
  if (status >= 400 && status < 500 && status !== 429 && status !== 408) {
    return false;
  }

  // Explicit retryable HTTP status codes
  if (status === 429 || status === 408 || status === 503 || status === 502 || status === 504 || status === 500) {
    return true;
  }

  // String error codes
  const codeStr = String(err.code || '').toUpperCase();
  if (['UNAVAILABLE', 'RESOURCE_EXHAUSTED', 'DEADLINE_EXCEEDED', 'INTERNAL', 'ECONNRESET', 'ETIMEDOUT'].includes(codeStr)) {
    return true;
  }

  // Fallback to error message inspection
  const msg = String(err.message || '').toLowerCase();
  if (
    msg.includes('api key') ||
    msg.includes('unauthorized') ||
    msg.includes('forbidden') ||
    msg.includes('invalid argument') ||
    msg.includes('not found')
  ) {
    return false;
  }

  return (
    msg.includes('503') ||
    msg.includes('unavailable') ||
    msg.includes('high demand') ||
    msg.includes('overloaded') ||
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('rate limit') ||
    msg.includes('quota') ||
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('econnreset')
  );
}

// Generate content with exponential backoff and jitter for retryable errors
async function generateContentWithRetry(ai, params, maxRetries = 3) {
  let attempt = 0;
  let delayMs = 1000;

  while (true) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      attempt++;
      if (attempt <= maxRetries && isRetryableError(err)) {
        const jitter = Math.floor(Math.random() * 500);
        const waitTime = delayMs + jitter;
        console.warn(`[Gemini API] Retryable error encountered (attempt ${attempt}/${maxRetries}): ${err.message || err}. Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        delayMs *= 2;
      } else {
        throw err;
      }
    }
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY });
});

// Analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { base64Data, mimeType, optionalPromptExtension } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    if (!base64Data || !mimeType) {
      return res.status(400).json({ error: 'Image data and mimeType are required.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemPrompt = `You are an expert tutor for all subjects. I am providing an image of a homework problem or a concept. 
    ${optionalPromptExtension || ""}
    If the image is completely blurry, unreadable, or doesn't contain any identifiable academic question/concept, output EXACTLY this format:
    #### Error
    BLURRY_OR_NO_QUESTION
    #### Message
    (Explain nicely that you couldn't read the image or find a question, and ask the user to retake the photo)

    If the image contains multiple distinct questions, output EXACTLY this format:
    #### Error
    MULTIPLE_QUESTIONS
    #### Questions
    - (List Question 1 text here)
    - (List Question 2 text here)
    - (Continue for up to 5 questions)

    Otherwise, solve the problem and output your response structured EXACTLY like this (use Markdown):
    #### Subject
    (Identify the subject, e.g., Calculus, Chemistry, History)
    #### Answer
    (The direct answer to the problem or a clear summary)
    #### Step-by-Step Reasoning
    (Explain clearly how you got the answer)
    #### Insight
    (Provide a helpful tip or related concept)`;

    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    const response = await generateContentWithRetry(ai, {
      model,
      contents: [{
        role: "user",
        parts: [
          { text: systemPrompt },
          { inlineData: { mimeType: mimeType, data: base64Data } }
        ]
      }]
    }, 3);

    res.json({ text: response.text });
  } catch (error) {
    console.error('API Error:', error.message || error);

    const status = Number(error.status || error.statusCode || error.response?.status) || 500;
    let safeMessage = 'An error occurred while analyzing the image. Please try again.';

    if (status === 503 || (error.message && (error.message.includes('503') || error.message.includes('high demand') || error.message.includes('unavailable')))) {
      safeMessage = 'The AI service is currently experiencing high demand. Please try again in a moment.';
    } else if (status === 429 || (error.message && (error.message.includes('429') || error.message.includes('rate limit') || error.message.includes('quota')))) {
      safeMessage = 'Rate limit reached. Please wait a moment before trying again.';
    } else if (status === 400) {
      safeMessage = 'Invalid request or unsupported image format.';
    } else if (status === 401 || status === 403) {
      safeMessage = 'Authentication error connecting to AI service.';
    }

    const httpCode = status >= 400 && status < 600 ? status : 500;
    res.status(httpCode).json({ error: safeMessage });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not set in .env file!');
  }
});

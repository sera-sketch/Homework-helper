import './env.js';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{
        role: "user",
        parts: [
          { text: systemPrompt },
          { inlineData: { mimeType: mimeType, data: base64Data } }
        ]
      }]
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not set in .env file!');
  }
});

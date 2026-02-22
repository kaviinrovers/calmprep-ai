import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Helper to get Gemini model and handle API key check
 */
const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please add it to your Render Environment Variables.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

/**
 * Analyze PDF content unit-wise with AI
 */
export const analyzePDFContent = async (pdfText) => {
  if (!pdfText || pdfText.trim().length < 50) {
    throw new Error('PDF content is too short or could not be extracted. Please ensure the PDF is not a scan.');
  }

  try {
    const model = getModel();
    const prompt = `You are an expert exam preparation AI tutor. Analyze this educational content and provide a detailed unit-wise breakdown.

CONTENT TO ANALYZE:
${pdfText}

INSTRUCTIONS:
1. Split the content into logical units/chapters/topics
2. For each unit, identify high, medium, and low importance topics.
3. Predict exam questions (2, 5, and 10 marks) for each unit with guidance.
4. Provide marks-wise study guidance.

IMPORTANT: Respond strictly in valid JSON format.

JSON STRUCTURE:
{
  "units": [
    {
      "unitNumber": 1,
      "unitName": "Unit name",
      "importantTopics": [{"text": "Topic", "importance": "high", "reason": "Reason"}],
      "predictedQuestions": [{"question": "...", "marks": 2, "guidance": {"howToStart": "...", "keyPoints": [], "expectedLength": "...", "keywords": []}}],
      "studyGuidance": {"twoMark": {"expectedLines": "...", "keywords": []}, "fiveMark": {"expectedPoints": "...", "diagramNeeded": true, "explanation": "..."}, "tenMark": {"structure": "...", "minimumLength": "...", "mustInclude": []}}
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Improved JSON extraction - handle markdown blocks
    let jsonString = responseText;
    if (responseText.includes('```')) {
      const match = responseText.match(/```(?:json)?([\s\S]*?)```/);
      if (match) jsonString = match[1];
    }

    try {
      return JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('JSON Parse Error Raw response:', responseText);
      throw new Error('The AI returned an invalid response. Please try uploading the PDF again.');
    }
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw error;
  }
};

/**
 * Generate exam-ready answer for a question
 */
export const generateAnswer = async (question, marks, pdfContext, language = 'english') => {
  try {
    const model = getModel();
    const languageInstruction = {
      english: 'Respond in English',
      tamil: 'Respond in Tamil',
      mixed: 'Respond in a mix of Tamil and English (Tanglish), using Tamil for explanations and English for technical terms',
    };

    const marksGuidance = {
      2: 'Provide a brief 2-3 line answer with key keywords',
      5: 'Provide a 5-7 point answer with brief explanations for each point',
      10: 'Provide a detailed answer with Introduction, Body, and Conclusion',
    };

    const prompt = `You are a calm, friendly exam preparation tutor. Generate an exam-ready answer for this question based ONLY on the provided study material.

QUESTION: ${question}
MARKS: ${marks}
LANGUAGE: ${language}

STUDY MATERIAL CONTEXT:
${pdfContext}

REQUIREMENTS:
- ${marksGuidance[marks]}
- ${languageInstruction[language]}
- Base your answer STRICTLY on the provided study material.
- Make it exam-ready and structured.

Generate the answer now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text().trim();

    return {
      question,
      marks,
      answer,
      language,
      source: 'Based on your uploaded study material',
    };
  } catch (error) {
    console.error('Gemini Answer Generation Error:', error);
    throw error;
  }
};

/**
 * Generate voice assistant response
 */
export const generateVoiceResponse = async (userMessage, context, language = 'english') => {
  try {
    const model = getModel();
    const languageInstruction = {
      english: 'Respond in English',
      tamil: 'Respond in Tamil',
      mixed: 'Respond in a mix of Tamil and English',
    };

    const prompt = `You are a calm, patient, and friendly AI tutor helping a college student prepare for exams.

STUDENT SAYS: "${userMessage}"
CONTEXT: ${context}

INSTRUCTIONS:
- ${languageInstruction[language]}
- Be encouraging and supportive.
- Explain patiently.
- Keep responses conversational.

Respond naturally:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const voiceResponse = response.text().trim();
    return voiceResponse;
  } catch (error) {
    console.error('Gemini Voice Response Error:', error);
    throw error;
  }
};

/**
 * Conduct viva/oral test
 */
export const conductViva = async (topic, difficulty = 'medium', language = 'english') => {
  try {
    const model = getModel();
    const prompt = `You are conducting an oral viva/exam for a college student.

TOPIC: ${topic}
DIFFICULTY: ${difficulty}
LANGUAGE: ${language}

Generate ONE viva question that tests understanding of the topic and can be answered verbally.
Just return the question text (no explanation):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const question = response.text().trim();
    return question;
  } catch (error) {
    console.error('Gemini Viva Generation Error:', error);
    throw error;
  }
};

export default {
  analyzePDFContent,
  generateAnswer,
  generateVoiceResponse,
  conductViva,
};

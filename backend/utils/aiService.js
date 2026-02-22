import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// You can change this to other models like "meta-llama/Llama-3-8B-Instruct" 
// or "mistralai/Mistral-7B-Instruct-v0.2"
const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2";

/**
 * Helper to call Hugging Face and extract JSON
 */
const callHF = async (prompt) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY is missing. Please add it to your Render Environment Variables.');
  }

  try {
    const response = await hf.textGeneration({
      model: MODEL_NAME,
      inputs: `<s>[INST] ${prompt} [/INST]`,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.1,
        return_full_text: false,
      },
    });

    return response.generated_text;
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    if (error.message.includes('429')) {
      throw new Error('Hugging Face free tier limit reached. Please wait a few minutes or use your own API key.');
    }
    throw error;
  }
};

/**
 * Analyze PDF content unit-wise with AI
 */
export const analyzePDFContent = async (pdfText) => {
  if (!pdfText || pdfText.trim().length < 50) {
    throw new Error('PDF content is too short or could not be extracted. Please ensure the PDF is not a scan.');
  }

  try {
    const prompt = `You are an expert exam preparation AI tutor. Analyze this educational content and provide a detailed unit-wise breakdown.

CONTENT TO ANALYZE:
${pdfText.substring(0, 8000)} // Limit context for free tier

INSTRUCTIONS:
1. Split the content into logical units/chapters/topics
2. For each unit, identify high, medium, and low importance topics.
3. Predict exam questions (2, 5, and 10 marks) for each unit.
4. Provide marks-wise study guidance.

IMPORTANT: Respond ONLY with a valid JSON object. No other text.

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

    const responseText = await callHF(prompt);

    // Extract JSON from response
    let jsonString = responseText;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    try {
      return JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error('JSON Parse Error Raw response:', responseText);
      throw new Error('Hugging Face returned an invalid response. Please try again or with a shorter PDF.');
    }
  } catch (error) {
    console.error('Analysis Error:', error);
    throw error;
  }
};

/**
 * Generate exam-ready answer for a question
 */
export const generateAnswer = async (question, marks, pdfContext, language = 'english') => {
  try {
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

    const prompt = `You are a calm, friendly exam preparation tutor. Generate an exam-ready answer for this question based on the provided study material.

QUESTION: ${question}
MARKS: ${marks}
LANGUAGE: ${language}

STUDY MATERIAL:
${pdfContext.substring(0, 4000)}

REQUIREMENTS:
- ${marksGuidance[marks]}
- ${languageInstruction[language]}
- Make it exam-ready and structured.

Answer:`;

    const answer = await callHF(prompt);

    return {
      question,
      marks,
      answer: answer.trim(),
      language,
      source: 'Based on your uploaded study material',
    };
  } catch (error) {
    console.error('Answer Generation Error:', error);
    throw error;
  }
};

/**
 * Generate voice assistant response
 */
export const generateVoiceResponse = async (userMessage, context, language = 'english') => {
  try {
    const languageInstruction = {
      english: 'Respond in English',
      tamil: 'Respond in Tamil',
      mixed: 'Respond in a mix of Tamil and English',
    };

    const prompt = `You are a calm AI tutor helping a college student.
STUDENT: "${userMessage}"
CONTEXT: ${context.substring(0, 2000)}

- ${languageInstruction[language]}
- Be encouraging and supportive.
- Keep responses conversational.

Tutor response:`;

    const voiceResponse = await callHF(prompt);
    return voiceResponse.trim();
  } catch (error) {
    console.error('Voice Response Error:', error);
    throw error;
  }
};

/**
 * Conduct viva/oral test
 */
export const conductViva = async (topic, difficulty = 'medium', language = 'english') => {
  try {
    const prompt = `You are conducting a viva.
TOPIC: ${topic}
DIFFICULTY: ${difficulty}
LANGUAGE: ${language}

Generate ONE viva question. Just the question text:`;

    const question = await callHF(prompt);
    return question.trim().split('\n')[0]; // Take first line
  } catch (error) {
    console.error('Viva Generation Error:', error);
    throw error;
  }
};

export default {
  analyzePDFContent,
  generateAnswer,
  generateVoiceResponse,
  conductViva,
};

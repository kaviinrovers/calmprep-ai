import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze PDF content unit-wise with AI
 */
export const analyzePDFContent = async (pdfText) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are an expert exam preparation AI tutor. Analyze this educational content and provide a detailed unit-wise breakdown.

CONTENT TO ANALYZE:
${pdfText}

INSTRUCTIONS:
1. Split the content into logical units/chapters/topics
2. For each unit, identify:
   - Very important topics (⭐ high importance) - must-study for exams
   - Medium importance topics (⚠️ medium) - good to know
   - Low priority topics (⛔ low) - can skip if time is limited

3. Predict exam questions for each unit:
   - 5-7 questions for 2 marks (short answer)
   - 3-5 questions for 5 marks (medium answer)
   - 2-3 questions for 10 marks (long answer)

4. For EACH predicted question, provide guidance:
   - How to start the answer
   - Key points that MUST be included
   - Expected length/structure
   - Keywords examiners look for

5. Provide marks-wise study guidance for each unit:
   - 2 MARK: How many lines? What keywords are compulsory?
   - 5 MARK: How many points? Diagram needed? How much explanation?
   - 10 MARK: Structure (Introduction → Body → Conclusion), minimum length, what lines MUST be written

RESPOND IN JSON FORMAT:
{
  "units": [
    {
      "unitNumber": 1,
      "unitName": "Unit name here",
      "importantTopics": [
        {
          "text": "Topic name",
          "importance": "high" | "medium" | "low",
          "reason": "Why this is important for exams"
        }
      ],
      "predictedQuestions": [
        {
          "question": "Question text",
          "marks": 2 | 5 | 10,
          "guidance": {
            "howToStart": "Start with...",
            "keyPoints": ["Point 1", "Point 2"],
            "expectedLength": "2-3 lines" or "5-7 points" etc,
            "keywords": ["keyword1", "keyword2"]
          }
        }
      ],
      "studyGuidance": {
        "twoMark": {
          "expectedLines": "2-3 lines",
          "keywords": ["key1", "key2"]
        },
        "fiveMark": {
          "expectedPoints": "5-7 points",
          "diagramNeeded": true/false,
          "explanation": "Brief but detailed"
        },
        "tenMark": {
          "structure": "Introduction (1-2 lines) → Body (detailed explanation) → Conclusion (summary)",
          "minimumLength": "1-2 pages",
          "mustInclude": ["point1", "point2"]
        }
      }
    }
  ]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse AI response');
        }

        const analysis = JSON.parse(jsonMatch[0]);
        return analysis;
    } catch (error) {
        console.error('AI Analysis Error:', error);
        throw new Error('Failed to analyze PDF content with AI');
    }
};

/**
 * Generate exam-ready answer for a question
 */
export const generateAnswer = async (question, marks, pdfContext, language = 'english') => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const languageInstruction = {
            english: 'Respond in English',
            tamil: 'Respond in Tamil',
            mixed: 'Respond in a mix of Tamil and English (Tanglish), using Tamil for explanations and English for technical terms',
        };

        const marksGuidance = {
            2: 'Provide a brief 2-3 line answer with key keywords',
            5: 'Provide a 5-7 point answer with brief explanations for each point',
            10: 'Provide a detailed answer with Introduction (1-2 lines), Body (detailed explanation with examples), and Conclusion (summary)',
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
- Base your answer STRICTLY on the provided study material
- Make it exam-ready and structured
- Include keywords that examiners look for
- Be student-friendly and clear

IMPORTANT: Even if the answer is short, it MUST be correct and based on the uploaded material.

Generate the answer now:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        return {
            question,
            marks,
            answer,
            language,
            source: 'Based on your uploaded study material',
        };
    } catch (error) {
        console.error('Answer Generation Error:', error);
        throw new Error('Failed to generate answer');
    }
};

/**
 * Generate voice assistant response
 */
export const generateVoiceResponse = async (userMessage, context, language = 'english') => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
- Be encouraging and supportive
- Explain patiently like a good teacher
- Never be harsh or punitive
- Keep responses conversational (you're speaking, not writing)
- If student seems confused, simplify your explanation
- Always be exam-oriented in your guidance

Respond naturally:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const voiceResponse = response.text();

        return voiceResponse;
    } catch (error) {
        console.error('Voice Response Error:', error);
        throw new Error('Failed to generate voice response');
    }
};

/**
 * Conduct viva/oral test
 */
export const conductViva = async (topic, difficulty = 'medium', language = 'english') => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are conducting an oral viva/exam for a college student.

TOPIC: ${topic}
DIFFICULTY: ${difficulty}
LANGUAGE: ${language}

Generate ONE viva question that:
- Tests understanding of the topic
- Is appropriate for the difficulty level
- Can be answered verbally in 1-2 minutes

Just return the question (no explanation):`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const question = response.text().trim();

        return question;
    } catch (error) {
        console.error('Viva Generation Error:', error);
        throw new Error('Failed to generate viva question');
    }
};

export default {
    analyzePDFContent,
    generateAnswer,
    generateVoiceResponse,
    conductViva,
};

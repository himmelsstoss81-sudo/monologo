import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AssessmentResult {
  transcript: string;
  score: number;
  cefrLevel: string;
  criteriaFeedback: {
    eficacia: { feedback: string; score: number };
    coherencia: { feedback: string; score: number };
    correccion: { feedback: string; score: number };
    alcance: { feedback: string; score: number };
    fonologia: { feedback: string; score: number };
  };
  globalAssessment: string;
  noCumpleTarea?: boolean;
}

export async function transcribeAndAssess(
  audioBase64: string,
  language: string,
  targetLevel: string,
  topic: string,
  criteria: string,
  descriptors: string
): Promise<AssessmentResult> {
  const model = "gemini-3.1-pro-preview"; // Correct Pro model name

  try {
    const prompt = `
      You are an expert language examiner following the official assessment model of Castilla y León.
      The student is practicing ${language} at level ${targetLevel}.
      The topic is: ${topic}.
      
      TASK:
      1. Transcribe the provided audio exactly in ${language}. Include repetitions and hesitations.
      2. Assess the performance using the following rubrics based on the CEFR level:
      ${criteria}
      
      EVALUATION MODEL (Castilla y León):
      - Use a system of bands: 0, 1, 2, 3.
      - Interpretation:
          3 = Above expected CEFR level.
          2 = At expected level (matches descriptors).
          1 = Below level.
          0 = Far below level.
      - NO intermediate values (e.g., no 2.5). Only integers 0, 1, 2, or 3.
      - If the student "Cannot fulfill the task" (No cumple la tarea), mark the specific flag.
      
      CATEGORIES (Assessment MUST include all 5 of these EXACT keys):
      - eficacia (Eficacia comunicativa)
      - coherencia (Coherencia y cohesión)
      - correccion (Corrección)
      - alcance (Alcance y uso)
      - fonologia (Fonología y Fluidez)
      
      3. Provide all justifications and feedback in Spanish.
      
      SCORING RULES:
      - Score each category from 0, 1, 2, or 3 (Must be a literal integer).
      - NO intermediate values (e.g., no 2.5).
      - Provide a pedagogical justification for each assigned band, aligned with the qualitative descriptors.
      - Determine a global qualitative assessment of the level.
      
      OUTPUT FORMAT (JSON):
      {
        "transcript": "...",
        "score": number (total band sum 0-15),
        "cefrLevel": "The evaluated level according to CEFR",
        "noCumpleTarea": boolean,
        "criteriaFeedback": {
          "eficacia": { "feedback": "...", "score": 0 | 1 | 2 | 3 },
          "coherencia": { "feedback": "...", "score": 0 | 1 | 2 | 3 },
          "correccion": { "feedback": "...", "score": 0 | 1 | 2 | 3 },
          "alcance": { "feedback": "...", "score": 0 | 1 | 2 | 3 },
          "fonologia": { "feedback": "...", "score": 0 | 1 | 2 | 3 }
        },
        "globalAssessment": "Descripción cualitativa global..."
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "audio/webm",
                data: audioBase64,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    const errorMsg = error?.message || "";
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || errorMsg.toLowerCase().includes("quota") || errorMsg.includes("429")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw error;
  }
}

export async function generateTask(language: string, level: string, topic: string): Promise<{ task: string; questions: string[] }> {
  // Use Lite model for simple task generation to save quota
  const model = "gemini-3.1-flash-lite-preview"; 
  
  try {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(level);
    const lowerLevel = currentIndex > 0 ? levels[currentIndex - 1] : 'A1';

    const prompt = `
      Create a speaking task for a ${language} student. 
      The student chose level ${level}, but you must use language and complexity suitable for level ${lowerLevel} (one level lower).
      Topic: ${topic}.
      
      The output should be in ${language}.
      Do not write any introduction or greeting. 
      Just provide the topic description and exactly 6 discussion questions.
      
      OUTPUT FORMAT (JSON):
      {
        "task": "A short description of the speaking task in ${language}",
        "questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5", "Question 6"]
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    const errorMsg = error?.message || "";
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || errorMsg.toLowerCase().includes("quota") || errorMsg.includes("429")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw error;
  }
}

const translationCache: Record<string, string[]> = {};

export async function translateTopics(language: string, topics: string[]): Promise<string[]> {
  const cacheKey = `${language}-${topics.join('|')}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  // Use Lite model for translations to save quota
  const model = "gemini-3.1-flash-lite-preview"; 
  
  try {
    const prompt = `
      Translate the following list of topics into ${language}.
      Keep the meaning as close as possible to the original.
      Return only a JSON array of strings.
      
      Topics: ${JSON.stringify(topics)}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "[]");
    if (Array.isArray(result)) {
      translationCache[cacheKey] = result;
      return result;
    }
    return topics;
  } catch (error: any) {
    const errorMsg = error?.message || "";
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || errorMsg.toLowerCase().includes("quota") || errorMsg.includes("429")) {
      console.warn("Quota exceeded for topic translation, using originals.");
      return topics;
    }
    return topics;
  }
}

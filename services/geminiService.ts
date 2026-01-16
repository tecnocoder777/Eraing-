
import { GoogleGenAI, Type } from "@google/genai";
import { TriviaQuestion } from "../types";

// Safety check for process.env to prevent crashes on static hosting
const getApiKey = () => {
  try {
    return process?.env?.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });
const modelId = "gemini-2.5-flash";

export const generateTriviaQuestion = async (difficulty: string = 'medium', topic: string = 'general knowledge'): Promise<TriviaQuestion> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Generate a multiple-choice trivia question about ${topic} with ${difficulty} difficulty.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Exactly 4 options"
            },
            correctAnswerIndex: { 
              type: Type.INTEGER,
              description: "Zero-based index of the correct answer (0-3)"
            },
            difficulty: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "difficulty"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as TriviaQuestion;
  } catch (error) {
    console.error("Gemini Trivia Error:", error);
    return {
      question: "Which coding library is used for building user interfaces?",
      options: ["Angular", "Vue", "React", "Svelte"],
      correctAnswerIndex: 2,
      difficulty: 'easy'
    };
  }
};

export const generateCreativeTask = async (): Promise<{ prompt: string, criteria: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a short, fun, creative writing prompt for a user to earn coins. Keep it under 20 words.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
            criteria: { type: Type.STRING, description: "What makes a good answer?" }
          }
        }
      }
    });
     const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (e) {
    return {
      prompt: "Write a haiku about a robot.",
      criteria: "Must be 5-7-5 syllables."
    };
  }
};

export const gradeCreativeSubmission = async (prompt: string, submission: string): Promise<{ score: number, feedback: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Prompt: ${prompt}\nUser Submission: ${submission}\n\nGrade this submission on a scale of 1-10 based on creativity and relevance. Be generous but fair.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Score between 1 and 10" },
            feedback: { type: Type.STRING, description: "Short feedback (1 sentence)" }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (e) {
    console.error(e);
    return { score: 5, feedback: "Good effort! (AI Service Offline)" };
  }
};

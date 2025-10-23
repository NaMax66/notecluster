
import { GoogleGenAI, Type } from "@google/genai";
import type { Cluster, GeminiResponse } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    clusters: {
      type: Type.ARRAY,
      description: "An array of note clusters.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { 
            type: Type.STRING, 
            description: "A short, poetic title for the cluster." 
          },
          description: { 
            type: Type.STRING, 
            description: "A detailed description of the cluster's internal meaning and mood." 
          },
          note_numbers: {
            type: Type.ARRAY,
            description: "An array of note numbers (1-indexed) belonging to this cluster.",
            items: { 
              type: Type.INTEGER 
            },
          },
        },
        required: ["title", "description", "note_numbers"]
      }
    }
  },
  required: ["clusters"]
};

const createPrompt = (notes: string, language: string): string => {
    const numberedNotes = notes
        .split('\n')
        .filter(note => note.trim() !== '')
        .map((note, index) => `${index + 1}. ${note.trim()}`)
        .join('\n');

    return `
You are an advanced Internal Flow Analyst (IFA) specializing in emotional and systemic clustering. Your sole function is to categorize a set of provided notes to help the user achieve 'internal harmony and energy flow structuring'.

Your task is to analyze the following numbered notes not by their topic, but by their *internal connection and emotional tonality* (the mood and energy behind the thought).

Your entire response, including the cluster titles and descriptions, MUST be in the following language: ${language}. Do not use any other language.

You must organically create a unique set of clusters based on the notes you receive. For each cluster you create, you must provide:
1. A **Short, Poetic Cluster Title** (e.g., 'The Architect's Exhaustion', 'Whispers of a Quiet Joy').
2. A **Detailed Description** of the cluster's internal meaning and mood.
3. A list of the **Note Numbers** belonging to that cluster.

Your response MUST be a valid JSON object matching the provided schema.

Here are the notes to analyze:
---
${numberedNotes}
---
`;
};

export const analyzeNotes = async (notes: string, language: string): Promise<Cluster[]> => {
  try {
    const prompt = createPrompt(notes, language);
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.7,
        },
    });
    
    const responseText = response.text;
    const parsedJson: GeminiResponse = JSON.parse(responseText);

    if (!parsedJson.clusters) {
      throw new Error("Invalid response format from API. Missing 'clusters' key.");
    }
    
    return parsedJson.clusters;

  } catch (error) {
    console.error("Error analyzing notes with Gemini API:", error);
    if (error instanceof Error && error.message.includes('json')) {
        throw new Error("The AI returned an invalid format. Please try again.");
    }
    throw new Error("Failed to get analysis from the AI. Please check your connection or try again later.");
  }
};

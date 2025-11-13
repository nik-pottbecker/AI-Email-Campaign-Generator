import { GoogleGenAI, Type } from "@google/genai";
import type { Campaign } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CAMPAIGN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    subjectLines: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "A compelling subject line for the email."
      },
      description: "A list of 3-5 potential subject lines for the email campaign."
    },
    body: {
      type: Type.STRING,
      description: "The full body copy of the email, formatted in Markdown. It should be engaging and persuasive."
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A detailed, descriptive prompt suitable for a text-to-image AI model to generate a visually appealing and relevant image for the campaign."
    }
  },
  required: ["subjectLines", "body", "imagePrompt"],
};

export const generateCampaign = async (prompt: string): Promise<Campaign> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a complete email marketing campaign based on the following request. Provide a variety of subject lines, a well-written email body in markdown, and a detailed prompt for generating a hero image. Request: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: CAMPAIGN_SCHEMA,
      },
    });

    const jsonText = response.text.trim();
    const campaignData: Campaign = JSON.parse(jsonText);
    return campaignData;

  } catch (error) {
    console.error("Error generating campaign:", error);
    throw new Error("Failed to generate campaign content. Please try again.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check the prompt and try again.");
  }
};

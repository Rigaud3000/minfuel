/**
 * Google Gemini API Service
 * 
 * This service handles interactions with Google's Gemini AI model using the official Google Generative AI SDK
 */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// The API key should be loaded from environment variables in production
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "";

// Initialize the API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Configure the safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Get a response from the Gemini AI model
 * @param userMessage The message from the user
 * @returns A string response from the AI
 */
export async function getGeminiResponse(userMessage: string): Promise<string> {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create the chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hi, I'm looking for healthy eating advice." }],
        },
        {
          role: "model",
          parts: [{ 
            text: "Hello! I'm MindFuel Coach, your guide to clean eating and healthy habits. I'd be happy to provide advice on nutrition, meal planning, and achieving your wellness goals. What specific aspect of healthy eating would you like to know about?" 
          }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.95,
      },
      safetySettings,
    });

    // Create the prompt with health coaching context
    const prompt = `As MindFuel Coach, please respond to this user query about health and wellness, focusing on clean eating, sugar detox, and healthy habits. Be supportive and give practical advice in 3-5 sentences maximum: ${userMessage}`;

    // Send message and get response
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
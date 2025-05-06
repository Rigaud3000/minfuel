/**
 * HuggingFace API Service
 * 
 * This service handles interactions with HuggingFace's inference API
 */
import { HfInference } from '@huggingface/inference';

// Initialize the HuggingFace client with API token
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Model to use - Use a simple text generation model
const MODEL_ID = "gpt2";

/**
 * Get a response from HuggingFace's inference API
 * @param userMessage The message from the user
 * @returns A string response from the AI
 */
export async function getHuggingFaceResponse(userMessage: string): Promise<string> {
  try {
    // Create a prompt with health coaching context
    const prompt = `You are a health coach named MindFuel Coach who specializes in clean eating, 
    sugar detox, and healthy habits. Please provide a helpful, supportive and practical response 
    to the following user query in 3-5 sentences:
    
    User: ${userMessage}
    
    MindFuel Coach:`;

    // Make the API request
    const response = await hf.textGeneration({
      model: MODEL_ID,
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        return_full_text: false
      }
    });

    // Clean up the response if needed
    let result = response.generated_text || "";
    
    // Type guard to ensure result is a string
    if (typeof result === 'string') {
      // Remove any extra "MindFuel Coach:" prefixes that might be in the response
      result = result.replace(/^MindFuel Coach:\s*/i, "");
      return result.trim();
    }
    
    return "Sorry, I couldn't generate a proper response at this time.";
  } catch (error) {
    console.error("Error calling HuggingFace API:", error);
    throw error;
  }
}
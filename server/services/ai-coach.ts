/**
 * AI Coach Service
 * 
 * This service integrates multiple AI providers (Gemini, HuggingFace) with a fallback
 * mechanism to ensure reliable responses for the AI coaching feature.
 */

import { getGeminiResponse } from './gemini';
import { getHuggingFaceResponse } from './huggingface';

// Enum to track which AI provider to use
enum AIProvider {
  GEMINI = 'gemini',
  HUGGINGFACE = 'huggingface',
  FALLBACK = 'fallback'
}

// This can be adjusted based on API availability and performance
let currentProvider = AIProvider.GEMINI;

/**
 * Get a response from the AI coach using the available AI providers with fallback mechanisms
 * @param userMessage The message from the user
 * @returns A string response from the AI coach
 */
export async function getAICoachResponse(userMessage: string): Promise<string> {
  // Try with current provider first
  try {
    if (currentProvider === AIProvider.GEMINI) {
      const response = await getGeminiResponse(userMessage);
      return response;
    } else if (currentProvider === AIProvider.HUGGINGFACE) {
      const response = await getHuggingFaceResponse(userMessage);
      return response;
    }
  } catch (primaryError) {
    console.error(`Error with primary provider (${currentProvider}):`, primaryError);
    
    // Try the alternate provider
    try {
      if (currentProvider === AIProvider.GEMINI) {
        // Switch to HuggingFace as backup
        console.log("Switching to HuggingFace as backup");
        currentProvider = AIProvider.HUGGINGFACE; // Update for next time
        return await getHuggingFaceResponse(userMessage);
      } else {
        // Switch to Gemini as backup
        console.log("Switching to Gemini as backup");
        currentProvider = AIProvider.GEMINI; // Update for next time
        return await getGeminiResponse(userMessage);
      }
    } catch (backupError) {
      console.error("Backup provider also failed:", backupError);
      
      // If both providers fail, use the local fallback
      currentProvider = AIProvider.FALLBACK;
      return getFallbackResponse(userMessage);
    }
  }
  
  // If we reach here, something went wrong with the provider selection
  // So use the fallback response
  return getFallbackResponse(userMessage);
}

/**
 * Get a smart fallback response if all AI providers fail
 * This provides helpful responses based on keyword matching
 */
function getFallbackResponse(userMessage: string): string {
  // Convert message to lowercase for easier matching
  const message = userMessage.toLowerCase();
  
  // Check for greetings
  if (containsAny(message, ['hello', 'hi', 'hey', 'greetings', 'howdy', 'hola'])) {
    return "Hello! I'm your MindFuel AI Coach. I'm here to help you with your clean eating journey. How can I assist you today?";
  }
  
  // Check for sugar alternatives/cravings
  if (containsAny(message, ['sugar', 'craving', 'crave', 'sweet', 'alternative', 'substitute'])) {
    return "Great question about sugar alternatives! Consider using natural sweeteners like monk fruit, stevia, or erythritol that don't spike blood sugar. Whole fruits, especially berries, provide natural sweetness with fiber and nutrients. Spices like cinnamon and vanilla extract can enhance sweetness without adding sugar.";
  }
  
  // Check for meal planning
  if (containsAny(message, ['meal', 'plan', 'food', 'eat', 'recipe', 'breakfast', 'lunch', 'dinner', 'cook'])) {
    return "Clean eating starts with planning. Try preparing meals in advance featuring a variety of colorful vegetables, quality proteins, and healthy fats. Keep meals simple with a protein + vegetables + healthy carb formula. Stock your kitchen with whole foods and remove processed items to make healthy choices easier.";
  }
  
  // Check for progress tracking
  if (containsAny(message, ['progress', 'track', 'goal', 'achiev', 'improve', 'measure', 'success'])) {
    return "Progress isn't always linear! Focus on non-scale victories like energy levels, sleep quality, and mood improvements rather than just weight. Take progress photos and measurements monthly instead of daily weighing. Journaling your food, energy, and mood can reveal important patterns and celebrate small wins.";
  }
  
  // Check for motivation
  if (containsAny(message, ['motivat', 'encourage', 'struggle', 'hard', 'difficult', 'challenge', 'stuck'])) {
    return "Remember why you started this journey - connecting to your deeper 'why' can provide lasting motivation. Create a visual reminder of your goals to see daily. Find an accountability partner or community for support. Celebrate small wins along the way and practice self-compassion when facing setbacks.";
  }
  
  // Check for specific nutrients
  if (containsAny(message, ['protein', 'fat', 'carb', 'nutrient', 'vitamin', 'mineral'])) {
    return "Balanced nutrition is essential for health. Focus on quality proteins like beans, lentils, eggs, and lean meats. Include healthy fats from avocados, nuts, seeds and olive oil. Choose complex carbs like sweet potatoes, quinoa, and oats. Aim for a colorful plate to ensure a wide range of vitamins and minerals.";
  }

  // Check for hydration
  if (containsAny(message, ['water', 'drink', 'hydrat', 'thirst', 'fluid'])) {
    return "Staying well-hydrated is crucial for energy, detoxification and reducing cravings. Aim for at least 8 glasses of water daily. Try infusing water with fruits, herbs or cucumber for flavor without sugar. Herbal teas count toward hydration goals. Consider setting reminders or using a marked water bottle to track intake.";
  }
  
  // Default fallback response
  return "I understand you're on a clean eating journey, and I'm here to support you. For specific advice, try asking about meal planning, sugar alternatives, cravings management, healthy recipes, or motivation strategies. I'm happy to share practical tips tailored to your needs!";
}

// Helper function to check if a message contains any of the given keywords
function containsAny(message: string, keywords: string[]): boolean {
  return keywords.some(keyword => message.includes(keyword));
}

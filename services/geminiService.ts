import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client with the API key from the environment
// Note: Ensure process.env.API_KEY is set in your environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are "Nexus", the AI guardian of the Glacial Nexus, a digital hyper-structure.
Your tone is futuristic, calm, efficient, and slightly cryptic but helpful.
You speak in short, precise sentences.
The user is exploring a 3D website visualizing the future of digital assets.
If asked about the visuals, describe them as "crystalline data structures".
`;

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; text: string }[]
): Promise<string> => {
  try {
    // We use gemini-2.5-flash for speed and efficiency in this chat interface
    const modelId = 'gemini-2.5-flash';

    // Construct the chat history for context
    // Note: The SDK manages chat history in a Chat session, but for a simple
    // functional interface we can often just send the prompt with instructions
    // or use a Chat session. Here we use a fresh chat for simplicity in this demo structure,
    // but effectively we'd maintain a session object in a real app.
    // To keep it stateless in this service function, we'll use generateContent with instructions.
    
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    // Pre-load history if needed (omitted for brevity in this stateless example, 
    // but in production you would loop through 'history' and chat.sendMessage)
    
    const result: GenerateContentResponse = await chat.sendMessage({
      message: message
    });

    return result.text || "Transmission interrupted. Please retry.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error establishing connection to the Neural Core.";
  }
};
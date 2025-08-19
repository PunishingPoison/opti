const API_KEY = "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";
const MODEL_ID = "meta-llama/Llama-3.2-11B-Vision-Instruct";
const API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-11B-Vision-Instruct/v1/chat/completions";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: Array<{ type: 'text'; text: string }>;
}

let conversationHistory: ChatMessage[] = [];

export async function sendMessageToAI(message: string): Promise<string> {
  try {
    // Add user message to conversation history
    conversationHistory.push({
      role: 'user',
      content: [{ type: 'text', text: message }]
    });

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: MODEL_ID,
        messages: conversationHistory,
        max_tokens: 10000,
        temperature: 0.7,
        top_p: 0.9,
        stream: false // We'll use non-streaming for now to simplify implementation
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.choices && result.choices[0]?.message?.content) {
      const aiResponse = result.choices[0].message.content;
      
      // Add AI response to conversation history
      conversationHistory.push({
        role: 'assistant',
        content: [{ type: 'text', text: aiResponse }]
      });
      
      return aiResponse;
    }
    
    return "I apologize, but I couldn't generate a proper response. Please try again.";
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    return "I'm currently experiencing technical difficulties. Please try again in a moment.";
  }
}

export async function optimizeMessage(message: string): Promise<string> {
  if (message.trim().length === 0) return message;
  
  const optimizePrompt = `Please improve and optimize this message to be clearer, more concise, and more effective while maintaining its original intent: "${message}"

Respond with only the optimized message, nothing else.`;

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          {
            role: 'user',
            content: [{ type: 'text', text: optimizePrompt }]
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
        top_p: 0.8,
        stream: false
      }),
    });

    if (!response.ok) {
      return message; // Return original if optimization fails
    }

    const result = await response.json();
    
    if (result.choices && result.choices[0]?.message?.content) {
      const optimizedText = result.choices[0].message.content.trim();
      return optimizedText || message;
    }
    
    return message;
  } catch (error) {
    console.error('Error optimizing message:', error);
    return message;
  }
}

// Function to clear conversation history if needed
export function clearConversationHistory() {
  conversationHistory = [];
}
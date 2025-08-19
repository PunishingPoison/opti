import React, { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';
import { Message, ChatState } from './types/chat';
import { sendMessageToAI, clearConversationHistory } from './utils/huggingface';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    hasStarted: false,
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleFirstMessage = useCallback(async (message: string) => {
    // Start transition animation
    setIsTransitioning(true);
    
    // Wait for transition to complete before switching screens
    setTimeout(() => {
      setChatState(prev => ({
        ...prev,
        hasStarted: true,
      }));
    }, 500);

    // Clear any previous conversation history when starting fresh
    clearConversationHistory();
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [userMessage],
      isLoading: true,
    }));

    try {
      const aiResponse = await sendMessageToAI(message);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const aiResponse = await sendMessageToAI(message);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));
    }
  }, []);

  const handleNewChat = () => {
    clearConversationHistory();
    setIsTransitioning(false);
    setChatState({
      messages: [],
      isLoading: false,
      hasStarted: false,
    });
  };
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Welcome Screen */}
      <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        isTransitioning ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      } ${chatState.hasStarted ? 'hidden' : ''}`}>
        <WelcomeScreen onFirstMessage={handleFirstMessage} />
      </div>

      {/* Chat Interface */}
      <div className={`absolute inset-0 transition-all duration-500 ease-in-out ${
        chatState.hasStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
      }`}>
        {chatState.hasStarted && (
          <ChatInterface
            messages={chatState.messages}
            onSendMessage={handleSendMessage}
            isLoading={chatState.isLoading}
            onNewChat={handleNewChat}
          />
        )}
      </div>
    </div>
  );
}

export default App;
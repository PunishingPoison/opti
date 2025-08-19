import React, { useState } from 'react';
import { Sparkles, Plus, Send, Settings } from 'lucide-react';

interface WelcomeScreenProps {
  onFirstMessage: (message: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFirstMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onFirstMessage(input.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Llama Chat</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-white mb-4">
            Hello, <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">User</span>
          </h1>
          <p className="text-gray-400 text-lg">How can I assist you today?</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="relative">
            <div className="flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-2xl hover:bg-gray-800/70 transition-all duration-200">
              <button
                type="button"
                className="flex items-center justify-center w-12 h-12 text-gray-400 hover:text-white transition-colors ml-2"
              >
                <Plus className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-4 outline-none text-lg"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex items-center justify-center w-12 h-12 text-gray-400 hover:text-white disabled:text-gray-600 transition-colors mr-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 w-full max-w-4xl">
          {[
            "Write a creative story",
            "Explain quantum physics",
            "Plan a weekend trip",
            "Code a simple game"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onFirstMessage(suggestion)}
              className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 text-left text-gray-300 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200 hover:scale-105"
            >
              <span className="text-sm">{suggestion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
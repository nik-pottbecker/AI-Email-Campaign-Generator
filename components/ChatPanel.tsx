import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import SendIcon from './icons/SendIcon';
import LoaderIcon from './icons/LoaderIcon';
import SparklesIcon from './icons/SparklesIcon';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  onSendPrompt: (prompt: string) => void;
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chatHistory, onSendPrompt, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSendPrompt(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-2xl p-4 md:p-6 shadow-2xl">
      <div className="flex items-center mb-4 border-b border-gray-700 pb-3">
        <SparklesIcon className="w-8 h-8 text-indigo-400 mr-3" />
        <h2 className="text-xl font-bold text-gray-100">Campaign Assistant</h2>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-6">
          {chatHistory.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-md lg:max-w-lg p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && chatHistory.length > 0 && (
            <div className="flex justify-start">
               <div className="max-w-md lg:max-w-lg p-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none flex items-center space-x-2">
                    <LoaderIcon className="w-5 h-5" />
                    <span className="text-sm">Generating...</span>
               </div>
            </div>
          )}
        </div>
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your product or offer..."
            className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 rounded-full py-3 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? <LoaderIcon className="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;

import React, { useState, useCallback } from 'react';
import ChatPanel from './components/ChatPanel';
import CampaignPreview from './components/CampaignPreview';
import { generateCampaign, generateImage } from './services/geminiService';
import type { Campaign, ChatMessage } from './types';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I can help you create an amazing email campaign. Just tell me about your product, service, or promotion, and I'll generate the content for you."
    }
  ]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendPrompt = useCallback(async (prompt: string) => {
    setIsLoadingChat(true);
    setError(null);
    setGeneratedImage(null); // Reset image when new campaign is generated
    const newHistory = [...chatHistory, { role: 'user', content: prompt } as ChatMessage];
    setChatHistory(newHistory);

    try {
      const campaignData = await generateCampaign(prompt);
      setCampaign(campaignData);
      const modelResponse: ChatMessage = {
          role: 'model',
          content: "I've generated a campaign for you! You can see the details in the preview panel. Let me know if you'd like to make any changes."
      };
      setChatHistory([...newHistory, modelResponse]);

    } catch (err: any) {
      const errorMessage = `Error generating campaign: ${err.message || 'An unknown error occurred'}`;
      setError(errorMessage);
      setChatHistory([...newHistory, { role: 'model', content: `Sorry, I couldn't generate the campaign. ${err.message}` }]);
      console.error(errorMessage);
    } finally {
      setIsLoadingChat(false);
    }
  }, [chatHistory]);

  const handleGenerateImage = useCallback(async (prompt: string) => {
    setIsLoadingImage(true);
    setError(null);
    try {
      const imageUrl = await generateImage(prompt);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      const errorMessage = `Error generating image: ${err.message || 'An unknown error occurred'}`;
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoadingImage(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 lg:p-6">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748; /* gray-800 */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a5568; /* gray-600 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096; /* gray-500 */
        }
      `}</style>
      <header className="text-center mb-6">
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          AI Email Campaign Generator
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Craft perfect email campaigns with the power of Gemini
        </p>
      </header>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-4 max-w-4xl mx-auto" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto" style={{ height: 'calc(100vh - 150px)'}}>
        <div className="h-full">
          <ChatPanel 
            chatHistory={chatHistory} 
            onSendPrompt={handleSendPrompt} 
            isLoading={isLoadingChat} 
          />
        </div>
        <div className="h-full">
          <CampaignPreview 
            campaign={campaign}
            generatedImage={generatedImage}
            onGenerateImage={handleGenerateImage}
            isLoadingImage={isLoadingImage}
            isLoadingCampaign={isLoadingChat}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

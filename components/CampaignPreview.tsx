import React from 'react';
import type { Campaign } from '../types';
import LoaderIcon from './icons/LoaderIcon';
import ImageIcon from './icons/ImageIcon';

interface CampaignPreviewProps {
  campaign: Campaign | null;
  generatedImage: string | null;
  onGenerateImage: (prompt: string) => void;
  isLoadingImage: boolean;
  isLoadingCampaign: boolean;
}

const Placeholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 bg-gray-800/50 rounded-lg p-8">
        <ImageIcon className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm text-gray-400 mt-1">Your generated campaign will appear here.</p>
    </div>
);

const CampaignPreview: React.FC<CampaignPreviewProps> = ({ campaign, generatedImage, onGenerateImage, isLoadingImage, isLoadingCampaign }) => {
  if (isLoadingCampaign && !campaign) {
    return (
        <div className="flex items-center justify-center h-full bg-gray-800 rounded-2xl p-6">
             <LoaderIcon className="w-12 h-12 text-indigo-400" />
        </div>
    );
  }
  
  if (!campaign) {
    return (
        <div className="bg-gray-800 rounded-2xl p-6 h-full">
            <Placeholder message="Ready to build a campaign?" />
        </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-4 md:p-6 h-full overflow-y-auto custom-scrollbar shadow-2xl">
      <div className="space-y-6">
        {/* Image Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Campaign Visual</h3>
          <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            {isLoadingImage ? (
              <LoaderIcon className="w-10 h-10 text-indigo-400" />
            ) : generatedImage ? (
              <img src={generatedImage} alt="Generated Campaign Visual" className="w-full h-full object-cover" />
            ) : (
                <div className="text-center text-gray-400 p-4">
                    <p className="font-semibold mb-2">Image Prompt:</p>
                    <p className="text-sm italic mb-4">"{campaign.imagePrompt}"</p>
                    <button
                        onClick={() => onGenerateImage(campaign.imagePrompt)}
                        disabled={isLoadingImage}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors disabled:bg-gray-600"
                    >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Generate Image
                    </button>
                </div>
            )}
          </div>
        </div>

        {/* Subject Lines Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Subject Lines</h3>
          <ul className="space-y-2">
            {campaign.subjectLines.map((subject, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded-md text-sm text-gray-300 shadow-sm">
                - {subject}
              </li>
            ))}
          </ul>
        </div>

        {/* Body Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Email Body</h3>
          <div className="prose prose-invert prose-sm bg-gray-700 p-4 rounded-md shadow-sm max-w-none">
            {campaign.body.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPreview;

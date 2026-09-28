import React from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';

interface ReviewsBannerProps {
  onOpenReviews: () => void;
  language: 'ENG' | 'HIN';
}

export const ReviewsBanner: React.FC<ReviewsBannerProps> = ({ onOpenReviews, language }) => {
  return (
    <div className="px-4 py-2">
      <button
        type="button"
        onClick={onOpenReviews}
        className="w-full bg-white border border-gray-150 rounded-2xl p-3 flex items-center justify-between hover:border-[#a2ded9] shadow-2xs transition group text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 group-hover:text-[#007080] group-hover:bg-[#e4f6f5] transition">
            <MessageSquare className="w-4 h-4 stroke-[2]" />
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#007080] transition">
              {language === 'ENG' ? 'Hear From Our Users' : 'हमारे उपयोगकर्ताओं से सुनें'}
            </h4>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {language === 'ENG'
                ? 'See what participants say about Feedants'
                : 'देखें कि प्रतिभागी फीडैंट्स के बारे में क्या कहते हैं'}
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#007080] group-hover:translate-x-0.5 transition" />
      </button>
    </div>
  );
};

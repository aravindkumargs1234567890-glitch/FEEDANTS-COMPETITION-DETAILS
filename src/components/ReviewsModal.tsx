import React from 'react';
import { X, Star, MessageSquareQuote, CheckCircle } from 'lucide-react';
import { IReview } from '../types/index.ts';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: IReview[];
  language: 'ENG' | 'HIN';
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  reviews,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-150 animate-scale-up">
        {/* Header */}
        <div className="bg-[#007080] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {language === 'ENG' ? 'Participant Reviews' : 'प्रतिभागी समीक्षाएं'}
              </h3>
              <p className="text-[10px] text-cyan-100">
                {language === 'ENG' ? 'Verified classical dancers on Feedants' : 'फीडैंट्स पर सत्यापित नर्तक'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reviews List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3 divide-y divide-gray-100">
          {reviews.map((rev) => (
            <div key={rev.id} className="pt-3 first:pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#007080]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-none">{rev.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{rev.city} • {rev.date}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-2 italic leading-relaxed">
                "{rev.comment}"
              </p>

              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                <CheckCircle className="w-3 h-3" />
                <span>Verified Participant</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-150 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            {language === 'ENG' ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
};

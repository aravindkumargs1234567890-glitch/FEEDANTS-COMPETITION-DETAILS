import React from 'react';
import { Play, ShieldCheck } from 'lucide-react';

interface TrustCardsProps {
  onWatchPrizeVideo: () => void;
  onOpenRefundPolicy: () => void;
  language: 'ENG' | 'HIN';
}

export const TrustCards: React.FC<TrustCardsProps> = ({
  onWatchPrizeVideo,
  onOpenRefundPolicy,
  language,
}) => {
  return (
    <div className="px-4 py-2">
      <div className="grid grid-cols-2 gap-2.5">
        {/* Left Card: Prize Money Video */}
        <div
          onClick={onWatchPrizeVideo}
          className="bg-[#dff3f0] border border-[#a8e2dc] rounded-2xl p-3 flex flex-col justify-between cursor-pointer hover:border-[#007080] transition group shadow-2xs"
        >
          <div className="w-8 h-8 rounded-full bg-[#007080] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#007080] transition leading-snug">
              {language === 'ENG' ? 'How will you receive prize money?' : 'पुरस्कार राशि कैसे प्राप्त होगी?'}
            </h4>
            <p className="text-[10px] text-gray-500 mt-1">
              {language === 'ENG' ? 'Watch video to know more' : 'अधिक जानने के लिए वीडियो देखें'}
            </p>
          </div>
        </div>

        {/* Right Card: Policies & Razorpay Trust */}
        <div className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col justify-between gap-2.5 shadow-2xs">
          {/* Refund Policy */}
          <div
            onClick={onOpenRefundPolicy}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.2]" />
            <span className="text-xs font-semibold text-gray-800">
              {language === 'ENG' ? 'Refund policy' : 'रिफंड नीति'}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.2]" />
              <div className="text-[11px] leading-tight">
                <span className="font-medium text-gray-600">
                  {language === 'ENG' ? 'Secure payments powered by ' : 'सुरक्षित भुगतान '}
                </span>
                <span className="font-black text-blue-900 tracking-tight ml-0.5 italic">
                  Razorpay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

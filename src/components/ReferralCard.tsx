import React, { useState } from 'react';
import { Megaphone, Check, Copy, Share2 } from 'lucide-react';
import { IReferralInfo } from '../types/index.ts';

interface ReferralCardProps {
  referralInfo: IReferralInfo;
  language: 'ENG' | 'HIN';
}

export const ReferralCard: React.FC<ReferralCardProps> = ({ referralInfo, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralInfo.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Feedants Classical Dance Competition!',
          text: 'Participate in Feedants Classical Dance Competition and win from ₹1,500 prize pool!',
          url: referralInfo.url,
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="bg-[#e7f7f3] border border-[#a2ded9] rounded-2xl p-3 shadow-2xs">
        <div className="flex items-start gap-3">
          {/* Megaphone Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#ccf0e8] text-[#007080] flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5 -rotate-12 stroke-[2.2]" />
          </div>

          {/* Details & Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-gray-900 leading-tight">
                {language === 'ENG' ? 'Refer & Earn more discount' : 'रेफर करें और अधिक छूट पाएं'}
              </h4>

              <button
                type="button"
                onClick={handleShare}
                className="shrink-0 bg-[#007080] hover:bg-[#005c69] text-white px-3 py-1 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
              >
                {language === 'ENG' ? 'Refer Now' : 'रेफर करें'}
              </button>
            </div>

            {/* Input & Copy Button */}
            <div className="mt-2 flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden p-0.5 focus-within:border-[#007080]">
              <input
                type="text"
                readOnly
                value={referralInfo.url}
                className="w-full px-2 py-1 text-[11px] text-gray-700 bg-transparent outline-none truncate"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-[#007080] bg-gray-50 hover:bg-[#e4f6f5] rounded transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    <span className="text-emerald-700">{language === 'ENG' ? 'Copied' : 'कॉपी हुआ'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{language === 'ENG' ? 'Copy Link' : 'लिंक कॉपी करें'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Subtext */}
            <p className="text-[10px] font-medium text-gray-500 mt-1.5">
              {language === 'ENG'
                ? `You earn ₹${referralInfo.rewardAmount} for every signup`
                : `प्रत्येक साइनअप पर आप ₹${referralInfo.rewardAmount} कमाते हैं`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

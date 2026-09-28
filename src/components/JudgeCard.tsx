import React from 'react';
import { Play } from 'lucide-react';
import { IJudge } from '../types/index.ts';

interface JudgeCardProps {
  judge: IJudge;
  onOpenIntroVideo: () => void;
  language: 'ENG' | 'HIN';
}

export const JudgeCard: React.FC<JudgeCardProps> = ({ judge, onOpenIntroVideo, language }) => {
  return (
    <div className="px-4 py-3">
      <div className="bg-white border border-gray-150 rounded-2xl p-3 flex items-center justify-between shadow-xs hover:border-[#a2ded9] transition">
        {/* Left: Judge Avatar & Details */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={judge.image}
              alt={judge.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#e4f6f5]"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#007080] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white">
              ★
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              {language === 'ENG' ? 'Judge' : 'निर्णायक'}
            </span>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              {language === 'HIN' ? 'मंजू दुबे' : judge.name}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5 font-medium">
              {language === 'HIN' ? 'पेशेवर कथक नृत्यांगना' : judge.role}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {language === 'HIN' ? '12+ वर्षों का अनुभव' : judge.experience}
            </p>
          </div>
        </div>

        {/* Right: Intro Video Action */}
        <button
          onClick={onOpenIntroVideo}
          type="button"
          className="flex flex-col items-center justify-center gap-1 group cursor-pointer pl-2"
        >
          <div className="w-10 h-10 rounded-full bg-[#e4f6f5] flex items-center justify-center text-[#007080] group-hover:bg-[#007080] group-hover:text-white transition shadow-2xs">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <span className="text-[11px] font-medium text-gray-600 group-hover:text-[#007080] transition whitespace-nowrap">
            {language === 'ENG' ? 'Intro Video' : 'परिचय वीडियो'}
          </span>
        </button>
      </div>
    </div>
  );
};

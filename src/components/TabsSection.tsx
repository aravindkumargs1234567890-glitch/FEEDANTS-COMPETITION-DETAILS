import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Award, BookOpen } from 'lucide-react';
import { IJudgingParameter } from '../types/index.ts';

interface TabsSectionProps {
  aboutText: string;
  judgingParameters: IJudgingParameter[];
  rules: string[];
  eligibility: string[];
  language: 'ENG' | 'HIN';
}

type TabType = 'about' | 'judging' | 'rules';

export const TabsSection: React.FC<TabsSectionProps> = ({
  aboutText,
  judgingParameters,
  rules,
  eligibility,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="px-4 py-3">
      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`pb-2.5 px-1 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'about'
              ? 'text-[#007080]'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {language === 'ENG' ? 'About Competition' : 'प्रतियोगिता के बारे में'}
          {activeTab === 'about' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007080] rounded-t-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('judging')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'judging'
              ? 'text-[#007080]'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {language === 'ENG' ? 'Judging Parameters' : 'मूल्यांकन मानक'}
          {activeTab === 'judging' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007080] rounded-t-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'rules'
              ? 'text-[#007080]'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {language === 'ENG' ? 'Rules & Eligibility' : 'नियम एवं पात्रता'}
          {activeTab === 'rules' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007080] rounded-t-full" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-3">
        {activeTab === 'about' && (
          <div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {isExpanded
                ? aboutText
                : language === 'ENG'
                ? 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.'
                : 'यह एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है जो सभी आयु समूहों के लिए खुली है। कहीं से भी भाग लें और अपनी प्रतिभा का प्रदर्शन करें।'}
            </p>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs font-bold text-[#007080] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>{isExpanded ? (language === 'ENG' ? 'View less' : 'कम देखें') : (language === 'ENG' ? 'View more' : 'अधिक देखें')}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {activeTab === 'judging' && (
          <div className="space-y-2.5 animate-fade-in">
            {judgingParameters.map((param, idx) => (
              <div key={idx} className="bg-gray-50/80 rounded-xl p-2.5 border border-gray-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#007080]" />
                    {param.title}
                  </span>
                  <span className="px-2 py-0.5 bg-[#e4f6f5] text-[#007080] text-[10px] font-bold rounded-md">
                    {param.weightage}% {language === 'ENG' ? 'Weightage' : 'वेटेज'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">{param.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-3 animate-fade-in">
            <div>
              <h4 className="text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#007080]" />
                {language === 'ENG' ? 'Competition Rules' : 'प्रतियोगिता नियम'}
              </h4>
              <ul className="space-y-1.5">
                {rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007080] mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-1">
              <h4 className="text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'ENG' ? 'Eligibility' : 'पात्रता'}
              </h4>
              <ul className="space-y-1.5">
                {eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

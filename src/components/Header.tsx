import React from 'react';
import { ArrowLeft, Wifi, Battery, Signal } from 'lucide-react';

interface HeaderProps {
  language: 'ENG' | 'HIN';
  onLanguageChange: (lang: 'ENG' | 'HIN') => void;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, onBack }) => {
  return (
    <header className="bg-white sticky top-0 z-30 border-b border-gray-100">
      {/* Mobile OS Status Bar */}
      <div className="flex items-center justify-between px-6 pt-2 pb-1 text-xs font-semibold text-gray-800 tracking-tight">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 text-gray-800">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 text-gray-900 font-bold text-base hover:opacity-80 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900 stroke-[2.5]" />
          <span>{language === 'ENG' ? 'Go back' : 'पीछे जाएं'}</span>
        </button>

        {/* Language Toggle Pills */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-md text-xs font-semibold">
          <button
            type="button"
            onClick={() => onLanguageChange('ENG')}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              language === 'ENG'
                ? 'bg-[#007080] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ENG
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('HIN')}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              language === 'HIN'
                ? 'bg-[#007080] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>
    </header>
  );
};

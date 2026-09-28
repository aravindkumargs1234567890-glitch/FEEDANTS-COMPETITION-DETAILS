import React from 'react';
import { Home, Search, Plus, Trophy } from 'lucide-react';
import { IUser } from '../types/index.ts';

interface BottomNavBarProps {
  currentUser: IUser | null;
  language: 'ENG' | 'HIN';
  activeTab?: string;
  onTabClick?: (tab: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentUser,
  language,
  activeTab = 'competitions',
  onTabClick,
}) => {
  return (
    <nav className="bg-white border-t border-gray-150 px-4 py-1.5 flex items-center justify-between text-[10px] text-gray-400 select-none">
      {/* Home */}
      <button
        type="button"
        onClick={() => onTabClick?.('home')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 cursor-pointer transition ${
          activeTab === 'home' ? 'text-[#007080] font-bold' : 'hover:text-gray-700'
        }`}
      >
        <Home className="w-5 h-5 stroke-[1.8]" />
        <span>{language === 'ENG' ? 'Home' : 'होम'}</span>
      </button>

      {/* Explore */}
      <button
        type="button"
        onClick={() => onTabClick?.('explore')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 cursor-pointer transition ${
          activeTab === 'explore' ? 'text-[#007080] font-bold' : 'hover:text-gray-700'
        }`}
      >
        <Search className="w-5 h-5 stroke-[1.8]" />
        <span>{language === 'ENG' ? 'Explore' : 'खोजें'}</span>
      </button>

      {/* Center Floating Plus Button */}
      <div className="relative -top-2 flex flex-col items-center">
        <button
          type="button"
          onClick={() => onTabClick?.('create')}
          className="w-11 h-11 rounded-full bg-[#007080] text-white flex items-center justify-center shadow-md hover:bg-[#005c69] active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-6 h-6 stroke-[2.8]" />
        </button>
      </div>

      {/* Competitions (Active) */}
      <button
        type="button"
        onClick={() => onTabClick?.('competitions')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 cursor-pointer transition ${
          activeTab === 'competitions' ? 'text-[#007080] font-bold' : 'hover:text-gray-700'
        }`}
      >
        <Trophy className="w-5 h-5 text-[#007080] stroke-[2.2]" />
        <span className="text-[#007080] font-bold">
          {language === 'ENG' ? 'Competitions' : 'प्रतियोगिताएं'}
        </span>
      </button>

      {/* Profile */}
      <button
        type="button"
        onClick={() => onTabClick?.('profile')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 cursor-pointer transition ${
          activeTab === 'profile' ? 'text-[#007080] font-bold' : 'hover:text-gray-700'
        }`}
      >
        {currentUser?.profileImage ? (
          <img
            src={currentUser.profileImage}
            alt={currentUser.name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-300"
          />
        ) : (
          <div className="w-5 h-5 rounded-full bg-gray-200" />
        )}
        <span>{language === 'ENG' ? 'Profile' : 'प्रोफ़ाइल'}</span>
      </button>
    </nav>
  );
};

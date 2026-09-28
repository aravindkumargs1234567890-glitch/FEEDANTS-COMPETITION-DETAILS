import React from 'react';
import { Trophy, Check } from 'lucide-react';
import { ILifecycleState, IRegistration } from '../types/index.ts';

interface CompetitionHeaderProps {
  title: string;
  category: string;
  competitionType: string;
  hasCertificate: boolean;
  userRegistration: IRegistration | null;
  lifecycle: ILifecycleState;
  language: 'ENG' | 'HIN';
}

export const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({
  title,
  category,
  competitionType,
  hasCertificate,
  userRegistration,
  lifecycle,
  language,
}) => {
  const isRegistered = !!userRegistration && userRegistration.registrationStatus === 'CONFIRMED';

  return (
    <div className="px-4 pt-3 pb-2">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {language === 'HIN' ? 'फीडैंट्स क्लासिकल डांस' : title}
        </h1>

        {/* Dynamic User Registration Status Badge */}
        {isRegistered ? (
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-[#e4f6f5] text-[#007080] border border-[#a2ded9] rounded-lg text-xs font-bold shadow-2xs animate-fade-in">
            <div className="w-3.5 h-3.5 rounded-full bg-[#007080] flex items-center justify-center text-white">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span>{language === 'ENG' ? 'Registered' : 'पंजीकृत'}</span>
          </div>
        ) : lifecycle.status === 'REGISTRATION_CLOSED' ? (
          <div className="shrink-0 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
            {language === 'ENG' ? 'Closed' : 'बंद है'}
          </div>
        ) : lifecycle.remainingSpots <= 0 ? (
          <div className="shrink-0 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold">
            {language === 'ENG' ? 'Sold Out' : 'हाउसफुल'}
          </div>
        ) : (
          <div className="shrink-0 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
            {language === 'ENG' ? 'Open' : 'खुला है'}
          </div>
        )}
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span className="px-3 py-1 bg-gray-100/90 text-gray-700 rounded-md text-xs font-medium">
          {language === 'HIN' ? 'नृत्य' : category}
        </span>

        <span className="px-3 py-1 bg-gray-100/90 text-gray-700 rounded-md text-xs font-medium">
          {language === 'HIN' ? 'मल्टी-विन' : competitionType}
        </span>

        {hasCertificate && (
          <div className="flex items-center gap-1 text-[#007080] text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-[#007080]" />
            <span>{language === 'ENG' ? 'Winners get certificate' : 'विजेताओं को प्रमाणपत्र मिलेगा'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

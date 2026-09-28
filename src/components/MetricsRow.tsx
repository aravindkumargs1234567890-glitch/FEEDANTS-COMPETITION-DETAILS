import React from 'react';
import { Users } from 'lucide-react';

interface MetricsRowProps {
  prizePool: number;
  entryFee: number;
  participantCount: number;
  maxParticipants: number;
  remainingSpots: number;
  language: 'ENG' | 'HIN';
}

export const MetricsRow: React.FC<MetricsRowProps> = ({
  prizePool,
  entryFee,
  participantCount,
  maxParticipants,
  remainingSpots,
  language,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((participantCount / maxParticipants) * 100)));

  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* Prize Pool */}
        <div className="col-span-4 border-r border-gray-100 pr-2">
          <p className="text-[11px] font-medium text-gray-500">
            {language === 'ENG' ? 'Prize Pool' : 'पुरस्कार राशि'}
          </p>
          <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-baseline gap-1 mt-0.5">
            <span className="text-[#008080] font-bold">₹</span>
            <span>{prizePool.toLocaleString('en-IN')}</span>
          </p>
        </div>

        {/* Entry Fee */}
        <div className="col-span-3 border-r border-gray-100 pr-2">
          <p className="text-[11px] font-medium text-gray-500">
            {language === 'ENG' ? 'Entry Fee' : 'प्रवेश शुल्क'}
          </p>
          <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-baseline gap-1 mt-0.5">
            <span className="font-bold text-gray-800">₹</span>
            <span>{entryFee}</span>
          </p>
        </div>

        {/* Remaining Spots & Progress Bar */}
        <div className="col-span-5 pl-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#007080] mb-1">
            <Users className="w-3.5 h-3.5 text-[#007080]" />
            <span>
              {remainingSpots > 0
                ? `${language === 'ENG' ? 'Only' : 'केवल'} ${remainingSpots} ${language === 'ENG' ? 'spots left' : 'स्थान शेष'}`
                : language === 'ENG'
                ? 'Housefull'
                : 'सभी स्थान भरे हुए'}
            </span>
          </div>

          {/* Capacity Progress Bar */}
          <div className="w-full bg-gray-200/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#008080] h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mt-1">
            <span>
              {participantCount} / {maxParticipants} {language === 'ENG' ? 'Booked' : 'बुक किया गया'}
            </span>
            <span className="text-[9px] text-gray-400">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

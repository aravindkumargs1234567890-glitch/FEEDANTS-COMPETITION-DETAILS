import React from 'react';
import { Play } from 'lucide-react';
import { IPreviousWinner } from '../types/index.ts';

interface PreviousWinnersProps {
  winners: IPreviousWinner[];
  onSelectWinner: (winner: IPreviousWinner) => void;
  language: 'ENG' | 'HIN';
}

export const PreviousWinners: React.FC<PreviousWinnersProps> = ({
  winners,
  onSelectWinner,
  language,
}) => {
  return (
    <div className="py-2">
      <div className="px-4 mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">
          {language === 'ENG' ? 'Previous Winners' : 'पिछले विजेता'}
        </h2>
        <span className="text-[11px] text-gray-400 font-medium">
          {language === 'ENG' ? 'Scroll to explore' : 'देखने के लिए स्क्रॉल करें'}
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar scroll-smooth">
        {winners.map((winner) => (
          <div
            key={winner.id}
            onClick={() => onSelectWinner(winner)}
            className="shrink-0 flex items-center gap-2.5 bg-white border border-gray-200/90 rounded-2xl p-2 pr-3.5 shadow-2xs hover:border-[#007080] transition cursor-pointer group"
          >
            {/* Thumbnail with Play Overlay */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <img
                src={winner.image}
                alt={winner.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white/90 text-[#007080] flex items-center justify-center shadow-xs group-hover:scale-110 transition">
                  <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            {/* Winner Details */}
            <div className="min-w-[85px]">
              <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#007080] transition leading-tight">
                {winner.name}
              </h4>
              <p className="text-[11px] font-semibold text-[#007080] mt-0.5">
                {language === 'HIN' ? `${winner.rankNumber} स्थान विजेता` : winner.rank}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

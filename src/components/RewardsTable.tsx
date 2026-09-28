import React from 'react';
import { Trophy, Award, Star } from 'lucide-react';
import { IReward } from '../types/index.ts';

interface RewardsTableProps {
  rewards: IReward[];
  language: 'ENG' | 'HIN';
}

export const RewardsTable: React.FC<RewardsTableProps> = ({ rewards, language }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-amber-500 fill-amber-100" />;
      case 2:
        return <Award className="w-4 h-4 text-slate-400 fill-slate-100" />;
      case 3:
        return <Award className="w-4 h-4 text-amber-700 fill-amber-100" />;
      default:
        return <Star className="w-4 h-4 text-[#007080]" />;
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-900">
          {language === 'ENG' ? 'Rewards (All Positions)' : 'पुरस्कार (सभी स्थान)'}
        </h3>
        <span className="text-[10px] text-gray-400 font-medium">
          {language === 'ENG' ? 'Direct Bank / UPI Transfer' : 'सीधे बैंक / यूपीआई ट्रांसफर'}
        </span>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl p-2 divide-y divide-gray-100 shadow-2xs">
        {rewards.map((reward) => (
          <div key={reward.rank} className="py-2 px-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md flex items-center justify-center">
                {getRankIcon(reward.rank)}
              </div>
              <span className="text-xs font-semibold text-gray-800">
                {language === 'HIN' ? `${reward.rank} स्थान विजेता` : reward.title}
              </span>
            </div>

            <div className="text-xs font-bold text-gray-900 flex items-center gap-0.5">
              <span className="text-[#007080] font-extrabold">₹</span>
              <span>{reward.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

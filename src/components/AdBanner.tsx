import React from 'react';
import { Megaphone } from 'lucide-react';

export const AdBanner: React.FC = () => {
  return (
    <div className="px-4 py-2">
      <div className="border border-dashed border-gray-300 rounded-xl py-3 flex items-center justify-center gap-1.5 text-xs text-gray-400 bg-gray-50/50">
        <Megaphone className="w-3.5 h-3.5" />
        <span className="font-semibold tracking-wide">Ad Here</span>
      </div>
    </div>
  );
};

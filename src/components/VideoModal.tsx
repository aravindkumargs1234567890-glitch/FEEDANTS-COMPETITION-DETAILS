import React from 'react';
import { X, Play, Award, CheckCircle } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
  performerName?: string;
  rankBadge?: string;
  quote?: string;
  language: 'ENG' | 'HIN';
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  videoUrl,
  performerName,
  rankBadge,
  quote,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-gray-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-800 text-white animate-scale-up">
        {/* Top Header */}
        <div className="p-3.5 px-4 flex items-center justify-between border-b border-gray-800">
          <div>
            <h3 className="text-sm font-bold text-white leading-tight truncate">{title}</h3>
            {performerName && (
              <p className="text-[11px] text-[#2ec4b6] font-semibold mt-0.5 flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>{performerName}</span>
                {rankBadge && <span>• {rankBadge}</span>}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Box */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        {/* Details & Quote Footer */}
        {quote && (
          <div className="p-3.5 bg-gray-950/70 border-t border-gray-800 text-xs text-gray-300 italic">
            "{quote}"
          </div>
        )}

        <div className="p-3 bg-gray-900 flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5 text-[#2ec4b6]">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Feedants Verified Classical Entry</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition cursor-pointer"
          >
            {language === 'ENG' ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
};

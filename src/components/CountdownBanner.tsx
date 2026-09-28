import React, { useState, useEffect } from 'react';
import { Hourglass, Timer as TimerIcon } from 'lucide-react';
import { ILifecycleState } from '../types/index.ts';

interface CountdownBannerProps {
  registrationEndDate: string;
  lifecycle: ILifecycleState;
  language: 'ENG' | 'HIN';
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  registrationEndDate,
  lifecycle,
  language,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(registrationEndDate).getTime();
      const diff = target - now;

      if (diff <= 0 || lifecycle.status === 'REGISTRATION_CLOSED') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [registrationEndDate, lifecycle.status]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="px-4 py-1.5">
      <div className="bg-[#e4f6f5] border border-[#b2e5e1] rounded-xl px-3 py-2.5 flex items-center justify-between shadow-2xs">
        {/* Left: Hourglass & Label */}
        <div className="flex items-center gap-1.5 text-xs text-gray-800 font-semibold">
          <Hourglass className="w-3.5 h-3.5 text-[#007080] animate-pulse" />
          <span className="whitespace-nowrap">
            {language === 'ENG' ? 'Registration closes in' : 'पंजीकरण समाप्त होगा'}
          </span>
        </div>

        {/* Center: Live Real-Time Ticking Countdown */}
        {!timeLeft.isExpired ? (
          <div className="text-xs sm:text-sm font-extrabold text-[#007080] tracking-tight">
            <span>{pad(timeLeft.days)}d</span> : <span>{pad(timeLeft.hours)}h</span> :{' '}
            <span>{pad(timeLeft.minutes)}m</span> : <span className="tabular-nums">{pad(timeLeft.seconds)}s</span>
          </div>
        ) : (
          <div className="text-xs font-bold text-gray-500">
            {language === 'ENG' ? 'Closed' : 'समाप्त'}
          </div>
        )}

        {/* Right: Hurry up badge */}
        <div className="flex items-center gap-1 text-xs font-bold text-[#007080]">
          <TimerIcon className="w-3.5 h-3.5 text-[#007080]" />
          <span className="hidden sm:inline whitespace-nowrap">
            {language === 'ENG' ? 'Hurry up!' : 'जल्दी करें!'}
          </span>
        </div>
      </div>
    </div>
  );
};

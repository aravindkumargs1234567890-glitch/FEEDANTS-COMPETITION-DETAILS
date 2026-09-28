import React from 'react';
import { Calendar, Send, UploadCloud, Trophy } from 'lucide-react';

interface ImportantDatesProps {
  registrationEndDate: string;
  submissionStartDate: string;
  submissionEndDate: string;
  resultDate: string;
  language: 'ENG' | 'HIN';
}

export const ImportantDates: React.FC<ImportantDatesProps> = ({
  registrationEndDate,
  submissionStartDate,
  submissionEndDate,
  resultDate,
  language,
}) => {
  return (
    <div className="px-4 py-3">
      <h2 className="text-sm font-bold text-gray-900 mb-2">
        {language === 'ENG' ? 'Important Dates' : 'महत्वपूर्ण तिथियां'}
      </h2>

      <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden grid grid-cols-2 divide-x divide-y divide-gray-150 shadow-2xs">
        {/* 1. Register Before */}
        <div className="p-3 flex items-start gap-2.5">
          <div className="mt-0.5 text-[#007080] p-1.5 bg-[#e4f6f5] rounded-lg">
            <Calendar className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase">
              {language === 'ENG' ? 'Register Before' : 'पंजीकरण अंतिम तिथि'}
            </p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">10 Aug 26</p>
            <p className="text-[11px] text-gray-500">11:50 PM</p>
          </div>
        </div>

        {/* 2. Submission Starts */}
        <div className="p-3 flex items-start gap-2.5">
          <div className="mt-0.5 text-[#007080] p-1.5 bg-[#e4f6f5] rounded-lg">
            <Send className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase">
              {language === 'ENG' ? 'Submission Starts' : 'प्रविष्टि आरंभ'}
            </p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">6 Aug 26</p>
            <p className="text-[11px] text-gray-500">04:00 AM</p>
          </div>
        </div>

        {/* 3. Submission Ends */}
        <div className="p-3 flex items-start gap-2.5">
          <div className="mt-0.5 text-[#007080] p-1.5 bg-[#e4f6f5] rounded-lg">
            <UploadCloud className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase">
              {language === 'ENG' ? 'Submission Ends' : 'प्रविष्टि अंतिम तिथि'}
            </p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">30 Aug 26</p>
            <p className="text-[11px] text-gray-500">11:55 PM</p>
          </div>
        </div>

        {/* 4. Result Date */}
        <div className="p-3 flex items-start gap-2.5">
          <div className="mt-0.5 text-[#007080] p-1.5 bg-[#e4f6f5] rounded-lg">
            <Trophy className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase">
              {language === 'ENG' ? 'Result Date' : 'परिणाम तिथि'}
            </p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">1 Sept 26</p>
            <p className="text-[11px] text-gray-500">11:50 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

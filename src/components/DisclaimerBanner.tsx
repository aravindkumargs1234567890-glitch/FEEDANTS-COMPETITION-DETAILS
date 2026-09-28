import React from 'react';
import { Info } from 'lucide-react';

interface DisclaimerBannerProps {
  disclaimer: string;
  language: 'ENG' | 'HIN';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ disclaimer, language }) => {
  return (
    <div className="px-4 py-2">
      <div className="bg-[#eaf8f7] border border-[#b2e5e1] rounded-xl px-3 py-2.5 flex items-start gap-2 shadow-2xs">
        <Info className="w-4 h-4 text-[#007080] shrink-0 mt-0.5" />
        <p className="text-[11px] text-gray-700 font-medium leading-tight">
          <strong className="text-[#007080] font-bold">
            {language === 'ENG' ? 'Disclaimer: ' : 'अस्वीकरण: '}
          </strong>
          {language === 'HIN'
            ? 'केवल भुगतान किए गए प्रतिभागियों के योगदान पर ही निर्णय के लिए विचार किया जाएगा।'
            : disclaimer}
        </p>
      </div>
    </div>
  );
};

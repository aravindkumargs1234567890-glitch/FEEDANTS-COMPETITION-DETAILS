import React from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  refundPolicy: string;
  language: 'ENG' | 'HIN';
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({
  isOpen,
  onClose,
  refundPolicy,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-150 animate-scale-up">
        {/* Header */}
        <div className="bg-[#007080] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold">
              {language === 'ENG' ? 'Cancellation & Refund Policy' : 'रिफंड एवं रद्दीकरण नीति'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-gray-600 leading-relaxed">
          <div className="p-3 bg-[#e4f6f5] border border-[#a2ded9] rounded-xl text-[#007080] font-medium">
            {refundPolicy}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-xs">
              {language === 'ENG' ? 'Key Refund Terms:' : 'प्रमुख शर्तें:'}
            </h4>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Full refund initiated within 3-5 business days upon valid cancellation before registration end date.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Once submission is uploaded or judging commenced, entry fee is non-refundable.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>All payments are securely processed by Razorpay with end-to-end banking compliance.</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-150">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#007080] text-white rounded-xl text-xs font-bold transition hover:bg-[#005c69] cursor-pointer"
          >
            {language === 'ENG' ? 'Understood' : 'समझ गया'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Building, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ICompetition, IUser } from '../types/index.ts';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: ICompetition;
  currentUser: IUser;
  onSuccess: (data: any) => void;
  language: 'ENG' | 'HIN';
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  competition,
  currentUser,
  onSuccess,
  language,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState(`${currentUser.email.split('@')[0]}@okaxis`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitionId: competition._id,
          userId: currentUser._id,
          paymentMethod: selectedMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-up">
        {/* Modal Header */}
        <div className="bg-[#007080] text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
              {language === 'ENG' ? 'Feedants Registration' : 'फीडैंट्स पंजीकरण'}
            </span>
            <h3 className="text-base font-bold leading-tight">
              {competition.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handlePayAndRegister} className="p-4 space-y-4">
          {/* Summary Box */}
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 font-medium">
                {language === 'ENG' ? 'Participant' : 'प्रतिभागी'}
              </p>
              <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
              <p className="text-[10px] text-gray-400">{currentUser.email}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-gray-500 font-medium">
                {language === 'ENG' ? 'Entry Fee' : 'प्रवेश शुल्क'}
              </p>
              <p className="text-lg font-black text-gray-900">₹{competition.entryFee}</p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-2">
              {language === 'ENG' ? 'Select Payment Mode' : 'भुगतान विधि चुनें'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
                  selectedMethod === 'upi'
                    ? 'border-[#007080] bg-[#e4f6f5] text-[#007080]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / GPay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
                  selectedMethod === 'card'
                    ? 'border-[#007080] bg-[#e4f6f5] text-[#007080]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-semibold transition cursor-pointer ${
                  selectedMethod === 'netbanking'
                    ? 'border-[#007080] bg-[#e4f6f5] text-[#007080]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>NetBanking</span>
              </button>
            </div>
          </div>

          {selectedMethod === 'upi' && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-700">UPI ID / VPA</label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#007080]"
                placeholder="username@okhdfcbank"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Trust Banner */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Secure Razorpay Checkout</span>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#007080] hover:bg-[#005c69] text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'ENG' ? 'Processing...' : 'प्रक्रिया जारी...'}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>
                  {language === 'ENG' ? `Pay ₹${competition.entryFee} & Register` : `₹${competition.entryFee} भुगतान कर रजिस्टर करें`}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

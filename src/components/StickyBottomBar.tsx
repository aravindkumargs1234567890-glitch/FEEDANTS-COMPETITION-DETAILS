import React from 'react';
import { UploadCloud, CheckCircle2, Lock, ArrowRight, Eye } from 'lucide-react';
import { ILifecycleState, IRegistration, ISubmission } from '../types/index.ts';

interface StickyBottomBarProps {
  userRegistration: IRegistration | null;
  userSubmission: ISubmission | null;
  lifecycle: ILifecycleState;
  entryFee: number;
  onRegisterClick: () => void;
  onUploadSubmissionClick: () => void;
  onViewSubmissionClick: () => void;
  language: 'ENG' | 'HIN';
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  userRegistration,
  userSubmission,
  lifecycle,
  entryFee,
  onRegisterClick,
  onUploadSubmissionClick,
  onViewSubmissionClick,
  language,
}) => {
  const isRegistered = !!userRegistration && userRegistration.registrationStatus === 'CONFIRMED';
  const hasSubmitted = !!userSubmission || userRegistration?.submissionStatus === 'SUBMITTED';

  // Determine button state and copy
  let buttonTitle = '';
  let buttonSubtitle = '';
  let buttonAction: () => void = () => {};
  let isDisabled = false;
  let buttonBg = 'bg-[#005f73] hover:bg-[#0a4f5c] text-white';
  let buttonIcon = null;

  if (isRegistered) {
    if (hasSubmitted) {
      buttonTitle = language === 'ENG' ? 'Submission Received' : 'प्रविष्टि प्राप्त हुई';
      buttonSubtitle = language === 'ENG' ? 'Tap to view or update your entry' : 'अपनी प्रविष्टि देखने या बदलने के लिए टैप करें';
      buttonAction = onViewSubmissionClick;
      buttonBg = 'bg-[#007080] hover:bg-[#005c69] text-white';
      buttonIcon = <Eye className="w-4 h-4" />;
    } else if (lifecycle.isSubmissionOpen) {
      // EXACT SCREENSHOT STATE: "Upload Submission" with subtext "Registered"
      buttonTitle = language === 'ENG' ? 'Upload Submission' : 'प्रविष्टि अपलोड करें';
      buttonSubtitle = language === 'ENG' ? 'Registered' : 'पंजीकृत';
      buttonAction = onUploadSubmissionClick;
      buttonBg = 'bg-[#005f73] hover:bg-[#004e5f] text-white';
      buttonIcon = <UploadCloud className="w-4 h-4 stroke-[2.5]" />;
    } else if (lifecycle.status === 'REGISTRATION_OPEN') {
      buttonTitle = language === 'ENG' ? 'Registered' : 'पंजीकृत';
      buttonSubtitle = language === 'ENG' ? 'Submission opens soon' : 'प्रविष्टि जल्द शुरू होगी';
      buttonAction = () => {};
      buttonBg = 'bg-[#007080] text-white';
      buttonIcon = <CheckCircle2 className="w-4 h-4" />;
    } else if (lifecycle.status === 'COMPLETED') {
      buttonTitle = language === 'ENG' ? 'Competition Completed' : 'प्रतियोगिता समाप्त';
      buttonSubtitle = language === 'ENG' ? 'View Final Results' : 'अंतिम परिणाम देखें';
      buttonAction = () => {};
      buttonBg = 'bg-gray-800 text-white';
    } else {
      buttonTitle = language === 'ENG' ? 'Submission Closed' : 'प्रविष्टि बंद है';
      buttonSubtitle = language === 'ENG' ? 'Registered participant' : 'पंजीकृत प्रतिभागी';
      buttonAction = () => {};
      isDisabled = true;
      buttonBg = 'bg-gray-400 text-white';
    }
  } else {
    // Unregistered state
    if (lifecycle.remainingSpots <= 0) {
      buttonTitle = language === 'ENG' ? 'Competition Full' : 'प्रतियोगिता पूर्ण';
      buttonSubtitle = language === 'ENG' ? 'Sold Out (20/20 Booked)' : 'सभी स्थान भरे हुए हैं';
      isDisabled = true;
      buttonBg = 'bg-gray-400 text-white cursor-not-allowed';
      buttonIcon = <Lock className="w-4 h-4" />;
    } else if (lifecycle.status === 'REGISTRATION_CLOSED') {
      buttonTitle = language === 'ENG' ? 'Registration Closed' : 'पंजीकरण बंद';
      buttonSubtitle = language === 'ENG' ? 'Deadline passed' : 'अंतिम तिथि समाप्त हो गई';
      isDisabled = true;
      buttonBg = 'bg-gray-400 text-white cursor-not-allowed';
      buttonIcon = <Lock className="w-4 h-4" />;
    } else {
      buttonTitle = language === 'ENG' ? `Register Now • ₹${entryFee}` : `अभी पंजीकरण करें • ₹${entryFee}`;
      buttonSubtitle =
        language === 'ENG'
          ? `Only ${lifecycle.remainingSpots} spots left`
          : `केवल ${lifecycle.remainingSpots} स्थान शेष`;
      buttonAction = onRegisterClick;
      buttonBg = 'bg-[#007080] hover:bg-[#005c69] text-white';
      buttonIcon = <ArrowRight className="w-4 h-4" />;
    }
  }

  return (
    <div className="p-3 bg-white border-t border-gray-150">
      <button
        type="button"
        disabled={isDisabled}
        onClick={buttonAction}
        className={`w-full py-2.5 px-4 rounded-xl flex flex-col items-center justify-center transition-all duration-200 shadow-md active:scale-[0.99] cursor-pointer ${buttonBg}`}
      >
        <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold tracking-tight">
          {buttonIcon}
          <span>{buttonTitle}</span>
        </div>
        {buttonSubtitle && (
          <span className="text-[11px] font-medium opacity-90 tracking-wide mt-0.5">
            {buttonSubtitle}
          </span>
        )}
      </button>
    </div>
  );
};

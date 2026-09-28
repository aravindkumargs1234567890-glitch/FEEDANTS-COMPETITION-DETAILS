import React, { useState, useEffect, useCallback } from 'react';
import { ApiClient, CompetitionDetailsResponse } from './api/client.ts';
import { ICompetition, ILifecycleState, IRegistration, ISubmission, IUser, IPreviousWinner } from './types/index.ts';

// Components
import { Header } from './components/Header.tsx';
import { CompetitionHeader } from './components/CompetitionHeader.tsx';
import { MetricsRow } from './components/MetricsRow.tsx';
import { JudgeCard } from './components/JudgeCard.tsx';
import { CountdownBanner } from './components/CountdownBanner.tsx';
import { ImportantDates } from './components/ImportantDates.tsx';
import { PreviousWinners } from './components/PreviousWinners.tsx';
import { TabsSection } from './components/TabsSection.tsx';
import { RewardsTable } from './components/RewardsTable.tsx';
import { DisclaimerBanner } from './components/DisclaimerBanner.tsx';
import { TrustCards } from './components/TrustCards.tsx';
import { ReferralCard } from './components/ReferralCard.tsx';
import { ReviewsBanner } from './components/ReviewsBanner.tsx';
import { AdBanner } from './components/AdBanner.tsx';
import { StickyBottomBar } from './components/StickyBottomBar.tsx';
import { BottomNavBar } from './components/BottomNavBar.tsx';

// Modals
import { RegistrationModal } from './components/RegistrationModal.tsx';
import { SubmissionModal } from './components/SubmissionModal.tsx';
import { VideoModal } from './components/VideoModal.tsx';
import { ReviewsModal } from './components/ReviewsModal.tsx';
import { RefundPolicyModal } from './components/RefundPolicyModal.tsx';
import { ConcurrencyTestModal } from './components/ConcurrencyTestModal.tsx';
import { EvaluatorToolbar } from './components/EvaluatorToolbar.tsx';

import { Loader2, Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core Data
  const [competition, setCompetition] = useState<ICompetition | null>(null);
  const [lifecycle, setLifecycle] = useState<ILifecycleState | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [userRegistration, setUserRegistration] = useState<IRegistration | null>(null);
  const [userSubmission, setUserSubmission] = useState<ISubmission | null>(null);

  // UI States
  const [language, setLanguage] = useState<'ENG' | 'HIN'>('ENG');
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isConcurrencyModalOpen, setIsConcurrencyModalOpen] = useState(false);
  const [videoModalData, setVideoModalData] = useState<{
    isOpen: boolean;
    title: string;
    videoUrl: string;
    performerName?: string;
    rankBadge?: string;
    quote?: string;
  }>({
    isOpen: false,
    title: '',
    videoUrl: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch initial competition and users
  const loadData = useCallback(async (activeUserId?: string) => {
    try {
      const userList = await ApiClient.listUsers();
      setUsers(userList);

      const targetUser = activeUserId
        ? userList.find((u) => u._id === activeUserId) || userList[0]
        : currentUser || userList[0];

      if (targetUser && (!currentUser || currentUser._id !== targetUser._id)) {
        setCurrentUser(targetUser);
      }

      const res: CompetitionDetailsResponse = await ApiClient.getCompetitionDetails(
        'comp_classical_dance_001',
        targetUser?._id
      );

      setCompetition(res.competition);
      setLifecycle(res.lifecycle);
      setUserRegistration(res.userRegistration);
      setUserSubmission(res.userSubmission);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load competition data:', err);
      setError(err.message || 'Unable to connect to Feedants backend service.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectUser = async (user: IUser) => {
    setCurrentUser(user);
    setLoading(true);
    await loadData(user._id);
    showToast(`Switched active user to: ${user.name}`);
  };

  const handleScenarioChange = async (scenario: string) => {
    if (!competition) return;
    try {
      setLoading(true);
      await ApiClient.setLifecycleScenario(competition._id, scenario);
      await loadData(currentUser?._id);
      showToast(`Simulation updated: ${scenario}`);
    } catch (err: any) {
      showToast(`Scenario error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    try {
      setLoading(true);
      await ApiClient.resetDatabase();
      await loadData();
      showToast('Database reset to initial design state (1/20 Booked).');
    } catch (err: any) {
      showToast(`Reset error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = (data: any) => {
    setUserRegistration(data.registration);
    if (data.competition) setCompetition(data.competition);
    if (data.lifecycle) setLifecycle(data.lifecycle);
    showToast('Registration confirmed! Entry fee paid.');
  };

  const handleSubmissionSuccess = (submission: ISubmission) => {
    setUserSubmission(submission);
    if (userRegistration) {
      setUserRegistration({ ...userRegistration, submissionStatus: 'SUBMITTED' });
    }
    showToast('Dance performance entry uploaded successfully!');
  };

  if (loading && !competition) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#007080] mb-3" />
        <p className="text-sm font-semibold tracking-wide">Loading Feedants Competition Module...</p>
      </div>
    );
  }

  if (error && !competition) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl max-w-sm text-center shadow-lg border border-red-200">
          <p className="text-red-600 font-bold mb-2">Backend Connection Error</p>
          <p className="text-xs text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 bg-[#007080] text-white rounded-xl text-xs font-bold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!competition || !lifecycle || !currentUser) {
    return null;
  }

  const screenContent = (
    <div className="flex flex-col min-h-full bg-white text-gray-900 selection:bg-[#a2ded9]">
      {/* Mobile Top Header (Status Bar, Back, ENG/HIN) */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onBack={() => showToast('Navigation: Go back')}
      />

      {/* Scrollable Main Screen Body */}
      <main className="flex-1 overflow-y-auto pb-4">
        {/* Title, Badges, User Registration State */}
        <CompetitionHeader
          title={competition.title}
          category={competition.category}
          competitionType={competition.competitionType}
          hasCertificate={competition.hasCertificate}
          userRegistration={userRegistration}
          lifecycle={lifecycle}
          language={language}
        />

        {/* Prize Pool, Entry Fee, Remaining Spots */}
        <MetricsRow
          prizePool={competition.prizePool}
          entryFee={competition.entryFee}
          participantCount={competition.participantCount}
          maxParticipants={competition.maxParticipants}
          remainingSpots={lifecycle.remainingSpots}
          language={language}
        />

        {/* Judge Card with Intro Video */}
        <JudgeCard
          judge={competition.judge}
          onOpenIntroVideo={() =>
            setVideoModalData({
              isOpen: true,
              title: competition.introVideo.title,
              videoUrl: competition.introVideo.videoUrl,
              performerName: competition.judge.name,
              rankBadge: competition.judge.role,
              quote: competition.judge.bio,
            })
          }
          language={language}
        />

        {/* Countdown Banner */}
        <CountdownBanner
          registrationEndDate={competition.registrationEndDate}
          lifecycle={lifecycle}
          language={language}
        />

        {/* 2x2 Grid of Important Dates */}
        <ImportantDates
          registrationEndDate={competition.registrationEndDate}
          submissionStartDate={competition.submissionStartDate}
          submissionEndDate={competition.submissionEndDate}
          resultDate={competition.resultDate}
          language={language}
        />

        {/* Previous Winners Carousel */}
        <PreviousWinners
          winners={competition.previousWinners}
          onSelectWinner={(winner: IPreviousWinner) =>
            setVideoModalData({
              isOpen: true,
              title: `${winner.name} - ${winner.performanceTitle}`,
              videoUrl: winner.videoUrl,
              performerName: winner.name,
              rankBadge: winner.rank,
              quote: winner.quote,
            })
          }
          language={language}
        />

        {/* Tabs: About, Judging Parameters, Rules & Eligibility */}
        <TabsSection
          aboutText={competition.aboutCompetition}
          judgingParameters={competition.judgingParameters}
          rules={competition.rules}
          eligibility={competition.eligibility}
          language={language}
        />

        {/* Rewards Breakdown (All Positions) */}
        <RewardsTable rewards={competition.rewards} language={language} />

        {/* Disclaimer Notice */}
        <DisclaimerBanner disclaimer={competition.disclaimer} language={language} />

        {/* Trust & Payout Information */}
        <TrustCards
          onWatchPrizeVideo={() =>
            setVideoModalData({
              isOpen: true,
              title: 'Prize Money Transfer & Payout Verification Process',
              videoUrl: competition.paymentInformation.videoUrl,
              quote: competition.paymentInformation.description,
            })
          }
          onOpenRefundPolicy={() => setIsRefundModalOpen(true)}
          language={language}
        />

        {/* Referral Card */}
        <ReferralCard referralInfo={competition.referralInformation} language={language} />

        {/* Reviews Section */}
        <ReviewsBanner onOpenReviews={() => setIsReviewsModalOpen(true)} language={language} />

        {/* Ad Placeholder Banner */}
        <AdBanner />
      </main>

      {/* Sticky Bottom Action Button */}
      <StickyBottomBar
        userRegistration={userRegistration}
        userSubmission={userSubmission}
        lifecycle={lifecycle}
        entryFee={competition.entryFee}
        onRegisterClick={() => setIsRegModalOpen(true)}
        onUploadSubmissionClick={() => setIsSubModalOpen(true)}
        onViewSubmissionClick={() => setIsSubModalOpen(true)}
        language={language}
      />

      {/* Bottom App Navigation Bar */}
      <BottomNavBar currentUser={currentUser} language={language} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Evaluator Controls at Top */}
      <EvaluatorToolbar
        users={users}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onScenarioChange={handleScenarioChange}
        onOpenConcurrencyTest={() => setIsConcurrencyModalOpen(true)}
        onResetDatabase={handleResetDatabase}
        language={language}
      />

      {/* Frame Viewport Selector Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-400">View Mode:</span>
          <button
            type="button"
            onClick={() => setIsMobileFrame(true)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition ${
              isMobileFrame ? 'bg-[#007080] text-white font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device (Pixel Perfect)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsMobileFrame(false)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition ${
              !isMobileFrame ? 'bg-[#007080] text-white font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Responsive Full Screen</span>
          </button>
        </div>

        <div className="text-[11px] text-gray-400 hidden sm:block">
          Active: <strong className="text-white">{currentUser.name}</strong> • Status:{' '}
          <strong className={userRegistration ? 'text-emerald-400' : 'text-amber-400'}>
            {userRegistration ? 'Registered' : 'Not Registered'}
          </strong>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-4 z-60 bg-gray-900 text-white border border-[#007080] px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2ec4b6] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Container */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
        {isMobileFrame ? (
          <div className="w-full max-w-[420px] h-[94vh] bg-white rounded-[38px] shadow-2xl ring-1 ring-gray-800 overflow-hidden flex flex-col border-[6px] border-slate-900 relative">
            {screenContent}
          </div>
        ) : (
          <div className="w-full max-w-2xl h-[94vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-200">
            {screenContent}
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        competition={competition}
        currentUser={currentUser}
        onSuccess={handleRegistrationSuccess}
        language={language}
      />

      <SubmissionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        competition={competition}
        currentUser={currentUser}
        existingSubmission={userSubmission}
        onSuccess={handleSubmissionSuccess}
        language={language}
      />

      <VideoModal
        isOpen={videoModalData.isOpen}
        onClose={() => setVideoModalData((prev) => ({ ...prev, isOpen: false }))}
        title={videoModalData.title}
        videoUrl={videoModalData.videoUrl}
        performerName={videoModalData.performerName}
        rankBadge={videoModalData.rankBadge}
        quote={videoModalData.quote}
        language={language}
      />

      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        reviews={competition.reviews}
        language={language}
      />

      <RefundPolicyModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        refundPolicy={competition.refundPolicy}
        language={language}
      />

      <ConcurrencyTestModal
        isOpen={isConcurrencyModalOpen}
        onClose={() => setIsConcurrencyModalOpen(false)}
        competition={competition}
        onRefreshParent={() => loadData(currentUser._id)}
        language={language}
      />
    </div>
  );
}

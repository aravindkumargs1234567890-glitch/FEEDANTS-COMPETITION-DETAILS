export type CompetitionStatus =
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'SUBMISSION_OPEN'
  | 'SUBMISSION_CLOSED'
  | 'RESULTS_PENDING'
  | 'COMPLETED';

export interface IJudge {
  name: string;
  role: string;
  experience: string;
  image: string;
  videoUrl: string;
  bio?: string;
}

export interface IIntroVideo {
  title: string;
  videoUrl: string;
  duration: string;
  thumbnail: string;
}

export interface IPreviousWinner {
  id: string;
  name: string;
  rank: string;
  rankNumber: number;
  image: string;
  performanceTitle: string;
  videoUrl: string;
  quote?: string;
}

export interface IJudgingParameter {
  title: string;
  weightage: number;
  description: string;
}

export interface IReward {
  rank: number;
  title: string;
  amount: number;
  iconType: string;
}

export interface IReferralInfo {
  code: string;
  url: string;
  rewardAmount: number;
  description: string;
}

export interface IReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  city: string;
  date: string;
  avatar: string;
}

export interface ICompetition {
  _id: string;
  title: string;
  description: string;
  category: string;
  competitionType: string;
  hasCertificate: boolean;
  prizePool: number;
  entryFee: number;
  maxParticipants: number;
  participantCount: number;
  registrationStartDate: string;
  registrationEndDate: string;
  submissionStartDate: string;
  submissionEndDate: string;
  resultDate: string;
  judge: IJudge;
  introVideo: IIntroVideo;
  previousWinners: IPreviousWinner[];
  aboutCompetition: string;
  judgingParameters: IJudgingParameter[];
  rules: string[];
  eligibility: string[];
  rewards: IReward[];
  disclaimer: string;
  refundPolicy: string;
  paymentInformation: {
    provider: string;
    poweredBy: string;
    videoUrl: string;
    description: string;
  };
  referralInformation: IReferralInfo;
  reviews: IReview[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ILifecycleState {
  status: CompetitionStatus;
  isRegistrationOpen: boolean;
  isSubmissionOpen: boolean;
  isCompleted: boolean;
  remainingSpots: number;
  secondsUntilRegistrationCloses: number;
  secondsUntilSubmissionCloses: number;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  phone?: string;
  city?: string;
}

export interface IRegistration {
  _id: string;
  userId: string;
  competitionId: string;
  registrationStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  paymentReference: string;
  amountPaid: number;
  registeredAt: string;
  submissionStatus: 'NOT_SUBMITTED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REVIEWED';
}

export interface ISubmission {
  _id: string;
  userId: string;
  competitionId: string;
  registrationId: string;
  submissionUrl: string;
  title: string;
  performanceNotes?: string;
  fileType: string;
  submissionStatus: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

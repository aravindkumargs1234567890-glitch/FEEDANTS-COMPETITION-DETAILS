import { db, MongoQuery, UpdateQuery } from '../db/mongoStore.js';

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
  registrationStartDate: string; // ISO
  registrationEndDate: string;   // ISO
  submissionStartDate: string;   // ISO
  submissionEndDate: string;     // ISO
  resultDate: string;            // ISO
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
  createdAt: Date;
  updatedAt: Date;
}

export class CompetitionModel {
  static async findById(id: string): Promise<ICompetition | null> {
    return db.competitions.findById(id);
  }

  static async findOne(query: MongoQuery): Promise<ICompetition | null> {
    return db.competitions.findOne(query);
  }

  static async find(query: MongoQuery = {}): Promise<ICompetition[]> {
    return db.competitions.find(query);
  }

  static async create(comp: Partial<ICompetition>): Promise<ICompetition> {
    return db.competitions.insertOne(comp);
  }

  static async updateOne(filter: MongoQuery, update: UpdateQuery) {
    return db.competitions.updateOne(filter, update);
  }

  /**
   * Atomic findOneAndUpdate for registration increment with concurrency guarantee
   * Ensures participantCount < maxParticipants at the instant of modification
   */
  static async findOneAndUpdate(filter: MongoQuery, update: UpdateQuery, options: { new?: boolean } = {}) {
    return db.competitions.findOneAndUpdate(filter, update, options);
  }

  /**
   * Dynamic lifecycle determination based on current real-time timestamp
   */
  static determineLifecycleState(comp: ICompetition, referenceDate = new Date()): {
    status: CompetitionStatus;
    isRegistrationOpen: boolean;
    isSubmissionOpen: boolean;
    isCompleted: boolean;
    remainingSpots: number;
    secondsUntilRegistrationCloses: number;
    secondsUntilSubmissionCloses: number;
  } {
    const now = referenceDate.getTime();
    const regStart = new Date(comp.registrationStartDate).getTime();
    const regEnd = new Date(comp.registrationEndDate).getTime();
    const subStart = new Date(comp.submissionStartDate).getTime();
    const subEnd = new Date(comp.submissionEndDate).getTime();
    const resDate = new Date(comp.resultDate).getTime();

    const remainingSpots = Math.max(0, comp.maxParticipants - comp.participantCount);
    const isFull = comp.participantCount >= comp.maxParticipants;

    let status: CompetitionStatus = 'UPCOMING';

    if (now < regStart) {
      status = 'UPCOMING';
    } else if (now >= regStart && now <= regEnd) {
      if (isFull) {
        status = 'REGISTRATION_CLOSED';
      } else {
        status = 'REGISTRATION_OPEN';
      }
    } else if (now > regEnd && now < subStart) {
      status = 'REGISTRATION_CLOSED';
    } else if (now >= subStart && now <= subEnd) {
      status = 'SUBMISSION_OPEN';
    } else if (now > subEnd && now < resDate) {
      status = 'RESULTS_PENDING';
    } else {
      status = 'COMPLETED';
    }

    const secondsUntilRegistrationCloses = Math.max(0, Math.floor((regEnd - now) / 1000));
    const secondsUntilSubmissionCloses = Math.max(0, Math.floor((subEnd - now) / 1000));

    return {
      status,
      isRegistrationOpen: status === 'REGISTRATION_OPEN' && !isFull,
      isSubmissionOpen: now >= subStart && now <= subEnd,
      isCompleted: status === 'COMPLETED',
      remainingSpots,
      secondsUntilRegistrationCloses,
      secondsUntilSubmissionCloses,
    };
  }
}

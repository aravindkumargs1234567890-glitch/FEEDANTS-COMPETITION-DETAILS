import { db, MongoQuery, UpdateQuery } from '../db/mongoStore.js';

export type RegistrationStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED' | 'FREE';
export type ParticipationSubmissionStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REVIEWED';

export interface IRegistration {
  _id: string;
  userId: string;
  competitionId: string;
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  paymentReference: string;
  amountPaid: number;
  registeredAt: Date;
  submissionStatus: ParticipationSubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class RegistrationModel {
  static async findById(id: string): Promise<IRegistration | null> {
    return db.registrations.findById(id);
  }

  static async findOne(query: MongoQuery): Promise<IRegistration | null> {
    return db.registrations.findOne(query);
  }

  static async find(query: MongoQuery = {}): Promise<IRegistration[]> {
    return db.registrations.find(query);
  }

  static async create(data: Partial<IRegistration>): Promise<IRegistration> {
    return db.registrations.insertOne({
      userId: data.userId,
      competitionId: data.competitionId,
      registrationStatus: data.registrationStatus || 'CONFIRMED',
      paymentStatus: data.paymentStatus || 'PAID',
      paymentReference: data.paymentReference || `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      amountPaid: data.amountPaid ?? 99,
      registeredAt: data.registeredAt || new Date(),
      submissionStatus: data.submissionStatus || 'NOT_SUBMITTED',
    });
  }

  static async updateOne(filter: MongoQuery, update: UpdateQuery) {
    return db.registrations.updateOne(filter, update);
  }

  static async countDocuments(query: MongoQuery = {}): Promise<number> {
    return db.registrations.countDocuments(query);
  }
}

import { db, MongoQuery, UpdateQuery } from '../db/mongoStore.js';

export type SubmissionStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export interface ISubmission {
  _id: string;
  userId: string;
  competitionId: string;
  registrationId: string;
  submissionUrl: string;
  title: string;
  performanceNotes?: string;
  fileType: string;
  submissionStatus: SubmissionStatus;
  submittedAt: Date;
  updatedAt: Date;
}

export class SubmissionModel {
  static async findById(id: string): Promise<ISubmission | null> {
    return db.submissions.findById(id);
  }

  static async findOne(query: MongoQuery): Promise<ISubmission | null> {
    return db.submissions.findOne(query);
  }

  static async find(query: MongoQuery = {}): Promise<ISubmission[]> {
    return db.submissions.find(query);
  }

  static async create(data: Partial<ISubmission>): Promise<ISubmission> {
    return db.submissions.insertOne({
      userId: data.userId,
      competitionId: data.competitionId,
      registrationId: data.registrationId,
      submissionUrl: data.submissionUrl,
      title: data.title || 'Classical Dance Performance Entry',
      performanceNotes: data.performanceNotes || '',
      fileType: data.fileType || 'video/mp4',
      submissionStatus: data.submissionStatus || 'SUBMITTED',
      submittedAt: new Date(),
    });
  }

  static async updateOne(filter: MongoQuery, update: UpdateQuery) {
    return db.submissions.updateOne(filter, update);
  }
}

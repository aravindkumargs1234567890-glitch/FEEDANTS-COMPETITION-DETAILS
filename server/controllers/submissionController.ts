import { Request, Response } from 'express';
import { SubmissionModel } from '../models/Submission.js';
import { RegistrationModel } from '../models/Registration.js';
import { CompetitionModel } from '../models/Competition.js';

export class SubmissionController {
  static async submitEntry(req: Request, res: Response) {
    const { userId, competitionId, submissionUrl, title, performanceNotes, fileType } = req.body;

    if (!userId || !competitionId || !submissionUrl) {
      return res.status(400).json({
        success: false,
        message: 'userId, competitionId, and submissionUrl are required.',
      });
    }

    try {
      // 1. Verify user is registered
      const registration = await RegistrationModel.findOne({
        userId,
        competitionId,
        registrationStatus: 'CONFIRMED',
      });

      if (!registration) {
        return res.status(403).json({
          success: false,
          message: 'You must have a confirmed registration to upload a competition submission.',
        });
      }

      // 2. Verify submission window
      const competition = await CompetitionModel.findById(competitionId);
      if (!competition) {
        return res.status(404).json({ success: false, message: 'Competition not found.' });
      }

      const now = Date.now();
      const subStart = new Date(competition.submissionStartDate).getTime();
      const subEnd = new Date(competition.submissionEndDate).getTime();

      if (now < subStart) {
        return res.status(400).json({
          success: false,
          message: `Submission window opens on ${new Date(competition.submissionStartDate).toLocaleDateString()}. Please check back then.`,
        });
      }

      if (now > subEnd) {
        return res.status(400).json({
          success: false,
          message: 'Submission deadline has passed. Late submissions are not accepted.',
        });
      }

      // Check for existing submission (allow update/re-upload)
      const existingSubmission = await SubmissionModel.findOne({
        userId,
        competitionId,
      });

      let submission;
      if (existingSubmission) {
        await SubmissionModel.updateOne(
          { _id: existingSubmission._id },
          {
            $set: {
              submissionUrl,
              title: title || existingSubmission.title,
              performanceNotes: performanceNotes || existingSubmission.performanceNotes,
              fileType: fileType || existingSubmission.fileType,
              submissionStatus: 'SUBMITTED',
              updatedAt: new Date(),
            },
          }
        );
        submission = await SubmissionModel.findById(existingSubmission._id);
      } else {
        submission = await SubmissionModel.create({
          userId,
          competitionId,
          registrationId: registration._id,
          submissionUrl,
          title: title || `${competition.title} Entry`,
          performanceNotes: performanceNotes || '',
          fileType: fileType || 'video/mp4',
          submissionStatus: 'SUBMITTED',
        });
      }

      // Update registration submissionStatus
      await RegistrationModel.updateOne(
        { _id: registration._id },
        { $set: { submissionStatus: 'SUBMITTED' } }
      );

      return res.status(201).json({
        success: true,
        message: 'Your competition submission has been received successfully!',
        data: submission,
      });
    } catch (err: any) {
      console.error('[SubmissionController.submitEntry] Error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Submission failed' });
    }
  }

  static async getSubmission(req: Request, res: Response) {
    const { competitionId, userId } = req.query;
    try {
      const submission = await SubmissionModel.findOne({
        competitionId: competitionId as string,
        userId: userId as string,
      });
      return res.json({ success: true, data: submission });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

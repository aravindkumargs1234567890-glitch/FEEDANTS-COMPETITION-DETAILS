import { Request, Response } from 'express';
import { CompetitionModel } from '../models/Competition.js';
import { RegistrationModel } from '../models/Registration.js';
import { SubmissionModel } from '../models/Submission.js';
import { seedDatabase } from '../db/seed.js';

export class CompetitionController {
  static async getDetails(req: Request, res: Response) {
    try {
      const compId = req.params.id || 'comp_classical_dance_001';
      const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);

      let comp = await CompetitionModel.findById(compId);
      if (!comp) {
        // Fallback to the first competition
        const all = await CompetitionModel.find();
        if (all.length > 0) comp = all[0];
      }

      if (!comp) {
        return res.status(404).json({ success: false, message: 'Competition not found' });
      }

      const lifecycle = CompetitionModel.determineLifecycleState(comp);

      let userRegistration = null;
      let userSubmission = null;

      if (userId) {
        userRegistration = await RegistrationModel.findOne({
          userId,
          competitionId: comp._id,
        });

        if (userRegistration) {
          userSubmission = await SubmissionModel.findOne({
            userId,
            competitionId: comp._id,
          });
        }
      }

      return res.json({
        success: true,
        data: {
          competition: comp,
          lifecycle,
          userRegistration,
          userSubmission,
          serverTime: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.error('[CompetitionController.getDetails] Error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
  }

  static async listCompetitions(req: Request, res: Response) {
    try {
      const competitions = await CompetitionModel.find();
      const enriched = competitions.map((c) => ({
        ...c,
        lifecycle: CompetitionModel.determineLifecycleState(c),
      }));
      return res.json({ success: true, data: enriched });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  /**
   * Evaluator testing utility: dynamically adjust lifecycle timestamps or reset to default
   */
  static async adjustLifecycle(req: Request, res: Response) {
    try {
      const compId = req.params.id || 'comp_classical_dance_001';
      const { scenario } = req.body; // 'NORMAL' | 'REG_CLOSED' | 'SUBMISSION_OPEN' | 'COMPLETED' | 'FULL'

      const comp = await CompetitionModel.findById(compId);
      if (!comp) {
        return res.status(404).json({ success: false, message: 'Competition not found' });
      }

      const now = Date.now();
      const updates: any = {};

      if (scenario === 'NORMAL') {
        // 1 day 6 hours left in registration
        updates.registrationStartDate = new Date(now - 3 * 24 * 3600 * 1000).toISOString();
        updates.registrationEndDate = new Date(now + (1 * 24 * 3600 + 6 * 3600 + 28 * 60 + 32) * 1000).toISOString();
        updates.submissionStartDate = new Date(now - 1 * 24 * 3600 * 1000).toISOString();
        updates.submissionEndDate = new Date(now + 12 * 24 * 3600 * 1000).toISOString();
        updates.participantCount = 1; // 19 spots left
      } else if (scenario === 'REG_CLOSED') {
        // Registration ended 2 hours ago
        updates.registrationStartDate = new Date(now - 7 * 24 * 3600 * 1000).toISOString();
        updates.registrationEndDate = new Date(now - 2 * 3600 * 1000).toISOString();
        updates.submissionStartDate = new Date(now + 2 * 24 * 3600 * 1000).toISOString();
      } else if (scenario === 'FULL') {
        // Full capacity (20/20)
        updates.participantCount = comp.maxParticipants;
      } else if (scenario === 'SUBMISSION_CLOSED') {
        updates.submissionStartDate = new Date(now - 10 * 24 * 3600 * 1000).toISOString();
        updates.submissionEndDate = new Date(now - 1 * 3600 * 1000).toISOString();
      } else if (scenario === 'COMPLETED') {
        updates.resultDate = new Date(now - 24 * 3600 * 1000).toISOString();
      }

      await CompetitionModel.updateOne({ _id: compId }, { $set: updates });
      const updated = await CompetitionModel.findById(compId);

      return res.json({
        success: true,
        message: `Scenario updated to ${scenario}`,
        data: {
          competition: updated,
          lifecycle: CompetitionModel.determineLifecycleState(updated!),
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async resetDatabase(req: Request, res: Response) {
    try {
      await seedDatabase(true);
      return res.json({ success: true, message: 'Database reset to initial design state successfully.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

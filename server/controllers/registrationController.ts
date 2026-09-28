import { Request, Response } from 'express';
import { CompetitionModel } from '../models/Competition.js';
import { RegistrationModel } from '../models/Registration.js';
import { UserModel } from '../models/User.js';
import { MongoError } from '../db/mongoStore.js';

export class RegistrationController {
  /**
   * Safe Atomic Registration with Concurrency and Capacity Guarantee
   */
  static async register(req: Request, res: Response) {
    const { competitionId, userId, paymentMethod } = req.body;

    if (!competitionId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: competitionId and userId are required.',
      });
    }

    try {
      // 1. Verify User exists
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User account not found. Please log in or select a valid user.',
        });
      }

      // 2. Verify Competition exists
      const comp = await CompetitionModel.findById(competitionId);
      if (!comp) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found.',
        });
      }

      // 3. Check Lifecycle & Dates
      const lifecycle = CompetitionModel.determineLifecycleState(comp);
      const now = Date.now();
      const regStart = new Date(comp.registrationStartDate).getTime();
      const regEnd = new Date(comp.registrationEndDate).getTime();

      if (now < regStart) {
        return res.status(400).json({
          success: false,
          message: `Registration has not opened yet. Registration opens on ${new Date(comp.registrationStartDate).toLocaleDateString()}.`,
        });
      }

      if (now > regEnd) {
        return res.status(400).json({
          success: false,
          message: 'Registration deadline has passed. Registration is now closed.',
        });
      }

      // 4. Pre-check if User already registered (Fast fail)
      const existing = await RegistrationModel.findOne({
        userId,
        competitionId,
        registrationStatus: { $ne: 'CANCELLED' },
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'You are already registered for this competition.',
          data: existing,
        });
      }

      // 5. ATOMIC CAPACITY CHECK & INCREMENT (Zero Race Conditions)
      // Only increments if participantCount < maxParticipants
      const updatedComp = await CompetitionModel.findOneAndUpdate(
        {
          _id: competitionId,
          participantCount: { $lt: comp.maxParticipants },
        },
        {
          $inc: { participantCount: 1 },
        },
        { new: true }
      );

      if (!updatedComp) {
        return res.status(409).json({
          success: false,
          message: `Competition is completely full (${comp.maxParticipants}/${comp.maxParticipants} booked). No remaining spots available.`,
        });
      }

      // 6. Create Registration Document with Compound Unique Index Protection
      let newRegistration;
      try {
        const paymentReference = `RZP_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        newRegistration = await RegistrationModel.create({
          userId,
          competitionId,
          registrationStatus: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentReference,
          amountPaid: comp.entryFee,
          registeredAt: new Date(),
          submissionStatus: 'NOT_SUBMITTED',
        });
      } catch (err: any) {
        // Rollback atomic participant increment if insertion failed
        await CompetitionModel.updateOne(
          { _id: competitionId },
          { $inc: { participantCount: -1 } }
        );

        if (err instanceof MongoError && err.code === 11000) {
          return res.status(409).json({
            success: false,
            message: 'Duplicate registration prevented by database unique compound index (userId + competitionId).',
          });
        }
        throw err;
      }

      const newLifecycle = CompetitionModel.determineLifecycleState(updatedComp);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! You have secured your spot.',
        data: {
          registration: newRegistration,
          competition: updatedComp,
          lifecycle: newLifecycle,
          remainingSpots: newLifecycle.remainingSpots,
        },
      });
    } catch (err: any) {
      console.error('[RegistrationController.register] Error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'An error occurred during registration.',
      });
    }
  }

  /**
   * Cancel / Refund registration and atomically free up a slot
   */
  static async cancelRegistration(req: Request, res: Response) {
    const { registrationId } = req.params;
    try {
      const reg = await RegistrationModel.findById(registrationId);
      if (!reg) {
        return res.status(404).json({ success: false, message: 'Registration not found' });
      }

      if (reg.registrationStatus === 'CANCELLED') {
        return res.status(400).json({ success: false, message: 'Registration is already cancelled' });
      }

      // Decrement participantCount atomically
      await CompetitionModel.updateOne(
        { _id: reg.competitionId, participantCount: { $gt: 0 } },
        { $inc: { participantCount: -1 } }
      );

      await RegistrationModel.updateOne(
        { _id: registrationId },
        {
          $set: {
            registrationStatus: 'CANCELLED',
            paymentStatus: 'REFUNDED',
          },
        }
      );

      const updatedReg = await RegistrationModel.findById(registrationId);
      const comp = await CompetitionModel.findById(reg.competitionId);

      return res.json({
        success: true,
        message: 'Registration cancelled and refund initiated. Spot freed up.',
        data: {
          registration: updatedReg,
          remainingSpots: comp ? comp.maxParticipants - comp.participantCount : 0,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getUserRegistrations(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const registrations = await RegistrationModel.find({ userId });
      return res.json({ success: true, data: registrations });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

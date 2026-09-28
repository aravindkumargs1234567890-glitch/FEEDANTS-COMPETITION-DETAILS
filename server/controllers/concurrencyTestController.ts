import { Request, Response } from 'express';
import { CompetitionModel } from '../models/Competition.js';
import { RegistrationModel } from '../models/Registration.js';
import { UserModel } from '../models/User.js';
import { MongoError } from '../db/mongoStore.js';

export class ConcurrencyTestController {
  /**
   * Evaluator stress test: Fires multiple concurrent registrations simultaneously
   * to prove that atomic locking and capacity checks prevent overbooking.
   */
  static async runConcurrencyStressTest(req: Request, res: Response) {
    const { competitionId, totalRequests = 10, simulateDuplicates = false } = req.body;
    const targetCompId = competitionId || 'comp_classical_dance_001';

    try {
      const comp = await CompetitionModel.findById(targetCompId);
      if (!comp) {
        return res.status(404).json({ success: false, message: 'Competition not found' });
      }

      const initialCount = comp.participantCount;
      const maxParticipants = comp.maxParticipants;
      const initialSpotsLeft = Math.max(0, maxParticipants - initialCount);

      const startTime = Date.now();
      const results: Array<{
        workerId: number;
        userId: string;
        userName: string;
        success: boolean;
        statusCode: number;
        message: string;
        timestamp: number;
      }> = [];

      // Create distinct users for testing
      const testUsers: any[] = [];
      const userCount = simulateDuplicates ? 2 : totalRequests;

      for (let i = 1; i <= userCount; i++) {
        const email = `stress_test_${Date.now()}_worker_${i}@feedants.test`;
        const user = await UserModel.create({
          name: `Concurrent Dancer #${i}`,
          email,
          city: 'Stress Test Suite',
        });
        testUsers.push(user);
      }

      // Prepare concurrent registration tasks
      const tasks = Array.from({ length: totalRequests }).map(async (_, idx) => {
        const user = testUsers[simulateDuplicates ? idx % 2 : idx];
        const workerId = idx + 1;

        // Perform the exact atomic registration procedure
        try {
          // Pre-check duplicate
          const existing = await RegistrationModel.findOne({
            userId: user._id,
            competitionId: targetCompId,
            registrationStatus: { $ne: 'CANCELLED' },
          });

          if (existing) {
            results.push({
              workerId,
              userId: user._id,
              userName: user.name,
              success: false,
              statusCode: 409,
              message: 'Duplicate registration detected (compound index enforcement)',
              timestamp: Date.now() - startTime,
            });
            return;
          }

          // Atomic increment with condition participantCount < maxParticipants
          const atomicComp = await CompetitionModel.findOneAndUpdate(
            {
              _id: targetCompId,
              participantCount: { $lt: maxParticipants },
            },
            {
              $inc: { participantCount: 1 },
            },
            { new: true }
          );

          if (!atomicComp) {
            results.push({
              workerId,
              userId: user._id,
              userName: user.name,
              success: false,
              statusCode: 409,
              message: 'Capacity full: Atomic condition participantCount < maxParticipants rejected registration',
              timestamp: Date.now() - startTime,
            });
            return;
          }

          // Insert registration record
          try {
            await RegistrationModel.create({
              userId: user._id,
              competitionId: targetCompId,
              registrationStatus: 'CONFIRMED',
              paymentStatus: 'PAID',
              paymentReference: `STRESS_${Date.now()}_W${workerId}`,
              amountPaid: 99,
            });

            results.push({
              workerId,
              userId: user._id,
              userName: user.name,
              success: true,
              statusCode: 201,
              message: 'Spot successfully booked atomically',
              timestamp: Date.now() - startTime,
            });
          } catch (err: any) {
            // Rollback atomic participant increment if duplicate detected
            await CompetitionModel.updateOne(
              { _id: targetCompId },
              { $inc: { participantCount: -1 } }
            );

            results.push({
              workerId,
              userId: user._id,
              userName: user.name,
              success: false,
              statusCode: 409,
              message: err instanceof MongoError ? err.message : 'Registration insertion error',
              timestamp: Date.now() - startTime,
            });
          }
        } catch (err: any) {
          results.push({
            workerId,
            userId: user._id,
            userName: user.name,
            success: false,
            statusCode: 500,
            message: err.message,
            timestamp: Date.now() - startTime,
          });
        }
      });

      // Fire all concurrent workers simultaneously!
      await Promise.all(tasks);

      const endTime = Date.now();
      const finalComp = await CompetitionModel.findById(targetCompId);
      const finalCount = finalComp?.participantCount ?? 0;
      const successCount = results.filter((r) => r.success).length;
      const rejectedCount = results.filter((r) => !r.success).length;

      // Verification checks
      const isCapacityViolated = finalCount > maxParticipants;
      const isNegativeSpots = maxParticipants - finalCount < 0;

      return res.json({
        success: true,
        summary: {
          totalRequestsFired: totalRequests,
          successfulRegistrations: successCount,
          rejectedRegistrations: rejectedCount,
          initialSpotsLeft,
          initialParticipantCount: initialCount,
          finalParticipantCount: finalCount,
          maxCapacity: maxParticipants,
          remainingSpots: Math.max(0, maxParticipants - finalCount),
          overbookingPrevented: !isCapacityViolated && !isNegativeSpots,
          executionTimeMs: endTime - startTime,
        },
        workers: results.sort((a, b) => a.workerId - b.workerId),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

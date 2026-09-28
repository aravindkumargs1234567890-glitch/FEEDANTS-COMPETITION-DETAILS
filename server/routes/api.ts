import { Router } from 'express';
import { CompetitionController } from '../controllers/competitionController.js';
import { RegistrationController } from '../controllers/registrationController.js';
import { SubmissionController } from '../controllers/submissionController.js';
import { UserController } from '../controllers/userController.js';
import { ConcurrencyTestController } from '../controllers/concurrencyTestController.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Feedants API', timestamp: new Date() });
});

// Competitions
router.get('/competitions', CompetitionController.listCompetitions);
router.get('/competitions/:id', CompetitionController.getDetails);
router.post('/competitions/:id/lifecycle', CompetitionController.adjustLifecycle);
router.post('/competitions/reset', CompetitionController.resetDatabase);

// Registrations
router.post('/register', RegistrationController.register);
router.post('/registrations/:registrationId/cancel', RegistrationController.cancelRegistration);
router.get('/users/:userId/registrations', RegistrationController.getUserRegistrations);

// Submissions
router.post('/submissions', SubmissionController.submitEntry);
router.get('/submissions', SubmissionController.getSubmission);

// Users
router.get('/users', UserController.listUsers);
router.get('/users/:id', UserController.getUser);
router.post('/users', UserController.createUser);

// Concurrency Test Suite
router.post('/concurrency/test', ConcurrencyTestController.runConcurrencyStressTest);

export default router;

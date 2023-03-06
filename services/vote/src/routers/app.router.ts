import express, { Router } from 'express';
import { voteRouter } from './vote.router';

const router: Router = express.Router();
router.use('/votes', voteRouter);

export const applicationRouter: Router = router;

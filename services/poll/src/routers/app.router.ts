import express, { Router } from 'express';
import { pollRouter } from './poll.router';

const router: Router = express.Router();
router.use('/polls', pollRouter);

export const applicationRouter: Router = router;

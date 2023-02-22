import express, { Router } from 'express';
import { pollRouter } from './poll.router';
import { formRouter } from './form.router';

const router: Router = express.Router();
router.use('/polls', pollRouter);
router.use('/forms', formRouter);

export const applicationRouter: Router = router;

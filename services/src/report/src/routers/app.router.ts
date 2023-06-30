import express, { Router } from 'express';
import { reportRouter } from './report.router';

const router: Router = express.Router();
router.use('/reports', reportRouter);

export const applicationRouter: Router = router;

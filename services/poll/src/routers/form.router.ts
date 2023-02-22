import express, { Router } from 'express';
import { getQuestionsByLatestVersion } from '../controllers';
import { decodeParams } from '../middlewares';

const router: Router = express.Router();

router.get('/:url', decodeParams, getQuestionsByLatestVersion);

export const formRouter: Router = router;

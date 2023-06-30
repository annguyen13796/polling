import express, { Router } from 'express';
import { getLatestRelease } from '../controllers';
import { decodeParams } from '../middlewares';

const router: Router = express.Router();

router.get('/:url', decodeParams, getLatestRelease);

export const formRouter: Router = router;

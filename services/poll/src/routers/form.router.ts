import express, { Router } from 'express';
import { getLatestVersion } from '../controllers';
import { decodeParams } from '../middlewares';

const router: Router = express.Router();

router.get('/:url', decodeParams, getLatestVersion);

export const formRouter: Router = router;

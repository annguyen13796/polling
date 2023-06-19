import express, { Router } from 'express';
import {
	createOverviewReport,
	createUserResponse,
	getAnswerReports,
	getOverviewReport,
	getOverviewReportsForPoll,
	getVoterReportsForAnswer,
	updateOverviewReport,
} from '../controllers';

const router: Router = express.Router();
router.get('/overview/:pollId/versions', getOverviewReportsForPoll);

router.get(
	'/overview/:pollId/versions/:pollVersion/time/:timeInterval',
	getOverviewReport,
);
router.patch(
	'/overview/:pollId/versions/:pollVersion/time/:timeInterval',
	updateOverviewReport,
);
router.post(
	'/overview/:pollId/versions/:pollVersion/time',
	createOverviewReport,
);

router.get(
	'/detail/:pollId/versions/:version/time/:timeInterval/answers',
	getAnswerReports,
);

router.get(
	'/detail/:pollId/versions/:version/time/:timeInterval/questions/:questionId/answers/:answer/voters',
	getVoterReportsForAnswer,
);

router.post('/detail/:pollId/versions/:pollVersion/time', createUserResponse);

export const reportRouter: Router = router;

// overview-reports
// post

// overview-reports/:id

// overview-reports
// Query Params

// answer-reports
// 
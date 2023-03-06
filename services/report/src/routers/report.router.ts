import express, { Router } from 'express';
import {
	createOverviewReportForRecurrence,
	createUserResponseForRecurrence,
	getOverviewReportForRecurrence,
	getOverviewReportsForPoll,
	updateStatusForRecurrence,
} from '../controllers';

const router: Router = express.Router();
router.get('/overview/:pollId/versions/', getOverviewReportsForPoll);

router.get(
	'/overview/:pollId/versions/:pollVersion/recurrences/:pollRecurrence',
	getOverviewReportForRecurrence,
);
router.patch(
	'/overview/:pollId/versions/:pollVersion/recurrences/:pollRecurrence',
	updateStatusForRecurrence,
);
router.post(
	'/overview/:pollId/versions/:pollVersion/recurrences/',
	createOverviewReportForRecurrence,
);

// router.get(
// 	'/detail/:pollId/version/:version/recurrences/:pollRecurrence/answers',
// 	getAnswerReportsForRecurrence,
// );

// router.get(
// 	'/detail/:pollId/version/:version/recurrence/:pollRecurrence/answers/:answer/voters',
// 	getVoterReportsForAnswer,
// );

router.post(
	'/detail/:pollId/versions/:pollVersion/recurrences/',
	createUserResponseForRecurrence,
);

export const reportRouter: Router = router;

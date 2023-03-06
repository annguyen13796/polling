import express, { Router } from 'express';
import {
	getDraftAnswersForUser,
	putDraftAnswersForQuestion,
	putGeneralVotingStatusOfUser,
} from '../controllers';

const router: Router = express.Router();
router.get(
	'/userResponses/:userResponseId/draftAnswersForQuestions',
	getDraftAnswersForUser,
);

router.put(
	'/userResponses/:userResponseId/draftAnswersForQuestions/:questionId',
	putDraftAnswersForQuestion,
);
router.put('/userResponses/:userResponseId', putGeneralVotingStatusOfUser);

export const voteRouter: Router = router;

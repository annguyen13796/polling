import express, { Router } from 'express';
import {
	getDraftAnswers,
	putDraftAnswersForQuestion,
	putDraftInformation,
} from '../controllers';

const router: Router = express.Router();
router.get('/drafts/:draftId/answers-for-questions', getDraftAnswers);

router.put(
	'/drafts/:draftId/answers-for-questions/:questionId',
	putDraftAnswersForQuestion,
);

router.put('/drafts/:draftId', putDraftInformation);

export const voteRouter: Router = router;

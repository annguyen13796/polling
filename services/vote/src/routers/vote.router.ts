import express, { Router } from 'express';
import {
	getCurrentAnswersForDraft,
	putCurrentAnswersForQuestion,
	putDraft,
} from '../controllers';

const router: Router = express.Router();
router.get('/drafts/:draftId/answers-for-questions', getCurrentAnswersForDraft);

router.put(
	'/drafts/:draftId/answers-for-questions/:questionId',
	putCurrentAnswersForQuestion,
);

router.put('/drafts/:draftId', putDraft);

export const voteRouter: Router = router;


// votes/:id
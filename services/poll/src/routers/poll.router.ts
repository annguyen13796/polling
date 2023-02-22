import express, { Router } from 'express';
import {
	createPoll,
	createQuestion,
	getAllPolls,
	getPollQuestions,
	deletePollById,
	getPollById,
	editQuestion,
	deleteQuestionById,
} from '../controllers';

const router: Router = express.Router();

router.post('/', createPoll);
router.get('/', getAllPolls);
router.get('/:pollId', getPollById);
router.delete('/:pollId', deletePollById);

router.post('/:pollId/questions', createQuestion);
router.get('/:pollId/questions', getPollQuestions);

router.put('/:pollId/questions/:questionId', editQuestion);
router.delete('/:pollId/questions/:questionId', deleteQuestionById);
export const pollRouter: Router = router;

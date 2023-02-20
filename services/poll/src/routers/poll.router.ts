import express, { Router } from 'express';
import {
	createPoll,
	createQuestion,
	getAllPolls,
	getPollQuestions,
	deletePollById,
	getPollById,
} from '../controllers';

const router: Router = express.Router();

router.post('/', createPoll);
router.get('/', getAllPolls);
router.get('/:pollId', getPollById);
router.delete('/:pollId', deletePollById);

router.post('/questions', createQuestion);
router.get('/:pollId/questions', getPollQuestions);

export const pollRouter: Router = router;

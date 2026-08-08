import express from 'express';
import {
  getUserResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Guard all resume routes with auth check
router.use(protect);

router.get('/', getUserResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;

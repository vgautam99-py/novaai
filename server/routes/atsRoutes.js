import express from 'express';
import { checkATS, generateCoverLetter } from '../controllers/atsController.js';
import protect from '../middleware/authMiddleware.js';
import checkCredits from '../middleware/checkCredits.js';
import { memoryUpload } from '../config/multer.js';

const router = express.Router();

// All routes are protected and verify credits
router.use(protect);
router.use(checkCredits);

router.post('/check', memoryUpload.single('file'), checkATS);
router.post('/cover-letter', generateCoverLetter);

export default router;

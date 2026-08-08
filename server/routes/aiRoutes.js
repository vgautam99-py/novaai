import express from 'express';
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  resumeReview,
  getUserCreations,
  getPublishedCreations,
  toggleLikeCreation,
} from '../controllers/aiController.js';
import protect from '../middleware/authMiddleware.js';
import checkCredits from '../middleware/checkCredits.js';
import { upload, memoryUpload } from '../config/multer.js';

const router = express.Router();

// Public community feed
router.get('/published-creations', getPublishedCreations);

// Private creations & operations
router.get('/user-creations', protect, getUserCreations);
router.post('/toggle-like', protect, toggleLikeCreation);

// Private generative tools (require credit check)
router.post('/generate-article', protect, checkCredits, generateArticle);
router.post('/generate-blog-title', protect, checkCredits, generateBlogTitle);
router.post('/generate-image', protect, checkCredits, generateImage);
router.post('/remove-image-background', upload.single('image'), protect, checkCredits, removeImageBackground);
router.post('/resume-review', memoryUpload.single('resume'), protect, checkCredits, resumeReview);

export default router;

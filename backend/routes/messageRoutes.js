import express from 'express';
import MessageController from '../controllers/messageController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, MessageController.sendMessage)
router.get('/:chatId', protect, MessageController.allMessage)

export default router;
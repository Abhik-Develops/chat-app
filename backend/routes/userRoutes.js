import express from 'express';
import UserController from './../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',protect, UserController.allUsers)
router.post('/', UserController.registerUser);
router.get('/verify-email/:id/:token', UserController.userEmailVerify);
router.post('/login', UserController.authUser);
router.post('/send-password-reset-email', UserController.sendPasswordResetEmail);
router.post('/reset-password/:id/:token', UserController.userPasswordReset);
router.put('/update', protect, UserController.userProfileUpdate);
router.post('/change-password', protect, UserController.userPasswordChange);

export default router;
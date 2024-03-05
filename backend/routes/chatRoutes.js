import express from 'express'
import ChatController from './../controllers/chatController.js'
import protect from './../middleware/authMiddleware.js'

const router = express.Router();

router.get('/', protect, ChatController.fetchChat);
router.post('/', protect, ChatController.accessChat);
router.post('/group', protect, ChatController.createGroupChat);
router.put('/groupupdate', protect, ChatController.updateGroup);
router.put('/groupremove', protect, ChatController.removeFromGroup);
router.put('/groupadd', protect, ChatController.addToGroup);
router.put('/addgroupadmin', protect, ChatController.addGroupAdmin);
router.put('/removegroupadmin', protect, ChatController.removeGroupAdmin);


export default router;
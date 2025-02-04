import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { create, deletepost, getallposts, getposts, updatepost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getposts);
router.get('/getallposts', getallposts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.put('/update-post/:postId/:userId', verifyToken, updatepost);

export default router;
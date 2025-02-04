import express from "express";
import { deleteUser, getUser, getUserAccess, getusers, signout, test, updateUser, updateUserAccess } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getusers);
router.get('/:userId', getUser);
router.get('/getUserAccess/:userId', verifyToken, getUserAccess);
router.put('/updateUserAccess/:userId', verifyToken, updateUserAccess);

export default router;
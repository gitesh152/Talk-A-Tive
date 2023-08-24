import Express from "express";
const router = Express.Router()
import authenticate from "../middlewares/authMiddleware.js";
import { sendMessage, getAllMessages } from "../controllers/messageController.js";

router.route('/').post(authenticate, sendMessage);      //create a message using chatId and content
router.route('/:chatId').get(authenticate, getAllMessages); //fetch all messages per chatId

export default router;
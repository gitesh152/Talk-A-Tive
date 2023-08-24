import Express from "express";
const router = Express.Router()
import { login, signup, allUsers } from '../controllers/userController.js'
import authenticate from "../middlewares/authMiddleware.js";

router.route('/').get(authenticate, allUsers);
router.route('/login').post(login)
router.route('/signup').post(signup)

export default router;
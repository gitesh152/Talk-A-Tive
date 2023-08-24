import Express from "express";
const router = Express.Router()
import { allchats, createChat, accessChat, createGroupChat, renameGroupChat, addToGroup, removeFromGroup } from '../controllers/chatController.js'
import authenticate from "../middlewares/authMiddleware.js";
import chats from '../data/data.js'

// router.route('/allchats').get(async (req, res) => { res.send(chats) });     //get all chats from dummy data
router.route('/allchats').get(allchats);     //get all chats from database data
router.route('/').post(authenticate, createChat)    //create or fetch one to one chat
router.route('/').get(authenticate, accessChat)     //fetch a user's all chats

router.route('/group').post(authenticate, createGroupChat)  //create group chat
router.route('/grouprename').put(authenticate, renameGroupChat)     //rename group chat
router.route('/groupremove').put(authenticate, removeFromGroup)     //remove user from group chat
router.route('/groupadd').put(authenticate, addToGroup)             //add user to group chat


export default router;
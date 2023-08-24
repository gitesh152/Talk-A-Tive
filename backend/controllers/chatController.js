import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";

const allchats = asyncHandler(async (req, res) => {
    const allChats = await Chat.find();
    res.status(200).send(allChats);
})

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const createChat = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body
        if (!userId) {
            console.log('UserId not found in params');
            res.status(401)
            throw new Error('UserId not found in params')
        }
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        })
            .populate({ path: 'users', select: "-password" })
            .populate({ path: 'latestMessage', populate: { path: 'user', select: "-password" } })

        if (isChat.length > 0) {
            res.status(201)
            res.json(isChat[0])
        }
        else {
            var chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [req.user._id, userId]
            }
            const newChat = await Chat.create(chatData);
            const FullChat = await newChat.populate({ path: 'users', select: "-password" })
            res.status(201)
            res.send(FullChat)
        }
    }
    catch (error) {
        res.json({
            message: error.message,
            stack: error.stack
        })
    }
})

//@description     Fetch User's all Chats
//@route           GET /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
    try {
        const userAllChats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate({ path: 'users groupAdmin', select: '-password' })
            .populate({ path: 'latestMessage', populate: { path: 'sender', select: "-password" } })
            .sort({ updatedAt: -1 });
        res.status(200).send(userAllChats)
    }
    catch (error) {
        res.json({
            message: error.message,
            stack: error.stack
        })
    }
})

//@description     Create Chat Group
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            res.status(401)
            throw new Error('Please fill all fields!')
        }
        const users = JSON.parse(req.body.users);
        if (users.length < 2) {
            res.status(401)
            throw new Error('More than 2 users required for a group chat.')
        }
        users.push(req.user.id);
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users,
            isGroupChat: true,
            groupAdmin: req.user.id
        })
        const FullGroupChat = await groupChat
            .populate({ path: 'users groupAdmin', select: '-password' })
        res.status(200).json(FullGroupChat);
    }
    catch (error) {
        res.json({
            message: error.message,
            stack: error.stack
        })
    }
})

//@description     Rename Chat Group
//@route           PUT /api/chat/grouprename
//@access          Protected
const renameGroupChat = asyncHandler(async (req, res) => {
    try {
        const { chatId, chatName } = req.body
        const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true });
        const FullupdatedChat = await updatedChat
            .populate({ path: 'users groupAdmin', select: '-password' })
        // .populate({ path: 'latestMessage', populate: { path: 'user', select: "-password" } })

        res.status(201).send(FullupdatedChat)
    }
    catch (error) {
        res.json({
            message: error.message,
            stack: error.stack
        })
    }
})

//@description     Remove user from Chat Group
//@route           PUT /api/chat/groupremove
//@access          Protected
const removeFromGroup = asyncHandler(async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const updatedChat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true });
        if (updatedChat) {
            const FullupdatedChat = await updatedChat
                .populate({ path: 'users groupAdmin', select: '-password' })
            res.status(201).send(FullupdatedChat)
        } else {
            res.status(401)
            throw new Error('Chat not found!')
        }
    }
    catch (error) {
        res.json({
            message: error.message,
            stack: error.stack
        })
    }
})

//@description     Add user to Chat Group
//@route           PUT /api/chat/groupadd
//@access          Protected
const addToGroup = asyncHandler(async (req, res) => {
    try {
        const { chatId, userId } = req.body
        const updatedChat = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true });
        if (updatedChat) {
            const FullupdatedChat = await updatedChat
                .populate({ path: 'users groupAdmin', select: '-password' })
            res.status(201).send(FullupdatedChat)
        } else {
            res.status(401)
            throw new Error('Chat not found!')
        }
    }
    catch (error) {
        res.json({
            message: error.message,
            stack: error.stack
        })
    }
})

export { allchats, createChat, accessChat, createGroupChat, renameGroupChat, addToGroup, removeFromGroup }
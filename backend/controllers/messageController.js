import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";

const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { content, chatId } = req.body;
        if (!content || !chatId) {
            res.status(400);
            throw new Error('Invalid data passed to request .')
        }

        var newMessage = {
            sender: req.user._id,
            content,
            chat: chatId
        }
        var msg = await Message.create(newMessage);
        await Chat.findByIdAndUpdate(chatId, { latestMessage: msg._id });
        msg = await msg.populate({ path: 'sender', select: "-password" });
        msg = await msg.populate({ path: 'chat', populate: { path: 'users', select: "-password" } })
        //                           //or
        // msg = await msg.populate({ path: 'chat'})
        // msg = await msg.populate({ path: 'chat.users', select: "-password" })
        res.json(msg)
    }
    catch (e) {
        res.json({
            //Since Error constructor return enumerable properties
            message: e.message,
            stack: e.stack,
        });
    }
})

const getAllMessages = asyncHandler(async (req, res) => {
    try {
        var msg = await Message.find({ chat: req.params.chatId })
            .populate({ path: 'sender', select: "-password" })
            .populate({ path: 'chat', populate: { path: 'users', select: "-password" } })
        //                           //or
        // msg = await msg.populate({ path: 'chat'})
        // msg = await msg.populate({ path: 'chat.users', select: "-password" })
        res.json(msg)
    }
    catch (e) {
        res.json({
            //Since Error constructor return enumerable properties
            message: e.message,
            stack: e.stack,
        });
    }
})

export { sendMessage, getAllMessages }
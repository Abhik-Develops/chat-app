import asyncHandler from 'express-async-handler'
import MessageModel from './../models/MessageModel.js'
import UserModel from '../models/UserModel.js';
import ChatModel from '../models/ChatModel.js';

class MessageController{
    static sendMessage = asyncHandler(async (req, res) => {
        const {chatId, content} = req.body;
        if(!content || !chatId)
        {
            return res.status(400).send("Invalid data passed into request");
        }
        let newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId
        }
        try {
            let message = await MessageModel.create(newMessage);
            message = await message.populate("sender", "name pic");
            message = await message.populate("chat");
            message = await UserModel.populate(message, {
                path: 'chat.users',
                select: 'name pic email',
            });

            await ChatModel.findByIdAndUpdate(req.body.chatId, {
                latestMessage: message,
            });
            res.json(message);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    })
    static allMessage = asyncHandler( async (req, res) => {
        try {
            const messages = await MessageModel.find({chat:req.params.chatId}).populate("sender", "name pic email").populate("chat");
            res.json(messages);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    })
}

export default MessageController;
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    chatName: {type: String, trim: true},
    chatPic: {type: String, default: "https://icon-library.com/images/user-icon-png/user-icon-png-28.jpg"},
    chatDesc: {type: String, trim: true, default: ''},
    isGroupChat: {type: Boolean, default: false},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: "User",}],
    latestMessage: {type: mongoose.Schema.Types.ObjectId, ref: "Message",},
    groupAdmins: [{type: mongoose.Schema.Types.ObjectId, ref: "User",}],
},
{
    timestamps: true,
});

const ChatModel = mongoose.model('Chat', chatSchema);

export default ChatModel;
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider.jsx'
import { Box, IconButton, Typography, CircularProgress, FormControl, TextField, InputAdornment, Alert, Avatar, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { getSender, getSenderInfo } from '../../configs/ChatLogics.js'
import ProfileModal from '../miscellaneous/ProfileModal.jsx'
import GroupChatModal from '../miscellaneous/GroupChatModal.jsx';
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal.jsx';
import ScrollableChat from './ScrollableChat.jsx';
import axios from 'axios';
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from './../../animations/typing.json'

let socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const {user, selectedChat, setSelectedChat, notifications, setNotifications} = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnection, setSocketConnection] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })

    const fetchMessages = async () => {
        if(!selectedChat){
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            setLoading(true);
            const {data} = await axios.get(`${import.meta.env.VITE_ENDPOINT}/api/message/${selectedChat._id}`, config)
            setMessages(data);
            setLoading(false);
            socket.emit('joinchat', selectedChat._id);
        } catch (error) {
            setError({
                status: true,
                msg: 'Failed to load the messages',
                type: 'error',
            })
        }
    }

    const handleClick = () => {
        setSelectedChat("")
    }

    useEffect(() => {
        socket = io(import.meta.env.VITE_ENDPOINT);
        socket.emit("setup", user);
        socket.on('connected', () =>{
            setSocketConnection(true)
        } );
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));

    },[])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat])


    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id != newMessageReceived.chat._id){
                if(!notifications.includes(newMessageReceived)){
                    setNotifications([newMessageReceived, ...notifications]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else{
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    const sendMessage = async (e) => {
        if((e.key === 'Enter' || e.type === 'click') && newMessage){
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    }
                }
                setNewMessage("");
                const {data} = await axios.post(`${import.meta.env.VITE_ENDPOINT}/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);
                socket.emit('newmessage', data);
                setMessages([...messages, data]);
                setFetchAgain(!fetchAgain);
            } catch (error) {
                setError({
                    status: true,
                    msg: 'Failed to send the message',
                    type: 'error',
                })
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        // typing indicator
        if(!socketConnection){
            return;
        }
        if(!typing){
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(()=>{
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if(timeDiff >= timerLength && typing){
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength)
    }

  return (
    <>
        {
            selectedChat ? (
                <>
                    <Box sx={{pb: 3, width: '100%', display: 'flex', justifyContent: {xs: 'space-between'}, alignItems: 'center'}}>
                        <IconButton sx={{display: {xs: 'flex', md: 'none'}}} onClick={handleClick}>
                            <ArrowBackIcon/>
                        </IconButton>
                        {
                            !selectedChat.isGroupChat ? (
                                <>
                                    <ProfileModal user={getSenderInfo(user, selectedChat.users)}>
                                        <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                                            <Avatar alt={getSender(user, selectedChat.users)} src={getSenderInfo(user, selectedChat.users).pic} sx={{mr:2, size:'small', cursor: 'pointer'}}/>
                                            <Typography variant='h5' sx={{fontFamily: 'Wrok sans', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                {getSender(user, selectedChat.users)}
                                            </Typography>
                                        </Box>
                                    </ProfileModal>
                                    <ProfileModal user={getSenderInfo(user, selectedChat.users)}/>
                                </>
                            ) : (
                                <>
                                    <GroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
                                        <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                                            <Avatar alt={selectedChat.chatName} src={selectedChat.chatPic} sx={{mr:2, size:'small', cursor: 'pointer'}}/>
                                            <Typography variant='h5' sx={{fontFamily: 'Wrok sans', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                {selectedChat.chatName}
                                            </Typography>
                                        </Box>
                                    </GroupChatModal>
                                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                                </>
                            )
                        }
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3, background: '#E8E8E8', width: '100%', height: '100%', borderRadius: '10px', overflowY: 'hidden'}}>
                        {
                            loading ? <CircularProgress size={70} thickness={2} sx={{m:'auto', color:'black'}}/> : (
                                <div style={{display:'flex', flexDirection:'column', overflowY:'scroll', scrollbarWidth:'none'}}>
                                    <ScrollableChat messages={messages} />
                                </div>
                            )
                        }
                        <FormControl onKeyDown={sendMessage} required sx={{mt:3}}>
                        {
                            isTyping ? <Lottie options={defaultOptions} width={70} style={{marginBottom: 15, marginLeft: 0}}/> : <></>
                        }
                            <TextField sx={{bgcolor:'#E8E8E8', borderRadius: '5px'}} placeholder='Enter a message' onChange={typingHandler} value={newMessage} InputProps={{endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton edge="end" onClick={sendMessage}>
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            )}}/>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <Typography sx={{fontSize: '3xl', pb: 3, fontFamily: 'Work sans'}}>
                        Click on a user to start chatting
                    </Typography>
                </Box>
            )
        }
        {error.status ? <Alert severity={error.type} onClose={() => {setError({
            status: false,
            msg: error.msg,
            type: error.type,
        });}}>{error.msg}</Alert> : ''}
    </>
  )
}

export default SingleChat
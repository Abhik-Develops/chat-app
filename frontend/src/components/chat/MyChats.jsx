import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import { Box, Button, Stack, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatLoading from './ChatLoading';
import NewGroupChatModal from '../miscellaneous/NewGroupChatModal.jsx';
import axios from 'axios';
import ChatListItem from './ChatListItem.jsx';

const MyChats = ({fetchAgain}) => {
  const { user, selectedChat, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();
  const [loggedUser, setLoggedUser] = useState(user);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  })
  const fetchChat = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      const {data} = await axios.get(`${import.meta.env.VITE_ENDPOINT}/api/chat`, config);
      setChats(data)
    } catch (error) {
      setError({
        status: true,
        msg: 'Failed to load the chats',
        type: 'error',
      })
    }
  }

  const handleClick = (chat) => {
    setNotifications(notifications.filter((notification)=> notification.chat._id !== chat._id));
    setSelectedChat(chat)
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChat();
  },[fetchAgain])
  return (
    <Box sx={{display: {xs: selectedChat ? "none" : "flex", md: "flex"}, flexDirection: 'column', alignItems: 'center', p: 3, bgcolor: 'white', width: {xs:"100%", md:"31%"}, borderRadius: '10px', border: "1px"}}>
      <Box sx={{py: 3, fontSize: {xs:'28px', md:'30px'}, fontFamily: 'Work sans', display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
        <NewGroupChatModal>
          <Button variant='outlined' color='info' fullWidth startIcon=<AddIcon/> sx={{display: 'flex', fontSize: {xs: '17px', md: '17px', lg: '20px'}}}>
            New Group Chat
          </Button>
        </NewGroupChatModal>
      </Box>
      {error.status ? <Alert severity={error.type} onClose={() => {setError({
          status: false,
          msg: error.msg,
          type: error.type,
      });}}>{error.msg}</Alert> : ''}
      <Box sx={{display: 'flex', flexDirection: 'column', pb: 3, bgcolor: 'F8F8F8', width: '100%', h: '100%', borderRadius: '10px', overflowY: 'hidden'}}>
        {chats ? 
          <Stack sx={{overflowY: 'scroll', '::-webkit-scrollbar': {display: 'none'}}} spacing={2}>
            {chats.map((chat)=>{
              const notificationCount = notifications.reduce((count, notification) => {
                  if (notification.chat._id === chat._id) {
                      return count + 1;
                  }
                  return count;
              }, 0);
              return (
                <ChatListItem key={chat._id} chat={chat} handleFunction={handleClick} loggedUser={loggedUser} notificationCount={notificationCount}/>
              )})}
          </Stack>
        : <ChatLoading/>}
      </Box>
    </Box>
  )
}

export default MyChats
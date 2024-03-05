import React from 'react'
import { ChatState } from './../../context/ChatProvider.jsx'
import { Box } from '@mui/material'
import SingleChat from './SingleChat.jsx'

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const {selectedChat} = ChatState();
  return (
    <Box sx={{display:{xs: selectedChat ? 'flex' : 'none', md: 'flex'}, alignItems: 'center', flexDirection: 'column', p: 3, bgcolor: 'white', width: {xs: '100%', md: '68%'}, borderRadius: '10px', border: '1px'}}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox
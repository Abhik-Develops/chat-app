import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider.jsx'
import { Box } from '@mui/material'
import SideDrawer from '../components/miscellaneous/SideDrawer.jsx'
import MyChats from '../components/chat/MyChats.jsx'
import ChatBox from '../components/chat/ChatBox.jsx'

const Chat = () => {
  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width: "100%", backgroundColor:'lightblue'}}>
      {user && <SideDrawer/>}
      <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%', height: '91.5vh', padding: '10px'}}>
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default Chat
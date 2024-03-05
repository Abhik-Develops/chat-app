import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { formatTime, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../configs/ChatLogics'
import { ChatState } from '../../context/ChatProvider'
import { Avatar, Tooltip } from '@mui/material'

const ScrollableChat = ({messages}) => {
    const {user} = ChatState();
  return (
    <ScrollableFeed>
        {messages && messages.map((message, i) => {
            return (
                <div style={{display: 'flex'}} key={message._id}>
                {
                    (isSameSender(messages, message, i, user._id) || 
                    isLastMessage(messages, i, user._id)) && (
                    <Tooltip title={message.sender.name} arrow placement="bottom-start">
                        <Avatar alt={message.sender.name} src={message.sender.pic} sx={{ width: 32, height: 32, cursor: 'pointer' }}/>
                    </Tooltip>
                    )
                }
                    <span style={{backgroundColor: `${message.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`, borderRadius: '10px', padding: '5px 50px 5px 15px', maxWidth: '75%', marginLeft: isSameSenderMargin(messages, message, i, user._id), marginTop: isSameUser(messages, message, i, user._id) ? 3 : 10, wordWrap: 'break-word', position: 'relative'}}>
                        {
                            message.content
                        }
                        <span style={{position: 'absolute', right: 10, bottom: 1, fontSize: 8, color: 'grey'}}>{formatTime(message.updatedAt)}</span>
                    </span>
                </div>
            )
        })}
    </ScrollableFeed>
  )
}

export default ScrollableChat
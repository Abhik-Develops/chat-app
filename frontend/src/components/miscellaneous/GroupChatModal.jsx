import React, { useState } from 'react'
import { Box, IconButton, Typography, Dialog, DialogTitle, DialogContent, Divider, Stack, Alert } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import GroupUserListItem from '../user/GroupUserListItem';

const GroupChatModal = ({fetchAgain, setFetchAgain, children}) => {
    const { selectedChat, setSelectedChat, user} = ChatState(); 
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })
    const addAdmin = async (userToAdd) => {
        if(selectedChat.groupAdmins.find((u)=>u._id===userToAdd._id)){
            setError({
                status: true,
                msg: "User is already an admin of the group",
                type: 'warning',
            });
            return;
        }
        if(!selectedChat.groupAdmins.some((u)=>u._id===user._id)){
            setError({
                status: true,
                msg: "Only admins can add admin",
                type: 'warning',
            });
            return;
        }
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.put(`${import.meta.env.VITE_ENDPOINT}/api/chat/addgroupadmin`, {
                chatId: selectedChat._id,
                userId: userToAdd._id,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            setError({
                status: true,
                msg: error.message,
                type: 'error',
            })
        }
    }

    const removeAdmin = async (userToRemove) => {
        if(!selectedChat.groupAdmins.find((u)=>u._id===userToRemove._id)){
            setError({
                status: true,
                msg: "User is not an admin",
                type: 'warning',
            });
            return;
        }
        if(!selectedChat.groupAdmins.some((u)=>u._id===user._id)){
            setError({
                status: true,
                msg: "Only admins can remove admin",
                type: 'warning',
            });
            return;
        }
        if(selectedChat.groupAdmins[0]._id===userToRemove._id){
            setError({
                status: true,
                msg: "Creator of the group can not be removed",
                type: 'warning',
            });
            return;
        }
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.put(`${import.meta.env.VITE_ENDPOINT}/api/chat/removegroupadmin`, {
                chatId: selectedChat._id,
                userId: userToRemove._id,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            setError({
                status: true,
                msg: error.message,
                type: 'error',
            })
        }
    }

  return (
    <>
    {
        children ? <span style={{maxWidth: '100%', overflow: 'hidden'}} onClick={handleOpen}>{children}</span> : 
            <IconButton onClick={handleOpen}>
                <VisibilityIcon/>
            </IconButton>
    }
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{scrollbarWidth:'none'}}>
                <Box component="img" alt={selectedChat.chatName} src={selectedChat.chatPic} sx={{height: 'auto', maxHeight: 'calc(100vh - (100px + 150px))', width: '100%', maxWidth: '500px'}} />
                <Typography variant='h4' sx={{fontFamily:'Work sans', textAlign: 'center', overflow:'auto', scrollbarWidth: 'none'}}>{selectedChat.chatName}</Typography>
                <Divider sx={{my: 1}}/>
                <Typography variant='body2' sx={{fontFamily: 'Work sans', fontSize: {xs: '15px', md: '17px'}, textAlign: 'center', overflow: 'auto', scrollbarWidth: 'none'}}>{selectedChat.chatDesc}</Typography>
                <Divider sx={{my:1}}/>
                <Stack spacing={1} sx={{mb: 1}}>
                  {
                    selectedChat.users.map((u)=>{
                        return <GroupUserListItem key={u._id} u={u} admins={selectedChat.groupAdmins} isAdmin={selectedChat.groupAdmins.some(admin => admin._id === user._id)} addAdmin={addAdmin} removeAdmin={removeAdmin}></GroupUserListItem>
                    })
                  }
                </Stack>
                {error.status ? <Alert severity={error.type} onClose={() => {setError({
                            status: false,
                            msg: error.msg,
                            type: error.type,
                });}}>{error.msg}</Alert> : ''}
            </DialogContent>
        </Dialog>
    </>
  )
}

export default GroupChatModal
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Tooltip, Button, Typography, Alert, CircularProgress, Badge, IconButton, Menu, MenuItem, ListItemIcon, Divider, Avatar, Stack, TextField, InputAdornment, Drawer, FormControl} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Notifications, Settings, Logout, Search} from '@mui/icons-material';
import { ChatState } from '../../context/ChatProvider.jsx';
import ProfileModal from './ProfileModal.jsx';
import EditProfileModal from './EditProfileModal.jsx';
import CloseIcon from '@mui/icons-material/Close';
import ChatLoading from '../chat/ChatLoading.jsx'
import UserListItem from '../user/UserListItem.jsx';
import { getSender } from '../../configs/ChatLogics.js';
import axios from 'axios';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));
  

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const { user, setSelectedChat, chats, setChats, notifications, setNotifications } = ChatState();
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElNotifications, setAnchorElNotifications] = useState(null);
    const open = Boolean(anchorEl);
    const openNotifications = Boolean(anchorElNotifications);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClickNotifications = (event) => {
        setAnchorElNotifications(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseNotifications = () => {
        setAnchorElNotifications(null);
    };
    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    }
    const [openDrawer, setOpenDrawer] = useState(false);
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })
    const handleSearch = async (e) => {
        if(e.key === 'Enter' || e.type === 'click'){
            if(!search){
                setError({
                    status: true,
                    msg: 'Please enter something in search',
                    type: 'warning',
                })
                return;
            }
            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                };
                const {data} = await axios.get(`${import.meta.env.VITE_ENDPOINT}/api/user?search=${search}`, config)
                setLoading(false);
                setSearchResult(data);
            } catch (error) {
                setError({
                    status: true,
                    msg: 'Failed to load search results',
                    type: 'error',
                })
            }
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type":"application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.post(`${import.meta.env.VITE_ENDPOINT}/api/chat`, {userId}, config);
            if(!chats.find((c)=> c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setOpenDrawer(false);
        } catch (error) {
            setError({
                status: true,
                msg: 'Error fetching the chat',
                type: 'error',
            })
        }
    }

  return (
    <>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'white', width: '100%', p: "5px 10px 5px 10px", border: '5px'}}>
            <Tooltip title="Search Users to Chat" arrow placement="bottom-end">
                <Button onClick={() => setOpenDrawer(true)} startIcon=<Search/> sx={{color:'black'}}>
                    <Typography sx={{px:'4px', display: {xs: 'none', md: 'flex'}}}>
                        Search User
                    </Typography>
                </Button>
            </Tooltip>
            <Typography sx={{fontSize: 20, fontFamily: 'Work sans'}}>
                Quick Chat
            </Typography>
            <Box>
                <Tooltip title="Notifications" arrow>
                    <IconButton onClick={handleClickNotifications}>
                        <Badge badgeContent={notifications.length} max={99} color='error' overlap='circular'>
                            <Notifications/>
                        </Badge>
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorElNotifications} open={openNotifications} onClose={handleCloseNotifications} onClick={handleCloseNotifications}>
                        {
                            !notifications.length && 
                            <MenuItem>
                                No new messages
                            </MenuItem>
                        }
                        {
                            notifications.map((notification) => {
                                return (
                                    <MenuItem key={notification._id} onClick={()=>{
                                        setSelectedChat(notification.chat)
                                        setNotifications(notifications.filter((n)=>n !== notification))}}>
                                    {
                                        notification.chat.isGroupChat ? `New message from ${notification.chat.chatName}` : `New message from ${getSender(user, notification.chat.users)}`
                                    }
                                    </MenuItem>
                                )
                            })
                        }
                </Menu>
                <Tooltip title="Account settings" arrow>
                    <IconButton onClick={handleClick}>
                        <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                            <Avatar alt={user.name} src={user.pic} sx={{ width: 32, height: 32 }}/>
                        </StyledBadge>
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <ProfileModal user={user}>
                        <MenuItem>
                            <ListItemIcon>
                                <Avatar alt={user.name} src={user.pic} sx={{ width: 24, height: 24}}/>
                            </ListItemIcon>
                            My Profile
                        </MenuItem>
                    </ProfileModal>
                    <Divider sx={{my: 1}}/>
                    <EditProfileModal>
                        <MenuItem>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                    </EditProfileModal>
                    <MenuItem onClick={logoutHandler}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
        <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} PaperProps={{
            sx: { width: {md: '50%', sm: '70%', xs: '90%'}, scrollbarWidth: 'none'},
          }}>
            <Box sx={{m:3}}>
                <IconButton
                    aria-label="close Frawer"
                    onClick={() => setOpenDrawer(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                    >
                    <CloseIcon />
                </IconButton>
            </Box>
            <Typography sx={{textAlign:'center', fontFamily:'Work sans', fontSize:'30px'}}>Search Users</Typography>
            <FormControl onKeyDown={handleSearch}>
                <TextField
                label="Name or Email"
                aria-label='Search users'
                InputProps={{endAdornment: (
                    <InputAdornment position="end">
                        <IconButton edge="end" onClick={handleSearch}>
                            <Search />
                        </IconButton>
                    </InputAdornment>
                )}}
                onChange={(e)=>setSearch(e.target.value)}
                sx={{m:3}}
                />
            </FormControl>
            {error.status ? <Alert severity={error.type} onClose={() => {setError({
                    status: false,
                    msg: error.msg,
                    type: error.type,
                });}}>{error.msg}</Alert> : ''}
            {loading ? 
                <ChatLoading/>
            :
                <Stack spacing={2} sx={{mx:3}}>
                    {searchResult.map((user) => {
                        return <UserListItem key={user._id} user={user} handleFunction={()=>{accessChat(user._id)}}/>
                    })}
                </Stack>
            }
            {loadingChat && <CircularProgress thickness={2} sx={{mx: 'auto', color: 'black'}}/>}
      </Drawer>
    </>
  )
}

export default SideDrawer
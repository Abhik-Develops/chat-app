import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import { IconButton, Box, Alert, Stack, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, InputAdornment, Typography, Divider } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import PortraitIcon from '@mui/icons-material/Portrait'
import CloseIcon from '@mui/icons-material/Close';
import UserBadgeItem from '../user/UserBadgeItem';
import UserListItem from '../user/UserListItem';
import axios from 'axios';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages, children}) => {
    const { selectedChat, setSelectedChat, user} = ChatState();
    const [open, setOpen] = useState(false);
    const [pic, setPic] = useState('');
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loadingPic, setLoadingPic] = useState(false);
    const [loadingName, setLoadingName] = useState(false);
    const [loadingDesc, setLoadingDesc] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorPic, setErrorPic] = useState({
        status: false,
        msg: "",
        type: "",
    })
    const [errorName, setErrorName] = useState({
        status: false,
        msg: "",
        type: "",
    })
    const [errorDesc, setErrorDesc] = useState({
        status: false,
        msg: "",
        type: "",
    })
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setPic('');
        setName('');
        setDesc('');
        setSearchResult([]);
        setErrorPic({
            status: false,
            msg: "",
            type: "",
        })
        setErrorName({
            status: false,
            msg: "",
            type: "",
        })
        setErrorDesc({
            status: false,
            msg: "",
            type: "",
        })
        setError({
            status: false,
            msg: "",
            type: "",
        })
        setOpen(false);
    }
    const handlePic = (e) => {
        postDetails(e.target.files[0]);
    }
    const handleName = (e) => {
        setName(e.target.value);
    }
    const handleDesc = (e) => {
        setDesc(e.target.value);
    }
    const handleSubmitPic = async () => {
        setLoadingPic(true);
        if (!pic){
            setErrorPic({
                status: true,
                msg: "Please select an image",
                type: "warning",
            });
            setLoadingPic(false);
            return;
        }
        try {
            setLoadingPic(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.put(`${import.meta.env.VITE_ENDPOINT}/api/chat/groupupdate`, {
                chatId: selectedChat._id,
                chatPic: pic,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoadingPic(false);
            setPic('');
            setErrorPic({
                status: true,
                msg: "Group picture updated successfully",
                type: "success",
            });
        } catch (error) {
            setErrorPic({
                status: true,
                msg: error.response.data.message,
                type: 'error',
            })
            setLoadingPic(false);
        }
    }
    const postDetails = (pic) => {
        setLoadingPic(true);
        if(pic === undefined){
            setErrorPic({
                status: true,
                msg: "Please select an image",
                type: "warning",
            })
            setLoadingPic(false);
        }
        if(pic.type === "image/jpeg" || pic.type === "image/png"){
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dddpgqmd1");
            fetch(`${import.meta.env.VITE_IMAGE_UPLOAD_URL}`, {
                method: "post",
                body: data,
            })
            .then((res) => res.json())
            .then((data)=>{
                setPic(data.url.toString());
                setLoadingPic(false);
            })
            .then((err)=>{
                console.log(err);
                setLoadingPic(false);
            });
        }
        else{
            setError({
                status: true,
                msg: "Please select an image of jpeg or png type",
                type: "warning",
            })
            setLoadingPic(false);
        }
    }
    const handleSubmitName = async () => {
        setLoadingName(true);
        if(!name)
        {
            setErrorName({
                status: true,
                msg: "Please enter a name",
                type: 'warning',
            })
            setLoadingName(false);
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.put(`${import.meta.env.VITE_ENDPOINT}/api/chat/groupupdate`, {
                chatId: selectedChat._id,
                chatName: name,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoadingName(false);
            setName('');
            setErrorName({
                status: true,
                msg: "Group name updated successfully",
                type: 'success',
            })
        } catch (error) {
            setErrorName({
                status: true,
                msg: error.response.data.message,
                type: 'error',
            })
            setLoadingName(false);
        }
    }
    const handleSubmitDesc = async () => {
        setLoadingDesc(true);
        if(!desc)
        {
            setErrorDesc({
                status: true,
                msg: "Please write something",
                type: 'warning',
            })
            setLoadingDesc(false);
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.put(`${import.meta.env.VITE_ENDPOINT}/api/chat/groupupdate`, {
                chatId: selectedChat._id,
                chatDesc: desc,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoadingDesc(false);
            setDesc('');
            setErrorDesc({
                status: true,
                msg: "Group description updated successfully",
                type: 'success',
            })
        } catch (error) {
            setErrorDesc({
                status: true,
                msg: error.response.data.message,
                type: 'error',
            })
            setLoadingDesc(false);
        }
    }
    const handleSearch = async (query) => {
        setSearch(query)
        if(!query){
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
                msg: "Failed to load the search results",
                type: "error",
            })
            setLoading(false);
        }
    }
    const handleAddUser = async (userToAdd) => {
        if(selectedChat.users.find((u)=>u._id===userToAdd._id)){
            setError({
                status: true,
                msg: "User already in group",
                type: 'warning',
            });
            return;
        }
        if(!selectedChat.groupAdmins.some((u)=>u._id===user._id)){
            setError({
                status: true,
                msg: "Only admins can add someone",
                type: 'warning',
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.put(`${import.meta.env.VITE_ENDPOINT}/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: userToAdd._id,
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            setError({
                status: true,
                msg: error.message,
                type: 'error',
            })
            setLoading(false);
        }
    }
    const handleRemove = async (userToRemove) => {
        if(userToRemove._id !== user._id && !selectedChat.groupAdmins.some((u)=>u._id === user._id)){
            setError({
                status: true,
                msg: "Only admins can remove someone",
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
            const {data} = await axios.put(`${import.meta.env.VITE_ENDPOINT}/api/chat/groupremove`, {
                chatId: selectedChat._id,
                userId: userToRemove._id,
            }, config);
            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            setError({
                status: true,
                msg: error.message,
                type: 'error',
            })
            setLoading(false);
        }
    }
  return (
    <>
        {
            children ? <span onClick={handleOpen}>{children}</span> :
            <IconButton onClick={handleOpen} sx={{display:{xs:'flex'}}}>
                <VisibilityIcon/>
            </IconButton>
        }
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle variant='h4' sx={{fontFamily:'Work sans', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <SettingsIcon fontSize='inherit' sx={{mr:1}} /> Update Group
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
            <Divider/>
            <DialogContent sx={{scrollbarWidth: 'none'}}>
                <Stack spacing={2}>
                    <Box component="img" alt={selectedChat.chatName} src={pic ? pic : selectedChat.chatPic} sx={{height: 'auto', width: '100%', maxWidth: '500px'}} />
                    <TextField type='file' id="pic" name="pic" fullWidth label="Upload New Group Image" onChange={handlePic} InputProps={{startAdornment: <InputAdornment position="start"><PortraitIcon /></InputAdornment>, endAdornment: <InputAdornment position='end'><LoadingButton loading={loadingPic} variant='contained' disableElevation onClick={handleSubmitPic}>Save</LoadingButton></InputAdornment>}} inputProps={{accept: 'image/*'}}/>
                    {errorPic.status ? <Alert severity={errorPic.type} onClose={() => {setErrorPic({
                        status: false,
                        msg: errorPic.msg,
                        type: errorPic.type,
                    });}}>{errorPic.msg}</Alert> : ''}
                    <Typography variant='h4' sx={{fontFamily:'Work sans', textAlign:'center', whiteSpace: 'nowrap', overflow:'auto', scrollbarWidth: 'none'}}>{name ? name : selectedChat.chatName}</Typography>
                    <TextField id='name' name='name' label='Update Name' value={name} fullWidth onChange={handleName} InputProps={{endAdornment: <InputAdornment position='end'><LoadingButton loading={loadingName} variant='contained' disableElevation onClick={handleSubmitName}>Save</LoadingButton></InputAdornment>}}/>
                    {errorName.status ? <Alert severity={errorName.type} onClose={() => {setErrorName({
                        status: false,
                        msg: errorName.msg,
                        type: errorName.type,
                    });}}>{errorName.msg}</Alert> : ''}
                    <TextField id='desc' name='desc' label='Update Description' value={desc} fullWidth onChange={handleDesc} InputProps={{endAdornment: <InputAdornment position='end'><LoadingButton loading={loadingDesc} variant='contained' disableElevation onClick={handleSubmitDesc}>Save</LoadingButton></InputAdornment>}}/>
                    {errorDesc.status ? <Alert severity={errorDesc.type} onClose={() => {setErrorDesc({
                        status: false,
                        msg: errorDesc.msg,
                        type: errorDesc.type,
                    });}}>{errorDesc.msg}</Alert> : ''}
                    <TextField label="Add Users" value={search} onChange={(e)=>handleSearch(e.target.value)}/>
                    <Box sx={{display: selectedChat.users.length ? 'flex' : 'none', flexWrap: 'wrap'}}>
                        {
                            selectedChat.users.map((u)=>{
                                return <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)} />
                            })
                        }
                    </Box>
                    {loading ? (<CircularProgress />) : (
                        <Stack spacing={1}>
                            {
                                searchResult?.slice(0,4).map((user)=>{
                                    return <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}></UserListItem>
                                })
                            }
                        </Stack>
                    )}
                    {error.status ? <Alert severity={error.type} onClose={() => {setError({
                            status: false,
                            msg: error.msg,
                            type: error.type,
                    });}}>{error.msg}</Alert> : ''}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={()=>handleRemove(user)} color='error' disableElevation>Leave Chat</Button>
            </DialogActions>
        </Dialog>
    </>
  )
}

export default UpdateGroupChatModal
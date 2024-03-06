import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Divider, TextField, InputAdornment, Button, IconButton, Stack, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SettingsIcon from '@mui/icons-material/Settings';
import PortraitIcon from '@mui/icons-material/Portrait';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const EditProfileModal = ({children}) => {
    const { user, setUser } = ChatState();
    const [name, setName] = useState('');
    const [pic, setPic] = useState('');
    const [open, setOpen] = useState(false);
    const [loadingName, setLoadingName] = useState(false);
    const [loadingPic, setLoadingPic] = useState(false);
    const [errorName, setErrorName] = useState({
        status: false,
        msg: "",
        type: "",
    })
    const [errorPic, setErrorPic] = useState({
        status: false,
        msg: "",
        type: "",
    })
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCancel = () => {
        setName('');
        setErrorName({
            status: false,
            msg: "",
            type: "",
        })
        setPic('');
        setErrorPic({
            status: false,
            msg: "",
            type: "",
        })
        handleClose();
    }
    const handleName = (e) => {
        setName(e.target.value);
    }
    const handlePic = (e) => {
        postDetails(e.target.files[0]);
    }
    const handleSubmitName = async () => {
        setLoadingName(true);
        if (!name){
            setErrorName({
                status: true,
                msg: "Please enter a name",
                type: "warning",
            });
            setLoadingName(false);
            return;
        }
        if (name === user.name){
            setErrorName({
                status: true,
                msg: "Please enter a different name",
                type: "warning",
            });
            setLoadingName(false);
            return;
        }
        try {
            setLoadingName(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const { data } = await axios.put(`${import.meta.env.VITE_ENDPOINT}/api/user/update`, {
                userId: user._id,
                name: name,
            }, config);
            const newUser = {...data, token: user.token}
            localStorage.setItem('userInfo', JSON.stringify(newUser));
            setUser(newUser);
            setName('');
            setErrorName({
                status: true,
                msg: "Name updated successfully",
                type: "success",
            });
            setLoadingName(false);
        } catch (error) {
            setErrorName({
                status: true,
                msg: error.response.data.message,
                type: 'error',
            })
            setLoadingName(false);
        }
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
            const { data } = await axios.put(`${import.meta.env.VITE_ENDPOINT}/api/user/update`, {
                userId: user._id,
                pic: pic,
            }, config);
            const newUser = {...data, token: user.token}
            localStorage.setItem('userInfo', JSON.stringify(newUser));
            setUser(newUser);
            setPic('');
            setErrorPic({
                status: true,
                msg: "Profile picture updated successfully",
                type: "success",
            });
            setLoadingPic(false);
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
  return (
    <>
        <span onClick={handleOpen}>{children}</span>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle variant='h4' sx={{fontFamily:'Work sans', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <SettingsIcon fontSize='inherit' sx={{mr:1}} /> Edit Profile
                <IconButton
                    aria-label="close"
                    onClick={handleCancel}
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
            <DialogContent sx={{scrollbarWidth:'none'}}>
                <Stack spacing={2}>
                    <Typography variant='h4' sx={{fontFamily:'Work sans', textAlign:'center', whiteSpace: 'nowrap', overflow:'auto', scrollbarWidth: 'none'}}>{name ? name : user.name}</Typography>
                    <TextField id='name' name='name' label='New Name' value={name} fullWidth onChange={handleName} InputProps={{endAdornment: <InputAdornment position='end'><LoadingButton loading={loadingName} variant='contained' disableElevation onClick={handleSubmitName}>Save</LoadingButton></InputAdornment>}}/>
                    {errorName.status ? <Alert severity={errorName.type} onClose={() => {setErrorName({
                        status: false,
                        msg: errorName.msg,
                        type: errorName.type,
                    });}}>{errorName.msg}</Alert> : ''}
                    <Box component="img" alt={user.name} src={pic ? pic : user.pic} sx={{height: 'auto', maxHeight: {lg: '700px', md: '600px', sm: '500px', xs: '400px'}, width: '100%', maxWidth: '500px'}} />
                    <TextField type='file' id="pic" name="pic" fullWidth label="Upload New Image" onChange={handlePic} InputProps={{startAdornment: <InputAdornment position="start"><PortraitIcon /></InputAdornment>, endAdornment: <InputAdornment position='end'><LoadingButton loading={loadingPic} variant='contained' disableElevation onClick={handleSubmitPic}>Save</LoadingButton></InputAdornment>}} inputProps={{accept: 'image/*'}}/>
                    {errorPic.status ? <Alert severity={errorPic.type} onClose={() => {setErrorPic({
                        status: false,
                        msg: errorPic.msg,
                        type: errorPic.type,
                    });}}>{errorPic.msg}</Alert> : ''}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button href='/change-password' color='error' variant='contained' disableElevation>Change Password</Button>
            </DialogActions>
        </Dialog>
    </>
  )
}

export default EditProfileModal
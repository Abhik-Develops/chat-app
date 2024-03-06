import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import { Stack, TextField, Box, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import UserListItem from '../user/UserListItem';
import UserBadgeItem from '../user/UserBadgeItem';
import axios from 'axios';


const NewGroupChatModal = ({children}) => {
  const {user, chats, setChats} = ChatState();
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [error, setError] = useState({
    status: false,
    msg: "",
    type: "",
  })

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setGroupChatName('');
    setSelectedUsers([]);
    setSearch('');
    setSearchResult();
    setError({
      status: false,
      msg: "",
      type: "",
    })
    setOpen(false);
  } 
  const handleSearch = async (query) => {
    setSearch(query);
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
  const handleGroup = (userToAdd) => {
      if(selectedUsers.find((u)=>u._id===userToAdd._id)){
          setError({
              status: true,
              msg: "User already added",
              type: 'warning',
          });
          return;
      }
      setSelectedUsers([...selectedUsers, userToAdd])
  }
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel)=>sel._id !== delUser._id))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    if(!groupChatName || !selectedUsers){
      setError({
        status: true,
        msg: "Please fill all the fields",
        type: 'warning',
      })
      setNameLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      const {data} = await axios.post(`${import.meta.env.VITE_ENDPOINT}/api/chat/group`, {name: groupChatName, users: JSON.stringify(selectedUsers.map((u)=> u._id)),}, config);
      setChats([data, ...chats]);
      setError({
        status: true,
        msg: "New Group Chat created",
        type: "success",
      })
      setNameLoading(false);
      handleClose();
    } catch (error) {
      setError({
        status: true,
        msg: error.response.data.message,
        type: "error",
      })
      setNameLoading(false);
    }
  }
  return (
    <>
      <span onClick={handleOpen} style={{width: '100%'}}>{children}</span>
      <Dialog
        open={open}
        onClose={handleClose}
        id='new-group-form'
        PaperProps={{
          component: 'form',
          noValidate: true,
          onSubmit: handleSubmit,
        }}
        fullWidth
      >
        <DialogTitle sx={{fontFamily:'Work sans', textAlign: 'center'}}>
          Create New Group Chat
        </DialogTitle>
        <DialogContent sx={{scrollbarWidth: 'none'}}>
        <Stack spacing={2} sx={{mt:1}}>
            <TextField autoFocus required label="Chat Name" value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
            <TextField label="Add Users" value={search} onChange={(e)=>handleSearch(e.target.value)}/>
            <Box sx={{display: selectedUsers.length ? 'flex' : 'none', flexWrap: 'wrap'}}>
              {selectedUsers.map((u)=>{
                return <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)} />
              })}
            </Box>
            {loading ? (
              <Stack sx={{alignItems: 'center'}}>
                <CircularProgress/>
              </Stack>
              ) : (
              <Stack spacing={1}>
                  {
                      searchResult?.slice(0,4).map((user)=>{
                          return <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}></UserListItem>
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
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton variant='contained' type="submit" loading={nameLoading} disableElevation>
            Create
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NewGroupChatModal
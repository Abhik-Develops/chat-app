import React from 'react'
import { Avatar, Box, Button, Typography } from '@mui/material';
import { ChatState } from '../../context/ChatProvider';
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close';
import ProfileModal from '../miscellaneous/ProfileModal'
import ChatProfileModal from '../miscellaneous/ChatProfileModal';

const GroupUserListItem = ({u, handleFunction, admins, isAdmin, addAdmin, removeAdmin}) => {
    const { user } = ChatState();
    const isUserAdmin = admins ? admins.some(admin => admin._id === u._id) : false;
  return ( 
    <Box onClick={handleFunction} sx={{bgcolor: "#E8E8E8", cursor: 'pointer', "&:hover":{backgroundColor: '#38B2AC', color: 'white'}, width: '100%', display: 'flex', alignItems: 'center', color: 'black', px:3, py:2, mx:'auto', borderRadius:'10px'}}>
        <ChatProfileModal name={u.name} pic={u.pic}><Avatar sx={{mr:2, cursor: 'pointer'}} name={u.name} src={u.pic}/></ChatProfileModal>
        <ProfileModal user={u}>
          <Box sx={{flex: 1, overflow: 'hidden'}}>
              <Typography sx={{width: '90%', whiteSpace: 'nowrap', overflow: 'scroll', scrollbarWidth: 'none'}}>{u.name}</Typography>
              <Typography sx={{fontSize: 'small', width: '90%', whiteSpace: 'nowrap', overflow: 'scroll', scrollbarWidth: 'none'}} ><b>{u.email}</b></Typography>
          </Box>
        </ProfileModal>
        {isAdmin ? isUserAdmin ? <Button size='small' variant='contained' color='error' startIcon={<CloseIcon/>} disabled={u._id===user._id} disableElevation onClick={()=>removeAdmin(u)}>Admin</Button> 
        : <Button size='small' variant='contained' startIcon={<AddIcon/>} disableElevation onClick={()=>addAdmin(u)}>Admin</Button>
        : isUserAdmin ? <Button size='small' variant='contained' disabled={true} disableElevation>Admin</Button>
        : ''}
    </Box>
  )
}

export default GroupUserListItem
import React from 'react'
import { Avatar, Box, Typography } from '@mui/material';

const UserListItem = ({user, handleFunction}) => {
  return ( 
    <Box onClick={handleFunction} sx={{bgcolor: "#E8E8E8", cursor: 'pointer', "&:hover":{backgroundColor: '#38B2AC', color: 'white'}, width: '100%', display: 'flex', alignItems: 'center', color: 'black', px:3, py:2, mx:'auto', borderRadius:'10px'}}>
        <Avatar sx={{mr:2, cursor: 'pointer', justifySelf: 'flex-start'}} name={user.name} src={user.pic}/>
        <Box sx={{flex: 'auto', overflow: 'hidden'}}>
            <Typography sx={{width: '100%', whiteSpace: 'nowrap', overflow: 'scroll', scrollbarWidth: 'none'}}>{user.name}</Typography>
            <Typography sx={{fontSize: 'small', width: '100%', whiteSpace: 'nowrap', overflow: 'scroll', scrollbarWidth: 'none'}} ><b>{user.email}</b></Typography>
        </Box>
    </Box>
  )
}

export default UserListItem
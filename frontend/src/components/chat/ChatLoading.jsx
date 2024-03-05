import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const ChatLoading = () => {
  return (
    <Stack spacing={2} sx={{mx: 3}}>
        <Skeleton animation="wave" variant="rectangular" height={75.5} sx={{borderRadius:'10px', width: '100%'}}/>
        <Skeleton animation="wave" variant="rectangular" height={75.5} sx={{borderRadius:'10px', width: '100%'}}/>
        <Skeleton animation="wave" variant="rectangular" height={75.5} sx={{borderRadius:'10px', width: '100%'}}/>
        <Skeleton animation="wave" variant="rectangular" height={75.5} sx={{borderRadius:'10px', width: '100%'}}/>
        <Skeleton animation="wave" variant="rectangular" height={75.5} sx={{borderRadius:'10px', width: '100%'}}/>
        <Skeleton animation="wave" variant="rectangular" height={75.5} sx={{borderRadius:'10px', width: '100%'}}/>
        <Skeleton animation="wave" variant="rectangular" height={75.5} sx={{borderRadius:'10px', width: '100%'}}/>
    </Stack>
  )
}

export default ChatLoading
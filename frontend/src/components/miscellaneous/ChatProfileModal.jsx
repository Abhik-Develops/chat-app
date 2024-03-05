import React, { useState } from 'react'
import { Box, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ChatProfileModal = ({name, pic, children}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
    <>
        <span onClick={handleOpen}>{children}</span>
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
            <DialogContent>
                <Box component="img" alt={name} src={pic} sx={{height: 'auto', width: '100%', maxWidth: '500px'}}/>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default ChatProfileModal;
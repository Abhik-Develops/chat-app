import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Box, Alert, Typography, Card } from "@mui/material";
import { LoadingButton } from '@mui/lab'
import axios from "axios";

const SendPasswordResetEmail = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })

    const handleEmail = (e) => setEmail(e.target.value);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        if (!email){
            setError({status:true, msg: "Please Provide Valid Email", type: "error"})
            setLoading(false);
            return;
        }
        const config = {
            headers: {
                "Content-type": "application/json"
            }                
        }
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_ENDPOINT}/api/user/send-password-reset-email`,{email}, config);
            setEmail('');
            setLoading(false);
            setError({status:true, msg: "Password reset link sent to your email. Redirecting to login page...", type: "success"})
            setTimeout(()=>{navigate('/')}, 5000);
        } catch (error) {
            setLoading(false);
            setError({status:true, msg: error.response.data.message, type: "error"})
        }
    }

  return (
    <>
        <Grid container sx={{alignItems: "center", justifyContent: "center" ,height:'100vh', bgcolor: 'lightblue'}}>
            <Grid item sx={{width: '100%'}}>
                <Card sx={{width: {xs: '90%'}, maxWidth: 500, height: "100%", mx: 'auto'}}>
                    <Box sx={{m: 3}}>
                        <Box>
                            <Typography variant="h5" align="center" color='secondary'>Reset Password</Typography>
                        </Box>
                        <Box component='form' noValidate sx={{mt:1}} id="password-reset-form" onSubmit={handleSubmit}>
                            <TextField margin='normal' required autoFocus fullWidth id='email' name='email' label='Email Address' value={email} onChange={handleEmail}/>
                            <Box textAlign='center'>
                                <LoadingButton type='submit' variant='contained' sx={{mt:3, mb:2, px:5}} loading={loading}>Send</LoadingButton>
                            </Box>
                            {error.status ? <Alert severity={error.type} onClose={() => {setError({
                                status: false,
                                msg: error.msg,
                                type: error.type,
                            });}}>{error.msg}</Alert> : ''}
                        </Box>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    </>
  )
}

export default SendPasswordResetEmail
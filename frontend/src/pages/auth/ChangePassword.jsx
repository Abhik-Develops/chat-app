import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import { Grid, Card, Typography, Box, Alert } from "@mui/material";
import PasswordInput from "../../components/input/PasswordInput";
import axios from 'axios'

function ChangePassword() {
    const navigate = useNavigate();
    const {user} = ChatState();
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })

    const handlePassword = (e) => setPassword(e.target.value);
    const handleConfirmpassword = (e) => setConfirmpassword(e.target.value);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!password || !confirmpassword){
            setError({
                status: true,
                msg: "Please fill all the fields",
                type: "warning",
            });
            return;
        }
        if(password !== confirmpassword){
            setError({
                status: true,
                msg: "Password and Confirm Password does not match",
                type: "warning",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-type": "application/json",
                }
            };
            const {data} = await axios.post(`${import.meta.env.VITE_ENDPOINT}/api/user/change-password`, {
                userId: user._id,
                password: password,
                confirmpassword: confirmpassword,
            }, config);
            setPassword('');
            setConfirmpassword('');
            setLoading(false);
            setError({status:true, msg: "Password changed Sucessfully. Redirecting to chats Page...", type: "success"})
            setTimeout(()=>navigate('/chats'), 1000);   
        } catch (error) {
            setError({
                status: true,
                msg: error.response.data.message,
                type: 'error',
            })
            setLoading(false);
        }
    }

  return (
    <>
        <Grid container sx={{alignItems: "center", justifyContent: "center", height:'100vh', bgcolor: 'lightblue'}}>
            <Grid item>
                <Card sx={{width: {xs: '90%'}, maxWidth: 500, height: "100%", mx: 'auto'}}>
                    <Box sx={{m:3}}>
                        <Box>
                            <Typography variant="h5" align="center" color='secondary'>CHANGE PASSWORD</Typography>
                        </Box>
                        <Box component='form' noValidate sx={{mt:1}} id="password-change-form" onSubmit={handleSubmit}>
                            <PasswordInput id='password' name='password' label='Password' value={password} handlePassword={handlePassword}/>
                            <PasswordInput id='confirmpassword' name='confirmpassword' label='Confirm Password' value={confirmpassword} handlePassword={handleConfirmpassword}/>
                            <Box textAlign='center'>
                                <LoadingButton type='submit' variant='contained' sx={{mt:3, mb:2, px:5}} loading={loading}>Save</LoadingButton>
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

export default ChangePassword
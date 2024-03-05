import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography, Box, Alert, Card } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import PasswordInput from "../../components/input/PasswordInput";
import axios from "axios";

function ResetPassword() {
    const {id, token} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })

    const handlePassword = (e) => setPassword(e.target.value);
    const handleConfirmpassword = (e) => setConfirmpassword(e.target.value);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        if (!password || !confirmpassword){
            setError({
                status: true,
                msg: "Please fill all the fields",
                type: "warning",
            });
            setLoading(false);
            return;
        }
        if(password !== confirmpassword){
            setError({
                status: true,
                msg: "Password and Confirm Password does not match",
                type: "warning",
            });
            setLoading(false);
            return;
        }
        const config = {
            headers: {
                "Content-type": "application/json"
            }                
        }
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_ENDPOINT}/api/user/reset-password/${id}/${token}`,{password, confirmpassword}, config);
            setPassword('');
            setConfirmpassword('');
            setLoading(false);
            setError({status:true, msg: "Password Reset Sucessfully. Redirecting to Login Page...", type: "success"})
            setTimeout(()=>navigate('/'), 1000);
        } catch (error) {
            setLoading(false);
            setError({status:true, msg: error.response.data.message, type: "error"})
        }
    }

  return (
    <>
        <Grid container sx={{alignItems: "center", justifyContent: "center", height:'100vh', bgcolor: 'lightblue'}}>
            <Grid item>
                <Card sx={{width: {xs: '90%'}, maxWidth: 500, height: "100%", mx: 'auto'}}>
                    <Box sx={{m: 3}}>
                        <Box>
                            <Typography variant="h5" align="center" color='secondary'>Reset Password</Typography>
                        </Box>
                        <Box component='form' noValidate sx={{mt:1}} id="password-reset-email-form" onSubmit={handleSubmit}>
                            <PasswordInput id='password' name='password' label='New Password' value={password} handlePassword={handlePassword}/>
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

export default ResetPassword
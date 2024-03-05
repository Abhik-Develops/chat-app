import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { TextField, Box, Alert, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import PasswordInput from "../input/PasswordInput";
import axios from "axios";


const UserLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })

    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email || !password){
            setError({
                status: true,
                msg: "Please fill all the fields",
                type: "warning",
            });
            setLoading(false);
            return;
        }
        try{
            const config = {
                headers: {
                    "Content-type": "application/json"
                }                
            }
            const {data} = await axios.post(`${import.meta.env.VITE_ENDPOINT}/api/user/login`,{email, password}, config);
            setEmail('');
            setPassword('');
            setError({
                status: true,
                msg: "Login Successful. Redirecting to chats page...",
                type: "success",
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            setTimeout(()=>navigate('/chats'), 1000);
        }   
        catch(err){
            setError({
                status: true,
                msg: err.response.data.message,
                type: "error",
            });
            setLoading(false);
        }
    }
    const handleClick = () => {
        setEmail(import.meta.env.VITE_GUEST_EMAIL);
        setPassword(import.meta.env.VITE_GUEST_PASS);
    }

  return (
    <>
        <Box component='form' noValidate sx={{mt:1}} id="login-form" onSubmit={handleSubmit}>
            <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' value={email} onChange={handleEmail}/>
            <PasswordInput id='password' name='password' label='Password' value={password} handlePassword={handlePassword}/>
            <Box display='flex' justifyContent='space-around'>
                <Button type='button' variant='contained' sx={{mt:3, mb:2, px:5}} color="error" onClick={handleClick}>Guest</Button>
                <LoadingButton type='submit' variant='contained' sx={{mt:3, mb:2, px:5}} loading={loading}>Login</LoadingButton>
            </Box>
            <NavLink to='/sendpasswordresetemail'>Forgot Password?</NavLink>
            
            {error.status ? <Alert severity={error.type} sx={{mt: 1.5}} onClose={() => {setError({
                status: false,
                msg: error.msg,
                type: error.type,
            });}}>{error.msg}</Alert> : ''}
        </Box>
    </>
  )
}

export default UserLogin
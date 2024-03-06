import { useState } from "react";
import { TextField, Box, Alert, InputAdornment } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import PasswordInput from "../input/PasswordInput";
import PortraitIcon from '@mui/icons-material/Portrait';
import axios from 'axios'

const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })

    const handleName = (e) => setName(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleConfirmpassword = (e) => setConfirmpassword(e.target.value);
    const handlePic = (e) => postDetails(e.target.files[0]);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        if (!name || !email || !password || !confirmpassword){
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

        try{
            const config = {
                headers: {
                    "Content-type": "application/json"
                }                
            }
            const {data} = await axios.post(`${import.meta.env.VITE_ENDPOINT}/api/user`,{name, email, password, confirmpassword, pic}, config);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmpassword('');
            setError({
                status: true,
                msg: "Verification link sent to your email. Please verify your email.",
                type: "success",
            });
            setLoading(false);
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

    const postDetails = (pic) => {
        setLoading(true);
        if(pic === undefined){
            setError({
                status: true,
                msg: "Please select an image",
                type: "warning",
            })
            setLoading(false);
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
                setLoading(false);
            })
            .then((err)=>{
                setLoading(false);
            });
        }
        else{
            setError({
                status: true,
                msg: "Please select an image of jpeg or png type",
                type: "warning",
            })
            setLoading(false);
        }
    }

  return (
    <>
        <Box component='form' noValidate sx={{mt:1}} id="registration-form" onSubmit={handleSubmit}>
            <TextField margin='normal' required fullWidth id='name' name='name' label='Name' value={name} onChange={handleName}/>
            <TextField margin='normal' type='email' required fullWidth id='email' name='email' label='Email Address' value={email} onChange={handleEmail} />
            <PasswordInput id='password' name='password' label='Password' value={password} handlePassword={handlePassword}/>
            <PasswordInput id='confirmpassword' name='confirmpassword' label='Confirm Password' value={confirmpassword} handlePassword={handleConfirmpassword}/>
            <TextField type='file' margin="normal" id="pic" name="pic" fullWidth label="Upload Image" onChange={handlePic} InputProps={{startAdornment: <InputAdornment position="start"><PortraitIcon /></InputAdornment>}} inputProps={{accept: 'image/*'}}/>
            <Box textAlign='center'>
                <LoadingButton type='submit' variant='contained' sx={{mt:3, mb:2, px:5}} loading={loading}>Register</LoadingButton>
            </Box>
            {error.status ? <Alert severity={error.type} onClose={() => {setError({
                status: false,
                msg: error.msg,
                type: error.type,
            });}}>{error.msg}</Alert> : ''}
        </Box>
    </>
  )
}

export default Registration;
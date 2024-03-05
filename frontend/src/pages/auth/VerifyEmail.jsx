import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography, Box, Alert, Card } from "@mui/material";
import axios from "axios";

function VerifyEmail() {
    const {id, token} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState({
        status: false,
        msg: "",
        type: "",
    })

    useEffect(() =>{
        const verifyAndFetch = async ()=>{
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_ENDPOINT}/api/user/verify-email/${id}/${token}`);
                setError({status:true, msg: "Email verified sucessfully. Redirecting to chats Page...", type: "success"})
                localStorage.setItem('userInfo', JSON.stringify(data));
                setTimeout(()=>navigate('/chats'), 2000);
            } catch (error) {
                setError({status:true, msg: error.response.data.message, type: "error"})
            }
        }
        verifyAndFetch();
    },[])

  return (
    <>
        <Grid container sx={{alignItems: "center", justifyContent: "center", height:'100vh', bgcolor: 'lightblue'}}>
            <Grid item>
                <Card sx={{width: {xs: '90%'}, maxWidth: 500, height: "100%"}}>
                    <Box sx={{m:3}}>
                        <Box>
                            <Typography variant="h5" align="center" color='secondary'>Email Verification</Typography>
                        </Box>
                        <Box sx={{mt:1}}>
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

export default VerifyEmail
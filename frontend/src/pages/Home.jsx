import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Grid, Card, Tabs, Tab, Box } from '@mui/material'
import UserLogin from './../components/auth/UserLogin.jsx';
import Registration from './../components/auth/Registration.jsx';

const Tabpanel = ({children, value, index}) =>{
  return (
    <div role='tabpanel' hidden={value !== index}>
    {
      value ===index && (
        <Box>{children}</Box>
      )
    }
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user) navigate('/chats');
  },[navigate])
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) =>{
    setValue(newValue);
  }
  return (
    <>
      <Grid container sx={{alignItems: "center", justifyContent: "center", height: '100vh', backgroundColor:'lightblue'}}>
        <Grid item>
          <Card sx={{width: {xs: '90%'}, maxWidth: 500, height: "100%", mx: 'auto'}}>
            <Box sx={{m: 3}}>
              <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} variant="fullWidth" textColor='secondary' indicatorColor='secondary' onChange={handleChange}>
                  <Tab label='Login' sx={{textTransform:'none', fontWeight:'bold'}}></Tab>
                  <Tab label='Registration' sx={{textTransform:'none', fontWeight:'bold'}}></Tab>
                </Tabs>
              </Box>
              <Tabpanel value={value} index={0}><UserLogin/></Tabpanel>
              <Tabpanel value={value} index={1}><Registration/></Tabpanel>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Home
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import useLocalStorage from './../../hooks/useLocalStorage';

import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../context/basicAuthContext';

export default function Logout() {
  const navigate = useNavigate();
  const auth = useAuth();

  React.useEffect(() => {
    setTimeout(async () => {
      await auth.signout(); // Wipe data from local storage
      navigate(`/login`);
    }, 1337);
  }, [navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1 }}>
          <LogoutOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Logging you out...
        </Typography>
        <Box sx={{ marginTop: '1rem', display: 'flex' }}>
          <CircularProgress color="inherit" />
        </Box>
      </Box>
    </Container>
  );
}

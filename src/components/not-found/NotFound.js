import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

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
          <ErrorOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          404 page not found...
        </Typography>
        <Box sx={{ marginTop: '1rem', display: 'flex' }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              navigate('/');
            }}
          >
            GO BACK
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

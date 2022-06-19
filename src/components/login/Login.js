import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../context/basicAuthContext';

export default function Login() {
  const [loading, setLoading] = React.useState(false);
  const [rememberInThisBrowser, setRememberInThisBrowser] =
    React.useState(true);

  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  // const [showInvalidTokenError, setShowInvalidTokenError] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const _handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const isGood = await auth.verifySession(data.get('token'));
    if (isGood) {
      await auth.signin(data.get('token'), rememberInThisBrowser);
      navigate(`/`);
    } else {
      setLoading(false);
    }
  };

  const _handleRememberInThisBrowserChange = async (event) => {
    setRememberInThisBrowser(!rememberInThisBrowser);
  };

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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={_handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            name="token"
            label="Enter admin-secret"
            type={showPassword ? 'text' : 'password'}
            id="token"
            autoComplete="current-token"
            defaultValue={auth.getToken()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    //onClick={handleClickShowPassword}
                    //onMouseUp={handleMouseDownPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberInThisBrowser}
                value="remember"
                color="primary"
                onChange={_handleRememberInThisBrowserChange}
              />
            }
            label="Remember in this browser"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={25} color="inherit" /> : 'ENTER'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                href={process.env.REACT_APP_CONSOLE_DOCS_URL}
                variant="body2"
              >
                How to set admin secret?
              </Link>
            </Grid>
            <Grid item>
              <Link
                href={process.env.REACT_APP_CONSOLE_HELP_URL}
                variant="body2"
              >
                {'What is this? Help'}
              </Link>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: '2rem' }} />
          <Grid container>
            <Grid item xs sx={{ padding: '1rem' }}>
              <Typography
                align="center"
                component="h6"
                variant="inherit"
                color="text.disabled"
                sx={{ fontWeight: '200' }}
              >
                {process.env.REACT_APP_VERSION}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

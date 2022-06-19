import React from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Fab from '@mui/material/Fab';
import RefreshIcon from '@mui/icons-material/Refresh';

import TopBar from './../components/top-bar';
import ConsoleEditor from './../components/editor/Editor';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import useLocalStorage from './../hooks/useLocalStorage';

import AnsiUp from 'ansi_up';

import { useAuth } from './../context/basicAuthContext';

const StyledPreCodeTag = styled('pre')(
  ({ theme }) => `
  background-color: #000;
  color: #FFF;
  overflow-y: auto;
  padding: 0;
  height: 30vh;
  display: block;
  margin: 0;
  font-size: 15px;
`
);

function Home() {
  const { get, post, response, loading, error } = useFetch();
  const [logs, setLogs] = React.useState('');
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  const codeRef = React.useRef(null);

  const auth = useAuth();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const executeScroll = () => {
    if (codeRef?.current) {
      codeRef.current.scrollTop = codeRef?.current?.scrollHeight;
    }
  };

  const getLogs = async () => {
    // Do things...
    const results = await get('/console/api/v1/logs?type=text');
    if (response.ok) {
      // toast.success('yeey');
      const ansi_up = new AnsiUp();
      const html = ansi_up.ansi_to_html(results);
      setLogs(html);
    }
  };

  React.useEffect(() => {
    getLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (error) {
      toast.error('Request errored out...');
      setLogs(JSON.stringify(response.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  React.useEffect(() => {
    autoScroll && executeScroll();
  });

  const _handleSwitchChange = (event) => {
    setAutoScroll(!autoScroll);
  };

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <TextField
          margin="normal"
          required
          disabled
          fullWidth
          name="token"
          label="Admin-secret"
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

        <iframe
          src={`${process.env.REACT_APP_API_PREFIX}/console/docs`}
          id="myPortalToSwagger"
          className="myClassname"
          display="initial"
          position="relative"
          style={{
            border: 'none',
            width: 'inherit',
            height: '700px',
            paddingTop: '2rem',
            paddingBottom: '2rem',
          }}
        />

        <StyledPreCodeTag
          ref={codeRef}
          dangerouslySetInnerHTML={{ __html: loading ? 'Loading...' : logs }}
        ></StyledPreCodeTag>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                color="warning"
                checked={autoScroll}
                onChange={_handleSwitchChange}
              />
            }
            label="Auto scroll to bottom."
          />
        </FormGroup>
        <Divider
          style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
        ></Divider>
        <Box
          sx={{
            marginTop: 2,
            marginBottom: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h3" variant="h6">
            Roadmap for next release:
          </Typography>
          <List>
            {[
              '- Add visual studio code for web as the editor for the files.',
              '- Implement PM2 to handle reloading for zero downtime.',
              '- Home screen should support console and file viewer at the same time.',
              '- Force users to handle API errors, and edge cases by providing a solution for managing errors.',
              '- Tab complete in the shell',
            ].map((item) => (
              <ListItem key={item}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
      <Fab
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
        }}
        color="secondary"
        aria-label="Refresh"
        onClick={() => {
          getLogs();
        }}
      >
        <RefreshIcon />
      </Fab>
    </>
  );
}

export default Home;

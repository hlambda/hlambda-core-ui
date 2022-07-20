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
import CopyToClipboard from './../components/copy-to-clipboard/CopyToClipboard';

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
  const [showSecretInCommand, setShowSecretInCommand] = React.useState(false);
  const [timestampOnRender, setTimestampOnRender] = React.useState(Date.now());

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

  const generateCloneCommand = (showSecret) => {
    const url = `${window.location.protocol}//${window.location.hostname}${
      window.location.port === '80' ? '' : `:${window.location.port}`
    }`;
    return showSecret
      ? `hl clone ${`hlapp${timestampOnRender}`} --admin-secret="${auth.getToken()}" ${url}`
      : `hl clone ${`hlapp${timestampOnRender}`} --admin-secret="*********" ${url}`;
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
                <CopyToClipboard
                  aria-label="copy admin secret"
                  textToCopy={auth.getToken()}
                />
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
        <TextField
          margin="normal"
          required
          disabled
          fullWidth
          name="clone-command"
          label="Clone server metadata"
          type={'text'}
          id="clone-command"
          autoComplete="clone-command"
          value={
            showSecretInCommand
              ? generateCloneCommand(true)
              : generateCloneCommand(false)
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CopyToClipboard
                  aria-label="copy clone command"
                  textToCopy={generateCloneCommand(true)}
                />
                <IconButton
                  aria-label="toggle password visibility"
                  onMouseDown={() =>
                    setShowSecretInCommand(!showSecretInCommand)
                  }
                >
                  {showSecretInCommand ? <Visibility /> : <VisibilityOff />}
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

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
import Tooltip from '@mui/material/Tooltip';
import ReplayIcon from '@mui/icons-material/Replay';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Fab from '@mui/material/Fab';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import TopBar from './../components/top-bar';
import CopyToClipboard from './../components/copy-to-clipboard/CopyToClipboard';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import useLocalStorage from './../hooks/useLocalStorage';

import AnsiUp from 'ansi_up';

import { useAuth } from './../context/basicAuthContext';
import { generateRandomName } from './../utils/hlambda-names';

const StyledPreCodeTag = styled('pre')(
  ({ theme }) => `
  background-color: #000;
  color: #FFF;
  overflow-y: auto;
  height: calc(100vh - 12rem);
  display: block;
  margin: 0;
  font-size: 13px;
  padding: 2px;
`
);

function Home() {
  const { get, post, response, loading, error } = useFetch();
  const {
    get: get1,
    post: post1,
    response: response1,
    loading: loading1,
    error: error1,
  } = useFetch();
  const {
    get: get2,
    post: post2,
    response: response2,
    loading: loading2,
    error: error2,
  } = useFetch();
  const [firstTimeLoadingLogs, setFirstTimeLoadingLogs] = React.useState(true);
  const [logs, setLogs] = React.useState('');
  const [rawLogs, setRawLogs] = React.useState('');
  const [swaggerUIToken, setSwaggerUIToken] = React.useState();
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [swaggerRefresh, setSwaggerRefresh] = React.useState(false);
  const [snapToBottom, setSnapToBottom] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showSecretInCommand, setShowSecretInCommand] = React.useState(false);
  const [timestampOnRender, setTimestampOnRender] = React.useState(Date.now());
  const [tempName, setTempName] = React.useState(generateRandomName());

  const logsBoxRef = React.useRef(null);

  const auth = useAuth();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const executeScroll = () => {
    if (logsBoxRef?.current) {
      logsBoxRef.current.scrollTop = logsBoxRef?.current?.scrollHeight;
    }
  };

  const getClearLogs = async () => {
    // Do things...
    const results = await get2('/console/api/v1/logs/clear');
    if (response2.ok) {
      // toast.success('Logs cleared!');
    }
  };

  const getTokenForConsoleSwaggerUI = async () => {
    // Do things...
    const results = await get1(
      '/console/api/v1/console-swagger-ui-sign-access'
    );
    if (response1.ok) {
      // toast.success('yeey');
      setSwaggerUIToken(results);
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
      setRawLogs(results);
      if (firstTimeLoadingLogs) {
        setFirstTimeLoadingLogs(false);
      }
    }
  };

  const handleScroll = (event) => {
    const bufferSize = 7; // 7px buffer
    const sh =
      logsBoxRef?.current?.scrollHeight -
        Math.round(logsBoxRef?.current?.scrollTop) -
        bufferSize <=
      logsBoxRef?.current?.clientHeight;
    // Set to true if user is at the bottom of the logs
    setSnapToBottom(sh);
    // Debugging
    // if (sh) {
    //   logsBoxRef.current.style.backgroundColor = 'red';
    // } else {
    //   logsBoxRef.current.style.backgroundColor = 'green';
    // }
    // console.log(sh);
  };

  // Add event listeners to scroll to trigger snap
  React.useEffect(() => {
    const refElement = logsBoxRef?.current;
    refElement?.addEventListener('scroll', handleScroll);
    return () => refElement?.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    getTokenForConsoleSwaggerUI();
    getLogs();
    setTempName(generateRandomName());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (error) {
      toast.error('Request errored out...');
      setLogs(JSON.stringify(response.data));
      setRawLogs(JSON.stringify(response.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  React.useEffect(() => {
    if (error1) {
      toast.error('Request errored out...');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error1]);

  React.useEffect(() => {
    if (error2) {
      toast.error('Request errored out...');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error2]);

  React.useEffect(() => {
    autoScroll && snapToBottom && executeScroll();
  });

  const _handleSwitchChange = (event) => {
    setAutoScroll(!autoScroll);
  };

  const _handleSwitchAutoRefreshChange = (event) => {
    setAutoRefresh(!autoRefresh);
  };

  const _handleSwitchRefreshSwaggerChange = (event) => {
    setSwaggerRefresh(!swaggerRefresh);
  };

  React.useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        console.log('This will run 3 seconds!');
        getLogs();
      }, 3000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);

  const generateCloneCommand = (showSecret) => {
    const url = `${window.location.protocol}//${window.location.hostname}${
      window.location.port !== ''
        ? `:${window.location.port}`
        : window.location.port
    }`;
    return showSecret
      ? `hl clone ${`hlapp_${tempName}`} --admin-secret "${auth.getToken()}" ${url}`
      : `hl clone ${`hlapp_${tempName}`} --admin-secret "*********" ${url}`;
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
                <Tooltip title="Toggle password visibility" arrow>
                  <IconButton
                    aria-label="toggle password visibility"
                    //onClick={handleClickShowPassword}
                    //onMouseUp={handleMouseDownPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Tooltip>
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
                <Tooltip title="Toggle password visibility" arrow>
                  <IconButton
                    aria-label="toggle password visibility"
                    onMouseDown={() =>
                      setShowSecretInCommand(!showSecretInCommand)
                    }
                  >
                    {showSecretInCommand ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Generate new name" arrow>
                  <IconButton
                    aria-label="toggle generated name"
                    onMouseDown={() => setTempName(generateRandomName())}
                  >
                    <ReplayIcon />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <Grid container spacing={2} pt={'2rem'} pb={'5rem'}>
          <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
            {loading1 ? (
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={'calc(100vh - 12rem)'}
              />
            ) : (
              swaggerUIToken && (
                <iframe
                  src={`${
                    process.env.REACT_APP_DEVELOPMENT_MODE === 'true'
                      ? `${window.location.host}`.match(
                          /^localhost|^127\.0\.0\.1/
                        )
                        ? process.env.REACT_APP_API_PREFIX_LOCAL_DEVELOPMENT
                        : process.env.REACT_APP_API_PREFIX
                      : process.env.REACT_APP_API_PREFIX
                  }/console/docs/#/?secret=${encodeURIComponent(
                    auth.getToken()
                  )}`}
                  id="myPortalToSwagger"
                  className="myClassname"
                  display="initial"
                  position="relative"
                  style={{
                    border: 'none',
                    width: '100%',
                    height: 'calc(100vh - 12rem)',
                  }}
                />
              )
            )}
            <Grid container>
              <Grid item>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="warning"
                        checked={swaggerRefresh}
                        onChange={_handleSwitchRefreshSwaggerChange}
                      />
                    }
                    label="Refresh Swagger UI when reload button is pressed"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
            <StyledPreCodeTag
              ref={logsBoxRef}
              dangerouslySetInnerHTML={{
                __html: loading && firstTimeLoadingLogs ? 'Loading...' : logs,
              }}
            ></StyledPreCodeTag>

            <Grid container mt={'5px'}>
              <Grid item>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="warning"
                        checked={autoRefresh}
                        onChange={_handleSwitchAutoRefreshChange}
                      />
                    }
                    label="Auto refresh logs (3s)"
                  />
                </FormGroup>
              </Grid>
              <Grid item>
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
              </Grid>
              <Grid item>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch color="warning" disabled checked={snapToBottom} />
                    }
                    label="Auto snap"
                  />
                </FormGroup>
              </Grid>
              <Grid item>
                <CopyToClipboard
                  useGrids={true}
                  useToast={true}
                  aria-label="copy content"
                  textToCopy={rawLogs}
                />
              </Grid>
              <Grid item>
                <Tooltip title="Clear All Logs" arrow>
                  <IconButton
                    aria-label={'clear all logs'}
                    onMouseUp={() => {
                      getClearLogs();
                    }}
                  >
                    {<ClearAllIcon />}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Tooltip
        title={swaggerRefresh ? 'Refresh logs and Swagger UI' : 'Refresh logs'}
        arrow
      >
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
            if (swaggerRefresh) {
              getTokenForConsoleSwaggerUI();
            }
          }}
        >
          <RefreshIcon />
        </Fab>
      </Tooltip>
    </>
  );
}

export default Home;

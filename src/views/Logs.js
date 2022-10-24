import React from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import AnsiUp from 'ansi_up';

import Fab from '@mui/material/Fab';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RefreshIcon from '@mui/icons-material/Refresh';

import CopyToClipboard from './../components/copy-to-clipboard/CopyToClipboard';

const StyledPreCodeTag = styled('pre')(
  ({ theme }) => `
  background-color: #000;
  color: #FFF;
  overflow-y: auto;
  padding: 0;
  height: calc(100vh - 12rem);
  display: block;
  margin: 0;
  font-size: 15px;
`
);

function Logs() {
  const { get, post, response, loading, error } = useFetch();
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
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [snapToBottom, setSnapToBottom] = React.useState(true);

  const logsBoxRef = React.useRef(null);

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

  const getLogs = async () => {
    // Do things...
    const results = await get('/console/api/v1/logs?type=text');
    if (response.ok) {
      const ansi_up = new AnsiUp();
      const html = ansi_up.ansi_to_html(results);
      setLogs(html);
      setRawLogs(results);
      if (firstTimeLoadingLogs) {
        setFirstTimeLoadingLogs(false);
      }
    }
  };

  React.useEffect(() => {
    getLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (error) {
      toast.error('Request errored out...');
      setLogs(JSON.stringify(response.data));
      setRawLogs(JSON.stringify(response.data));
      // Turn off auto refresh
      setAutoRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

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

  React.useEffect(() => {
    getLogs();
  }, []);

  React.useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        console.log('This will run 3 seconds!');
        getLogs();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <Grid
          container
          direction="row"
          // justifyContent="flex-start"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <span style={{ paddingTop: '20px' }}>Server logs:</span>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              // justifyContent="flex-start"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <CopyToClipboard
                  useGrids={true}
                  aria-label="copy content"
                  textToCopy={rawLogs}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div style={{ paddingTop: '20px' }}>
          <StyledPreCodeTag
            ref={logsBoxRef}
            dangerouslySetInnerHTML={{
              __html: loading && firstTimeLoadingLogs ? 'Loading...' : logs,
            }}
          />
        </div>
        <Grid container>
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
                label="Auto refresh"
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
            <Button
              onClick={() => {
                getClearLogs();
              }}
            >
              Clear Logs
            </Button>
          </Grid>
        </Grid>
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

export default Logs;

import React from 'react';
import Container from '@mui/material/Container';
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

const StyledPreCodeTag = styled('pre')(
  ({ theme }) => `
  background-color: #000;
  color: #FFF;
  overflow-y: auto;
  padding: 0;
  height: 85vh;
  display: block;
  margin: 0;
  font-size: 15px;
`
);

function Logs() {
  const { get, post, response, loading, error } = useFetch();
  const [logs, setLogs] = React.useState('');
  const [autoScroll, setAutoScroll] = React.useState(true);

  const codeRef = React.useRef(null);

  const executeScroll = () => {
    if (codeRef?.current) {
      codeRef.current.scrollTop = codeRef?.current?.scrollHeight;
    }
  };

  const getLogs = async () => {
    // Do things...
    const results = await get('/console/api/v1/logs?type=text');
    if (response.ok) {
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
        <div style={{ paddingTop: '20px' }}>
          <StyledPreCodeTag
            ref={codeRef}
            dangerouslySetInnerHTML={{ __html: loading ? 'Loading...' : logs }}
          />
        </div>
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

export default Logs;

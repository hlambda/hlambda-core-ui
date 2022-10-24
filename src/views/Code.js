import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

import TopBar from './../components/top-bar';

import { useAuth } from './../context/basicAuthContext';

import useFetch from 'use-http';

import { useNavigate } from 'react-router-dom';

function Code({ defaultFile, type }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const { get, post, response, loading, error } = useFetch();

  const [vscodeUIToken, setVscodeUIToken] = React.useState();

  const getTokenForConsoleVscodeUI = async () => {
    // Do things...
    const results = await get('/console/api/v1/console-vscode-ui-sign-access');
    if (response.ok) {
      // toast.success('yeey');
      setVscodeUIToken(results);
    }
  };

  React.useEffect(() => {
    getTokenForConsoleVscodeUI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        {loading ? (
          <Skeleton
            variant="rectangular"
            width={'100%'}
            height={'calc(100vh - 12rem)'}
          />
        ) : (
          vscodeUIToken && (
            <iframe
              src={`/console/vscode-payload/index.html`}
              width={'100%'}
              style={{
                border: 'none',
                height: 'calc(100vh - 12rem)',
              }}
            />
          )
        )}

        <Grid item xs={12} pb={'10px'} pt={'10px'}>
          <Button
            onClick={() => {
              if (type === 'configurations') {
                navigate('/configurations-old');
              } else {
                navigate('/routes-old');
              }
            }}
          >
            {'Use old interface'}
          </Button>
          <Button
            onClick={() => {
              window.open(`/console/vscode-payload/index.html`);
            }}
          >
            {'Full screen'}
          </Button>
        </Grid>
      </Container>
    </>
  );
}

export default Code;

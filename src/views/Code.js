import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

import TopBar from './../components/top-bar';

import { useAuth } from './../context/basicAuthContext';

import useFetch from 'use-http';

import { useNavigate } from 'react-router-dom';

function Code({ defaultFile, openDefaultShell, type }) {
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

  const additionalInfoDefaultFile = defaultFile
    ? `defaultFile=${encodeURIComponent(
        `hyper-lambda-web-default:/${defaultFile}`
      )}`
    : undefined;

  const additionalInfoDefaultTerminal = openDefaultShell
    ? `openDefaultShell=${encodeURIComponent(openDefaultShell)}`
    : undefined;

  const additionalInfo =
    additionalInfoDefaultFile || additionalInfoDefaultTerminal
      ? `#?${[additionalInfoDefaultFile, additionalInfoDefaultTerminal].join(
          '&'
        )}`
      : '';

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        {loading ? (
          <Skeleton
            variant="rectangular"
            width={'100%'}
            height={'calc(100vh - 7rem)'}
          />
        ) : (
          vscodeUIToken && (
            <iframe
              src={`/console/vscode-payload/index.html${additionalInfo}`}
              key={`/console/vscode-payload/index.html${additionalInfo}`}
              width={'100%'}
              style={{
                border: 'none',
                height: 'calc(100vh - 7rem)',
              }}
            />
          )
        )}

        <Grid item xs={12} pb={'30px'} pt={'10px'}>
          {/* <Button
            onClick={() => {
              if (type === 'configurations') {
                navigate('/configurations-old');
              } else {
                navigate('/routes-old');
              }
            }}
          >
            {'Use old interface'}
          </Button> */}
          <Button
            color="primary"
            onClick={() => {
              window.open(
                `/console/vscode-payload/index.html${additionalInfo}`
              );
            }}
          >
            {'Open editor in the new dedicated window'}
          </Button>
        </Grid>
      </Container>
    </>
  );
}

export default Code;

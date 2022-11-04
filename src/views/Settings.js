import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';

import TopBar from './../components/top-bar';

import { useNavigate } from 'react-router-dom';
import useFetch from 'use-http';

import useLocalStorage from './../hooks/useLocalStorage';
import useSessionStorage from './../hooks/useSessionStorage';
import ConfirmationDialog from './../components/confirm-dialog';

function Settings() {
  const navigate = useNavigate();
  const { get, post, response, loading, error } = useFetch();

  const [serverVersion, setServerVersion] = useSessionStorage(
    `server-version`,
    null
  );

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} pb={'10px'} pt={'10px'}>
            <Typography variant="h5">Settings</Typography>
          </Grid>
          <Grid item xs={12} pb={'10px'} pt={'10px'}>
            <Divider />
          </Grid>
          <Grid item xs={12} pb={'10px'} pt={'10px'}>
            <Typography mt={'1rem'} variant="h7">
              Hλ (Hyper Lambda) is meta API. Any settings/configurations are
              passed via environment variables.
            </Typography>
          </Grid>
          <Grid item xs={12} pb={'10px'} pt={'10px'}>
            <Typography mt={'1rem'} variant="h7">
              You can change them by deploying the Meta API and setting
              environment variables or changing `hlambda-config.yaml` in one of
              your hlambda apps.
            </Typography>
          </Grid>
          <Grid item xs={12} pb={'10px'} pt={'10px'}>
            <Typography variant="h7">
              One of the examples could be the Hλ setup for serving static
              files. You will need to disable initial route redirect from root
              `/` to `/console/`. Just set
              `HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT` to `true`. Maybe you want
              to output results to stdout as JSON you will just have to set
              `JSON_STDOUT` to `true`
            </Typography>
          </Grid>
          <Grid item xs={12} pb={'10px'} pt={'10px'}>
            <List>
              {[
                '- HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT: true',
                '- JSON_STDOUT: true',
                '- ...',
              ].map((item) => (
                <ListItem key={item}>
                  <ListItemText primary={item} style={{ color: 'yellow' }} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} pb={'10px'} pt={'10px'}>
            <Typography variant="h7">
              The list of all the environment variables can be found here:{' '}
              <Link
                href="documentation"
                onClick={() => {
                  navigate('/documentation');
                }}
              >
                Documentation
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} pb={'10px'} pt={'10px'}>
            <Divider />
          </Grid>
          <Grid item xs={12} pb={'10px'} pt={'10px'}>
            <Grid item xs={12} pb={'10px'} pt={'10px'}>
              <ConfirmationDialog
                title="Cache (LocalStorage and SessionStorage) reset"
                openButtonText="Clear local cache"
                // message={`Press "OK" to proceed exporting metadata`}
                confirmText="reset cache"
                actionButtonText="Clear local cache"
                // cancelButtonText="Cancel"
                actionFunction={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                }}
              />
            </Grid>
            <Grid item xs={12} pb={'10px'} pt={'10px'}>
              <ConfirmationDialog
                title="Hard restart"
                openButtonText="Hard restart"
                // message={`Press "OK" to proceed exporting metadata`}
                confirmText="restart"
                actionButtonText="Hard restart"
                // cancelButtonText="Cancel"
                actionFunction={async () => {
                  // Do things...
                  const results = await get('/console/api/v1/trigger-reload');
                  if (response.ok) {
                    toast.success('Server restarting...');
                  } else {
                    toast.error('Request error!');
                  }
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ marginTop: '1rem' }} />
        <Grid container>
          <Grid item xs sx={{ padding: '1rem' }}>
            <Typography
              align="center"
              component="h4"
              variant="inherit"
              color="text.disabled"
              sx={{ fontWeight: '200' }}
            >
              Hλ Server version: {serverVersion}
            </Typography>
            <Typography
              align="center"
              component="h4"
              variant="inherit"
              color="text.disabled"
              sx={{ fontWeight: '200' }}
            >
              Hλ UI version: {process.env.REACT_APP_VERSION}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Settings;

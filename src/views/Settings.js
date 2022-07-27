import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';

import getSessionStorageOrDefault from './../utils/getSessionStorageOrDefault';

function Settings() {
  const { get, post, response, loading, error } = useFetch();

  const [serverVersion, setServerVersion] = React.useState(
    getSessionStorageOrDefault(`server-version`, null)
  );

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        Settings...
        <Typography component="h3" variant="h6">
          Hyper Lambda or Hlambda for short, is meta API meaning there is no
          settings as such, any settings are passed via environment variables.
          Here you can find the definitions and steps how to change it. Either
          by deploying the Meta API and setting env or upadting
          hlambda-config.yaml in one of your hlambda apps.
        </Typography>
        <Typography component="h3" variant="h6">
          One of the examples could be the setup for serving static files. You
          will need to disable initial route redirect to console.
        </Typography>
        <List>
          {['- HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT: true'].map((item) => (
            <ListItem key={item}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ marginTop: '2rem' }} />
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

import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';

function Settings() {
  const { get, post, response, loading, error } = useFetch();

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
      </Container>
    </>
  );
}

export default Settings;

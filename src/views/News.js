import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';

import useLocalStorage from './../hooks/useLocalStorage';
import useSessionStorage from './../hooks/useSessionStorage';

function NewsPage() {
  const { get, post, response, loading, error } = useFetch();

  const [serverVersion, setServerVersion] = useSessionStorage(
    `server-version`,
    null
  );

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
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
              '+ List env variables from the server instance',
              '+ File uploads through console. (Useful when serving static content like images)',
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

export default NewsPage;

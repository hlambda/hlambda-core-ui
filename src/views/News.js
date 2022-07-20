import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';

function NewsPage() {
  const { get, post, response, loading, error } = useFetch();

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
        <Divider
          style={{ paddingTop: '1rem', paddingBottom: '1rem' }}
        ></Divider>
      </Container>
    </>
  );
}

export default NewsPage;

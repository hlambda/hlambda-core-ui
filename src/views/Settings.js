import React from 'react';
import Container from '@mui/material/Container';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';

function Settings() {
  const { get, post, response, loading, error } = useFetch();

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        Settings...
      </Container>
    </>
  );
}

export default Settings;

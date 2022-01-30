import React from 'react';
import Container from '@mui/material/Container';

import TopBar from './../components/top-bar';
import ConsoleEditor from './../components/editor/Editor';

import useFetch from 'use-http';

function Home() {
  const { get, post, response, loading, error } = useFetch();

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <ConsoleEditor
          language="yaml"
          defaultFile="metadata/apps/example_demo_app/hlambda-config.yaml"
        />
      </Container>
    </>
  );
}

export default Home;

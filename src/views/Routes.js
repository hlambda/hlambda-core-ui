import React from 'react';
import Container from '@mui/material/Container';

import TopBar from './../components/top-bar';
import ConsoleEditor from './../components/editor/Editor';

import useFetch from 'use-http';

function Routes() {
  const { get, post, response, loading, error } = useFetch();

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <ConsoleEditor
          language="javascript"
          defaultFile="metadata/apps/example-demo-app/router.demo.js"
        />
      </Container>
    </>
  );
}

export default Routes;

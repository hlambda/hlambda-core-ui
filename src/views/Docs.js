import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import Editor from '@monaco-editor/react';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import CopyToClipboard from './../components/copy-to-clipboard/CopyToClipboard';

function DocumentationPage() {
  const { get, post, response, loading, error } = useFetch();

  const [environments, setEnvironments] = React.useState('');

  const getEnvrionmentsExample = async () => {
    const results = await get('/console/api/v1/environments-example');
    if (response.ok) {
      setEnvironments(results);
    }
  };

  React.useEffect(() => {
    getEnvrionmentsExample();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (error) {
      toast.error('Request errored out...');
      console.log(JSON.stringify(response.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <Grid
          container
          direction="row"
          // justifyContent="flex-start"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            {/* <Typography component="h3" variant="h6"> */}
            {`This is the list of environment variables used by Hyper Lambda server:`}
            {/* </Typography> */}
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              // justifyContent="flex-start"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <CopyToClipboard
                  useGrids={true}
                  aria-label="copy content"
                  textToCopy={environments}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div style={{ width: '100%', paddingTop: '20px' }}>
          <Editor
            key={Date.now()} // Super strange, without this monaco editor throws error: That context already exists.
            height="calc(100vh - 12rem)"
            language={'markdown'}
            defaultValue={loading ? 'Loading...' : environments}
            value={loading ? 'Loading...' : environments}
            theme="hc-black"
            readOnly={true}
            onMount={(editor) => {
              editor.updateOptions({ readOnly: true });
              console.log(editor);
            }}
          />
        </div>
      </Container>
    </>
  );
}

export default DocumentationPage;

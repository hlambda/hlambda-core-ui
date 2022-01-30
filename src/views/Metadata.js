import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

function Metadata() {
  const { get, post, response, loading, error } = useFetch();

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            Here you can import / export metadata...
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              onClick={async () => {
                // Do things...
                const results = await post('/console/api/v1/metadata/export');
                if (response.ok) {
                  toast.success('Metadata exported');
                  const blob = await response.blob();
                  // 2. Create blob link to download
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `sample.zip`);
                  // 3. Append to html page
                  document.body.appendChild(link);
                  // 4. Force download
                  link.click();
                  // 5. Clean up and remove the link
                  link.parentNode.removeChild(link);
                } else {
                  toast.error('Error while exporting metadata!');
                }
              }}
            >
              Export metadata
            </Button>
          </Grid>
          <Divider />
          <Grid item xs={12}>
            <input id="your-file-input" type="file" name="metadata"></input>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              onClick={async () => {
                const fileInput = document.querySelector('#your-file-input');
                const formData = new FormData();

                formData.append('metadata', fileInput.files[0]);
                // Do things...
                const results = await post(
                  '/console/api/v1/metadata/import',
                  formData
                );
                if (response.ok) {
                  toast.success('Metadata imported');
                } else {
                  toast.error('Error while importing metadata!');
                }
              }}
            >
              Import metadata
            </Button>
          </Grid>
          <Divider />
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              onClick={async () => {
                // Do things...
                const results = await get('/console/api/v1/metadata/clear');
                if (response.ok) {
                  toast.success('Metadata cleared');
                } else {
                  toast.error('Error while clearing metadata!');
                }
              }}
            >
              Clear metadata
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Metadata;

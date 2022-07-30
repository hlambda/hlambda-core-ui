import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import TopBar from './../components/top-bar';
import ConfirmationDialog from './../components/confirm-dialog';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import useLocalStorage from './../hooks/useLocalStorage';
import useSessionStorage from './../hooks/useSessionStorage';

function Metadata() {
  const { get, post, response, loading, error } = useFetch();

  const [metadataResult, setMetadataResult] = useLocalStorage(
    `metadata-result`,
    {}
  );
  const [metadataHistoryResult, setMetadataHistoryResult] = useLocalStorage(
    `metadata-history`,
    {}
  );

  const checkMetadata = async () => {
    const results = await get('/console/api/v1/metadata/version');
    if (response.ok) {
      setMetadataResult(results);
    }
  };

  const checkMetadataHistory = async () => {
    const results = await get('/console/api/v1/metadata/history');
    if (response.ok) {
      setMetadataHistoryResult(results);
    }
  };

  React.useEffect(() => {
    checkMetadata();
    checkMetadataHistory();
  }, []);

  const exportMetadata = async () => {
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
  };

  const importMetadata = async () => {
    const fileInput = document.querySelector('#your-file-input');
    const formData = new FormData();

    formData.append('metadata', fileInput.files[0]);
    // Do things...
    const results = await post('/console/api/v1/metadata/import', formData);
    if (response.ok) {
      toast.success('Metadata imported');
    } else {
      toast.error('Error while importing metadata!');
    }
  };

  const resetMetadata = async () => {
    // Do things...
    const results = await get('/console/api/v1/metadata/reset');
    if (response.ok) {
      toast.success('Metadata reset');
    } else {
      toast.error('Error while reset metadata!');
    }
  };

  const clearMetadata = async () => {
    // Do things...
    const results = await get('/console/api/v1/metadata/clear');
    if (response.ok) {
      toast.success('Metadata cleared');
    } else {
      toast.error('Error while clearing metadata!');
    }
  };

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            Metadata history: {JSON.stringify(metadataHistoryResult, null, 2)}
          </Grid>
          <Grid item xs={12}>
            Metadata hash: {JSON.stringify(metadataResult)}
          </Grid>
          <Grid item xs={12}>
            Here you can import / export metadata...
          </Grid>
          <Grid item xs={12}>
            <ConfirmationDialog
              title="Metadata export"
              openButtonText="Export metadata"
              message={`Press "Export metadata" to proceed exporting metadata.`}
              // confirmText="confirm"
              actionButtonText="Export metadata"
              // cancelButtonText="Cancel"
              actionFunction={() => {
                // console.log('Export CLICKED!!!');
                exportMetadata();
              }}
            />
          </Grid>
          <Divider />
          <Grid item xs={12}>
            <input id="your-file-input" type="file" name="metadata"></input>
          </Grid>
          <Grid item xs={12}>
            <ConfirmationDialog
              title="Metadata import"
              openButtonText="Import metadata"
              // message={`Press "OK" to proceed exporting metadata`}
              confirmText="import metadata"
              actionButtonText="Import metadata"
              // cancelButtonText="Cancel"
              actionFunction={() => {
                // console.log('Import CLICKED!!!');
                importMetadata();
              }}
            />
          </Grid>
          <Divider />
          <Grid item xs={12}>
            <ConfirmationDialog
              title="Metadata reset"
              openButtonText="Reset metadata"
              // message={`Press "OK" to proceed exporting metadata`}
              confirmText="reset metadata"
              actionButtonText="Reset metadata"
              // cancelButtonText="Cancel"
              actionFunction={() => {
                // console.log('RESET CLICKED!!!');
                resetMetadata();
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ConfirmationDialog
              title="Metadata clear"
              openButtonText="Clear metadata"
              // message={`Press "OK" to proceed exporting metadata`}
              confirmText="clear metadata"
              actionButtonText="Clear metadata"
              // cancelButtonText="Cancel"
              actionFunction={() => {
                // console.log('CLEAR CLICKED!!!');
                clearMetadata();
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Metadata;

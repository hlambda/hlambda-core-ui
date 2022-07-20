import React from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import Fab from '@mui/material/Fab';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RefreshIcon from '@mui/icons-material/Refresh';

import Editor from '@monaco-editor/react';

const StyledPreCodeTag = styled('pre')(
  ({ theme }) => `
  background-color: #000;
  color: #FFF;
  overflow-y: auto;
  padding: 0;
  height: 85vh;
  display: block;
  margin: 0;
  font-size: 15px;
`
);

function Errors() {
  const { get, post, response, loading, error } = useFetch();
  const [errors, setErrors] = React.useState('');

  const errorBoxRef = React.useRef(null);

  const getErrorsDefinitions = async () => {
    // Do things...
    const results = await get('/console/api/v1/errors');
    if (response.ok) {
      setErrors(JSON.stringify(results, null, 2));
    }
    // else {
    //   toast.error('Request errored out...');
    //   setErrors(JSON.stringify(results));
    // }
  };

  React.useEffect(() => {
    getErrorsDefinitions();
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
        <div style={{ paddingTop: '20px' }}>
          This is the list of all possible errors defined by the `errors.*.js`
          files:
        </div>
        <div
          style={{
            width: '100%',
            paddingTop: '20px',
          }}
        >
          <Editor
            height="calc(100vh - 12rem)"
            language={'json'}
            defaultValue={errors}
            value={errors}
            theme="vs-dark"
            readOnly={true}
            onMount={(editor) => {
              editor.updateOptions({ readOnly: true });
            }}
          />
        </div>
        {/* <div style={{ paddingTop: '20px' }}>
          <StyledPreCodeTag
            ref={errorBoxRef}
            dangerouslySetInnerHTML={{
              __html: loading ? 'Loading...' : errors,
            }}
          />
        </div> */}
      </Container>
    </>
  );
}

export default Errors;

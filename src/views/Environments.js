import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import Fab from '@mui/material/Fab';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RefreshIcon from '@mui/icons-material/Refresh';

import Editor from '@monaco-editor/react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import CopyToClipboard from './../components/copy-to-clipboard/CopyToClipboard';

const clean = (objectIn) => {
  let object;
  try {
    object = JSON.parse(objectIn);
  } catch (error) {
    console.log('[cleaner function] Unable to parse JSON');
  }
  if (typeof object === 'undefined') {
    return objectIn;
  }

  const cleanKey = (keyName) => {
    if (typeof object[keyName] !== 'undefined') {
      object[keyName] = '******';
    }
  };

  // cleanKey('HASURA_GRAPHQL_ADMIN_SECRET');
  // cleanKey('PRIVATE_KEY');
  // cleanKey('KEY');
  // cleanKey('PASSWORD');
  // cleanKey('SECRET');
  // cleanKey('HLAMBDA_ADMIN_SECRET');

  const keys = Object.keys(object);

  for (const key of keys) {
    if (key.toLowerCase().match(/password|secret|key/)) {
      cleanKey(key);
    }
  }

  return JSON.stringify(object, null, 2);
};

function Errors() {
  const { get, post, response, loading, error } = useFetch();
  const [environments, setEnvironments] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const errorBoxRef = React.useRef(null);

  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const getErrorsDefinitions = async () => {
    // Do things...
    const results = await get('/console/api/v1/environments');
    if (response.ok) {
      setEnvironments(JSON.stringify(results, null, 2));
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
        <Grid
          container
          direction="row"
          // justifyContent="flex-start"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <span style={{ paddingTop: '20px' }}>
              This is the list environment variables in `process.env`:
            </span>
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
              <Grid item>
                <Tooltip title="Toggle password visibility" arrow>
                  <IconButton
                    aria-label="toggle secrets visibility"
                    //onClick={handleClickShowPassword}
                    //onMouseUp={handleMouseDownPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div
          style={{
            width: '100%',
            paddingTop: '20px',
          }}
        >
          <Editor
            height="calc(100vh - 12rem)"
            language={'json'}
            defaultValue={showPassword ? environments : clean(environments)}
            value={showPassword ? environments : clean(environments)}
            theme="hc-black"
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

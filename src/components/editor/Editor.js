import React from 'react';
import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';

import Editor from '@monaco-editor/react';
import FileSystemNavigator from './FileSystemNavigator';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import utf8 from 'utf8';
import base64 from 'base-64';

function ConsoleEditor({ language, defaultFile }) {
  const { get, post, response, loading, error } = useFetch();

  const [values, setValues] = React.useState({
    path: defaultFile ?? 'metadata/apps/auth/routes/router.auth.js',
    editorCodeData: '',
    encodingWrite: 'base64',
    encodingRead: 'utf-8',
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function _handleEditorChange(value, event) {
    //console.log("here is the current model value:", value);
    //console.log(btoa(`${value}`));
    // setCodePayloadValue(btoa(`${value}`))
    setValues({ ...values, editorCodeData: value });
  }

  const _handleSaveFileContent = async (value, event) => {
    const bytes = utf8.encode(`${values.editorCodeData}`);
    const encoded = base64.encode(bytes);

    const results = await post('/console/api/v1/file-edit', {
      path: values.path,
      data: encoded,
      encodingWrite: values.encodingWrite,
      encodingRead: values.encodingRead,
    });
    if (response.ok) {
      toast.success('Saved!');
      console.log(results);
    } else {
      // toast.error('Request errored out...');
      setEditorCodeValue('');
    }
  };

  // Reload the contents of the file
  const _handleReload = async (value, event) => {
    await post(
      '/console/api/v1/file-view',
      {
        path: values.path,
      },
      { responseType: 'text' }
    );
    if (response.ok) {
      // toast.success('yeey');
      const text = await response.text();
      setValues({ ...values, editorCodeData: text });
      console.log(text);
    } else {
      // toast.error('Request errored out...');
      setValues({ ...values, editorCodeData: '' });
    }
  };

  const _handleUpload = async (value, event) => {
    const fileInput = document.querySelector('#your-file-input');
    const formData = new FormData();
    formData.append('path', values.path);
    formData.append('uploadFile', fileInput.files[0]);
    // Do things...
    const results = await post('/console/api/v1/files/upload', formData);
    if (response.ok) {
      toast.success('File uploaded.');
    } else {
      toast.error('Error while uploading file!');
    }
  };

  // React.useEffect(() => {
  //   _handleReload();
  // }, []);

  React.useEffect(() => {
    _handleReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.path]);

  React.useEffect(() => {
    if (error) {
      toast.error('Request errored out...');
      console.log(JSON.stringify(response.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const checkLanguage = () => {
    if (['.yml', '.yaml'].includes(values.path.substr(-5))) {
      return 'yaml';
    }
    if (['.json'].includes(values.path.substr(-5))) {
      return 'json';
    }
    if (['.js'].includes(values.path.substr(-3))) {
      return 'javascript';
    }
    if (['.ts'].includes(values.path.substr(-3))) {
      return 'typescript';
    }
    if (['.md'].includes(values.path.substr(-3))) {
      return 'markdown';
    }
    return language;
  };

  return (
    <>
      <div style={{ paddingTop: '20px' }}>
        <Editor
          height="60vh"
          language={checkLanguage()}
          defaultValue={values.editorCodeData}
          value={values.editorCodeData}
          onChange={_handleEditorChange}
          theme="vs-dark"
        />
      </div>

      <Divider />
      <div style={{ paddingTop: '20px' }}>
        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-amount">Path</InputLabel>
          <Input
            id="standard-adornment-amount"
            value={values.path}
            onChange={handleChange('path')}
            variant="filled"
            startAdornment={<InputAdornment position="start">/</InputAdornment>}
          />
        </FormControl>
      </div>
      {/* <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={values.encodingWrite}
        label="encodingWrite"
        onChange={handleChange('encodingWrite')}
      >
        <MenuItem value={'base64'}>Base 64</MenuItem>
        <MenuItem value={'hex'}>Hex</MenuItem>
        <MenuItem value={'utf-8'}>utf-8</MenuItem>
      </Select>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={values.encodingRead}
        label="encodingRead"
        onChange={handleChange('encodingRead')}
      >
        <MenuItem value={'base64'}>Base 64</MenuItem>
        <MenuItem value={'hex'}>Hex</MenuItem>
        <MenuItem value={'utf-8'}>utf-8</MenuItem>
      </Select> */}

      <Divider />
      <Grid container>
        <Grid>
          <Button variant="contained" onClick={_handleSaveFileContent}>
            Sve File
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" onClick={_handleReload}>
            Reload File
          </Button>
        </Grid>
        <Grid>
          <Button variant="contained" onClick={_handleUpload}>
            Upload File
          </Button>
          <input id="your-file-input" type="file" name="uploadFile"></input>
        </Grid>

        {/* <Grid>
          <Button variant="contained" onClick={_handleReadDear}>
            Read Dir
          </Button>
        </Grid> */}
      </Grid>
      <Divider />
      <div style={{ paddingTop: '20px' }}>
        <FileSystemNavigator
          defaultFile={defaultFile}
          languages={['.js', '.yml', '.yaml']}
          setValuesParrent={setValues}
          valuesParrent={values}
        ></FileSystemNavigator>
      </div>
    </>
  );
}

export default ConsoleEditor;

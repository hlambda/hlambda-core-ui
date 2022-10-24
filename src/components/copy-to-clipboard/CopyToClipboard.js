import React from 'react';

import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import CopyAll from '@mui/icons-material/FileCopy';
import CheckIcon from '@mui/icons-material/Check';

import { toast } from 'react-toastify';

const CopyToClipboard = (props) => {
  const [isCopied, setIsCopied] = React.useState(false);

  // This is the function we wrote earlier
  const copyTextToClipboard = async (text) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  };

  // Returns onClick handler function for the copy button
  const handleCopyClickFunc = (copyText) => () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
        if (props.useToast) {
          toast.success('Copied!');
        }
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (props.useGrids) {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid height={32} item>
          {isCopied && !props.useToast && (
            <Alert
              sx={{ paddingTop: 0, paddingBottom: 0 }}
              icon={<CheckIcon />}
              severity="success"
            >
              {isCopied ? 'Copied!' : ''}
            </Alert>
          )}
        </Grid>
        <Grid item>
          <Tooltip title="Copy" arrow>
            <IconButton
              aria-label={props['aria-label']}
              onMouseDown={handleCopyClickFunc(props.textToCopy)}
            >
              {<CopyAll />}
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }
  return (
    <>
      {isCopied && props.useToast && (
        <Alert icon={<CheckIcon />} severity="success">
          {isCopied ? 'Copied!' : ''}
        </Alert>
      )}
      <Tooltip title="Copy" arrow>
        <IconButton
          aria-label={props['aria-label']}
          onMouseDown={handleCopyClickFunc(props.textToCopy)}
        >
          {<CopyAll />}
        </IconButton>
      </Tooltip>
    </>
  );
};

export default CopyToClipboard;

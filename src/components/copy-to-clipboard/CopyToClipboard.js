import React from 'react';

import Alert from '@mui/material/Alert';
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
        // toast.success('Copied!');
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {isCopied && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          {isCopied ? 'Copied!' : ''}
        </Alert>
      )}
      <IconButton
        aria-label={props['aria-label']}
        onMouseDown={handleCopyClickFunc(props.textToCopy)}
      >
        {<CopyAll />}
      </IconButton>
    </>
  );
};

export default CopyToClipboard;

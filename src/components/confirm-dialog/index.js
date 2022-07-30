import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const ConfirmationDialog = (props) => {
  const inputRef = React.useRef();
  const [open, setOpen] = React.useState(false);
  const [isProceedEnabled, setIsProceedEnabled] = React.useState(
    !props?.confirmText
  );
  const [confirmInputText, setConfirmInputText] = React.useState('');

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleProceed = () => {
    setOpen(false);
    if (typeof props?.actionFunction === 'function') {
      if (props?.confirmText) {
        if (props?.confirmText === `${confirmInputText}`.toLowerCase()) {
          props?.actionFunction();
        }
      } else {
        props?.actionFunction();
      }
    }
  };

  // Attempt to fix autofocus from mui... no luck. :(
  // React.useEffect(() => {
  //   if (props?.confirmText) {
  //     inputRef?.current?.focus();
  //     console.log(inputRef);
  //   }
  // }, []);

  return (
    <div>
      <Button color="primary" variant="contained" onClick={handleClickOpen}>
        {props?.openButtonText ?? 'Open'}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{props?.title ?? 'Confirmation'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props?.message ??
              `Please write "${
                props?.confirmText ?? 'confirm'
              }" to confirm the action.`}
          </DialogContentText>
          {props?.confirmText && (
            <TextField
              autoFocus={true}
              inputRef={inputRef}
              inputProps={{ autoFocus: true }}
              margin="dense"
              id="confirmation-text"
              label="Confirm"
              placeholder={props?.confirmText}
              type="text"
              fullWidth
              value={confirmInputText}
              onChange={(event) => {
                if (props?.confirmText) {
                  if (
                    props?.confirmText === `${event.target.value}`.toLowerCase()
                  ) {
                    setIsProceedEnabled(true);
                  } else {
                    setIsProceedEnabled(false);
                  }
                } else {
                  setIsProceedEnabled(true);
                }
                setConfirmInputText(event.target.value);
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={handleClose}>
            {props?.cancelButtonText ?? 'Cancel'}
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={props?.confirmText ? !isProceedEnabled : false}
            onClick={handleProceed}
          >
            {props?.actionButtonText ?? 'Proceed'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationDialog;

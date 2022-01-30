import React from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Fab from '@mui/material/Fab';
import RefreshIcon from '@mui/icons-material/Refresh';

import TopBar from './../components/top-bar';
import ConsoleEditor from './../components/editor/Editor';

import useFetch from 'use-http';
import { toast } from 'react-toastify';

import useLocalStorage from './../hooks/useLocalStorage';

import AnsiUp from 'ansi_up';

import { useAuth } from './../context/basicAuthContext';

const StyledPreCodeTag = styled('pre')(
  ({ theme }) => `
  background-color: #000;
  color: #FFF;
  overflow-y: auto;
  padding: 0;
  height: 30vh;
  display: block;
  margin: 0;
  font-size: 15px;
`
);

function VsCodeWebPage() {
  const { get, post, response, loading, error } = useFetch();
  const [logs, setLogs] = React.useState('');
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  const codeRef = React.useRef(null);

  const auth = useAuth();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const executeScroll = () => {
    if (codeRef?.current) {
      codeRef.current.scrollTop = codeRef?.current?.scrollHeight;
    }
  };

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <iframe
          src={`${process.env.REACT_APP_API_PREFIX}/console/vscode`}
          id="myPortalToSwagger"
          className="myClassname"
          display="initial"
          position="relative"
          style={{
            border: 'none',
            width: 'inherit',
            height: '900px',
            paddingTop: '2rem',
            paddingBottom: '2rem',
          }}
        />
      </Container>
      <Fab
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
        }}
        color="secondary"
        aria-label="Refresh"
        onClick={() => {
          getLogs();
        }}
      >
        <RefreshIcon />
      </Fab>
    </>
  );
}

export default VsCodeWebPage;

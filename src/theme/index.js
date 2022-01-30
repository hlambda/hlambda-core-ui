import { createTheme } from '@mui/material/styles';
import { red, lightBlue } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: lightBlue[500],
    },
    secondary: {
      main: red[500],
    },
  },
});

export default theme;

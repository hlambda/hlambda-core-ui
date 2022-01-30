import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

import { useNavigate } from 'react-router-dom';
import useFetch from 'use-http';
import { toast } from 'react-toastify';

const pages = [
  {
    name: 'API',
    url: '/',
  },
  // {
  //   name: 'Code',
  //   url: '/code',
  // },
  {
    name: 'Routes',
    url: '/routes',
  },
  {
    name: 'Shell',
    url: '/shell',
  },
  {
    name: 'Env',
    url: '/env',
  },
  {
    name: 'Errors',
    url: '/errors',
  },
  // {
  //   name: 'Events',
  //   url: '/events',
  // },
  {
    name: 'Logs',
    url: '/logs',
  },
  {
    name: 'Metadata',
    url: '/metadata',
  },
  // {
  //   name: 'Settings',
  //   url: '/settings',
  // },
  {
    name: 'Logout',
    url: '/logout',
  },
];

const ResponsiveAppBar = () => {
  const navigate = useNavigate();

  const { get, post, response, loading, error } = useFetch();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            onClick={() => {
              navigate('/');
            }}
          >
            Console
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography
                    onClick={() => {
                      navigate(page.url);
                    }}
                    textAlign="center"
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            Console
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => {
                  navigate(page.url);
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => {
              navigate('/settings');
            }}
            color="inherit"
          >
            <SettingsIcon />
          </IconButton>
          <Button
            variant="contained"
            onClick={async () => {
              // Do things...
              const results = await get('/console/api/v1/trigger-restart');
              if (response.ok) {
                toast.success('Server reloading...');
              } else {
                toast.error('Request error!');
              }
            }}
            color="secondary"
          >
            Reload server
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;

// export default function TopBar() {
//   return (
//     <React.Fragment>
//       <AppBar position="absolute" color="primary" sx={{ top: 0 }}>
//         <Toolbar>
//           <IconButton color="inherit" aria-label="open drawer">
//             <MenuIcon />
//           </IconButton>
//           <Box sx={{ flexGrow: 1 }} />
//           <IconButton color="inherit">
//             <SearchIcon />
//           </IconButton>
//           <IconButton color="inherit">
//             <MoreIcon />
//           </IconButton>
//         </Toolbar>
//       </AppBar>
//     </React.Fragment>
//   );
// }

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
import Link from '@mui/material/Link';

import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import NewsIcon from '@mui/icons-material/NewReleases';
import DocumentationIcon from '@mui/icons-material/Description';

import { useNavigate } from 'react-router-dom';
import useFetch from 'use-http';
import { toast } from 'react-toastify';

import Banner from './../banner/Banner';

import useLocalStorage from './../../hooks/useLocalStorage';
import useSessionStorage from './../../hooks/useSessionStorage';

const pages = [
  {
    name: 'API',
    url: '/',
  },
  // {
  //   name: 'Code',
  //   url: '/code',
  // },
  // {
  //   name: 'Routes',
  //   url: '/routes',
  // },
  {
    name: 'Code',
    url: '/code',
  },
  {
    name: 'Shell',
    url: '/shell',
  },
  {
    name: 'Config',
    url: '/configurations',
  },
  {
    name: 'Env',
    url: '/environments',
  },
  {
    name: 'Constants',
    url: '/constants',
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
  // const [serverVersion, setServerVersion] = React.useState(null);

  const [serverVersion, setServerVersion] = useSessionStorage(
    `server-version`,
    null
  );

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

  const getServerVersion = async () => {
    // Do things...
    const results = await get('/console/api/v1/version');
    if (response.ok) {
      setServerVersion(results);
    }
  };

  React.useEffect(() => {
    if (serverVersion === null) {
      getServerVersion();
    }
  }, []);

  return (
    <AppBar position="static">
      <Banner type="environment-banner" />
      <Banner type="version-banner" />
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
            Hλ
            {serverVersion && (
              <>
                {' · '} {serverVersion}
              </>
            )}
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
                <MenuItem
                  key={page.name}
                  onClick={() => {
                    navigate(page.url);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
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
            Hλ
            {serverVersion && (
              <>
                {' · '} {serverVersion}
              </>
            )}
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
              navigate('/documentation');
            }}
            color="inherit"
            style={{ marginRight: '5px' }}
          >
            <DocumentationIcon />
          </IconButton>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => {
              navigate('/news');
            }}
            color="inherit"
            style={{ marginRight: '5px' }}
          >
            <NewsIcon />
          </IconButton>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => {
              navigate('/settings');
            }}
            color="inherit"
            style={{ marginRight: '20px' }}
          >
            <SettingsIcon />
          </IconButton>
          <Button
            variant="contained"
            onClick={async () => {
              // Do things...
              const results = await get('/console/api/v1/trigger-reload');
              if (response.ok) {
                toast.success('Server reloading...', { hideProgressBar: true });
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

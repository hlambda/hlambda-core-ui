import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

import useFetch from 'use-http';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import useLocalStorage from './../../hooks/useLocalStorage';
import useSessionStorage from './../../hooks/useSessionStorage';

function Banner(props) {
  const navigate = useNavigate();
  const { get, post, response, loading, error } = useFetch();

  const [checkBannerResult, setCheckBannerResult] = useLocalStorage(
    'env-banner-result',
    {}
  );
  const [checkVersionResult, setCheckVersionResult] = useLocalStorage(
    'new-version-result',
    {}
  );
  const [hidden, setHidden] = useSessionStorage(
    `${props.type}-banner-hidden`,
    false
  );

  // This has to be a little more persistant, so that we do not fetch again if not needed.
  const [newVersionLastCheckTimestamp, setNewVersionLastCheckTimestamp] =
    useLocalStorage('new-version-last-check-timestamp', null);

  // This function checks COLOR BANNER
  const checkBanner = async () => {
    const results = await get('/console/api/v1/banner-info');
    if (response.ok) {
      setCheckBannerResult(results);
    }
  };

  // This function calls GitHub API to check latest release version.
  const checkVersion = async () => {
    const results = await get('/console/api/v1/check-version');
    if (response.ok) {
      setNewVersionLastCheckTimestamp(Date.now());
      setCheckVersionResult(results);
    }
  };

  React.useEffect(() => {
    if (props.type === 'version-banner') {
      if (
        newVersionLastCheckTimestamp === null ||
        Date.now() > newVersionLastCheckTimestamp + 3600 * 1000
      ) {
        // console.log('Checking version', newVersionLastCheckTimestamp);
        checkVersion();
      } else {
        // console.log('Too early...', newVersionLastCheckTimestamp);
      }
    } else {
      checkBanner();
    }
  }, []);

  //   React.useEffect(() => {
  //     _handleReload();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  //   React.useEffect(() => {
  //     if (error) {
  //       toast.error('Request errored out...');
  //       console.log(JSON.stringify(response.data));
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [error]);

  if (hidden) {
    return <></>;
  }

  if (props.type === 'version-banner') {
    if (!checkVersionResult?.foundNewerVersion) return <></>;
    return (
      <>
        <div
          style={{
            position: 'fixed',
            right: '0',
            bottom: '0',
            width: '100%',
            zIndex: '999999',

            textAlign: 'center',
            backgroundColor: '#f4ee44', // #ffc627
            color: '#43495a',
            boxSizing: 'border-box',
          }}
        >
          <Container maxWidth="xl">
            <Typography
              variant="body1"
              noWrap
              component="span"
              onClick={() => {
                navigate('/');
              }}
            >
              {`Hey there! A new server version`}{' '}
              <span style={{ fontWeight: 'bold' }}>
                {checkVersionResult?.latestVersion}
              </span>{' '}
              {`is available`}
              {' · '}
              <Link
                href={`https://github.com/hlambda/hlambda-core/releases/tag/${checkVersionResult?.latestVersion}`}
                variant="body2"
                target="_blank"
                // rel="noopener" // Security (Choose 1)
                rel="noreferrer" // Security (Choose 1)
                color={'#43495a'}
                fontWeight={'bold'}
              >
                View Changelog
              </Link>
              {' · '}
              <Link
                href={
                  process.env.REACT_APP_CONSOLE_DOCS_URL +
                  'deployment/updating.html'
                }
                variant="body2"
                target="_blank"
                // rel="noopener" // Security (Choose 1)
                rel="noreferrer" // Security (Choose 1)
                color={'#43495a'}
                fontWeight={'bold'}
              >
                Update Now
              </Link>
            </Typography>
            <IconButton
              size="large"
              aria-label="Close bar"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => {
                console.log('Close!');
                setHidden(true);
              }}
              color="inherit"
            >
              <CloseIcon />
            </IconButton>
          </Container>
        </div>
      </>
    );
  }

  if (!checkBannerResult?.enabled) return <></>;
  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          zIndex: '100',
          textAlign: 'center',
          backgroundColor: checkBannerResult?.color ?? '#fea300', // #ffc627
          color: '#333',
          boxSizing: 'border-box',
          padding: '7px 10px',
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="body1"
            noWrap
            component="span"
            onClick={() => {
              navigate('/');
            }}
          >
            {(!checkBannerResult?.name || checkBannerResult?.name === '') &&
              (!checkBannerResult?.message ||
                checkBannerResult?.message === '') && (
                <>
                  <span style={{ fontWeight: 'bold' }}>
                    {'Hlambda - Environment'}
                  </span>
                </>
              )}

            {checkBannerResult?.name && checkBannerResult?.name !== '' && (
              <>
                {'Environment name:'}{' '}
                <span style={{ fontWeight: 'bold' }}>
                  {checkBannerResult?.name}
                </span>
              </>
            )}
            {checkBannerResult?.message && checkBannerResult?.message !== '' && (
              <>
                {checkBannerResult?.name &&
                  checkBannerResult?.name !== '' &&
                  ' · '}
                <span style={{ fontWeight: 'bold' }}>
                  {checkBannerResult?.message}
                </span>
              </>
            )}
            {/* {' · '}
            {'Metadata updated at:'}{' '}
            <span style={{ fontWeight: 'bold' }}>
              {checkBannerResult?.metadataUpdatedAt}
            </span>
            {' · '}
            {'Metadata hash:'}{' '}
            <span style={{ fontWeight: 'bold' }}>
              {checkBannerResult?.metadataHash}
            </span> */}
          </Typography>
          <IconButton
            size="large"
            aria-label="Close bar"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => {
              console.log('Close!');
              setHidden(true);
            }}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </Container>
      </div>
    </>
  );
}

export default Banner;

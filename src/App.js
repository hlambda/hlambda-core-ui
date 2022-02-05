import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
//import './app.css';

import Login from './components/login/Login';
import Logout from './components/logout/Logout';
import NotFound from './components/not-found/NotFound';

import HomePage from './views/Home';
import CommandsPage from './views/Commands';
import ConfigurationPage from './views/Configuration';
import RoutesPage from './views/Routes';
import LogsPage from './views/Logs';
import ConstantsPage from './views/Constants';
import ErrorsPage from './views/Errors';
import EventsPage from './views/Events';
import MetadataPage from './views/Metadata';
import SettingsPage from './views/Settings';
import VsCodeWebPage from './views/VsCodeWebPage';

//import DashboardPage from './components/dashboard/Dashboard';

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import { Provider } from 'use-http';

import { useAuth } from './context/basicAuthContext';

const RequireAuth = ({ children }) => {
  const auth = useAuth();
  const adminSecret = auth.getToken();

  const location = useLocation();
  if (
    adminSecret === '' ||
    adminSecret === null ||
    typeof adminSecret === 'undefined'
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Todo: Maybe verify token

  return children;
};

const Page = (props) => {
  React.useEffect(() => {
    document.title = props.title || '';
  }, [props.title]);
  return props.children;
};

function App() {
  const auth = useAuth();

  const options = {
    persist: false, // Cache should not persist!!!
    cachePolicy: 'no-cache',
    headers: {
      Accept: 'application/json',
      'x-hlambda-admin-secret': auth.getToken(),
    },
    interceptors: {
      // every time we make an http request, this will run 1st before the request is made
      // url, path and route are supplied to the interceptor
      // request options can be modified and must be returned
      request: async ({ options, url, path, route }) => {
        // console.log(auth?.getToken());
        options.headers['x-hlambda-admin-secret'] = auth.getToken();
        return options;
      },
      // // every time we make an http request, before getting the response back, this will run
      // response: async ({ response }) => {
      //   const res = response
      //   if (res.data) res.data = toCamel(res.data)
      //   return res
      // }
    },
  };

  return (
    <Provider url={process.env.REACT_APP_API_URL} options={options}>
      <BrowserRouter basename={'/console'}>
        <CssBaseline />
        <Routes>
          <Route
            path="/login"
            element={
              <Page title="Login | Hlambda">
                <Login />
              </Page>
            }
          />
          <Route
            path="/logout"
            element={
              <Page title="Logout | Hlambda">
                <Logout />
              </Page>
            }
          />

          <Route
            index
            path="/"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <HomePage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/code"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <VsCodeWebPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/shell"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <CommandsPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/env"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <ConfigurationPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/routes"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <RoutesPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/logs"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <LogsPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/constants"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <ConstantsPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/errors"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <ErrorsPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/events"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <EventsPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/metadata"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <MetadataPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <SettingsPage />
                </Page>
              </RequireAuth>
            }
          />

          {/* <Route
            path="/demo/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          /> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer theme="dark" />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'use-http';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/login/Login';
import Logout from './components/logout/Logout';
import NotFound from './components/not-found/NotFound';

import HomePage from './views/Home';
import CommandsPage from './views/Commands';
import ConfigurationPage from './views/Configuration';
import EnvironmentsPage from './views/Environments';
import RoutesPage from './views/Routes';
import CodePage from './views/Code';
import LogsPage from './views/Logs';
import ConstantsPage from './views/Constants';
import ErrorsPage from './views/Errors';
import EventsPage from './views/Events';
import MetadataPage from './views/Metadata';
import SettingsPage from './views/Settings';
import DocumentationPage from './views/Docs';
import NewsPage from './views/News';

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
      // Every time we make an http request, this will run 1st before the request is made
      // url, path and route are supplied to the interceptor
      // request options can be modified and must be returned
      request: async ({ options, url, path, route }) => {
        // console.log(auth?.getToken());
        options.headers['x-hlambda-admin-secret'] = auth.getToken();
        return options;
      },
      // // Every time we make an http request, before getting the response back, this will run
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
                  <CodePage
                    type="routes"
                    defaultFile="metadata/apps/example-demo-app/router.demo.js"
                  />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/shell"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <CodePage
                    type="shell"
                    openDefaultShell
                    defaultFile="metadata/apps/example-demo-app/router.demo.js"
                  />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/shell-old"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <CommandsPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/configurations"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <CodePage
                    type="configurations"
                    defaultFile="metadata/apps/example-demo-app/hlambda-config.yaml"
                  />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/configurations-old"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <ConfigurationPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/environments"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <EnvironmentsPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/routes-old"
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
            path="/documentation"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <DocumentationPage />
                </Page>
              </RequireAuth>
            }
          />
          <Route
            path="/news"
            element={
              <RequireAuth>
                <Page title="Console | Hlambda">
                  <NewsPage />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="bottom-right" theme="dark" />
      </BrowserRouter>
    </Provider>
  );
}

export default App;

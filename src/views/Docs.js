import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Editor from '@monaco-editor/react';

import TopBar from './../components/top-bar';

import useFetch from 'use-http';

function DocumentationPage() {
  const { get, post, response, loading, error } = useFetch();

  const content = `# This is the basic documentation provided by the API.
  
# Constant reference in code: ENV_HLAMBDA_ADMIN_SECRET | Default value: 
# Master password for API management.
HLAMBDA_ADMIN_SECRET=""

# Constant reference in code: ENV_DISABLE_COLORS_IN_STDOUT | Default value: false
# Set to true if you want to disable colorful output to stdout, it helps if you use AWS CloudWatch
DISABLE_COLORS_IN_STDOUT="false"

# Constant reference in code: ENV_LOG_LEVELS | Default value: critical,normal,verbose
# Sets up logging level: critical, normal, verbose
LOG_LEVELS="critical,normal,verbose"

# Constant reference in code: ENV_SERVER_PORT | Default value: 4005
# Server port on which express app will be hosted
SERVER_PORT="4005"

# Constant reference in code: ENV_SERVER_SOURCE_IP | Default value: 0.0.0.0
# Server source ip on which express app will be listening
SERVER_SOURCE_IP="0.0.0.0"

# Constant reference in code: ENV_MICROSERVICE_NAME | Default value: hlambda
# Used in fetching microservice specific configuration and inside error messages.
MICROSERVICE_NAME="hlambda"

# Constant reference in code: ENV_SERVER_BODY_SIZE | Default value: 2mb
# Server max allowed body size from client that express app will support. (Main usecase is Apple Subscription Notifications)
SERVER_BODY_SIZE="2mb"

# Constant reference in code: ENV_HLAMBDA_CORS_DOMAIN | Default value: *
# By default, all CORS requests to the Hlambda server are allowed. To run with more restrictive CORS settings, use this env variable. Example: \`https://*.foo.bar.com:8080, http://*.localhost, http://localhost:3000, http://example.com\`
HLAMBDA_CORS_DOMAIN="*"

# Constant reference in code: ENV_SERVER_HEALTH | Default value: Healthy
# Server health that can change based on different events "Healthy", "Degraded", "Unhealthy", "Advisory"
SERVER_HEALTH="Healthy"

# Constant reference in code: ENV_HLAMBDA_DISABLE_ADMIN_SECRET | Default value: false
# Disables or enables master password for API management.
HLAMBDA_DISABLE_ADMIN_SECRET="false"

# Constant reference in code: ENV_HLAMBDA_DISABLE_CONSOLE | Default value: false
# Completely disables Console and Console API thus any metadata update.
HLAMBDA_DISABLE_CONSOLE="false"

# Constant reference in code: ENV_HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT | Default value: false
# Disable 301 redirect from the root path to the \`/console\`.
HLAMBDA_DISABLE_INITIAL_ROUTE_REDIRECT="false"

# Constant reference in code: ENV_HLAMBDA_DISABLE_CONSOLE_FRONTEND | Default value: false
# Disable static serving of the frontend artefacts from hlambda's public folder.
HLAMBDA_DISABLE_CONSOLE_FRONTEND="false"

# Constant reference in code: ENV_HLAMBDA_CONSOLE_ASSETS_DIR | Default value: public
# If set it will serve console assets from that directory instead of CDN. Using CDN enables system to have lates UI and receive Console hotfixes without the need for updating image.
HLAMBDA_CONSOLE_ASSETS_DIR="public"

# Constant reference in code: ENV_HLAMBDA_METADATA_RELOAD_DEBOUNCE_MS | Default value: 1331
# Debounce ms time to wait before closing the server and reloading metadata.
HLAMBDA_METADATA_RELOAD_DEBOUNCE_MS="1331"

# Constant reference in code: ENV_HLAMBDA_LOADED_APPS_PREFIX | Default value: /api/v1/
# Prefix used for all the loaded router apps.
HLAMBDA_LOADED_APPS_PREFIX="/api/v1/"

# Constant reference in code: ENV_HLAMBDA_ENABLE_PUBLIC_SWAGGER | Default value: false
# Flag to enable public swagger on /docs.
HLAMBDA_ENABLE_PUBLIC_SWAGGER="false"

# Constant reference in code: ENV_HLAMBDA_PUBLIC_SWAGGER_ROUTE | Default value: /docs
# Flag to map swagger route, default \`/docs\`.
HLAMBDA_PUBLIC_SWAGGER_ROUTE="/docs"

# Constant reference in code: ENV_HLAMBDA_CONFIGURATION_LOADER_PREFIX | Default value: hlambda-config.yaml
# Sets the value for the name of the configuration file that will be loaded.
HLAMBDA_CONFIGURATION_LOADER_PREFIX="hlambda-config.yaml"

# Constant reference in code: ENV_HLAMBDA_EXPRESS_LOADER_PREFIX | Default value: router.
# Sets the value for the prefix of the router files that will be loaded.
HLAMBDA_EXPRESS_LOADER_PREFIX="router."

# Constant reference in code: ENV_HLAMBDA_ENTRYPOINT_LOADER_PREFIX | Default value: entrypoint.
# Sets the value for the prefix of the entrypoint files that will be loaded.
HLAMBDA_ENTRYPOINT_LOADER_PREFIX="entrypoint."

# Constant reference in code: ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER | Default value: false
# Enables environment banner.
HLAMBDA_ENABLE_ENVIRONMENT_BANNER="false"

# Constant reference in code: ENV_HLAMBDA_ENVIRONMENT_BANNER_NAME | Default value: 
# Sets name to the environment banner.
HLAMBDA_ENVIRONMENT_BANNER_NAME=""

# Constant reference in code: ENV_HLAMBDA_ENVIRONMENT_BANNER_MESSAGE | Default value: 
# Sets message to the environment banner.
HLAMBDA_ENVIRONMENT_BANNER_MESSAGE=""

# Constant reference in code: ENV_HLAMBDA_ENABLE_ENVIRONMENT_BANNER_COLOR | Default value: #fea300
# Selects color of the environment banner.
HLAMBDA_ENABLE_ENVIRONMENT_BANNER_COLOR="#fea300"

# Constant reference in code: ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES | Default value: ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES,HLAMBDA_DISABLE_CONSOLE,HLAMBDA_ADMIN_SECRET
# List of the env variable names that are protected from hlambda config override.
HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES="ENV_HLAMBDA_LIST_OF_PROTECTED_ENV_VARIABLES,HLAMBDA_DISABLE_CONSOLE,HLAMBDA_ADMIN_SECRET"

`;

  return (
    <>
      <TopBar />
      <Container maxWidth="xl" style={{ paddingTop: '20px' }}>
        <Box
          sx={{
            marginTop: 2,
            marginBottom: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h3" variant="h6">
            {`It wouldn't be meta if we didn't also have documentation? :)`}
          </Typography>

          <div style={{ width: '100%', paddingTop: '20px' }}>
            <Editor
              height="calc(100vh - 12rem)"
              language={'markdown'}
              defaultValue={content}
              value={content}
              theme="vs-dark"
              readOnly={true}
              onMount={(editor) => {
                editor.updateOptions({ readOnly: true });
              }}
            />
          </div>
        </Box>
      </Container>
    </>
  );
}

export default DocumentationPage;

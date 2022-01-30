import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import useLocalStorage from './../hooks/useLocalStorage';

// ---

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [memoryType, setMemoryType] = React.useState('local-storage'); // options: 'local-storage', 'memory-storage'
  const [tokenInMem, setTokenInMem] = React.useState('');
  const [tokenInLocalStorage, setTokenInLocalStorage] = useLocalStorage(
    process.env.REACT_APP_TOKEN_NAME,
    ''
  );

  const getToken = () => {
    if (memoryType === 'local-storage') {
      return tokenInLocalStorage;
    } else {
      return tokenInMem;
    }
  };

  const signin = async (newToken, rememberInThisBrowser) => {
    if (rememberInThisBrowser) {
      setMemoryType('local-storage');
      await setTokenInLocalStorage(newToken);
    } else {
      setMemoryType('memory-storage');
      await setTokenInMem(newToken);
    }
    // console.log('Token changed...', token, newToken);
    console.log('signin');
  };

  const signout = async () => {
    if (memoryType === 'local-storage') {
      setTokenInLocalStorage('');
    } else {
      setToken('');
    }
    console.log('signout');
  };

  const verifySession = async (insertedToken) => {
    const results = await axios
      .get('/console/api/v1/check-connection', {
        headers: {
          'x-hlambda-admin-secret': insertedToken,
        },
      })
      .then((response) => {
        console.log(response);
        return true;
      })
      .catch((error) => {
        console.log('[fetch-error]', error);
        const response = error?.response?.data;
        console.log(response);
        if (response?.message) {
          toast.error(`${response?.message}`);
        } else if (error) {
          toast.error(`${error}`);
        }
        return false;
      });

    return results;
  };

  const value = { getToken, signin, signout, verifySession };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

import { useEffect, useState } from 'react';

// Get the prefix, fallback to empty string if env is not set.
const PREFIX = process.env.REACT_APP_STORAGE_PREFIX ?? '';

export default function useSessionStorage(key, initialValue) {
  const prefixedKey = `${PREFIX}:${key}`;
  const [value, setValue] = useState(() => {
    const jsonValue = sessionStorage.getItem(prefixedKey);
    if (jsonValue != null) {
      try {
        return JSON.parse(jsonValue);
      } catch (error) {
        console.log(
          '[useSessionStorage] Warning while parsing JSON from session storage'
        );
        if (
          `${process.env.REACT_APP_VERBOSE_OUTPUT}`.toLowerCase() === 'true'
        ) {
          console.error(error);
        }
        return initialValue;
      }
    }
    if (typeof initialValue === 'function') {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(prefixedKey, JSON.stringify(value));
    return () => {};
  }, [prefixedKey, value]);

  return [value, setValue];
}

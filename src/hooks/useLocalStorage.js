import { useEffect, useState } from 'react';

const PREFIX = process.env.REACT_APP_STORAGE_PREFIX;

export default function useLocalStorage(key, initialValue) {
  const prefixedKey = `${PREFIX}:${key}`;
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey);
    if (jsonValue != null) return JSON.parse(jsonValue);
    if (typeof initialValue === 'function') {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value));
    return () => {};
  }, [prefixedKey, value]);

  return [value, setValue];
}

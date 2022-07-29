/*
  Legacy function, please use useSessionStorage hook in ./hooks/ folder
*/

export function getSessionStorageOrDefault(key, defaultValue) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
}

export default getSessionStorageOrDefault;

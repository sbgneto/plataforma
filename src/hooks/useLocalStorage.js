import { useCallback, useState } from 'react';
import { getItem, setItem } from '../services/storageService';

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => getItem(key, defaultValue));

  const updateValue = useCallback(
    (newValue) => {
      setValue((prev) => {
        const resolved = typeof newValue === 'function' ? newValue(prev) : newValue;
        setItem(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, updateValue];
}

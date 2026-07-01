import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export function useUser() {
  const [userName, setUserName] = useLocalStorage(STORAGE_KEYS.CURRENT_USER, '');

  return {
    userName,
    setUserName,
    hasUser: Boolean(userName && userName.trim().length > 0),
  };
}

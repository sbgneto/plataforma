import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import * as soundService from '../services/soundService';

const DEFAULT_SETTINGS = { muted: false };

export function useSound() {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  const muted = settings?.muted ?? false;

  useEffect(() => {
    soundService.setMuted(muted);
  }, [muted]);

  const toggleMuted = useCallback(() => {
    setSettings((prev) => ({ ...(prev ?? DEFAULT_SETTINGS), muted: !(prev?.muted ?? false) }));
  }, [setSettings]);

  return {
    muted,
    toggleMuted,
    playCorrect: soundService.playCorrect,
    playWrong: soundService.playWrong,
    playClick: soundService.playClick,
    playCombo: soundService.playCombo,
  };
}

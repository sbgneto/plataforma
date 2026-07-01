import { useCallback, useEffect, useRef, useState } from 'react';

export function useGameTimer(durationMs, onTimeout) {
  const [timeLeftMs, setTimeLeftMs] = useState(durationMs);
  const rafRef = useRef(null);
  const endTimeRef = useRef(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    endTimeRef.current = Date.now() + durationMs;
    setTimeLeftMs(durationMs);

    const tick = () => {
      const remaining = Math.max(0, endTimeRef.current - Date.now());
      setTimeLeftMs(remaining);
      if (remaining <= 0) {
        stop();
        onTimeoutRef.current?.();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [durationMs, stop]);

  useEffect(() => stop, [stop]);

  return { timeLeftMs, start, stop };
}

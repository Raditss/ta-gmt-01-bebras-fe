import { useState, useEffect, useRef } from 'react';

export function useDuration(initialDuration: number = 0) {
  const [duration, setDuration] = useState<number>(initialDuration);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    lastUpdateRef.current = Date.now();
    setDuration(initialDuration);

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);
      
      if (elapsed >= 1) {
        setDuration(prev => prev + 1);
        lastUpdateRef.current = now - (now - lastUpdateRef.current) % 1000;
      }
    }, 100); // Check more frequently but only update when a full second has passed

    return () => clearInterval(interval);
  }, [initialDuration]);

  return {
    duration,
    formattedDuration: `${Math.floor(duration / 60)}m ${duration % 60}s`,
    getCurrentDuration: () => duration
  };
} 
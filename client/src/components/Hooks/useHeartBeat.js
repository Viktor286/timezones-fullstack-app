import { useRef, useState } from 'react';

// restart setTimeout on each rerender
export default function useHeartBeat(seconds) {
  const [lastUpdated, setLastUpdated] = useState(new Date().getTime());
  const minTimeout = useRef('');

  clearTimeout(minTimeout.current);
  minTimeout.current = setTimeout(() => {
    const now = new Date().getTime();
    if (now > lastUpdated + seconds * 1000) {
      setLastUpdated(now);
    }
  }, seconds * 1000);

  return lastUpdated;
}

import { useEffect, useState } from "react";

export function useSplashTimer(isBooting) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (isBooting) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [isBooting]);

  return showSplash || isBooting;
}

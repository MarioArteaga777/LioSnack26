import { useEffect, useState } from "react";

/**
 * Custom hook que controla el tiempo de visualización de la pantalla de carga (Splash Screen)
 * Muestra el splash durante 1.8 segundos o mientras la app está inicializando
 * 
 * @param {boolean} isBooting - Indica si la aplicación aún está inicializando
 * @returns {boolean} true mientras debe mostrarse el splash screen, false cuando debe ocultarse
 * 
 * @example
 * const showSplash = useSplashTimer(isBooting);
 * if (showSplash) return <SplashScreen />;
 */
export function useSplashTimer(isBooting) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (isBooting) {
      return undefined;
    }

    // Temporizador de 1.8 segundos para mostrar el splash
    const timeoutId = setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => clearTimeout(timeoutId);
  }, [isBooting]);

  return showSplash || isBooting;
}

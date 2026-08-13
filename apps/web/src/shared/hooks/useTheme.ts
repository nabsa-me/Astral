import { useCallback, useEffect, useState } from 'react';
import lightTheme from '../../styles/themes/light.module.css';
import darkTheme from '../../styles/themes/dark.module.css';

export type ThemeName = 'light' | 'dark';

/** Applies a theme class to <html>. Standalone so the entry point can set the
 * initial theme before React mounts (no store dependency, unlike Todoy). */
export const applyTheme = (theme: ThemeName = 'light'): void => {
  const root = document.documentElement;
  root.classList.remove(lightTheme.theme, darkTheme.theme);
  root.classList.add(theme === 'dark' ? darkTheme.theme : lightTheme.theme);
};

const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeName>('light');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeName) => setThemeState(next), []);

  return { theme, setTheme };
};

export default useTheme;

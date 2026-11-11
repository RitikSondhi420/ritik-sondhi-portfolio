import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ThemeState, ThemeMode } from '../types';

const THEME_KEY = 'ritik_portfolio_theme_v1';

const getInitialTheme = (): ThemeMode => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch {
    // fallback
  }
  return 'dark';
};

const applyThemeToDOM = (theme: ThemeMode) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
};

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

const initialState: ThemeState = {
  theme: initialTheme,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      applyThemeToDOM(action.payload);
    },
    toggleTheme: (state) => {
      const nextTheme: ThemeMode = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = nextTheme;
      applyThemeToDOM(nextTheme);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

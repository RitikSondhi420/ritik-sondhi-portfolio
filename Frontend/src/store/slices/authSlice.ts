import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import type { AuthState } from '../types';

const AUTH_KEY = 'ritik_portfolio_auth_v1';
const JWT_STORAGE_KEY = 'ritik_portfolio_jwt';

const getInitialAuthState = (): AuthState => {
  let isLoggedIn = false;
  let token: string | null = null;
  try {
    isLoggedIn = localStorage.getItem(AUTH_KEY) === 'true';
    token = localStorage.getItem(JWT_STORAGE_KEY);
  } catch {
    // fallback
  }
  return {
    isLoggedIn,
    token,
    status: 'idle',
    error: null,
  };
};

export const loginAdmin = createAsyncThunk<
  { success: boolean; token?: string },
  { user: string; pass: string },
  { rejectValue: string }
>('auth/loginAdmin', async ({ user, pass }, { rejectWithValue }) => {
  try {
    const result = await api.login(user, pass);
    if (result.success) {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
        if (result.token) {
          localStorage.setItem(JWT_STORAGE_KEY, result.token);
        }
      } catch {
        // ignore
      }
      return { success: true, token: result.token };
    }
    return rejectWithValue('Invalid username or password');
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Login failed');
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    logout: (state) => {
      api.logout();
      state.isLoggedIn = false;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      try {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(JWT_STORAGE_KEY);
      } catch {
        // ignore
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoggedIn = true;
        state.token = action.payload.token || null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoggedIn = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;


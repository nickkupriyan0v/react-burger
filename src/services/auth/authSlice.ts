import { API_DOMAIN } from '@/utils/api';
import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import type { TUser } from '@/utils/types';

type AuthState = {
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isInitializing: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,
  isInitializing: false,
};

export const checkAuth = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      return;
    }

    try {
      const response = await fetch(`${API_DOMAIN}/api/auth/user`, {
        method: 'GET',
        headers: {
          Authorization: accessToken,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return rejectWithValue('Invalid token');
      }

      const data = (await response.json()) as { success: boolean; user: TUser };

      if (data.success && data.user) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          dispatch(setAuthTokens({ user: data.user, accessToken, refreshToken }));
        }
      }
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return rejectWithValue('Failed to check auth');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthTokens: (
      state,
      action: PayloadAction<{ user: TUser; accessToken: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;

      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    restoreAuth: (state) => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');

      if (accessToken && refreshToken && userStr) {
        try {
          const user = JSON.parse(userStr) as TUser;
          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.isInitialized = true;
        state.isInitializing = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isInitialized = true;
        state.isInitializing = false;
      });
  },
});

export const { setAuthTokens, updateAccessToken, logout, restoreAuth } =
  authSlice.actions;
export default authSlice.reducer;

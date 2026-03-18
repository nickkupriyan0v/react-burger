import { API_DOMAIN } from '@/utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { TUser } from '@/utils/types';

export type TCheckAuthPayload = {
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export const checkAuth = createAsyncThunk<
  TCheckAuthPayload | void,
  void,
  { rejectValue: string }
>('auth/checkAuth', async (_, { rejectWithValue }) => {
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
        return { user: data.user, accessToken, refreshToken };
      }
    }
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return rejectWithValue('Failed to check auth');
  }
});

import { API_DOMAIN } from '@/utils/api';

import type { TRefreshTokenResponse } from '@/utils/types';

export async function triggerTokenRefresh(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_DOMAIN}/api/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = (await response.json()) as TRefreshTokenResponse;

    if (!data.success) {
      throw new Error('Token refresh unsuccessful');
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.accessToken;
  } catch (_error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    return null;
  }
}

export function createFetchWithTokenRefresh() {
  let isRefreshing = false;
  let refreshPromise: Promise<string | null> | null = null;

  return async function fetchWithTokenRefresh(
    url: string,
    options: RequestInit & { headers: { authorization?: string } } = {
      headers: {},
    }
  ): Promise<Response> {
    let response = await fetch(url, options);

    if (response.status === 401 && options.headers?.authorization) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        return response;
      }

      if (isRefreshing && refreshPromise) {
        const newAccessToken = await refreshPromise;
        if (newAccessToken) {
          options.headers.authorization = `Bearer ${newAccessToken}`;
          response = await fetch(url, options);
        }
        return response;
      }

      isRefreshing = true;
      refreshPromise = triggerTokenRefresh(refreshToken).finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        options.headers.authorization = `Bearer ${newAccessToken}`;
        response = await fetch(url, options);
      }
    }

    return response;
  };
}

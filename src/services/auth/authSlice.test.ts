import { describe, it, expect, beforeEach, vi } from 'vitest';

import authReducer, {
  setAuthTokens,
  updateAccessToken,
  logout,
  restoreAuth,
} from './authSlice';

import type { TUser } from '@/utils/types';

describe('authSlice', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      const initialState = authReducer(undefined, { type: 'unknown' });

      expect(initialState).toEqual({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isInitialized: false,
        isInitializing: false,
      });
    });
  });

  describe('setAuthTokens', () => {
    it('should set user, tokens, and update isAuthenticated', () => {
      const user: TUser = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';

      const newState = authReducer(
        undefined,
        setAuthTokens({ user, accessToken, refreshToken })
      );

      expect(newState.user).toEqual(user);
      expect(newState.accessToken).toBe(accessToken);
      expect(newState.refreshToken).toBe(refreshToken);
      expect(newState.isAuthenticated).toBe(true);
    });

    it('should save tokens to localStorage', () => {
      const user: TUser = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';

      authReducer(undefined, setAuthTokens({ user, accessToken, refreshToken }));

      expect(localStorage.getItem('accessToken')).toBe(accessToken);
      expect(localStorage.getItem('refreshToken')).toBe(refreshToken);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
    });
  });

  describe('updateAccessToken', () => {
    it('should update accessToken and save to localStorage', () => {
      const newAccessToken = 'new-access-token-456';

      const newState = authReducer(undefined, updateAccessToken(newAccessToken));

      expect(newState.accessToken).toBe(newAccessToken);
      expect(localStorage.getItem('accessToken')).toBe(newAccessToken);
    });
  });

  describe('logout', () => {
    it('should clear all auth state', () => {
      const user: TUser = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';

      let state = authReducer(
        undefined,
        setAuthTokens({ user, accessToken, refreshToken })
      );
      expect(state.isAuthenticated).toBe(true);

      state = authReducer(state, logout());

      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.refreshToken).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should remove tokens from localStorage', () => {
      const user: TUser = {
        email: 'test@example.com',
        name: 'Test User',
      };

      authReducer(
        undefined,
        setAuthTokens({
          user,
          accessToken: 'token1',
          refreshToken: 'token2',
        })
      );

      authReducer(undefined, logout());

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('restoreAuth', () => {
    it('should restore auth from localStorage when tokens exist', () => {
      const user: TUser = {
        email: 'test@example.com',
        name: 'Test User',
      };
      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      const newState = authReducer(undefined, restoreAuth());

      expect(newState.user).toEqual(user);
      expect(newState.accessToken).toBe(accessToken);
      expect(newState.refreshToken).toBe(refreshToken);
      expect(newState.isAuthenticated).toBe(true);
    });

    it('should not restore auth if tokens are missing', () => {
      const newState = authReducer(undefined, restoreAuth());

      expect(newState.user).toBeNull();
      expect(newState.accessToken).toBeNull();
      expect(newState.refreshToken).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
    });

    it('should handle invalid user JSON in localStorage', () => {
      localStorage.setItem('accessToken', 'token');
      localStorage.setItem('refreshToken', 'token');
      localStorage.setItem('user', 'invalid-json');

      const newState = authReducer(undefined, restoreAuth());

      expect(newState.user).toBeNull();
      expect(newState.accessToken).toBeNull();
      expect(newState.refreshToken).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});

import { API_DOMAIN } from '@/utils/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { checkAuth } from './asyncThunks';

import type {
  TAuthResponse,
  TForgotPasswordRequest,
  TLoginRequest,
  TLogoutRequest,
  TLogoutResponse,
  TPasswordResetResponse,
  TRefreshTokenRequest,
  TRefreshTokenResponse,
  TRegisterRequest,
  TResetPasswordRequest,
  TUpdateUserRequest,
  TUpdateUserResponse,
  TUser,
} from '@/utils/types';

export { checkAuth };

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_DOMAIN}/api/` }),
  endpoints: (builder) => ({
    register: builder.mutation<TAuthResponse, TRegisterRequest>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<TAuthResponse, TLoginRequest>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
    refreshToken: builder.mutation<TRefreshTokenResponse, TRefreshTokenRequest>({
      query: (body) => ({
        url: 'auth/token',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<TLogoutResponse, TLogoutRequest>({
      query: (body) => ({
        url: 'auth/logout',
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation<TPasswordResetResponse, TForgotPasswordRequest>({
      query: (body) => ({
        url: 'password-reset',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<TPasswordResetResponse, TResetPasswordRequest>({
      query: (body) => ({
        url: 'password-reset/reset',
        method: 'POST',
        body,
      }),
    }),
    getUser: builder.query<{ success: boolean; user: TUser }, string>({
      query: (token) => ({
        url: 'auth/user',
        method: 'GET',
        headers: {
          Authorization: token,
        },
      }),
    }),
    updateUser: builder.mutation<
      TUpdateUserResponse,
      { body: TUpdateUserRequest; accessToken: string }
    >({
      query: ({ body, accessToken }) => ({
        url: 'auth/user',
        method: 'PATCH',
        body,
        headers: {
          Authorization: accessToken,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = authApi;

import { API_DOMAIN } from '@/utils/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TOrder, TOrderRequest } from '@/utils/types';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_DOMAIN}/api/` }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<TOrder, TOrderRequest>({
      query: (body) => ({
        url: 'orders',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = ordersApi;

import { API_DOMAIN } from '@/utils/api';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TIngredient } from '@/utils/types';

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_DOMAIN}/api/` }),
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => 'ingredients',
      transformResponse: (response: { data: TIngredient[] }) => response.data,
    }),
  }),
});

export const { useGetIngredientsQuery } = ingredientsApi;

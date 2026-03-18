import { configureStore } from '@reduxjs/toolkit';

import { authApi } from './auth';
import authReducer from './auth/authSlice';
import burgerConstructorReducer from './burger-constructor';
import { ingredientsApi } from './ingredients';
import modalIngredientReducer from './modal-ingredient';
import { ordersApi } from './orders';

export const store = configureStore({
  reducer: {
    [ingredientsApi.reducerPath]: ingredientsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    burgerConstructor: burgerConstructorReducer,
    modalIngredient: modalIngredientReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ingredientsApi.middleware)
      .concat(ordersApi.middleware)
      .concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

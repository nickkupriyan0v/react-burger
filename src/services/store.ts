import { configureStore } from '@reduxjs/toolkit';

import burgerConstructorReducer from './burger-constructor';
import { ingredientsApi } from './ingredients';
import modalIngredientReducer from './modal-ingredient';
import { ordersApi } from './orders';

export const store = configureStore({
  reducer: {
    [ingredientsApi.reducerPath]: ingredientsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    burgerConstructor: burgerConstructorReducer,
    modalIngredient: modalIngredientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ingredientsApi.middleware)
      .concat(ordersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

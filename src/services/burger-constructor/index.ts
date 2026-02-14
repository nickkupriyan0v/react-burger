import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';

import type { RootState } from '@/services/store';
import type { TIngredient } from '@/utils/types';

export type TConstructorIngredient = TIngredient & {
  uniqueKey: string;
};

type BurgerConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: TIngredient | null;
};

const initialState: BurgerConstructorState = {
  ingredients: [],
  bun: null,
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredientWithKey: TConstructorIngredient = {
        ...action.payload,
        uniqueKey: nanoid(),
      };
      state.ingredients.push(ingredientWithKey);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ing) => ing.uniqueKey !== action.payload
      );
    },
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.bun = action.payload;
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
  },
});

export const { addIngredient, removeIngredient, setBun, moveIngredient } =
  burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;

export const selectTotalPrice = (state: RootState): number => {
  const { bun, ingredients } = state.burgerConstructor;
  let total = 0;

  if (bun) {
    total += bun.price * 2;
  }

  ingredients.forEach((ing) => {
    total += ing.price;
  });

  return total;
};

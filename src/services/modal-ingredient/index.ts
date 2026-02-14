import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

type ModalIngredientState = {
  selectedIngredient: TIngredient | null;
};

const initialState: ModalIngredientState = {
  selectedIngredient: null,
};

const modalIngredientSlice = createSlice({
  name: 'modalIngredient',
  initialState,
  reducers: {
    selectIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
    },
  },
});

export const { selectIngredient, clearSelectedIngredient } =
  modalIngredientSlice.actions;
export default modalIngredientSlice.reducer;

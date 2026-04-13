import { describe, it, expect } from 'vitest';

import modalIngredientReducer, {
  selectIngredient,
  clearSelectedIngredient,
} from './index';

import type { TIngredient } from '@/utils/types';

describe('modalIngredientSlice', () => {
  const mockIngredient: TIngredient = {
    _id: 'ing-1',
    name: 'Beef Patty',
    type: 'main',
    proteins: 26,
    fat: 11,
    carbohydrates: 0,
    calories: 179,
    price: 300,
    image: '/img/beef.png',
    image_large: '/img/beef-large.png',
    image_mobile: '/img/beef-mobile.png',
    __v: 0,
  };

  const mockIngredient2: TIngredient = {
    _id: 'ing-2',
    name: 'Sauce',
    type: 'sauce',
    proteins: 0,
    fat: 2,
    carbohydrates: 1,
    calories: 20,
    price: 50,
    image: '/img/sauce.png',
    image_large: '/img/sauce-large.png',
    image_mobile: '/img/sauce-mobile.png',
    __v: 0,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      const initialState = modalIngredientReducer(undefined, { type: 'unknown' });

      expect(initialState).toEqual({
        selectedIngredient: null,
      });
    });
  });

  describe('selectIngredient', () => {
    it('should set a selected ingredient', () => {
      const newState = modalIngredientReducer(
        undefined,
        selectIngredient(mockIngredient)
      );

      expect(newState.selectedIngredient).toEqual(mockIngredient);
    });

    it('should replace the selected ingredient', () => {
      let state = modalIngredientReducer(undefined, selectIngredient(mockIngredient));
      expect(state.selectedIngredient).toEqual(mockIngredient);

      state = modalIngredientReducer(state, selectIngredient(mockIngredient2));
      expect(state.selectedIngredient).toEqual(mockIngredient2);
      expect(state.selectedIngredient?._id).toBe('ing-2');
    });
  });

  describe('clearSelectedIngredient', () => {
    it('should clear the selected ingredient', () => {
      let state = modalIngredientReducer(undefined, selectIngredient(mockIngredient));
      expect(state.selectedIngredient).toEqual(mockIngredient);

      state = modalIngredientReducer(state, clearSelectedIngredient());
      expect(state.selectedIngredient).toBeNull();
    });

    it('should do nothing if ingredient is already null', () => {
      const state = modalIngredientReducer(undefined, clearSelectedIngredient());

      expect(state.selectedIngredient).toBeNull();
    });
  });
});

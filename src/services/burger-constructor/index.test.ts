import { describe, it, expect } from 'vitest';

import burgerConstructorReducer, {
  addIngredientAction,
  removeIngredient,
  setBun,
  moveIngredient,
  clearConstructor,
  selectTotalPrice,
} from './index';

import type { TConstructorIngredient } from './index';
import type { RootState } from '@/services/store';
import type { TIngredient } from '@/utils/types';

describe('burgerConstructorSlice', () => {
  const mockBun: TIngredient = {
    _id: 'bun-1',
    name: 'Sesame Bun',
    type: 'bun',
    proteins: 7,
    fat: 4,
    carbohydrates: 36,
    calories: 86,
    price: 200,
    image: '/img/bun.png',
    image_large: '/img/bun-large.png',
    image_mobile: '/img/bun-mobile.png',
    __v: 0,
  };

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
      const initialState = burgerConstructorReducer(undefined, { type: 'unknown' });

      expect(initialState).toEqual({
        ingredients: [],
        bun: null,
      });
    });
  });

  describe('addIngredientAction', () => {
    it('should add an ingredient to the ingredients array', () => {
      const constructorIngredient: TConstructorIngredient = {
        ...mockIngredient,
        uniqueKey: 'key-1',
      };

      const newState = burgerConstructorReducer(
        undefined,
        addIngredientAction(constructorIngredient)
      );

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toEqual(constructorIngredient);
    });

    it('should add multiple ingredients', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        uniqueKey: 'key-1',
      };
      const ingredient2: TConstructorIngredient = {
        ...mockIngredient2,
        uniqueKey: 'key-2',
      };

      let state = burgerConstructorReducer(undefined, {
        type: 'unknown',
      });
      state = burgerConstructorReducer(state, addIngredientAction(ingredient1));
      state = burgerConstructorReducer(state, addIngredientAction(ingredient2));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].uniqueKey).toBe('key-1');
      expect(state.ingredients[1].uniqueKey).toBe('key-2');
    });
  });

  describe('setBun', () => {
    it('should set a bun', () => {
      const newState = burgerConstructorReducer(undefined, setBun(mockBun));

      expect(newState.bun).toEqual(mockBun);
    });

    it('should replace an existing bun', () => {
      let state = burgerConstructorReducer(undefined, setBun(mockBun));
      expect(state.bun).toEqual(mockBun);

      const newBun: TIngredient = {
        ...mockBun,
        _id: 'bun-2',
        name: 'White Bun',
      };

      state = burgerConstructorReducer(state, setBun(newBun));
      expect(state.bun).toEqual(newBun);
      expect(state.bun?.name).toBe('White Bun');
    });

    it('should clear bun when null is passed', () => {
      let state = burgerConstructorReducer(undefined, setBun(mockBun));
      expect(state.bun).toEqual(mockBun);

      state = burgerConstructorReducer(state, setBun(null));
      expect(state.bun).toBeNull();
    });
  });

  describe('removeIngredient', () => {
    it('should remove an ingredient by uniqueKey', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        uniqueKey: 'key-1',
      };
      const ingredient2: TConstructorIngredient = {
        ...mockIngredient2,
        uniqueKey: 'key-2',
      };

      let state = burgerConstructorReducer(undefined, {
        type: 'unknown',
      });
      state = burgerConstructorReducer(state, addIngredientAction(ingredient1));
      state = burgerConstructorReducer(state, addIngredientAction(ingredient2));

      state = burgerConstructorReducer(state, removeIngredient('key-1'));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].uniqueKey).toBe('key-2');
    });

    it('should do nothing if ingredient with key not found', () => {
      const ingredient: TConstructorIngredient = {
        ...mockIngredient,
        uniqueKey: 'key-1',
      };

      let state = burgerConstructorReducer(undefined, {
        type: 'unknown',
      });
      state = burgerConstructorReducer(state, addIngredientAction(ingredient));

      state = burgerConstructorReducer(state, removeIngredient('non-existent-key'));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].uniqueKey).toBe('key-1');
    });
  });

  describe('moveIngredient', () => {
    it('should move an ingredient from one position to another', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        uniqueKey: 'key-1',
      };
      const ingredient2: TConstructorIngredient = {
        ...mockIngredient2,
        uniqueKey: 'key-2',
      };
      const ingredient3: TConstructorIngredient = {
        ...mockIngredient,
        uniqueKey: 'key-3',
      };

      let state = burgerConstructorReducer(undefined, {
        type: 'unknown',
      });
      state = burgerConstructorReducer(state, addIngredientAction(ingredient1));
      state = burgerConstructorReducer(state, addIngredientAction(ingredient2));
      state = burgerConstructorReducer(state, addIngredientAction(ingredient3));

      state = burgerConstructorReducer(
        state,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(state.ingredients[0].uniqueKey).toBe('key-2');
      expect(state.ingredients[1].uniqueKey).toBe('key-3');
      expect(state.ingredients[2].uniqueKey).toBe('key-1');
    });

    it('should move an ingredient from higher index to lower', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        uniqueKey: 'key-1',
      };
      const ingredient2: TConstructorIngredient = {
        ...mockIngredient2,
        uniqueKey: 'key-2',
      };
      const ingredient3: TConstructorIngredient = {
        ...mockIngredient,
        uniqueKey: 'key-3',
      };

      let state = burgerConstructorReducer(undefined, {
        type: 'unknown',
      });
      state = burgerConstructorReducer(state, addIngredientAction(ingredient1));
      state = burgerConstructorReducer(state, addIngredientAction(ingredient2));
      state = burgerConstructorReducer(state, addIngredientAction(ingredient3));

      state = burgerConstructorReducer(
        state,
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );

      expect(state.ingredients[0].uniqueKey).toBe('key-3');
      expect(state.ingredients[1].uniqueKey).toBe('key-1');
      expect(state.ingredients[2].uniqueKey).toBe('key-2');
    });
  });

  describe('clearConstructor', () => {
    it('should clear all ingredients and bun', () => {
      const ingredient: TConstructorIngredient = {
        ...mockIngredient,
        uniqueKey: 'key-1',
      };

      let state = burgerConstructorReducer(undefined, {
        type: 'unknown',
      });
      state = burgerConstructorReducer(state, setBun(mockBun));
      state = burgerConstructorReducer(state, addIngredientAction(ingredient));

      expect(state.bun).toBeDefined();
      expect(state.ingredients).toHaveLength(1);

      state = burgerConstructorReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('selectTotalPrice', () => {
    it('should calculate total price with bun and ingredients', () => {
      const mockState = {
        burgerConstructor: {
          bun: mockBun,
          ingredients: [
            { ...mockIngredient, uniqueKey: 'key-1' },
            { ...mockIngredient2, uniqueKey: 'key-2' },
          ],
        },
        auth: {} as unknown,
        modalIngredient: {} as unknown,
        ingredientsApi: {} as unknown,
        ordersApi: {} as unknown,
        authApi: {} as unknown,
      } as RootState;

      const totalPrice = selectTotalPrice(mockState);

      // Bun price * 2 + ingredient1 + ingredient2
      const expectedPrice =
        mockBun.price * 2 + mockIngredient.price + mockIngredient2.price;
      expect(totalPrice).toBe(expectedPrice);
    });

    it('should calculate total price with only bun', () => {
      const mockState = {
        burgerConstructor: {
          bun: mockBun,
          ingredients: [],
        },
        auth: {} as unknown,
        modalIngredient: {} as unknown,
        ingredientsApi: {} as unknown,
        ordersApi: {} as unknown,
        authApi: {} as unknown,
      } as RootState;

      const totalPrice = selectTotalPrice(mockState);
      expect(totalPrice).toBe(mockBun.price * 2);
    });

    it('should calculate total price with only ingredients', () => {
      const mockState = {
        burgerConstructor: {
          bun: null,
          ingredients: [
            { ...mockIngredient, uniqueKey: 'key-1' },
            { ...mockIngredient2, uniqueKey: 'key-2' },
          ],
        },
        auth: {} as unknown,
        modalIngredient: {} as unknown,
        ingredientsApi: {} as unknown,
        ordersApi: {} as unknown,
        authApi: {} as unknown,
      } as RootState;

      const totalPrice = selectTotalPrice(mockState);
      expect(totalPrice).toBe(mockIngredient.price + mockIngredient2.price);
    });

    it('should return 0 when there are no ingredients or bun', () => {
      const mockState = {
        burgerConstructor: {
          bun: null,
          ingredients: [],
        },
        auth: {} as unknown,
        modalIngredient: {} as unknown,
        ingredientsApi: {} as unknown,
        ordersApi: {} as unknown,
        authApi: {} as unknown,
      } as RootState;

      const totalPrice = selectTotalPrice(mockState);
      expect(totalPrice).toBe(0);
    });
  });
});

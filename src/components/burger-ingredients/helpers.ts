import type { TIngredient, TIngredientType } from '@/utils/types';

type TGroupedIngredients = { type: TIngredientType; ingredients: TIngredient[] };

export const groupByType = (ingredients: TIngredient[]): TGroupedIngredients[] => {
  const map = new Map<TIngredientType, TIngredient[]>();

  ingredients.forEach((item) => {
    const existing = map.get(item.type);
    if (existing) {
      existing.push(item);
    } else {
      map.set(item.type, [item]);
    }
  });

  return Array.from(map.entries()).map(([type, ingredients]) => ({
    type,
    ingredients,
  }));
};

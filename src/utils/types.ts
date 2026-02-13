export const IngredientType = {
  Bun: 'bun',
  Main: 'main',
  Sauce: 'sauce',
} as const;

export type TIngredientType = (typeof IngredientType)[keyof typeof IngredientType];

export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TTab = { title: string; id: string };

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

export type TOrder = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export type TOrderRequest = {
  ingredients: string[];
};

export type TUser = {
  email: string;
  name: string;
};

export type TRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TRefreshTokenRequest = {
  token: string;
};

export type TRefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TLogoutRequest = {
  token: string;
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
};

export type TForgotPasswordRequest = {
  email: string;
};

export type TPasswordResetResponse = {
  success: boolean;
  message: string;
};

export type TResetPasswordRequest = {
  password: string;
  token: string;
};

export type TUpdateUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type TUpdateUserResponse = {
  success: boolean;
  user: TUser;
};

import { ingredientTypeMapping } from '@/utils/constants';
import React, { forwardRef } from 'react';

import { BurgerIngredient } from '../burger-ingredient/burger-ingredient';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-ingredient-section.module.css';

type TBurgerIngredientSectionProps = {
  type: TIngredientType;
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
  titleRef?: React.Ref<HTMLHeadingElement>;
};

const BurgerIngredientSectionComponent = forwardRef<
  HTMLElement,
  TBurgerIngredientSectionProps
>(
  (
    { type, ingredients, onIngredientClick, titleRef }: TBurgerIngredientSectionProps,
    ref
  ): React.JSX.Element => {
    return (
      <article ref={ref} id={type}>
        <h3 ref={titleRef} className="text text_type_main-medium">
          {ingredientTypeMapping[type]}
        </h3>
        <ul className={styles.ingredients_list}>
          {ingredients.map((ingredient) => (
            <BurgerIngredient
              key={ingredient._id}
              ingredient={ingredient}
              onIngredientClick={onIngredientClick}
            />
          ))}
        </ul>
      </article>
    );
  }
);

BurgerIngredientSectionComponent.displayName = 'BurgerIngredientSection';

export const BurgerIngredientSection = React.memo(BurgerIngredientSectionComponent);

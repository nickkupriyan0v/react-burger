import { ingredientTypeMapping } from '@/utils/constants';

import { BurgerIngredient } from '../burger-ingredient/burger-ingredient';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-ingredient-section.module.css';

type TBurgerIngredientSectionProps = {
  type: TIngredientType;
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
  ref?: React.Ref<HTMLElement>;
};

export const BurgerIngredientSection = ({
  type,
  ingredients,
  onIngredientClick,
  ref,
}: TBurgerIngredientSectionProps): React.JSX.Element => {
  return (
    <article ref={ref} id={type}>
      <h3 className="text text_type_main-medium">{ingredientTypeMapping[type]}</h3>
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
};

import { Counter } from '@krgaa/react-developer-burger-ui-components';

import { Price } from '../price/price';

import type { TIngredient } from '@/utils/types';

import styles from './burger-ingredient.module.css';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
  onIngredientClick: (ingredient: TIngredient) => void;
};
export const BurgerIngredient = ({
  ingredient,
  onIngredientClick,
}: TBurgerIngredientProps): React.JSX.Element => {
  return (
    <div
      className={styles.burger_ingredient}
      onClick={() => onIngredientClick(ingredient)}
    >
      <Counter count={1} size="default" />
      <img src={ingredient.image} alt="" />
      <Price price={ingredient.price} />
      <div>{ingredient.name}</div>
    </div>
  );
};

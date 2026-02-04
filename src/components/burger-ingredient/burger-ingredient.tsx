import { Counter } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { Price } from '../price/price';

import type { TIngredient } from '@/utils/types';

import styles from './burger-ingredient.module.css';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
};
export const BurgerIngredient = ({
  ingredient,
}: TBurgerIngredientProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.burger_ingredient} onClick={() => setOpen(true)}>
        <Counter count={1} size="default" />
        <img src={ingredient.image} alt="" />
        <Price price={ingredient.price} />
        <div>{ingredient.name}</div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Детали ингредиента">
        <IngredientDetails ingredient={ingredient} />
      </Modal>
    </>
  );
};

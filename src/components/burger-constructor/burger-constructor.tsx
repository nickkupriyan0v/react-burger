import { BurgerConstructorItem } from '../burger-constructor-item/burger-constructor-item';
import { BurgerConstructorOrder } from '../burger-constructor-order/burger-constructor-order';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  return (
    <section className={styles.burger_constructor}>
      <ul className={styles.burger_constructor_items}>
        {ingredients.map((ingredient, index) => (
          <BurgerConstructorItem
            key={ingredient._id}
            ingredient={ingredient}
            isLocked={index === 0 || index === ingredients.length - 1}
            type={
              index === 0
                ? 'top'
                : index === ingredients.length - 1
                  ? 'bottom'
                  : undefined
            }
          />
        ))}
      </ul>
      <BurgerConstructorOrder />
    </section>
  );
};

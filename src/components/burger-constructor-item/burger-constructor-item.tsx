import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor-item.module.css';

type TBurgerConstructorItemProps = {
  ingredient: TIngredient;
  isLocked: boolean;
  type?: 'top' | 'bottom';
};

export const BurgerConstructorItem = ({
  ingredient,
  isLocked,
  type,
}: TBurgerConstructorItemProps): React.JSX.Element => {
  return (
    <li className={styles.burger_constructor_item}>
      <div className={styles.handle}>
        {isLocked ? null : <DragIcon type="primary" />}
      </div>
      <ConstructorElement
        isLocked={isLocked}
        type={type}
        key={ingredient._id}
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
      />
    </li>
  );
};

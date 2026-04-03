import { useAppSelector } from '@/hooks/redux';
import { IngredientType, type TIngredient } from '@/utils/types';
import { Counter } from '@krgaa/react-developer-burger-ui-components';
import React, { useMemo, useRef } from 'react';
import { useDrag } from 'react-dnd';

import { Price } from '../price/price';

import styles from './burger-ingredient.module.css';

type TBurgerIngredientProps = {
  ingredient: TIngredient;
  onIngredientClick: (ingredient: TIngredient) => void;
};

const BurgerIngredientComponent = ({
  ingredient,
  onIngredientClick,
}: TBurgerIngredientProps): React.JSX.Element => {
  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);

  const ref = useRef<HTMLDivElement>(null);

  const count = useMemo(() => {
    if (ingredient.type === IngredientType.Bun) {
      return bun?._id === ingredient._id ? 2 : 0;
    }
    return ingredients.filter((ing) => ing._id === ingredient._id).length;
  }, [ingredient, bun, ingredients]);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'ingredient-list',
      item: {
        ingredient,
      },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  drag(ref);

  return (
    <div
      ref={ref}
      className={styles.burger_ingredient}
      onClick={() => onIngredientClick(ingredient)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {count ? <Counter count={count} size="default" /> : null}
      <img src={ingredient.image} alt={ingredient.name} />
      <Price price={ingredient.price} />
      <div>{ingredient.name}</div>
    </div>
  );
};

export const BurgerIngredient = React.memo(BurgerIngredientComponent);

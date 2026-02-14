import { addIngredient, setBun } from '@/services/burger-constructor';
import { IngredientType, type TIngredient } from '@/utils/types';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { BurgerConstructorItem } from '../burger-constructor-item/burger-constructor-item';
import { BurgerConstructorOrder } from '../burger-constructor-order/burger-constructor-order';
import { EmptyState } from '../empty-state/empty-state';

import type { AppDispatch, RootState } from '@/services/store';

import styles from './burger-constructor.module.css';

type DragItem = {
  ingredient?: TIngredient;
  type?: string;
  index?: number;
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const sectionRef = useRef<HTMLElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'ingredient-list',
      drop: (item: DragItem): void => {
        if (item.ingredient) {
          const ingredient = item.ingredient;
          if (ingredient.type === IngredientType.Bun) {
            dispatch(setBun(ingredient));
          } else {
            dispatch(addIngredient(ingredient));
          }
        }
      },
      collect: (monitor): { isOver: boolean } => ({
        isOver: monitor.isOver(),
      }),
    }),
    [dispatch]
  );

  drop(sectionRef);

  const isEmpty = !bun && !ingredients.length;

  return (
    <section
      ref={sectionRef}
      className={styles.burger_constructor}
      style={{
        border: isOver ? '2px dashed #4c4c4c' : '2px dashed transparent',
      }}
    >
      {isEmpty ? (
        <EmptyState />
      ) : (
        <ul ref={ulRef} className={styles.burger_constructor_items}>
          {bun && <BurgerConstructorItem ingredient={bun} isLocked type="top" />}
          {ingredients.map((ingredient, index) => (
            <BurgerConstructorItem
              key={ingredient.uniqueKey}
              ingredient={ingredient}
              index={index}
            />
          ))}
          {bun && <BurgerConstructorItem ingredient={bun} isLocked type="bottom" />}
        </ul>
      )}

      <BurgerConstructorOrder />
    </section>
  );
};

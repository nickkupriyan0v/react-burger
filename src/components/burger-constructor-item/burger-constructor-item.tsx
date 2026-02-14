import { useAppDispatch } from '@/hooks/redux';
import { removeIngredient, moveIngredient } from '@/services/burger-constructor';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor-item.module.css';

type TBurgerConstructorItemProps = {
  ingredient: TIngredient & { uniqueKey?: string };
  isLocked?: boolean;
  type?: 'top' | 'bottom';
  index?: number;
};

type DragItem = {
  index?: number;
  type?: string;
};

export const BurgerConstructorItem = ({
  ingredient,
  isLocked = false,
  type,
  index = -1,
}: TBurgerConstructorItemProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'constructor-item',
      item: {
        index,
        type: 'constructor-item',
      },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: !isLocked,
    }),
    [index, isLocked]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'constructor-item',
      hover: (item: DragItem): void => {
        if (
          !ref.current ||
          item.index === undefined ||
          item.index === index ||
          index < 0 ||
          item.index < 0
        ) {
          return;
        }

        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex !== hoverIndex) {
          dispatch(moveIngredient({ fromIndex: dragIndex, toIndex: hoverIndex }));
          item.index = hoverIndex;
        }
      },
      collect: (monitor): { isOver: boolean } => ({
        isOver: monitor.isOver(),
      }),
    }),
    [index, dispatch]
  );

  drag(drop(ref));

  const handleRemove = (): void => {
    const uniqueKey = (ingredient as TIngredient & { uniqueKey?: string }).uniqueKey;
    if (uniqueKey) {
      dispatch(removeIngredient(uniqueKey));
    }
  };

  const getBunText = (): string => {
    if (type === 'top') {
      return `${ingredient.name} (верх)`;
    }
    if (type === 'bottom') {
      return `${ingredient.name} (низ)`;
    }
    return ingredient.name;
  };

  return (
    <li
      ref={ref}
      className={styles.burger_constructor_item}
      data-index={index}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? '#2f2f37' : 'transparent',
      }}
    >
      <div className={styles.handle}>
        {isLocked ? null : <DragIcon type="primary" />}
      </div>
      <ConstructorElement
        isLocked={isLocked}
        type={type}
        text={getBunText()}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={!isLocked ? handleRemove : undefined}
      />
    </li>
  );
};

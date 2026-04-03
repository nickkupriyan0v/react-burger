import React, { useMemo } from 'react';

import IngredientPreview from '../ingredient-preview/ingredient-preview';

import type { TIngredient } from '@/utils/types';

import styles from './ingredients-preview.module.css';

type TIngredientsPreviewProps = {
  ingredients: TIngredient[];
  maxVisible?: number;
};

const IngredientsPreviewComponent = ({
  ingredients,
  maxVisible = 5,
}: TIngredientsPreviewProps): React.JSX.Element => {
  const { visibleItems, hiddenCount } = useMemo(() => {
    const visible = ingredients.slice(0, maxVisible);
    const hidden = ingredients.length - maxVisible;

    return {
      visibleItems: visible,
      hiddenCount: hidden > 0 ? hidden : 0,
    };
  }, [ingredients, maxVisible]);

  return (
    <div className={styles.stack}>
      {visibleItems.map((ingredient, index) => {
        const isLast = index === visibleItems.length - 1;

        return (
          <div
            key={index}
            className={styles.item}
            style={{ zIndex: visibleItems.length - index }}
          >
            <IngredientPreview
              image={ingredient.image_mobile}
              name={ingredient.name}
              count={isLast ? hiddenCount : undefined}
            />
          </div>
        );
      })}
    </div>
  );
};

export const IngredientsPreview = React.memo(IngredientsPreviewComponent);

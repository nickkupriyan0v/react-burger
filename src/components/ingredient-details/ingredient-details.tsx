import type { TIngredient } from '@/utils/types';

import styles from './ingredient-details.module.css';
type TIngredientDetailsProps = {
  ingredient: TIngredient;
};
export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  return (
    <div className={styles.ingredient_details}>
      <img src={ingredient.image_large} alt={ingredient.name} />
      <h2 className="text text_type_main-medium mt-4">{ingredient.name}</h2>
      <div className={`${styles.ingredient_meta} mt-8 mb-8`}>
        <div className={styles.ingredient_meta_item}>
          <p className="text text_type_main-default text_color_inactive">
            Калории, ккал
          </p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.calories}
          </p>
        </div>
        <div className={styles.ingredient_meta_item}>
          <p className="text text_type_main-default text_color_inactive">Белки, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.proteins}
          </p>
        </div>
        <div className={styles.ingredient_meta_item}>
          <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.fat}
          </p>
        </div>
        <div className={styles.ingredient_meta_item}>
          <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.carbohydrates}
          </p>
        </div>
      </div>
    </div>
  );
};

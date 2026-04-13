import { type FC, memo } from 'react';

import styles from './ingredient-preview.module.css';

type TIngredientPreviewProps = {
  image: string;
  name: string;
  count?: number;
};

const IngredientPreview: FC<TIngredientPreviewProps> = ({ image, name, count }) => {
  return (
    <div className={styles.container} aria-label={name}>
      <img src={image} alt={name} className={styles.image} />
      {count ? <div className={styles.overlay}>+{count}</div> : null}
    </div>
  );
};

export default memo(IngredientPreview);

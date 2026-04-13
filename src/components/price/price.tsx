import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import React from 'react';

import styles from './price.module.css';

type TPriceProps = {
  price: number;
};

const PriceComponent = ({ price }: TPriceProps): React.JSX.Element => {
  return (
    <div className={styles.price}>
      <span className="text text_type_digits-default">{price}</span>
      <CurrencyIcon type="primary" />
    </div>
  );
};

export const Price = React.memo(PriceComponent);

import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './price.module.css';

type TPriceProps = {
  price: number;
};
export const Price = ({ price }: TPriceProps): React.JSX.Element => {
  return (
    <div className={styles.price}>
      <span className="text text_type_digits-default">{price}</span>
      <CurrencyIcon type="primary" />
    </div>
  );
};

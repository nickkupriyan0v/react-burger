import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
import { Price } from '../price/price';

import styles from './burger-constructor-order.module.css';

export const BurgerConstructorOrder = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.burger_constructor_order}>
      <Price price={3000} />
      <Button
        htmlType="button"
        type="primary"
        size="large"
        onClick={() => setOpen(true)}
      >
        Оформить заказ
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <OrderDetails />
      </Modal>
    </div>
  );
};

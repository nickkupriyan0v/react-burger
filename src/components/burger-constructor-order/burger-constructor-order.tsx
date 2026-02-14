import { useTotalPrice } from '@/hooks/useTotalPrice';
import { useCreateOrderMutation } from '@/services/orders';
import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
import { Price } from '../price/price';

import type { RootState } from '@/services/store';

import styles from './burger-constructor-order.module.css';

export const BurgerConstructorOrder = (): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const { bun, ingredients } = useSelector(
    (state: RootState) => state.burgerConstructor
  );
  const totalPrice = useTotalPrice();
  const [createOrder, { isLoading, isError, error }] = useCreateOrderMutation();

  const handleOrderClick = (): void => {
    if (!bun || ingredients.length === 0) {
      return;
    }

    const ingredientIds = [bun._id, ...ingredients.map((ing) => ing._id), bun._id];

    createOrder({ ingredients: ingredientIds })
      .unwrap()
      .then((response: { order: { number: number } }) => {
        setOrderNumber(response.order.number);
        setOpen(true);
      })
      .catch((err: unknown) => {
        console.error('Ошибка при создании заказа:', err);
      });
  };

  useEffect(() => {
    if (!open) {
      setOrderNumber(null);
    }
  }, [open]);

  return (
    <div className={styles.burger_constructor_order}>
      <Price price={totalPrice} />
      <Button
        htmlType="button"
        type="primary"
        size="large"
        onClick={handleOrderClick}
        disabled={!bun || ingredients.length === 0 || isLoading}
      >
        {isLoading ? 'Оформляется...' : 'Оформить заказ'}
      </Button>
      {isError && (
        <p className="text text_type_main-small mt-4" style={{ color: 'red' }}>
          {error && 'data' in error
            ? ((error.data as { message?: string }).message ??
              'Ошибка при создании заказа')
            : 'Ошибка при создании заказа'}
        </p>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <OrderDetails orderNumber={orderNumber} />
      </Modal>
    </div>
  );
};

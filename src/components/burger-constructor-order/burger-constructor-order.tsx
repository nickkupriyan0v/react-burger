import { ROUTES } from '@/core/router-config';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useTotalPrice } from '@/hooks/useTotalPrice';
import { clearConstructor } from '@/services/burger-constructor';
import { useCreateOrderMutation } from '@/services/orders';
import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
import { Price } from '../price/price';

import styles from './burger-constructor-order.module.css';

export const BurgerConstructorOrder = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const totalPrice = useTotalPrice();
  const [createOrder, { isLoading, isError, error }] = useCreateOrderMutation();

  const handleOrderClick = (): void => {
    if (!isAuthenticated) {
      void navigate(ROUTES.Login, { state: { from: { pathname: ROUTES.Home } } });
      return;
    }

    if (!bun || ingredients.length === 0) {
      return;
    }

    const ingredientIds = [bun._id, ...ingredients.map((ing) => ing._id), bun._id];

    createOrder({ ingredients: ingredientIds })
      .unwrap()
      .then((response: { order: { number: number } }) => {
        setOrderNumber(response.order.number);
        setOpen(true);
        dispatch(clearConstructor());
      })
      .catch((err: unknown) => {
        console.error('Ошибка при создании заказа:', err);
      });
  };

  const handleCloseModal = (): void => {
    setOpen(false);
    setOrderNumber(null);
  };

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
      <Modal open={open} onClose={handleCloseModal}>
        <OrderDetails orderNumber={orderNumber} />
      </Modal>
    </div>
  );
};

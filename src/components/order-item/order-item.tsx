import { useGetIngredientsMap } from '@/services/ingredients';
import { FormattedDate } from '@krgaa/react-developer-burger-ui-components';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IngredientsPreview } from '../ingredients-preview/ingredients-preview';
import { Price } from '../price/price';

import type { TWSOrder } from '@/utils/types';

import styles from './order-item.module.css';

const statusMap = {
  created: 'Создан',
  pending: 'В работе',
  done: 'Выполнен',
};

type TOrderItemProps = {
  order: TWSOrder;
  showStatus?: boolean;
};

const OrderItemComponent = ({
  order,
  showStatus,
}: TOrderItemProps): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const allIngredients = useGetIngredientsMap();

  const orderIngredients = useMemo(() => {
    return order.ingredients
      .map((ingredientId) => allIngredients[ingredientId])
      .filter(Boolean);
  }, [allIngredients, order.ingredients]);

  const price = useMemo(() => {
    return orderIngredients.reduce((acc, curr) => (acc += curr.price), 0);
  }, [orderIngredients]);

  const handleOrderClick = (): void => {
    const basePath = location.pathname.includes('/profile')
      ? '/profile/orders'
      : '/feed';
    void navigate(`${basePath}/${order._id}`, {
      state: { background: location },
    });
  };

  return (
    <section className={styles.order_item} onClick={handleOrderClick}>
      <div className={styles.order_item_header}>
        <div className="text text_type_digits-default"># {order.number}</div>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
      </div>
      <div className="text text_type_main-medium">{order.name}</div>
      {showStatus && (
        <div
          className={`text text_type_main-default ${
            order.status === 'done' ? styles.status_done : styles.status_pending
          }`}
        >
          {statusMap[order.status]}
        </div>
      )}
      <div className={styles.order_item_footer}>
        <IngredientsPreview ingredients={orderIngredients} />
        <Price price={price} />
      </div>
    </section>
  );
};

export const OrderItem = React.memo(OrderItemComponent);

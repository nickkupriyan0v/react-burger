import { useAppSelector } from '@/hooks/redux';
import { useGetIngredientsMap } from '@/services/ingredients';
import {
  useGetOrderByIdQuery,
  useGetOrdersWithStatus,
  useGetUserOrdersWithStatus,
} from '@/services/orders';
import { FormattedDate } from '@krgaa/react-developer-burger-ui-components';
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import IngredientPreview from '../ingredient-preview/ingredient-preview';
import { Modal } from '../modal/modal';
import { Price } from '../price/price';

import styles from './order-content.module.css';

type TOrderContentProps = {
  isModal?: boolean;
};

const statusMap = {
  created: 'Создан',
  pending: 'В работе',
  done: 'Выполнен',
};

const OrderContentComponent = ({
  isModal = false,
}: TOrderContentProps): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const allIngredients = useGetIngredientsMap();

  const { orders: feedOrders } = useGetOrdersWithStatus();
  const { orders: userOrders } = useGetUserOrdersWithStatus(accessToken ?? '');

  const cachedOrder = useMemo(() => {
    if (!id) return undefined;
    return feedOrders.find((o) => o._id === id) ?? userOrders.find((o) => o._id === id);
  }, [id, feedOrders, userOrders]);

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useGetOrderByIdQuery(id ?? '', { skip: !id || !!cachedOrder });

  const order = useMemo(() => {
    if (cachedOrder) return cachedOrder;
    return apiResponse?.orders?.[0];
  }, [cachedOrder, apiResponse]);

  const orderIngredients = useMemo(() => {
    if (!order) return [];
    return order.ingredients
      .map((ingredientId) => allIngredients[ingredientId])
      .filter(Boolean);
  }, [order, allIngredients]);

  const price = useMemo(() => {
    return orderIngredients.reduce((acc, curr) => (acc += curr.price), 0);
  }, [orderIngredients]);

  if (!id) {
    return null;
  }

  if (isLoading && !cachedOrder) {
    return null;
  }

  if (!order) {
    if (error) {
      void navigate('/not-found', { replace: true });
    }
    return null;
  }

  const handleCloseModal = (): void => {
    void navigate(-1);
  };

  const orderContent = (
    <div className={styles.order_content}>
      <div className={`${styles.order_header} mb-10`}>
        <p className="text text_type_digits-default"># {order.number}</p>
      </div>
      <div className="mb-3">
        <p className="text text_type_main-medium">{order.name}</p>
      </div>
      <div className={`status} mb-15`}>
        <p
          className={`text text_type_main-default ${
            order.status === 'done' ? styles.status_done : styles.status_pending
          }`}
        >
          {statusMap[order.status]}
        </p>
      </div>
      <div className={`${styles.composition} mb-6`}>
        <p className="text text_type_main-medium">Состав:</p>
        <div className={styles.ingredients_list}>
          {orderIngredients.map((ingredient, idx) => (
            <div key={idx} className={styles.ingredient_item}>
              <div className={styles.ingredient_info}>
                <IngredientPreview
                  image={ingredient.image_mobile}
                  name={ingredient.name}
                />
                <span className="text text_type_main-default">{ingredient.name}</span>
              </div>
              <Price price={ingredient.price} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.order_footer}>
        <p className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </p>
        <div className={styles.total_price}>
          <Price price={price} />
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <Modal open onClose={handleCloseModal}>
        {orderContent}
      </Modal>
    );
  }

  return (
    <div className="p-25" style={{ display: 'flex', justifyContent: 'center' }}>
      <div>{orderContent}</div>
    </div>
  );
};

export const OrderContent = React.memo(OrderContentComponent);

import { useGetOrdersWithStatus } from '@/services/orders';

import { OrderItem } from '../order-item/order-item';

import styles from './orders-list.module.css';

export const OrdersList = (): React.JSX.Element => {
  const { orders } = useGetOrdersWithStatus();

  return (
    <section className={styles.orders_list}>
      {orders?.map((order) => (
        <OrderItem order={order} key={order._id} />
      ))}
    </section>
  );
};

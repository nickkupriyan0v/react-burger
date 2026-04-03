import { OrderItem } from '@/components/order-item/order-item';
import { useAppSelector } from '@/hooks/redux';
import { useGetUserOrdersWithStatus } from '@/services/orders';

import styles from './profile-orders-page.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const { orders } = useGetUserOrdersWithStatus(accessToken ?? '');

  return (
    <section className={styles.profile_orders_page}>
      {orders.map((order) => (
        <OrderItem showStatus order={order} key={order._id} />
      ))}
    </section>
  );
};

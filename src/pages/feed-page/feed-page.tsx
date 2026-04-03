import { OrdersList } from '@/components/orders-list/orders-list';
import { OrdersStats } from '@/components/orders-stats/orders-stats';

import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Лента заказов
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <OrdersList />
        <OrdersStats />
      </main>
    </>
  );
};

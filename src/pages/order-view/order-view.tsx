import { OrderContent } from '@/components/order-content/order-content';
import { useLocation } from 'react-router-dom';

import { FeedPage } from '../feed-page/feed-page';
import { ProfileOrdersPage } from '../profile-orders-page/profile-orders-page';

export const OrderView = (): React.JSX.Element | null => {
  const location = useLocation();
  const state = location.state as { background?: unknown } | null;
  const isModal = Boolean(state?.background);
  const isProfileOrder = location.pathname.includes('/profile/orders');

  if (isModal) {
    const BackgroundComponent = isProfileOrder ? ProfileOrdersPage : FeedPage;

    return (
      <>
        <BackgroundComponent />
        <OrderContent isModal />
      </>
    );
  }

  return <OrderContent isModal={false} />;
};

import { HelperLink } from '@/components/helper-link/helper-link';
import { ROUTES } from '@/core/router-config';

import styles from './not-found-page.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <section className={styles.not_found_page}>
      <p className="text text_type_digits-large">404</p>
      <HelperLink text="Потерялись?" linkText="На главную" link={ROUTES.Home} />
    </section>
  );
};

import { NavLink } from 'react-router-dom';

import styles from './nav-item.module.css';

type NavItemProps = {
  to: string;
  children: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode);
};

export const NavItem = ({ to, children }: NavItemProps): React.JSX.Element => {
  return (
    <div className={styles.nav_item}>
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          isActive
            ? `${styles.nav_link} ${styles.nav_link_active} text text_type_main-medium`
            : `${styles.nav_link} text text_type_main-medium text_color_inactive`
        }
      >
        {typeof children === 'function' ? children : children}
      </NavLink>
    </div>
  );
};

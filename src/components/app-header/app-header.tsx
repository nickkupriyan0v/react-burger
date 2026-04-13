import { ROUTES } from '@/core/router-config';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import { NavItem } from '../nav-item/nav-item';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavItem to={ROUTES.Home}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default">Конструктор</p>
              </>
            )}
          </NavItem>
          <NavItem to={ROUTES.Feed}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default">Лента заказов</p>
              </>
            )}
          </NavItem>
        </div>
        <div className={styles.logo}>
          <Link to={ROUTES.Home}>
            <Logo />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          <NavItem to={ROUTES.Profile}>
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default">Личный кабинет</p>
              </>
            )}
          </NavItem>
        </div>
      </nav>
    </header>
  );
};

import { PROFILE_ROUTES, ROUTES } from '@/core/router-config';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useLogoutMutation } from '@/services/auth';
import { logout as logoutAction } from '@/services/auth/authSlice';
import { useState } from 'react';

import { NavItem } from '../nav-item/nav-item';

import styles from './profile-side-nav.module.css';

export const ProfileSideNav = (): React.JSX.Element => {
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');

  const handleLogout = (): void => {
    if (!refreshToken) {
      setError('Токен не найден');
      return;
    }

    void (async (): Promise<void> => {
      try {
        await logout({ token: refreshToken }).unwrap();
        dispatch(logoutAction());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при выходе');
      }
    })();
  };

  return (
    <aside className={styles.profile_side_nav}>
      <nav>
        <ul className={styles.nav_list}>
          <NavItem to={ROUTES.Profile}>Профиль</NavItem>
          <NavItem to={`${ROUTES.Profile}${PROFILE_ROUTES.Orders}`}>
            История заказов
          </NavItem>
          <li
            className={`text text_type_main-medium text_color_inactive ${styles.logout}`}
            onClick={handleLogout}
          >
            Выход
          </li>
        </ul>

        {error && <div style={{ color: 'red', marginTop: '16px' }}>{error}</div>}
      </nav>

      <p className="text text_type_main-default text_color_inactive">
        В этом разделе вы можете изменить свои персональные данные
      </p>
    </aside>
  );
};

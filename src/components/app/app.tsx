import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { checkAuth } from '@/services/auth/authSlice';
import { useGetIngredientsQuery } from '@/services/ingredients';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { isLoading, isError } = useGetIngredientsQuery({});
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);

  useEffect(() => {
    void dispatch(checkAuth());
  }, [dispatch]);

  if (!isInitialized || isLoading) {
    return (
      <section className={styles.preloader}>
        <Preloader />
      </section>
    );
  }
  if (isError) {
    return (
      <section className={styles.error}>
        <p>Произошла ошибка</p>
      </section>
    );
  }
  return (
    <div className={styles.app}>
      <AppHeader />
      <Outlet />
    </div>
  );
};

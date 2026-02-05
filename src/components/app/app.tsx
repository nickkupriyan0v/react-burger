import { useFetch } from '@/hooks/useFetch';
import { API_DOMAIN } from '@/utils/api';
import { Button, Preloader } from '@krgaa/react-developer-burger-ui-components';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const { data, loading, error, refetch } = useFetch<{ data: TIngredient[] }>(
    `${API_DOMAIN}/api/ingredients`
  );

  if (loading) {
    return (
      <section className={styles.preloader}>
        <Preloader />
      </section>
    );
  }
  if (error) {
    return (
      <section className={styles.error}>
        <p>Произошла ошибка</p>
        <Button
          htmlType="button"
          onClick={() => {
            void refetch();
          }}
        >
          Обновить
        </Button>
      </section>
    );
  }
  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={data?.data ?? []} />
        <BurgerConstructor ingredients={data?.data ?? []} />
      </main>
    </div>
  );
};

export default App;

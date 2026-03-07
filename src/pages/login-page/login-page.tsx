import { HelperLink } from '@/components/helper-link/helper-link';
import { ROUTES } from '@/core/router-config';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useLoginMutation } from '@/services/auth';
import { setAuthTokens } from '@/services/auth/authSlice';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import type { TLoginRequest } from '@/utils/types';

import styles from '../pages.module.css';

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState<TLoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as { from?: { pathname: string } } | null;
      const fromLocation = state?.from?.pathname ?? '/';
      void navigate(fromLocation, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(
      (prev): TLoginRequest => ({
        ...prev,
        [name]: value,
      })
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');

    void (async (): Promise<void> => {
      try {
        const result = await login(formData).unwrap();

        dispatch(
          setAuthTokens({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          })
        );

        setFormData({
          email: '',
          password: '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при входе');
      }
    })();
  };

  return (
    <section className={styles.form_page}>
      <h2 className={`text text_type_main-medium ${styles.form_page_header}`}>Вход</h2>
      <form onSubmit={handleSubmit} className={styles.form_page_content}>
        <EmailInput value={formData.email} onChange={handleInputChange} name="email" />
        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>

        {error && <div style={{ color: 'red', marginTop: '16px' }}>{error}</div>}
      </form>

      <section className={styles.form_page_footer}>
        <HelperLink
          text="Вы — новый пользователь?"
          link={ROUTES.Register}
          linkText="Зарегистрироваться"
        />
        <HelperLink
          text="Забыли пароль?"
          link={ROUTES.ForgotPassword}
          linkText="Восстановить пароль"
        />
      </section>
    </section>
  );
};

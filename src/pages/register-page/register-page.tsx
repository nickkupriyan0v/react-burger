import { HelperLink } from '@/components/helper-link/helper-link';
import { ROUTES } from '@/core/router-config';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useRegisterMutation } from '@/services/auth';
import { setAuthTokens } from '@/services/auth/authSlice';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import type { TRegisterRequest } from '@/utils/types';

import styles from '../pages.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState<TRegisterRequest>({
    email: '',
    password: '',
    name: '',
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
      (prev): TRegisterRequest => ({
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
        const result = await register(formData).unwrap();

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
          name: '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при регистрации');
      }
    })();
  };

  return (
    <div className={styles.form_page}>
      <h2 className={`text text_type_main-medium ${styles.form_page_header}`}>
        Регистрация
      </h2>
      <form onSubmit={handleSubmit} className={styles.form_page_content}>
        <Input
          placeholder="Имя"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <EmailInput value={formData.email} onChange={handleInputChange} name="email" />
        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button htmlType="submit" disabled={isLoading} type="primary" size="medium">
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      </form>
      <section className={styles.form_page_footer}>
        <HelperLink text="Уже зарегистрированы?" link={ROUTES.Login} linkText="Войти" />
      </section>
    </div>
  );
};

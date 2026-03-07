import { HelperLink } from '@/components/helper-link/helper-link';
import { ROUTES } from '@/core/router-config';
import { useResetPasswordMutation } from '@/services/auth';
import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TResetPasswordRequest } from '@/utils/types';

import styles from '../pages.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [formData, setFormData] = useState<TResetPasswordRequest>({
    password: '',
    token: '',
  });
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const passwordResetInitiated = localStorage.getItem('passwordResetInitiated');
    if (!passwordResetInitiated) {
      void navigate(ROUTES.ForgotPassword);
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(
      (prev): TResetPasswordRequest => ({
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
        const result = await resetPassword(formData).unwrap();

        if (result.success) {
          setFormData({ password: '', token: '' });

          localStorage.removeItem('passwordResetInitiated');

          void navigate(ROUTES.Login);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при сбросе пароля');
      }
    })();
  };

  if (!isAuthorized) {
    return <div>Перенаправление...</div>;
  }

  return (
    <section className={styles.form_page}>
      <h2 className={`text text_type_main-medium ${styles.form_page_header}`}>
        Восстановление пароля
      </h2>
      <form onSubmit={handleSubmit} className={styles.form_page_content}>
        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Введите новый пароль"
        />
        <Input
          placeholder="Введите код из письма"
          name="token"
          value={formData.token}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>

        {error && <div style={{ color: 'red', marginTop: '16px' }}>{error}</div>}
      </form>

      <section className={styles.form_page_footer}>
        <HelperLink text="Вспомнили пароль?" link={ROUTES.Login} linkText="Войти" />
      </section>
    </section>
  );
};

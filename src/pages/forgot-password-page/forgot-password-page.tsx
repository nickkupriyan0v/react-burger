import { HelperLink } from '@/components/helper-link/helper-link';
import { ROUTES } from '@/core/router-config';
import { useForgotPasswordMutation } from '@/services/auth';
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TForgotPasswordRequest } from '@/utils/types';

import styles from '../pages.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [formData, setFormData] = useState<TForgotPasswordRequest>({
    email: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setFormData({
      email: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');

    void (async (): Promise<void> => {
      try {
        const result = await forgotPassword(formData).unwrap();

        if (result.success) {
          setFormData({ email: '' });

          localStorage.setItem('passwordResetInitiated', 'true');

          void navigate('/reset-password');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Ошибка при восстановлении пароля'
        );
      }
    })();
  };

  return (
    <section className={styles.form_page}>
      <h2 className={`text text_type_main-medium ${styles.form_page_header}`}>
        Восстановление пароля
      </h2>
      <form onSubmit={handleSubmit} className={styles.form_page_content}>
        <EmailInput
          value={formData.email}
          onChange={handleInputChange}
          name="email"
          placeholder="Укажите e-mail"
        />
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Восстановление...' : 'Восстановить'}
        </Button>
        {error && <div style={{ color: 'red', marginTop: '16px' }}>{error}</div>}
      </form>
      <section className={styles.form_page_footer}>
        <HelperLink text="Вспомнили пароль?" link={ROUTES.Login} linkText="Войти" />
      </section>
    </section>
  );
};

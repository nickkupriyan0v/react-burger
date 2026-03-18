import { useAppSelector } from '@/hooks/redux';
import { useUpdateUserMutation } from '@/services/auth';
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';

import styles from './profile-info-page.module.css';

export const ProfileInfoPage = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      const initialData = { name: user.name, email: user.email, password: '' };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user]);

  useEffect(() => {
    const changed =
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.password !== originalData.password;
    setHasChanges(changed);
  }, [formData, originalData]);

  const handleInputChange = (field: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleCancel = (): void => {
    setFormData(originalData);
    setError('');
    setSuccessMessage('');
  };

  const handleSave = (): void => {
    if (!accessToken) {
      setError('Токен доступа не найден');
      return;
    }

    void (async (): Promise<void> => {
      try {
        const response = await updateUser({
          body: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
          accessToken,
        }).unwrap();

        if (response.success) {
          setOriginalData({ name: formData.name, email: formData.email, password: '' });
          setFormData({ ...formData, password: '' });
          setSuccessMessage('Данные профиля успешно обновлены');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка при обновлении профиля');
      }
    })();
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
        <h2>Профиль</h2>
        <p>Вы не авторизованы. Пожалуйста, войдите.</p>
      </div>
    );
  }

  return (
    <section className={styles.profile_info_page}>
      <Input
        value={formData.name}
        placeholder="Имя"
        onChange={(e) => handleInputChange('name', e.target.value)}
        icon="EditIcon"
      />
      <EmailInput
        value={formData.email}
        placeholder="Логин"
        onChange={(e) => handleInputChange('email', e.target.value)}
        isIcon={true}
      />
      <PasswordInput
        value={formData.password}
        placeholder="Пароль"
        onChange={(e) => handleInputChange('password', e.target.value)}
        icon="EditIcon"
      />

      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      {successMessage && (
        <div style={{ color: 'green', marginBottom: '16px' }}>{successMessage}</div>
      )}

      {hasChanges && (
        <div className={styles.controls}>
          <Button
            htmlType="button"
            type="secondary"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            Отмена
          </Button>
          <Button
            htmlType="button"
            type="primary"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      )}
    </section>
  );
};

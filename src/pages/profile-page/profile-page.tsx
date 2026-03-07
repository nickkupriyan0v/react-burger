import { ProfileSideNav } from '@/components/profile-side-nav/profile-side-nav';
import { Outlet } from 'react-router-dom';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element => {
  return (
    <section className={styles.profile_page}>
      <ProfileSideNav />
      <Outlet />
    </section>
  );
};

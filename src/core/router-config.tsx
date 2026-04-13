import { App } from '@/components/app/app';
import { ProtectedRoute } from '@/components/protected-route/protected-route';
import { FeedPage } from '@/pages/feed-page/feed-page';
import { ForgotPasswordPage } from '@/pages/forgot-password-page/forgot-password-page';
import { HomePage } from '@/pages/home-page/home-page';
import { IngredientView } from '@/pages/ingredient-view/ingredient-view';
import { LoginPage } from '@/pages/login-page/login-page';
import { NotFoundPage } from '@/pages/not-found-page/not-found-page';
import { OrderView } from '@/pages/order-view/order-view';
import { ProfileInfoPage } from '@/pages/profile-info-page/profile-info-page';
import { ProfileOrdersPage } from '@/pages/profile-orders-page/profile-orders-page';
import { ProfilePage } from '@/pages/profile-page/profile-page';
import { RegisterPage } from '@/pages/register-page/register-page';
import { ResetPasswordPage } from '@/pages/reset-password-page/reset-password-page';
import { createHashRouter } from 'react-router-dom';

export const ROUTES = {
  Home: '/',
  Register: '/register',
  ForgotPassword: '/forgot-password',
  Login: '/login',
  ResetPassword: '/reset-password',
  Profile: '/profile',
  Feed: '/feed',
  Ingredients: '/ingredients',
};

export const PROFILE_ROUTES = {
  Profile: '/',
  Orders: '/orders',
};

export const router = createHashRouter([
  {
    path: ROUTES.Home,
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: `${ROUTES.Ingredients}/:id`,
        element: <IngredientView />,
      },
      {
        path: `${ROUTES.Feed}/:id`,
        element: <OrderView />,
      },
      {
        path: ROUTES.Register,
        element: (
          <ProtectedRoute requireAuth={false} redirectTo={ROUTES.Home}>
            <RegisterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.Login,
        element: (
          <ProtectedRoute requireAuth={false} redirectTo={ROUTES.Home}>
            <LoginPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ForgotPassword,
        element: (
          <ProtectedRoute requireAuth={false} redirectTo={ROUTES.Home}>
            <ForgotPasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ResetPassword,
        element: (
          <ProtectedRoute requireAuth={false} redirectTo={ROUTES.Home}>
            <ResetPasswordPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.Profile,
        element: (
          <ProtectedRoute requireAuth={true} redirectTo={ROUTES.Login}>
            <ProfilePage />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ProfileInfoPage />,
          },
          {
            path: `${ROUTES.Profile}${PROFILE_ROUTES.Orders}`,
            element: <ProfileOrdersPage />,
          },
          {
            path: `${ROUTES.Profile}${PROFILE_ROUTES.Orders}/:id`,
            element: <OrderView />,
          },
        ],
      },
      { path: ROUTES.Feed, element: <FeedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

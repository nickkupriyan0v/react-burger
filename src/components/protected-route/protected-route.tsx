import { useAppSelector } from '@/hooks/redux';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAuth: boolean;
  redirectTo?: string;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const ProtectedRoute = ({
  children,
  requireAuth,
  redirectTo = '/',
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const location = useLocation();

  if (!isInitialized) {
    return <div>Загрузка...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    const state = location.state as LocationState | null;
    const fromLocation = state?.from?.pathname ?? '/';
    return <Navigate to={fromLocation} replace />;
  }

  return <>{children}</>;
};

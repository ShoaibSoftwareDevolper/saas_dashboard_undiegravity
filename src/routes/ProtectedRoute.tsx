import { Navigate, Outlet, useLocation } from 'react-router';
import { routePaths } from '../config/routes';
import { useAuth } from '../hooks/useAuth';
import { FullScreenLoader } from '../components/ui/FullScreenLoader/FullScreenLoader';

export function ProtectedRoute() {
  const { user, isRestoring } = useAuth();
  const location = useLocation();

  if (isRestoring) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to={routePaths.login} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

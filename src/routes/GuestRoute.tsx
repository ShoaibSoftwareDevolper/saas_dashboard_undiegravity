import { Navigate, Outlet, useLocation } from 'react-router';
import { routePaths } from '../config/routes';
import { useAuth } from '../hooks/useAuth';
import { FullScreenLoader } from '../components/ui/FullScreenLoader/FullScreenLoader';

export function GuestRoute() {
  const { user, isRestoring } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? routePaths.dashboard;

  if (isRestoring) {
    return <FullScreenLoader />;
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}

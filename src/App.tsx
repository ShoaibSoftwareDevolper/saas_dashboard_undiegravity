import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { modulePlaceholderItems } from './config/navigation';
import { routePaths } from './config/routes';
import { AuthProvider } from './context/AuthProvider';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ModulePage } from './pages/ModulePage/ModulePage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { GuestRoute } from './routes/GuestRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path={routePaths.login} element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path={routePaths.settings} element={<SettingsPage />} />
              {modulePlaceholderItems.map((item) => (
                <Route key={item.id} path={item.path} element={<ModulePage item={item} />} />
              ))}
            </Route>
          </Route>
          <Route path="*" element={<Navigate to={routePaths.dashboard} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

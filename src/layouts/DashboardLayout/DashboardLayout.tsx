import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} onNavigate={closeSidebar} />
      {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar} aria-hidden />}
      <div className={styles.main}>
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

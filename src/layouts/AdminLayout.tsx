import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import BgWatermark from '@/components/ui/BgWatermark';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <BgWatermark />
      <AdminSidebar />
      <div key={location.pathname} className="relative z-10 flex-1 min-w-0 animate-fade-in">
        <Outlet />
      </div>
    </div>
  );
}

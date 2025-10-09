import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin';

const AdminLayout = () => {
  AdminLayout.displayName = "AdminLayout";

  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <main className="ml-70 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

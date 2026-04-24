import { useAuth } from '../../context/AuthContext';
import { Link, Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav className="mt-4" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/admin/dashboard/poli" className="nav-link">Manajemen Poli</Link>
          <Link to="/admin/dashboard/dokter" className="nav-link">Manajemen Dokter</Link>
          <Link to="/admin/dashboard/pasien" className="nav-link">Manajemen Pasien</Link>
          <Link to="/admin/dashboard/obat" className="nav-link">Manajemen Obat</Link>
          <div style={{ marginTop: 'auto' }}>
            <button onClick={logout} className="nav-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              Logout
            </button>
          </div>
        </nav>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;

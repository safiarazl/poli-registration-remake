import { useAuth } from '../../context/AuthContext';
import { Link, Outlet } from 'react-router-dom';

const PasienDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Pasien Panel</h2>
        <nav className="mt-4" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Link to="/pasien/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/pasien/dashboard/daftar" className="nav-link">Daftar Poli</Link>
          <Link to="/pasien/dashboard/riwayat" className="nav-link">Riwayat Periksa</Link>
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

export default PasienDashboard;

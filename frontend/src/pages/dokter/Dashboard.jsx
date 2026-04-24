import { useAuth } from '../../context/AuthContext';
import { Link, Outlet } from 'react-router-dom';

const DokterDashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>Dokter Panel</h2>
        <nav className="mt-4" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Link to="/dokter/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/dokter/dashboard/jadwal" className="nav-link">Jadwal Periksa</Link>
          <Link to="/dokter/dashboard/pasien" className="nav-link">Daftar Pasien</Link>
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

export default DokterDashboard;

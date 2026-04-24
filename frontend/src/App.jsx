import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ManagePoli from './pages/admin/ManagePoli';
import ManageDokter from './pages/admin/ManageDokter';
import ManagePasien from './pages/admin/ManagePasien';
import ManageObat from './pages/admin/ManageObat';

import DokterDashboard from './pages/dokter/Dashboard';
import JadwalPeriksa from './pages/dokter/JadwalPeriksa';
import DaftarPasienDokter from './pages/dokter/DaftarPasien';
import PeriksaPasien from './pages/dokter/PeriksaPasien';

import PasienDashboard from './pages/pasien/Dashboard';
import DaftarPoli from './pages/pasien/DaftarPoli';
import RiwayatPeriksa from './pages/pasien/RiwayatPeriksa';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />}>
              <Route index element={<div className="glass-panel"><h1>Welcome, Admin</h1><p>Select an option from the sidebar.</p></div>} />
              <Route path="poli" element={<ManagePoli />} />
              <Route path="dokter" element={<ManageDokter />} />
              <Route path="pasien" element={<ManagePasien />} />
              <Route path="obat" element={<ManageObat />} />
            </Route>
          </Routes>
        </ProtectedRoute>
      } />

      {/* Dokter Routes */}
      <Route path="/dokter/*" element={
        <ProtectedRoute allowedRoles={['dokter']}>
          <Routes>
            <Route path="dashboard" element={<DokterDashboard />}>
              <Route index element={<div className="glass-panel"><h1>Welcome, Dokter</h1><p>Select an option from the sidebar.</p></div>} />
              <Route path="jadwal" element={<JadwalPeriksa />} />
              <Route path="pasien" element={<DaftarPasienDokter />} />
              <Route path="periksa/:id" element={<PeriksaPasien />} />
            </Route>
          </Routes>
        </ProtectedRoute>
      } />

      {/* Pasien Routes */}
      <Route path="/pasien/*" element={
        <ProtectedRoute allowedRoles={['pasien']}>
          <Routes>
            <Route path="dashboard" element={<PasienDashboard />}>
              <Route index element={<div className="glass-panel"><h1>Welcome, Pasien</h1><p>Select an option from the sidebar.</p></div>} />
              <Route path="daftar" element={<DaftarPoli />} />
              <Route path="riwayat" element={<RiwayatPeriksa />} />
            </Route>
          </Routes>
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

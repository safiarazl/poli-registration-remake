import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const DaftarPasien = () => {
  const [daftarPolis, setDaftarPolis] = useState([]);
  const navigate = useNavigate();

  const fetchDaftarPolis = async () => {
    try {
      const res = await api.get('/daftar-poli');
      setDaftarPolis(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDaftarPolis();
  }, []);

  const handlePeriksa = (daftarPoliId) => {
    navigate(`/dokter/dashboard/periksa/${daftarPoliId}`);
  };

  return (
    <div>
      <h2>Daftar Pasien Registrasi</h2>
      
      <div className="glass-panel">
        <table>
          <thead>
            <tr>
              <th>No Antrian</th>
              <th>Nama Pasien</th>
              <th>Keluhan</th>
              <th>Jadwal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {daftarPolis.map(dp => (
              <tr key={dp.id}>
                <td>{dp.no_antrian}</td>
                <td>{dp.pasien?.nama}</td>
                <td>{dp.keluhan}</td>
                <td>{dp.jadwal?.hari}, {dp.jadwal?.jam_mulai}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    background: dp.status === 'selesai' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: dp.status === 'selesai' ? '#10b981' : '#f59e0b'
                  }}>
                    {dp.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {dp.status !== 'selesai' ? (
                    <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handlePeriksa(dp.id)}>
                      Periksa
                    </button>
                  ) : (
                    <span>Selesai</span>
                  )}
                </td>
              </tr>
            ))}
            {daftarPolis.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">Belum ada pasien yang mendaftar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DaftarPasien;

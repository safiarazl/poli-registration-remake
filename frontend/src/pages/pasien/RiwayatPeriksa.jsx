import { useState, useEffect } from 'react';
import api from '../../api/axios';

const RiwayatPeriksa = () => {
  const [riwayats, setRiwayats] = useState([]);

  const fetchRiwayat = async () => {
    try {
      const res = await api.get('/periksa/me');
      setRiwayats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  return (
    <div>
      <h2>Riwayat Periksa</h2>
      
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Poli</th>
              <th>Dokter</th>
              <th>Keluhan</th>
              <th>Catatan</th>
              <th>Obat</th>
              <th>Total Biaya</th>
            </tr>
          </thead>
          <tbody>
            {riwayats.map(periksa => (
              <tr key={periksa.id}>
                <td>{new Date(periksa.tgl_periksa).toLocaleDateString('id-ID')}</td>
                <td>{periksa.daftar_poli?.jadwal?.dokter?.poli?.nama_poli}</td>
                <td>{periksa.daftar_poli?.jadwal?.dokter?.nama}</td>
                <td>{periksa.daftar_poli?.keluhan}</td>
                <td>{periksa.catatan}</td>
                <td>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {periksa.detail_periksas?.map(dp => (
                      <li key={dp.id}>{dp.obat?.nama_obat}</li>
                    ))}
                  </ul>
                </td>
                <td style={{ fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                  Rp {periksa.biaya_periksa?.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
            {riwayats.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">Belum ada riwayat pemeriksaan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiwayatPeriksa;

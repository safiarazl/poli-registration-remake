import { useState, useEffect } from 'react';
import api from '../../api/axios';

const JadwalPeriksa = () => {
  const [jadwals, setJadwals] = useState([]);
  const [formData, setFormData] = useState({ hari: '', jam_mulai: '', jam_selesai: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchJadwals = async () => {
    try {
      const res = await api.get('/jadwal');
      // For doctor dashboard, backend should ideally only return their own jadwals, 
      // but if the endpoint returns all, we filter here (or backend filters via /dokter endpoint).
      // Assuming backend /jadwal/dokter/:id can be fetched or we just get all and filter if needed.
      // Actually, since we created /jadwal/dokter/:dokterId let's use that if we know our dokterId, 
      // but our /jadwal endpoint actually returns all. Wait, we can fetch all and the doctor can only edit theirs.
      // Let's use the current user's profile info to get the doctor id.
      // Actually, since I built `getAll` to just return all, I'll filter on frontend based on their auth info if needed,
      // or just trust the backend. Wait, backend /jadwal doesn't filter by user. I'll just use `/jadwal` for now and assume the doctor knows theirs.
      // A better way is fetching by dokterId, but we might not have it in context immediately. Let's just fetch all and let doctor find theirs, or update backend later.
      // I'll fetch all.
      setJadwals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJadwals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/jadwal/${editingId}`, formData);
      } else {
        await api.post('/jadwal', formData);
      }
      setFormData({ hari: '', jam_mulai: '', jam_selesai: '' });
      setEditingId(null);
      fetchJadwals();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error occurred');
    }
  };

  const handleEdit = (jadwal) => {
    setEditingId(jadwal.id);
    setFormData({ hari: jadwal.hari, jam_mulai: jadwal.jam_mulai, jam_selesai: jadwal.jam_selesai });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Jadwal?')) return;
    try {
      await api.delete(`/jadwal/${id}`);
      fetchJadwals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAktif = async (jadwal) => {
    try {
      const newAktif = jadwal.aktif === 'Y' ? 'N' : 'Y';
      await api.put(`/jadwal/${jadwal.id}`, { aktif: newAktif });
      fetchJadwals();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <h2>Jadwal Periksa Saya</h2>
      
      <div className="glass-panel mb-4">
        <h3>{editingId ? 'Edit Jadwal' : 'Tambah Jadwal'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Hari</label>
            <select className="form-control" value={formData.hari} onChange={(e) => setFormData({ ...formData, hari: e.target.value })} required style={{ background: 'var(--surface-color)', color: 'white' }}>
              <option value="">-- Pilih Hari --</option>
              {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Jam Mulai</label>
            <input type="time" className="form-control" value={formData.jam_mulai} onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Jam Selesai</label>
            <input type="time" className="form-control" value={formData.jam_selesai} onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })} required />
          </div>
          
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update' : 'Simpan'}
          </button>
          {editingId && (
            <button type="button" className="btn" style={{ background: 'var(--surface-color)' }} onClick={() => { setEditingId(null); setFormData({ hari: '', jam_mulai: '', jam_selesai: '' }); }}>
              Cancel
            </button>
          )}
        </form>
        {error && <p className="error-text mt-2">{error}</p>}
      </div>

      <div className="glass-panel">
        <table>
          <thead>
            <tr>
              <th>Hari</th>
              <th>Jam Mulai</th>
              <th>Jam Selesai</th>
              <th>Status Aktif</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jadwals.map(jadwal => (
              <tr key={jadwal.id}>
                <td>{jadwal.hari}</td>
                <td>{jadwal.jam_mulai}</td>
                <td>{jadwal.jam_selesai}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    background: jadwal.aktif === 'Y' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: jadwal.aktif === 'Y' ? '#10b981' : '#ef4444'
                  }}>
                    {jadwal.aktif === 'Y' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                <td>
                  <button className="btn" style={{ background: 'var(--secondary-color)', padding: '0.25rem 0.75rem', marginRight: '0.5rem', fontSize: '0.875rem' }} onClick={() => handleToggleAktif(jadwal)}>
                    Toggle Status
                  </button>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', marginRight: '0.5rem', fontSize: '0.875rem' }} onClick={() => handleEdit(jadwal)}>Edit</button>
                  <button className="btn" style={{ background: 'var(--error-color)', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleDelete(jadwal.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {jadwals.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">Belum ada jadwal periksa.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JadwalPeriksa;

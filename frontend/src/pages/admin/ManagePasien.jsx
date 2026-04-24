import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManagePasien = () => {
  const [pasiens, setPasiens] = useState([]);
  const [formData, setFormData] = useState({ nama: '', alamat: '', no_ktp: '', no_hp: '', email: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchPasiens = async () => {
    try {
      const res = await api.get('/pasien');
      setPasiens(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPasiens();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        const { email, password, ...updateData } = formData;
        await api.put(`/pasien/${editingId}`, updateData);
      } else {
        await api.post('/pasien', formData);
      }
      setFormData({ nama: '', alamat: '', no_ktp: '', no_hp: '', email: '', password: '' });
      setEditingId(null);
      fetchPasiens();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error occurred');
    }
  };

  const handleEdit = (pasien) => {
    setEditingId(pasien.id);
    setFormData({ 
      nama: pasien.nama, 
      alamat: pasien.alamat, 
      no_ktp: pasien.no_ktp, 
      no_hp: pasien.no_hp, 
      email: '',
      password: '' 
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Pasien?')) return;
    try {
      await api.delete(`/pasien/${id}`);
      fetchPasiens();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Manajemen Pasien</h2>
      
      <div className="glass-panel mb-4">
        <h3>{editingId ? 'Edit Pasien' : 'Tambah Pasien'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Nama Pasien</label>
              <input type="text" className="form-control" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>No KTP</label>
              <input type="text" className="form-control" value={formData.no_ktp} onChange={(e) => setFormData({ ...formData, no_ktp: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>No HP</label>
              <input type="text" className="form-control" value={formData.no_hp} onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })} required />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Alamat</label>
            <input type="text" className="form-control" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} required />
          </div>

          {!editingId && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>Email (Akun Login)</label>
                <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required={!editingId} />
              </div>
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label>Password</label>
                <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingId} minLength="6" />
              </div>
            </div>
          )}

          <div>
            <button type="submit" className="btn btn-primary mt-2">
              {editingId ? 'Update' : 'Simpan'}
            </button>
            {editingId && (
              <button type="button" className="btn mt-2" style={{ background: 'var(--surface-color)', marginLeft: '1rem' }} onClick={() => { setEditingId(null); setFormData({ nama: '', alamat: '', no_ktp: '', no_hp: '', email: '', password: '' }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && <p className="error-text mt-2">{error}</p>}
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>No RM</th>
              <th>Nama</th>
              <th>Email</th>
              <th>No KTP</th>
              <th>No HP</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pasiens.map(pasien => (
              <tr key={pasien.id}>
                <td>{pasien.no_rm}</td>
                <td>{pasien.nama}</td>
                <td>{pasien.akun?.email}</td>
                <td>{pasien.no_ktp}</td>
                <td>{pasien.no_hp}</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', marginRight: '0.5rem', fontSize: '0.875rem' }} onClick={() => handleEdit(pasien)}>Edit</button>
                  <button className="btn" style={{ background: 'var(--error-color)', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleDelete(pasien.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {pasiens.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">Belum ada data pasien.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePasien;

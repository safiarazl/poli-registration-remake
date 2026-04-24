import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManageDokter = () => {
  const [dokters, setDokters] = useState([]);
  const [polis, setPolis] = useState([]);
  const [formData, setFormData] = useState({ nama: '', alamat: '', no_hp: '', id_poli: '', email: '', password: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [doktersRes, polisRes] = await Promise.all([
        api.get('/dokter'),
        api.get('/poli')
      ]);
      setDokters(doktersRes.data);
      setPolis(polisRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        // Exclude email and password for update as per our basic schema/controller
        const { email, password, ...updateData } = formData;
        await api.put(`/dokter/${editingId}`, updateData);
      } else {
        await api.post('/dokter', formData);
      }
      setFormData({ nama: '', alamat: '', no_hp: '', id_poli: '', email: '', password: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error occurred');
    }
  };

  const handleEdit = (dokter) => {
    setEditingId(dokter.id);
    setFormData({ 
      nama: dokter.nama, 
      alamat: dokter.alamat, 
      no_hp: dokter.no_hp, 
      id_poli: dokter.id_poli || '', 
      email: '', // Don't show email on edit
      password: '' // Don't show password on edit
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Dokter?')) return;
    try {
      await api.delete(`/dokter/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Manajemen Dokter</h2>
      
      <div className="glass-panel mb-4">
        <h3>{editingId ? 'Edit Dokter' : 'Tambah Dokter'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Nama Dokter</label>
              <input type="text" className="form-control" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>No HP</label>
              <input type="text" className="form-control" value={formData.no_hp} onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Pilih Poli</label>
              <select className="form-control" value={formData.id_poli} onChange={(e) => setFormData({ ...formData, id_poli: e.target.value })} required style={{ background: 'var(--surface-color)', color: 'white' }}>
                <option value="">-- Pilih Poli --</option>
                {polis.map(p => (
                  <option key={p.id} value={p.id}>{p.nama_poli}</option>
                ))}
              </select>
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
              <button type="button" className="btn mt-2" style={{ background: 'var(--surface-color)', marginLeft: '1rem' }} onClick={() => { setEditingId(null); setFormData({ nama: '', alamat: '', no_hp: '', id_poli: '', email: '', password: '' }); }}>
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
              <th>ID</th>
              <th>Nama</th>
              <th>Poli</th>
              <th>Email</th>
              <th>No HP</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dokters.map(dokter => (
              <tr key={dokter.id}>
                <td>{dokter.id}</td>
                <td>{dokter.nama}</td>
                <td>{dokter.poli?.nama_poli}</td>
                <td>{dokter.akun?.email}</td>
                <td>{dokter.no_hp}</td>
                <td>{dokter.alamat}</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', marginRight: '0.5rem', fontSize: '0.875rem' }} onClick={() => handleEdit(dokter)}>Edit</button>
                  <button className="btn" style={{ background: 'var(--error-color)', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleDelete(dokter.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {dokters.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">Belum ada data dokter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDokter;

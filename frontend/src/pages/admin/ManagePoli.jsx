import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManagePoli = () => {
  const [polis, setPolis] = useState([]);
  const [formData, setFormData] = useState({ nama_poli: '', keterangan: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchPolis = async () => {
    try {
      const res = await api.get('/poli');
      setPolis(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPolis();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/poli/${editingId}`, formData);
      } else {
        await api.post('/poli', formData);
      }
      setFormData({ nama_poli: '', keterangan: '' });
      setEditingId(null);
      fetchPolis();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error occurred');
    }
  };

  const handleEdit = (poli) => {
    setEditingId(poli.id);
    setFormData({ nama_poli: poli.nama_poli, keterangan: poli.keterangan });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Poli?')) return;
    try {
      await api.delete(`/poli/${id}`);
      fetchPolis();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Manajemen Poli</h2>
      
      <div className="glass-panel mb-4">
        <h3>{editingId ? 'Edit Poli' : 'Tambah Poli'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Nama Poli</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.nama_poli} 
              onChange={(e) => setFormData({ ...formData, nama_poli: e.target.value })}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 2 }}>
            <label>Keterangan</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.keterangan} 
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update' : 'Simpan'}
          </button>
          {editingId && (
            <button type="button" className="btn" style={{ background: 'var(--surface-color)' }} onClick={() => { setEditingId(null); setFormData({ nama_poli: '', keterangan: '' }); }}>
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
              <th>ID</th>
              <th>Nama Poli</th>
              <th>Keterangan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {polis.map(poli => (
              <tr key={poli.id}>
                <td>{poli.id}</td>
                <td>{poli.nama_poli}</td>
                <td>{poli.keterangan}</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', marginRight: '0.5rem', fontSize: '0.875rem' }} onClick={() => handleEdit(poli)}>Edit</button>
                  <button className="btn" style={{ background: 'var(--error-color)', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleDelete(poli.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {polis.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">Belum ada data poli.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePoli;

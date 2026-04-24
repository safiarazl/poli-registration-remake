import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManageObat = () => {
  const [obats, setObats] = useState([]);
  const [formData, setFormData] = useState({ nama_obat: '', kemasan: '', harga: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchObats = async () => {
    try {
      const res = await api.get('/obat');
      setObats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchObats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...formData,
      harga: parseInt(formData.harga)
    };

    try {
      if (editingId) {
        await api.put(`/obat/${editingId}`, payload);
      } else {
        await api.post('/obat', payload);
      }
      setFormData({ nama_obat: '', kemasan: '', harga: '' });
      setEditingId(null);
      fetchObats();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error occurred');
    }
  };

  const handleEdit = (obat) => {
    setEditingId(obat.id);
    setFormData({ nama_obat: obat.nama_obat, kemasan: obat.kemasan, harga: obat.harga });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Obat?')) return;
    try {
      await api.delete(`/obat/${id}`);
      fetchObats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Manajemen Obat</h2>
      
      <div className="glass-panel mb-4">
        <h3>{editingId ? 'Edit Obat' : 'Tambah Obat'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Nama Obat</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.nama_obat} 
              onChange={(e) => setFormData({ ...formData, nama_obat: e.target.value })}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Kemasan</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.kemasan} 
              onChange={(e) => setFormData({ ...formData, kemasan: e.target.value })}
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label>Harga (Rp)</label>
            <input 
              type="number" 
              className="form-control" 
              value={formData.harga} 
              onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              required 
              min="0"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update' : 'Simpan'}
          </button>
          {editingId && (
            <button type="button" className="btn" style={{ background: 'var(--surface-color)' }} onClick={() => { setEditingId(null); setFormData({ nama_obat: '', kemasan: '', harga: '' }); }}>
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
              <th>Nama Obat</th>
              <th>Kemasan</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {obats.map(obat => (
              <tr key={obat.id}>
                <td>{obat.id}</td>
                <td>{obat.nama_obat}</td>
                <td>{obat.kemasan}</td>
                <td>Rp {obat.harga.toLocaleString()}</td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', marginRight: '0.5rem', fontSize: '0.875rem' }} onClick={() => handleEdit(obat)}>Edit</button>
                  <button className="btn" style={{ background: 'var(--error-color)', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }} onClick={() => handleDelete(obat.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {obats.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">Belum ada data obat.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageObat;

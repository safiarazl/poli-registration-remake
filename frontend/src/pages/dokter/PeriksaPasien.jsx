import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

const PeriksaPasien = () => {
  const { id } = useParams(); // id_daftar_poli
  const navigate = useNavigate();
  
  const [daftarPoli, setDaftarPoli] = useState(null);
  const [obats, setObats] = useState([]);
  const [formData, setFormData] = useState({ catatan: '', obat_ids: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dpRes, obatRes] = await Promise.all([
          api.get('/daftar-poli'), // finding specific from list for now
          api.get('/obat')
        ]);
        const dp = dpRes.data.find(d => d.id === parseInt(id));
        if (dp) setDaftarPoli(dp);
        setObats(obatRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleObatChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData({ ...formData, obat_ids: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        id_daftar_poli: parseInt(id),
        tgl_periksa: new Date().toISOString(),
        catatan: formData.catatan,
        obat_ids: formData.obat_ids
      };

      await api.post('/periksa', payload);
      alert('Pemeriksaan berhasil disimpan!');
      navigate('/dokter/dashboard/pasien');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error occurred');
    }
  };

  if (!daftarPoli) return <div>Loading...</div>;

  return (
    <div>
      <h2>Pemeriksaan Pasien</h2>
      
      <div className="glass-panel mb-4">
        <h3>Data Pasien</h3>
        <p><strong>Nama:</strong> {daftarPoli.pasien?.nama}</p>
        <p><strong>Keluhan:</strong> {daftarPoli.keluhan}</p>
      </div>

      <div className="glass-panel">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Catatan Pemeriksaan</label>
            <textarea 
              className="form-control" 
              value={formData.catatan} 
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value })} 
              required 
              rows="4"
            ></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Pilih Obat (Tahan CTRL/CMD untuk pilih lebih dari satu)</label>
            <select 
              multiple 
              className="form-control" 
              value={formData.obat_ids} 
              onChange={handleObatChange} 
              required 
              style={{ background: 'var(--surface-color)', color: 'white', minHeight: '120px' }}
            >
              {obats.map(obat => (
                <option key={obat.id} value={obat.id}>{obat.nama_obat} - Rp {obat.harga}</option>
              ))}
            </select>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary mt-2" style={{ alignSelf: 'flex-start' }}>
            Simpan Pemeriksaan
          </button>
        </form>
      </div>
    </div>
  );
};

export default PeriksaPasien;

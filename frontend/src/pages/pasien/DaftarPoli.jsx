import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const DaftarPoli = () => {
  const [polis, setPolis] = useState([]);
  const [dokters, setDokters] = useState([]);
  const [jadwals, setJadwals] = useState([]);
  
  const [selectedPoli, setSelectedPoli] = useState('');
  const [selectedDokter, setSelectedDokter] = useState('');
  const [selectedJadwal, setSelectedJadwal] = useState('');
  const [keluhan, setKeluhan] = useState('');
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Polis initially
    const fetchPolis = async () => {
      try {
        const res = await api.get('/poli');
        setPolis(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPolis();
  }, []);

  useEffect(() => {
    // Fetch Dokters when Poli is selected
    const fetchDokters = async () => {
      if (!selectedPoli) return;
      try {
        const res = await api.get('/dokter');
        const filtered = res.data.filter(d => d.id_poli === parseInt(selectedPoli));
        setDokters(filtered);
        setSelectedDokter('');
        setJadwals([]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDokters();
  }, [selectedPoli]);

  useEffect(() => {
    // Fetch Jadwal when Dokter is selected
    const fetchJadwals = async () => {
      if (!selectedDokter) return;
      try {
        const res = await api.get(`/jadwal/dokter/${selectedDokter}`);
        // Only active jadwals should be available for registration
        const activeJadwals = res.data.filter(j => j.aktif === 'Y');
        setJadwals(activeJadwals);
        setSelectedJadwal('');
      } catch (err) {
        console.error(err);
      }
    };
    fetchJadwals();
  }, [selectedDokter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/daftar-poli', {
        id_jadwal: parseInt(selectedJadwal),
        keluhan
      });
      alert('Pendaftaran Berhasil!');
      navigate('/pasien/dashboard'); // redirect to dashboard or riwayat
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div>
      <h2>Pendaftaran Poliklinik</h2>
      
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>1. Pilih Poli</label>
            <select className="form-control" value={selectedPoli} onChange={(e) => setSelectedPoli(e.target.value)} required style={{ background: 'var(--surface-color)', color: 'white' }}>
              <option value="">-- Pilih Poli --</option>
              {polis.map(p => (
                <option key={p.id} value={p.id}>{p.nama_poli}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>2. Pilih Dokter</label>
            <select className="form-control" value={selectedDokter} onChange={(e) => setSelectedDokter(e.target.value)} required disabled={!selectedPoli} style={{ background: 'var(--surface-color)', color: 'white' }}>
              <option value="">-- Pilih Dokter --</option>
              {dokters.map(d => (
                <option key={d.id} value={d.id}>{d.nama}</option>
              ))}
            </select>
            {selectedPoli && dokters.length === 0 && <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tidak ada dokter di poli ini.</span>}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>3. Pilih Jadwal Periksa</label>
            <select className="form-control" value={selectedJadwal} onChange={(e) => setSelectedJadwal(e.target.value)} required disabled={!selectedDokter} style={{ background: 'var(--surface-color)', color: 'white' }}>
              <option value="">-- Pilih Jadwal Aktif --</option>
              {jadwals.map(j => (
                <option key={j.id} value={j.id}>{j.hari}, {j.jam_mulai} - {j.jam_selesai}</option>
              ))}
            </select>
            {selectedDokter && jadwals.length === 0 && <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Dokter ini tidak memiliki jadwal aktif.</span>}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>4. Keluhan</label>
            <textarea 
              className="form-control" 
              value={keluhan} 
              onChange={(e) => setKeluhan(e.target.value)} 
              required 
              rows="4"
              placeholder="Jelaskan keluhan anda..."
            ></textarea>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary mt-2" disabled={!selectedJadwal || !keluhan}>
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
};

export default DaftarPoli;

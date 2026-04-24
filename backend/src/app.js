const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const poliRoutes = require('./routes/poli.routes');
const dokterRoutes = require('./routes/dokter.routes');
const pasienRoutes = require('./routes/pasien.routes');
const jadwalRoutes = require('./routes/jadwal.routes');
const daftarPoliRoutes = require('./routes/daftarPoli.routes');
const periksaRoutes = require('./routes/periksa.routes');
const obatRoutes = require('./routes/obat.routes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/poli', poliRoutes);
app.use('/api/dokter', dokterRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/daftar-poli', daftarPoliRoutes);
app.use('/api/periksa', periksaRoutes);
app.use('/api/obat', obatRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

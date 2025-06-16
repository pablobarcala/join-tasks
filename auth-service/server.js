const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Conexión a MongoDB y arranque del servidor
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Auth Service conectado a MongoDB`);
    app.listen(PORT, () => console.log(`Auth Service corriendo en puerto ${PORT}`));
  })
  .catch((err) => console.error('Error conectando a MongoDB:', err));

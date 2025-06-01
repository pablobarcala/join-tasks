require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api', authRoutes);
app.use('/api', listRoutes);
app.use('/api', taskRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('Error de conexión:', err));

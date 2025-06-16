const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Task Service conectado a MongoDB');
    app.listen(PORT, () => console.log(`Task Service corriendo en puerto ${PORT}`));
  })
  .catch((err) => console.error('Error conectando a MongoDB:', err));
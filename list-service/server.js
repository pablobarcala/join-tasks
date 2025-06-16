const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const listRoutes = require('./routes/listRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors())
app.use(express.json());

app.use('/api/lists', listRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('List Service conectado a MongoDB');
    app.listen(PORT, () => console.log(`List Service corriendo en puerto ${PORT}`));
  })
  .catch((err) => console.error('Error conectando a MongoDB:', err));

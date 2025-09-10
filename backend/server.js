// backend/server.js
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const ordersRouter = require('./routes/orders');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Variables de entorno
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Verificar que MONGODB_URI esté definido
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI no está definido en .env');
  process.exit(1);
}

// Conexión a MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('MongoDB error:', err));

// Rutas
app.use('/api/orders', ordersRouter);

// Iniciar servidor
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

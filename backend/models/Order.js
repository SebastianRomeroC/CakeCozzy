// backend/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [
    {
      nombre: String,
      precio: Number,
      quantity: { type: Number, default: 1 }
    }
  ],
  total: { type: Number, required: true },
  direccion: { type: String },
  // GeoJSON point: [lng, lat]
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  status: { type: String, enum: ['pendiente','en camino','entregado'], default: 'pendiente' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);

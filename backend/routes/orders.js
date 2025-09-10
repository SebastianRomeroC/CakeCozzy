// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Crear orden
router.post('/', async (req, res) => {
    console.log("Orden recibida:", req.body);
  try {
    const { items, total, direccion, location } = req.body;
    // location expected: { coordinates: [lng, lat] }
    const order = new Order({
      items,
      total,
      direccion,
      location: location ? { type: 'Point', coordinates: location.coordinates } : undefined
    });
    await order.save();
    return res.status(201).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creando la orden', error: err.message });
  }
});

// Obtener orden por id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error obteniendo la orden' });
  }
});

// Actualizar status o location
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body; // { status: 'en camino' } o { location: { coordinates: [lng, lat] } }
    if (updates.location) updates.location = { type: 'Point', coordinates: updates.location.coordinates };
    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error actualizando la orden' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Criar pedido
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar pedidos de um cliente
router.get('/:customerId', async (req, res) => {
  const orders = await Order.find({ customerId: req.params.customerId }).populate('products.productId');
  res.json(orders);
});

// Atualizar status do pedido
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

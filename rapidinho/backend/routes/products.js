const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Criar produto
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar produtos
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto deletado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

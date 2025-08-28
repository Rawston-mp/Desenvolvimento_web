// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Cria app
const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Conexão MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/rapidinho';
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => {
    console.error('Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });

// Rotas
// Certifique-se de ter os arquivos em backend/routes
// auth.js, products.js, orders.js, checkout.js
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/checkout', require('./routes/checkout'));

// Healthcheck simples
app.get('/', (req, res) => {
  res.send('API Rapidinho funcionando!');
});

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Handler global de erros
// Qualquer erro não capturado nas rotas cai aqui
app.use((err, req, res, next) => {
  console.error('Erro inesperado:', err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

// Start do servidor
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

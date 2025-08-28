// backend/routes/checkout.js
const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');

// configura o cliente do Mercado Pago usando o token do .env
const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// POST cria a preferência e devolve os links em JSON
router.post('/', async (req, res) => {
  try {
    const { orderId, total, title } = req.body;

    const body = {
      items: [
        {
          title: title || `Pedido #${orderId || 'sem id'}`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(total || 0)
        }
      ],
      payer: {
        email: 'test_payer_123@testuser.com',
        identification: { type: 'CPF', number: '12345678909' },
        address: { zip_code: '01310-100' }
      },
      back_urls: {
        success: 'http://localhost:5000/sucesso',
        failure: 'http://localhost:5000/falha',
        pending: 'http://localhost:5000/pendente'
      }
    };

    const prefClient = new Preference(mp);
    const pref = await prefClient.create({ body });

    return res.json({
      id: pref.id,
      init_point: pref.init_point,
      sandbox_init_point: pref.sandbox_init_point
    });
  } catch (err) {
    console.error('Erro no checkout POST:', err);
    return res.status(500).json({ error: err.message || 'Falha ao criar preferência' });
  }
});

// GET de teste cria a preferência e redireciona direto para o checkout
router.get('/teste', async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: 'Produto Teste',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 99.90
        }
      ],
      payer: {
        email: 'test_payer_123@testuser.com',
        identification: { type: 'CPF', number: '12345678909' },
        address: { zip_code: '01310-100' }
      },
      back_urls: {
        success: 'http://localhost:5000/sucesso',
        failure: 'http://localhost:5000/falha',
        pending: 'http://localhost:5000/pendente'
      }
    };

    const prefClient = new Preference(mp);
    const pref = await prefClient.create({ body });

    console.log('init_point:', pref.init_point);
    console.log('sandbox_init_point:', pref.sandbox_init_point);

    // usa init_point para evitar 404 de assets no sandbox
    return res.redirect(pref.init_point);
  } catch (err) {
    console.error('Erro no checkout GET teste:', err);
    return res.status(500).json({ error: err.message || 'Falha ao criar preferência' });
  }
});

module.exports = router;

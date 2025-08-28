const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// log temporário para diagnóstico
const raw = process.env.MP_ACCESS_TOKEN || '';
const masked = raw ? raw.slice(0,6) + '...' + raw.slice(-4) : '(vazio)';
console.log('[MP] Access Token carregado:', masked);

router.post('/', async (req, res) => {
  try {
    const { orderId, total, title } = req.body;

    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Access Token ausente no servidor' });
    }

    const body = {
      items: [
        {
          title: title || `Pedido #${orderId || 's/ id'}`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(total || 0)
        }
      ],
      back_urls: {
        success: 'http://localhost:3000/sucesso',
        failure: 'http://localhost:3000/falha',
        pending: 'http://localhost:3000/pendente'
      },
      auto_return: 'approved'
    };

    const prefClient = new Preference(mp);
    const pref = await prefClient.create({ body });

    return res.json({
      id: pref.id,
      init_point: pref.init_point,
      sandbox_init_point: pref.sandbox_init_point
    });
  } catch (err) {
    console.error('Erro no checkout:', err);
    return res.status(500).json({ error: err.message || 'Falha ao criar preferência' });
  }
});

module.exports = router;

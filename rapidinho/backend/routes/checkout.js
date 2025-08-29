// backend/routes/checkout.js
const express = require('express');
const router = express.Router();
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Cliente Mercado Pago com token do .env
const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

// Função utilitária para montar a preferência
function makePrefBody({ title = 'Produto Teste', total = 99.90 }) {
  return {
    items: [
      {
        title,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: Number(total)
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
}

// POST cria a preferência e devolve os links em JSON
router.post('/', async (req, res) => {
  try {
    const { orderId, total, title } = req.body;
    const body = makePrefBody({
      title: title || `Pedido #${orderId || 'sem id'}`,
      total: total || 0
    });

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

// GET de teste, redireciona direto para o checkout
router.get('/teste', async (req, res) => {
  try {
    const body = makePrefBody({ title: 'Produto Teste', total: 99.90 });

    const prefClient = new Preference(mp);
    const pref = await prefClient.create({ body });

    console.log('init_point:', pref.init_point);
    console.log('sandbox_init_point:', pref.sandbox_init_point);

    // Usa init_point, com credencial TEST ele abre o sandbox
    return res.redirect(pref.init_point);
  } catch (err) {
    console.error('Erro no checkout GET teste:', err);
    return res.status(500).json({ error: err.message || 'Falha ao criar preferência' });
  }
});

// GET de depuração, mostra HTML com botões para os dois links
router.get('/debug', async (req, res) => {
  try {
    const total = req.query.total || 99.90;
    const title = req.query.title || 'Produto Teste';
    const body = makePrefBody({ title, total });

    const prefClient = new Preference(mp);
    const pref = await prefClient.create({ body });

    const initPoint = pref.init_point || '';
    const sandboxPoint = pref.sandbox_init_point || '';

    const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Checkout Debug</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 24px; background: #fafafa; color: #222; }
  .card { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 20px; max-width: 720px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  h1 { font-size: 20px; margin: 0 0 12px; }
  p { margin: 6px 0; }
  code { background: #f4f4f4; padding: 2px 6px; border-radius: 6px; }
  .links { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
  a.btn { display: inline-block; padding: 10px 14px; border-radius: 10px; text-decoration: none; }
  a.primary { background: #3483fa; color: #fff; }
  a.secondary { background: #eee; color: #222; }
  .note { font-size: 13px; color: #555; margin-top: 14px; }
</style>
</head>
<body>
  <div class="card">
    <h1>Links do Checkout</h1>
    <p><strong>Preference ID:</strong> <code>${pref.id}</code></p>
    <p><strong>Título:</strong> <code>${title}</code></p>
    <p><strong>Total:</strong> <code>R$ ${Number(total).toFixed(2)}</code></p>
    <div class="links">
      ${initPoint ? `<a class="btn primary" href="${initPoint}" target="_blank" rel="noopener">Abrir init_point</a>` : ''}
      ${sandboxPoint ? `<a class="btn secondary" href="${sandboxPoint}" target="_blank" rel="noopener">Abrir sandbox_init_point</a>` : ''}
    </div>
    <p class="note">Se um dos botões não aparecer, o link não foi fornecido pela API. Use o que estiver disponível.</p>
  </div>
</body>
</html>`;

    res.set('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    console.error('Erro no checkout GET debug:', err);
    return res.status(500).send(`<pre>${err.message || 'Falha ao criar preferência'}</pre>`);
  }
});

module.exports = router;

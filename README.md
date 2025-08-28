# Rapidinho

Aplicativo de marketplace local. Frontend simples em HTML, CSS e Tailwind via CDN. Backend em Node.js com Express e MongoDB. Integração de pagamento com Mercado Pago.

## Estrutura

rapidinho/
backend/
models/
User.js
Product.js
Order.js
routes/
auth.js
products.js
orders.js
checkout.js
server.js
package.json
.env
frontend/
index.html
style.css
script.js


## Requisitos

1. Node.js 18 ou superior
2. NPM
3. MongoDB local ou MongoDB Atlas
4. Chave do Mercado Pago Access Token

## Variáveis de ambiente

Crie o arquivo backend/.env com as chaves abaixo.
MONGO_URI=mongodb://localhost:27017/rapidinho
JWT_SECRET=uma_senha_super_secreta
MP_ACCESS_TOKEN=SEU_TOKEN_DO_MERCADO_PAGO
PORT=5000

markdown
Copiar código

## Instalação do backend

1. Entre em backend
2. Instale dependências
3. Opcional instale nodemon para recarregar o servidor
4. Inicie o servidor

Comandos
cd backend
npm install
npm install --save-dev nodemon
npm run dev

nginx
Copiar código

Se não tiver script dev
npx nodemon server.js

markdown
Copiar código

## Instalação do frontend

1. Entre em frontend
2. Suba um servidor estático simples
cd frontend
npx serve

bash
Copiar código
Abra o endereço exibido no terminal

## Endpoints principais

Autenticação
1. POST /api/auth/register  
   Corpo esperado name, email, password, role
2. POST /api/auth/login  
   Corpo esperado email, password  
   Retorna token JWT e dados do usuário

Produtos
1. GET  /api/products
2. POST /api/products
3. PUT  /api/products/:id
4. DELETE /api/products/:id

Pedidos
1. POST /api/orders
2. GET  /api/orders/:customerId
3. PUT  /api/orders/:id/status

Checkout Mercado Pago
1. POST /api/checkout  
   Corpo esperado orderId, total  
   Retorna init_point para redirecionamento

## Notas de segurança

1. Nunca commitar arquivos .env
2. Alterar JWT_SECRET em produção
3. Usar credenciais de produção do Mercado Pago somente no ambiente produtivo

## Dicas WSL

1. Rode sempre os comandos em um terminal da distro Ubuntu
2. Se usar nodemon e notar erros de watch, crie backend/nodemon.json

Exemplo
{
"watch": ["server.js", "models", "routes"],
"ext": "js,json",
"ignore": ["node_modules/*"],
"exec": "node server.js"
}

pgsql
Copiar código

## Teste de fluxo mínimo

1. Criar usuário com POST /api/auth/register
2. Logar com POST /api/auth/login
3. Criar alguns produtos com POST /api/products
4. Ver listagem com GET /api/products
5. Criar pedido com POST /api/orders
6. Gerar pagamento com POST /api/checkout e abrir o init_point no navegador

## Solução de problemas comuns

1. Erro CORS  
   Confirmar app.use(cors()) no server.js

2. Erro de import bcrypt  
   Instalar bcryptjs e usar require('bcryptjs') no User.js

3. Erro no SDK do Mercado Pago  
   Usar mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN })

4. Nodemon com EISDIR no WSL  
   Rodar no terminal da distro Linux  
   Usar nodemon.json para limitar os diretórios observados

Remover venv/ do repositório (sem apagar local)
git rm -r --cached venv
git commit -m "removendo venv do repositório"
git push origin dev

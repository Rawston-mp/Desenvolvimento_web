// Config
const apiBase = 'http://localhost:5000/api';
let token = localStorage.getItem('rapidinho_token') || '';
let currentUser = JSON.parse(localStorage.getItem('rapidinho_user') || 'null');
let cart = JSON.parse(localStorage.getItem('rapidinho_cart') || '[]');

// Elementos
const authStatus = document.getElementById('authStatus');
const openAuth = document.getElementById('openAuth');
const logoutBtn = document.getElementById('logoutBtn');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');

const authModal = document.getElementById('authModal');
const closeAuth = document.getElementById('closeAuth');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMsg = document.getElementById('loginMsg');
const regMsg = document.getElementById('regMsg');

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const categoryList = document.getElementById('categoryList');
const productList = document.getElementById('productList');
const sellerList = document.getElementById('sellerList');

// Dados demo para categorias e vendedores
const demoCategories = [
  { name: 'Celulares', icon: 'fa-mobile-alt', color: 'bg-blue-100', iconColor: 'text-blue-500' },
  { name: 'Casa', icon: 'fa-home', color: 'bg-green-100', iconColor: 'text-green-500' },
  { name: 'Eletrônicos', icon: 'fa-laptop', color: 'bg-purple-100', iconColor: 'text-purple-500' },
  { name: 'Moda', icon: 'fa-shirt', color: 'bg-red-100', iconColor: 'text-red-500' },
  { name: 'Games', icon: 'fa-gamepad', color: 'bg-yellow-100', iconColor: 'text-yellow-500' },
  { name: 'Automóveis', icon: 'fa-car', color: 'bg-pink-100', iconColor: 'text-pink-500' }
];

const demoSellers = [
  { name: 'Carlos Silva', area: 'Celulares', dist: '1.2km', img: 'https://placehold.co/80x80' },
  { name: 'Ana Souza', area: 'Moda', dist: '0.8km', img: 'https://placehold.co/80x80' },
  { name: 'João Santos', area: 'Eletrodomésticos', dist: '2.5km', img: 'https://placehold.co/80x80' }
];

// Utilidades
function setAuthUI() {
  if (token && currentUser) {
    authStatus.textContent = `Olá, ${currentUser.name}. Perfil: ${currentUser.role}.`;
    openAuth.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    authStatus.textContent = 'Você não está logado.';
    openAuth.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }
}

function saveCart() {
  localStorage.setItem('rapidinho_cart', JSON.stringify(cart));
  cartCount.textContent = String(cart.length);
}

function showModal() { authModal.classList.remove('hidden'); authModal.classList.add('flex'); }
function hideModal() { authModal.classList.add('hidden'); authModal.classList.remove('flex'); }

function switchToLogin() {
  tabLogin.classList.add('btn-blue'); tabRegister.classList.remove('btn-blue');
  loginForm.classList.remove('hidden'); registerForm.classList.add('hidden');
  loginMsg.textContent = ''; regMsg.textContent = '';
}
function switchToRegister() {
  tabRegister.classList.add('btn-blue'); tabLogin.classList.remove('btn-blue');
  registerForm.classList.remove('hidden'); loginForm.classList.add('hidden');
  loginMsg.textContent = ''; regMsg.textContent = '';
}

// Render
function renderCategories(items) {
  categoryList.innerHTML = '';
  items.forEach(c => {
    const el = document.createElement('div');
    el.className = 'category-card flex flex-col items-center';
    el.innerHTML = `
      <div class="w-16 h-16 ${c.color} rounded-full flex items-center justify-center mb-2">
        <i class="fas ${c.icon} ${c.iconColor} text-2xl"></i>
      </div>
      <span class="text-sm font-medium text-center">${c.name}</span>
    `;
    categoryList.appendChild(el);
  });
}

function renderProducts(items) {
  productList.innerHTML = '';
  items.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="relative">
        <img src="${p.image || 'https://placehold.co/300x300'}" alt="${p.name}"/>
        <span class="local-badge absolute top-2 right-2">
          <i class="fas fa-bolt mr-1"></i> LOCAL
        </span>
      </div>
      <div class="p-3">
        <h3 class="font-medium text-gray-800 mb-1 truncate" title="${p.name}">${p.name}</h3>
        <p class="text-xs text-gray-500 mb-2">${p.description || 'Produto local'}</p>
        <div class="flex justify-between items-center">
          <span class="font-bold text-lg">R$ ${Number(p.price).toFixed(2)}</span>
          <button class="btn btn-blue text-sm add-to-cart">Adicionar</button>
        </div>
      </div>
    `;
    const btn = card.querySelector('.add-to-cart');
    btn.addEventListener('click', () => {
      cart.push({ id: p._id, name: p.name, price: p.price });
      saveCart();
      alert(`${p.name} adicionado ao carrinho.`);
    });
    productList.appendChild(card);
  });
}

function renderSellers(items) {
  sellerList.innerHTML = '';
  items.forEach(s => {
    const row = document.createElement('div');
    row.className = 'seller-info p-3 flex items-center cursor-pointer hover:bg-gray-50';
    row.innerHTML = `
      <img src="${s.img}" alt="Foto do vendedor ${s.name}" class="w-12 h-12 rounded-full object-cover mr-3"/>
      <div>
        <h4 class="font-medium">${s.name}</h4>
        <div class="flex justify-between text-xs text-gray-500">
          <span>${s.area}</span>
          <span>${s.dist}</span>
        </div>
      </div>
    `;
    sellerList.appendChild(row);
  });
}

// API helpers
async function apiJSON(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${apiBase}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error || `Erro HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// Ações
async function loadProducts() {
  try {
    const products = await apiJSON('/products', { method: 'GET' });
    renderProducts(products);
  } catch (e) {
    console.error(e);
    productList.innerHTML = `<div class="text-sm text-red-600">Erro ao carregar produtos. Verifique se o backend está rodando na porta 5000.</div>`;
  }
}

function doCheckout() {
  if (cart.length === 0) {
    alert('Carrinho vazio.');
    return;
  }
  const total = cart.reduce((sum, p) => sum + Number(p.price || 0), 0);
  const orderId = Date.now().toString();

  apiJSON('/checkout', {
    method: 'POST',
    body: JSON.stringify({ orderId, total })
  })
    .then(data => {
      if (data.init_point) {
        window.open(data.init_point, '_blank');
      } else {
        alert('Não foi possível iniciar o pagamento.');
      }
    })
    .catch(err => {
      alert(`Erro no checkout, ${err.message}`);
    });
}

function logout() {
  token = '';
  currentUser = null;
  localStorage.removeItem('rapidinho_token');
  localStorage.removeItem('rapidinho_user');
  setAuthUI();
}

// Eventos de UI
openAuth.addEventListener('click', showModal);
closeAuth.addEventListener('click', hideModal);
tabLogin.addEventListener('click', switchToLogin);
tabRegister.addEventListener('click', switchToRegister);
logoutBtn.addEventListener('click', logout);
cartBtn.addEventListener('click', doCheckout);

// Login
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  loginMsg.textContent = '';
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  try {
    const data = await apiJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    token = data.token;
    currentUser = data.user;
    localStorage.setItem('rapidinho_token', token);
    localStorage.setItem('rapidinho_user', JSON.stringify(currentUser));
    setAuthUI();
    hideModal();
  } catch (err) {
    loginMsg.textContent = err.message;
  }
});

// Cadastro
registerForm.addEventListener('submit', async e => {
  e.preventDefault();
  regMsg.textContent = '';
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const role = document.getElementById('regRole').value;

  try {
    await apiJSON('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    // após cadastro, já faz login
    const login = await apiJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    token = login.token;
    currentUser = login.user;
    localStorage.setItem('rapidinho_token', token);
    localStorage.setItem('rapidinho_user', JSON.stringify(currentUser));
    setAuthUI();
    hideModal();
  } catch (err) {
    regMsg.textContent = err.message;
  }
});

// Busca por nome de produto
searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const term = searchInput.value.trim().toLowerCase();
  try {
    const products = await apiJSON('/products', { method: 'GET' });
    if (!term) { renderProducts(products); return; }
    const filtered = products.filter(p => String(p.name || '').toLowerCase().includes(term));
    renderProducts(filtered);
  } catch (err) {
    console.error(err);
  }
});

// Inicialização
function init() {
  setAuthUI();
  saveCart(); // atualiza contador
  renderCategories(demoCategories);
  renderSellers(demoSellers);
  loadProducts();
  switchToLogin();
}
init();

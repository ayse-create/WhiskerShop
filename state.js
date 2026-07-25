// ===== state.js =====
// Tek merkezi state kaynağı. Basit bir pub/sub (observer) deseni kullanır:
// UI parçaları subscribe olur, state değiştiğinde otomatik render tetiklenir.

const STORAGE_KEY = 'whiskermarket_save_v1';
const STARTING_BALANCE = 100;

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.balance !== 'number' || !Array.isArray(parsed.orders)) return null;
    return parsed;
  } catch (e) {
    console.warn('Kayıt okunamadı, sıfırdan başlanıyor.', e);
    return null;
  }
}

const saved = loadSave();

const state = {
  balance: saved ? saved.balance : STARTING_BALANCE,
  cart: saved && Array.isArray(saved.cart) ? saved.cart : [], // [{productId, qty}]
  orders: saved ? saved.orders : [], // [{id, productId, name, image, price, coinsEarned, status, createdAt}]
  totalOrdersCount: saved && typeof saved.totalOrdersCount === 'number' ? saved.totalOrdersCount : (saved ? saved.orders.length : 0),
  activeCategory: 'all',
  searchQuery: '',
};

const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      balance: state.balance,
      cart: state.cart,
      orders: state.orders,
      totalOrdersCount: state.totalOrdersCount,
    }));
  } catch (e) {
    console.warn('Kayıt yazılamadı (localStorage dolu olabilir).', e);
  }
}

function notify(eventName, payload) {
  persist();
  listeners.forEach((fn) => fn(eventName, payload));
}

export const Store = {
  getState() {
    return state;
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // ---- Sepet işlemleri ----
  addToCart(productId) {
    const existing = state.cart.find((c) => c.productId === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({ productId, qty: 1 });
    }
    notify('cart:add', { productId });
  },

  removeFromCart(productId) {
    state.cart = state.cart.filter((c) => c.productId !== productId);
    notify('cart:remove', { productId });
  },

  clearCartItem(productId) {
    this.removeFromCart(productId);
  },

  getCartTotal(products) {
    return state.cart.reduce((sum, item) => {
      const p = products.find((pr) => pr.id === item.productId);
      return p ? sum + p.price * item.qty : sum;
    }, 0);
  },

  // ---- Bakiye ----
  canAfford(price) {
    return state.balance >= price;
  },

  deduct(amount) {
    state.balance = Math.max(0, state.balance - amount);
    notify('balance:change', { delta: -amount });
  },

  credit(amount) {
    state.balance += amount;
    notify('balance:change', { delta: amount });
  },

  // ---- Siparişler ----
  createOrder(product) {
    state.totalOrdersCount += 1;
    const order = {
      id: `SIP-${Date.now()}-${state.totalOrdersCount}`,
      orderNumber: state.totalOrdersCount,
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      coinsEarned: 0,
      status: 'kargoda',
      createdAt: new Date().toISOString(),
    };
    state.orders.unshift(order);
    notify('order:create', { order });
    return order;
  },

  completeOrder(orderId, coinsEarned) {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return;
    order.status = 'teslim edildi';
    order.coinsEarned = coinsEarned;
    notify('order:complete', { order });
  },

  getOrderCountForDifficulty() {
    // Zorluk, o ana kadar oluşturulan toplam sipariş sayısına göre belirlenir.
    return state.totalOrdersCount;
  },

  // ---- Filtreleme ----
  setCategory(cat) {
    state.activeCategory = cat;
    notify('filter:category', { cat });
  },

  setSearch(q) {
    state.searchQuery = q;
    notify('filter:search', { q });
  },

  // ---- Sıfırlama (debug/kullanıcı isteğiyle) ----
  resetGame() {
    state.balance = STARTING_BALANCE;
    state.cart = [];
    state.orders = [];
    state.totalOrdersCount = 0;
    notify('game:reset', {});
  },
};

export { STARTING_BALANCE };

// ===== main.js =====
import { Store } from './state.js';
import { PRODUCTS } from './products.js';
import { renderCategoryChips, renderProductGrid } from './ShopView.js';
import { renderCart } from './Cart.js';
import { renderOrders } from './OrdersPanel.js';
import { Header } from './Header.js';
import { showToast } from './Toast.js';
import { MiniGame } from './MiniGame.js';
import { Sound } from './soundManager.js';

// ---------- DOM referansları ----------
const categoryRowEl = document.getElementById('categoryRow');
const productGridEl = document.getElementById('productGrid');
const cartBodyEl = document.getElementById('cartBody');
const cartFooterEl = document.getElementById('cartFooter');
const ordersPanelEl = document.getElementById('ordersPanel');
const gameMountEl = document.getElementById('gameMount');
const searchInputEl = document.getElementById('searchInput');

const cartDrawerEl = document.getElementById('cartDrawer');
const drawerOverlayEl = document.getElementById('drawerOverlay');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');

const shopSectionEl = document.getElementById('shopSection');
const ordersSectionEl = document.getElementById('ordersSection');
const ordersBtn = document.getElementById('ordersBtn');
const backToShopBtn = document.getElementById('backToShopBtn');

const header = new Header(document);

let isProcessingPurchase = false;

// ---------- Render ----------
function renderAll() {
  const state = Store.getState();
  header.setBalance(state.balance);
  header.setCartCount(state.cart.reduce((sum, c) => sum + c.qty, 0));
  renderCategoryChips(categoryRowEl, state.activeCategory);
  renderProductGrid(productGridEl, {
    category: state.activeCategory,
    query: state.searchQuery,
    balance: state.balance,
  });
  renderOrders(ordersPanelEl, state.orders);
  renderCart({
    bodyEl: cartBodyEl,
    footerEl: cartFooterEl,
    cart: state.cart,
    products: PRODUCTS,
    balance: state.balance,
  });
}

Store.subscribe(() => renderAll());
renderAll();

// ---------- Sepet çekmecesi ----------
function openCart() {
  cartDrawerEl.classList.add('open');
  drawerOverlayEl.classList.add('open');
}
function closeCart() {
  cartDrawerEl.classList.remove('open');
  drawerOverlayEl.classList.remove('open');
}
cartBtn.addEventListener('click', () => { Sound.click(); openCart(); });
closeCartBtn.addEventListener('click', () => { Sound.click(); closeCart(); });
drawerOverlayEl.addEventListener('click', closeCart);

// ---------- Siparişler görünümü ----------
ordersBtn.addEventListener('click', () => {
  Sound.click();
  shopSectionEl.classList.add('hidden');
  ordersSectionEl.classList.remove('hidden');
  closeCart();
});
backToShopBtn.addEventListener('click', () => {
  Sound.click();
  ordersSectionEl.classList.add('hidden');
  shopSectionEl.classList.remove('hidden');
});

// ---------- Kategori filtresi ----------
categoryRowEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-category]');
  if (!btn) return;
  Sound.click();
  Store.setCategory(btn.dataset.category);
});

// ---------- Arama ----------
let searchDebounce = null;
searchInputEl.addEventListener('input', (e) => {
  clearTimeout(searchDebounce);
  const value = e.target.value;
  searchDebounce = setTimeout(() => Store.setSearch(value.trim()), 150);
});

// ---------- Ürün ızgarası etkileşimleri ----------
productGridEl.addEventListener('click', (e) => {
  const card = e.target.closest('.product-card');
  if (!card) return;
  const productId = Number(card.dataset.productId);
  const actionBtn = e.target.closest('[data-action]');
  if (!actionBtn) return;

  if (actionBtn.dataset.action === 'add-cart') {
    Store.addToCart(productId);
    Sound.addToCart();
    showToast('Sepete eklendi', { type: 'success', icon: '🛒' });
    header.sayMascot('addedToCart');
    actionBtn.classList.add('paw-pop');
    setTimeout(() => actionBtn.classList.remove('paw-pop'), 400);
  } else if (actionBtn.dataset.action === 'buy-now') {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) purchaseProduct(productId, 1);
  }
});

// ---------- Sepet etkileşimleri ----------
cartBodyEl.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('[data-action="remove-cart-item"]');
  if (!removeBtn) return;
  const itemEl = removeBtn.closest('[data-product-id]');
  const productId = Number(itemEl.dataset.productId);
  Store.removeFromCart(productId);
  Sound.click();
});

cartFooterEl.addEventListener('click', (e) => {
  const checkoutBtn = e.target.closest('[data-action="checkout-cart"]');
  if (!checkoutBtn) return;
  checkoutCart();
});

// ---------- Satın alma akışı ----------
async function purchaseProduct(productId, totalItems = 1) {
  if (isProcessingPurchase) return false;
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return false;

  if (!Store.canAfford(product.price)) {
    showToast(`Bakiyen yetersiz — ${product.price} 🐾 gerekiyor.`, { type: 'error', icon: '⚠️' });
    header.sayMascot('lowBalance');
    return false;
  }

  isProcessingPurchase = true;
  Store.deduct(product.price);
  Sound.purchase();
  header.sayMascot('purchased');
  const order = Store.createOrder(product);

  const coinsEarned = await runMiniGame(order, product, totalItems);

  Store.completeOrder(order.id, coinsEarned);
  Store.credit(coinsEarned);
  showToast(`Teslimat tamamlandı! +${coinsEarned} 🐾 kazandın.`, { type: 'success', icon: '🎉' });
  header.sayMascot('delivered');
  isProcessingPurchase = false;
  return true;
}

async function checkoutCart() {
  const state = Store.getState();
  const cartItems = state.cart;
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  
  if (cartItems.length === 0) {
    showToast('Sepetin boş!', { type: 'error', icon: '🛒' });
    return;
  }

  // Sepeti boşalt (görsel olarak)
  cartItems.forEach((item) => Store.removeFromCart(item.productId));
  closeCart();

  // İlk ürünü temsili seç
  const firstProduct = cartItems[0];
  const order = Store.createOrder(firstProduct);
  const coinsEarned = await runMiniGame(order, firstProduct, totalItems);
  
  Store.completeOrder(order.id, coinsEarned);
  Store.credit(coinsEarned);
  showToast(`Teslimat tamamlandı! +${coinsEarned} 🐾 kazandın.`, { type: 'success', icon: '🎉' });
}

function runMiniGame(order, product, totalItems) {
  return new Promise((resolve) => {
    new MiniGame({
      mountEl: gameMountEl,
      orderNumber: order.orderNumber,
      product,
      totalItems: totalItems,
      onComplete: (coins) => resolve(coins),
    });
  });
}

// ===== shop/Cart.js =====
import { CATEGORY_EMOJI } from './products.js';

export function renderCart({ bodyEl, footerEl, cart, products, balance }) {
  if (!cart.length) {
    bodyEl.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🛒</div>
        <h3>Sepetin boş</h3>
        <p>Ürünleri incele ve sepete ekle!</p>
      </div>`;
    footerEl.innerHTML = '';
    return { total: 0 };
  }

  let total = 0;
  bodyEl.innerHTML = cart.map((item) => {
    const p = products.find((pr) => pr.id === item.productId);
    if (!p) return '';
    total += p.price * item.qty;
    return `
      <div class="cart-item" data-product-id="${p.id}">
        <div class="cart-item-media">
          <img src="${p.image}" alt="" onerror="const p2=this.parentElement; this.remove(); p2.textContent='${CATEGORY_EMOJI[p.category] || '🐾'}';">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${escapeHtmlCart(p.name)}${item.qty > 1 ? ` × ${item.qty}` : ''}</div>
          <div class="cart-item-price">${p.price * item.qty} 🐾</div>
        </div>
        <button class="cart-item-remove" data-action="remove-cart-item">Kaldır</button>
      </div>
    `;
  }).join('');

  const affordable = balance >= total;
  footerEl.innerHTML = `
    <div class="drawer-total">
      <span>Toplam</span>
      <span>${total} 🐾</span>
    </div>
    <button class="btn btn-primary" data-action="checkout-cart" style="padding:14px;" ${!affordable ? 'disabled' : ''}>
      ${affordable ? `Satın Al (${cart.length} ürün, sırayla teslim edilecek)` : 'Bakiye Yetersiz'}
    </button>
    <div class="drawer-hint">Sepetteki ürünler tek tek satın alınır, her biri için ayrı kargo mini oyunu açılır.</div>
  `;

  return { total };
}

function escapeHtmlCart(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

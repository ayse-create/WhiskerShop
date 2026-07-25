// ===== shop/ProductCard.js =====
import { CATEGORY_EMOJI } from './products.js';

export function productCardHtml(product, { canAfford, index }) {
  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
  return `
    <article class="product-card" data-product-id="${product.id}" style="animation-delay:${Math.min(index, 10) * 40}ms">
      <div class="product-media">
        <img
          src="${product.image}"
          alt="${escapeHtmlProduct(product.name)}"
          loading="lazy"
          onerror="const p=this.parentElement; this.remove(); p.querySelector('.placeholder-emoji')?.classList.remove('hidden');"
        >
        <span class="placeholder-emoji hidden">${CATEGORY_EMOJI[product.category] || '🐾'}</span>
        ${product.badge ? `<span class="product-badge">${escapeHtmlProduct(product.badge)}</span>` : ''}
      </div>
      <div class="product-body">
        <div class="product-category">${categoryLabel(product.category)}</div>
        <div class="product-name">${escapeHtmlProduct(product.name)}</div>
        <div class="product-rating">${stars} <span style="opacity:.6">${product.rating}</span></div>
        <div class="product-footer">
          <div class="product-price">${product.price}<span class="coin">🐾</span></div>
          <div class="product-actions">
            <button class="btn-icon-round" data-action="add-cart" title="Sepete ekle">🛒</button>
            <button class="btn btn-primary" data-action="buy-now" ${!canAfford ? 'disabled' : ''}>
              ${canAfford ? 'Hemen Al' : 'Yetersiz'}
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

// Placeholder görünsün diye görsel önceden var mı diye anında kontrol de mümkün,
// ama basitlik için onerror'a güveniyoruz; img zaten yoksa hemen tetiklenir.
// İlk render'da img'nin yüklenip yüklenmediğini bilmediğimiz için placeholder
// başlangıçta gizli, sadece hata durumunda gösteriliyor.

function categoryLabel(catId) {
  const map = {
    mama: 'Mama & Ödül', oyuncak: 'Oyuncak', 'kum-kap': 'Kum & Kap',
    aksesuar: 'Aksesuar', ev: 'Kedi Evi',
  };
  return map[catId] || catId;
}

function escapeHtmlProduct(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

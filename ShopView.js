// ===== shop/ShopView.js =====
import { CATEGORIES, filterProducts } from './products.js';
import { productCardHtml } from './ProductCard.js';

export function renderCategoryChips(container, activeCategory) {
  container.innerHTML = CATEGORIES.map((c) => `
    <button class="category-chip ${c.id === activeCategory ? 'active' : ''}" data-category="${c.id}">
      ${c.emoji} ${c.label}
    </button>
  `).join('');
}

export function renderProductGrid(container, { category, query, balance }) {
  const list = filterProducts({ category, query });

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="emoji">🔍</div>
        <h3>Sonuç bulunamadı</h3>
        <p>"${escapeHtmlShop(query || '')}" ile eşleşen ürün yok. Başka bir arama dene.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map((p, i) => productCardHtml(p, { canAfford: balance >= p.price, index: i })).join('');
}

function escapeHtmlShop(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

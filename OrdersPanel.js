// ===== ui/OrdersPanel.js =====

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'az önce';
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  return `${Math.floor(hours / 24)} gün önce`;
}

export function renderOrders(container, orders) {
  if (!orders.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="emoji">📦</div>
        <h3>Henüz siparişin yok</h3>
        <p>Bir ürün satın aldığında burada görünecek.</p>
      </div>`;
    return;
  }

  container.innerHTML = orders.map((o) => `
    <div class="order-card fade-in-up">
      <div class="order-media">
        <img src="${o.image}" alt="" onerror="this.style.display='none'; this.parentElement.innerHTML='📦';">
      </div>
      <div class="order-info">
        <div class="order-name">${escapeHtmlOrders(o.name)}</div>
        <div class="order-meta">#${o.orderNumber} · ${timeAgo(o.createdAt)} · ${o.price} 🐾${o.status === 'teslim edildi' ? ` · +${o.coinsEarned} 🐾 kazanıldı` : ''}</div>
      </div>
      <span class="order-status ${o.status === 'teslim edildi' ? 'delivered' : 'pending'}">
        ${o.status === 'teslim edildi' ? '✓ Teslim Edildi' : '🚚 Kargoda'}
      </span>
    </div>
  `).join('');
}

function escapeHtmlOrders(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

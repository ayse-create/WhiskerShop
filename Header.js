// ===== ui/Header.js =====

const MASCOT_LINES = {
  idle: [
    'Merhaba! Ben Kasiyer Pamuk 🐱 Bugün patilerine ne alışverişi yakışır?',
    'Kedi paranı harca, kargoyu sen sür, eve sağ salim ulaştır! 🚚',
    'Miyav! Sepetine bir şeyler ekle de teslimat macerası başlasın.',
  ],
  addedToCart: [
    'Güzel seçim! Sepete attık, hazır olduğunda satın al. 🛒',
  ],
  purchased: [
    'Sipariş alındı! Şimdi kargoyu sen süreceksin, hazır ol 🐾',
  ],
  delivered: [
    'Kargo eve ulaştı! Bakiyene taze kedi parası eklendi 💰',
  ],
  lowBalance: [
    'Kedi paran azaldı... belki biraz daha teslimat yapmalısın? 😼',
  ],
};

export class Header {
  constructor(root) {
    this.root = root;
    this.balanceEl = root.querySelector('[data-el="balance"]');
    this.balancePillEl = root.querySelector('[data-el="balancePill"]');
    this.cartBadgeEl = root.querySelector('[data-el="cartBadge"]');
    this.mascotTextEl = document.querySelector('[data-el="mascotText"]');
  }

  setBalance(value) {
    if (!this.balanceEl) return;
    this.balanceEl.textContent = value;
    this.balancePillEl.classList.remove('bump');
    // reflow trick to restart animation
    void this.balancePillEl.offsetWidth;
    this.balancePillEl.classList.add('bump');
  }

  setCartCount(count) {
    if (!this.cartBadgeEl) return;
    this.cartBadgeEl.textContent = count;
    this.cartBadgeEl.style.display = count > 0 ? 'flex' : 'none';
  }

  sayMascot(key = 'idle') {
    if (!this.mascotTextEl) return;
    const lines = MASCOT_LINES[key] || MASCOT_LINES.idle;
    const line = lines[Math.floor(Math.random() * lines.length)];
    this.mascotTextEl.innerHTML = `<strong>Kasiyer Pamuk:</strong> ${line}`;
  }
}

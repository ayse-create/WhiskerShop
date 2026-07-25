// ===== minigame/InputHandler.js =====
// Klavye (ok tuşları / A-D), dokunmatik swipe ve ekran üstü butonları
// tek bir arayüze (onLeft/onRight callback) indirger. Oyun motoru
// kontrol şemasından habersizdir.

export class InputHandler {
  constructor({ target, onLeft, onRight, controlButtons }) {
    this.target = target;
    this.onLeft = onLeft;
    this.onRight = onRight;
    this.touchStartX = null;
    this.touchStartY = null;
    this.active = true;

    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchEnd = this._handleTouchEnd.bind(this);

    window.addEventListener('keydown', this._handleKeyDown);
    target.addEventListener('touchstart', this._handleTouchStart, { passive: true });
    target.addEventListener('touchend', this._handleTouchEnd, { passive: true });

    if (controlButtons) {
      this._bindButton(controlButtons.left, () => this.onLeft());
      this._bindButton(controlButtons.right, () => this.onRight());
    }
  }

  _bindButton(el, fn) {
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      if (this.active) fn();
    };
    el.addEventListener('pointerdown', handler);
  }

  _handleKeyDown(e) {
    if (!this.active) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      this.onLeft();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      this.onRight();
    }
  }

  _handleTouchStart(e) {
    const t = e.changedTouches[0];
    this.touchStartX = t.clientX;
    this.touchStartY = t.clientY;
  }

  _handleTouchEnd(e) {
    if (this.touchStartX === null || !this.active) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - this.touchStartX;
    const dy = t.clientY - this.touchStartY;
    if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) this.onLeft(); else this.onRight();
    }
    this.touchStartX = null;
    this.touchStartY = null;
  }

  destroy() {
    this.active = false;
    window.removeEventListener('keydown', this._handleKeyDown);
    this.target.removeEventListener('touchstart', this._handleTouchStart);
    this.target.removeEventListener('touchend', this._handleTouchEnd);
  }
}

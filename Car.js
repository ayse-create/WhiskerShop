// ===== minigame/Car.js =====

export class Car {
  constructor({ laneCount, laneWidth, roadTop, roadBottom }) {
    this.laneCount = laneCount;
    this.laneWidth = laneWidth;
    this.lane = 1; // orta şerit (0,1,2)
    this.targetLane = 1;
    this.x = this._laneCenterX(this.lane);
    this.y = roadBottom - 90;
    this.width = 46;
    this.height = 74;
    this.slideSpeed = 9; // şeritler arası geçiş hızı (px/frame @60fps referans)
    this.hitFlashTimer = 0;
    this.bobPhase = 0;
  }

  _laneCenterX(laneIndex) {
    return this.laneWidth * laneIndex + this.laneWidth / 2;
  }

  moveLeft() {
    if (this.targetLane > 0) this.targetLane -= 1;
  }

  moveRight() {
    if (this.targetLane < this.laneCount - 1) this.targetLane += 1;
  }

  get bounds() {
    return {
      left: this.x - this.width / 2 + 8,
      right: this.x + this.width / 2 - 8,
      top: this.y - this.height / 2 + 6,
      bottom: this.y + this.height / 2 - 6,
    };
  }

  registerHit() {
    this.hitFlashTimer = 0.4;
  }

  update(dt) {
    const targetX = this._laneCenterX(this.targetLane);
    const diff = targetX - this.x;
    const step = this.slideSpeed * (dt * 60);
    if (Math.abs(diff) <= step) {
      this.x = targetX;
      this.lane = this.targetLane;
    } else {
      this.x += Math.sign(diff) * step;
    }
    if (this.hitFlashTimer > 0) this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);
    this.bobPhase += dt * 6;
  }

  draw(ctx) {
    const bob = Math.sin(this.bobPhase) * 1.5;
    const x = this.x;
    const y = this.y + bob;
    ctx.save();
    ctx.translate(x, y);

    // Gölge
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(0, this.height / 2 + 4, this.width / 2 + 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const flash = this.hitFlashTimer > 0;
    const bodyColor = flash ? '#ff8a6b' : '#F2A93B';

    // Kargo kasası (arka)
    ctx.fillStyle = bodyColor;
    roundRect(ctx, -this.width / 2, -this.height / 2, this.width, this.height * 0.62, 8);
    ctx.fill();

    // Kabin (ön)
    ctx.fillStyle = flash ? '#ffb199' : '#E15B3F';
    roundRect(ctx, -this.width / 2 + 3, -this.height / 2 + this.height * 0.6, this.width - 6, this.height * 0.4, 7);
    ctx.fill();

    // Ön cam
    ctx.fillStyle = 'rgba(251,243,230,0.85)';
    roundRect(ctx, -this.width / 2 + 8, -this.height / 2 + this.height * 0.66, this.width - 16, 14, 4);
    ctx.fill();

    // Kedi patisi logosu
    ctx.fillStyle = 'rgba(46,26,61,0.85)';
    ctx.beginPath();
    ctx.arc(0, -this.height * 0.1, 6, 0, Math.PI * 2);
    ctx.fill();
    [[-7, -18], [0, -22], [7, -18]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(dx, dy - this.height * 0.1 + 4, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Tekerlekler
    ctx.fillStyle = '#1D0F29';
    [[-this.width / 2 + 2, this.height / 2 - 12], [this.width / 2 - 2, this.height / 2 - 12],
     [-this.width / 2 + 2, -this.height / 2 + 14], [this.width / 2 - 2, -this.height / 2 + 14]].forEach(([wx, wy]) => {
      roundRect(ctx, wx - 4, wy - 8, 8, 16, 3);
      ctx.fill();
    });

    ctx.restore();
  }
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

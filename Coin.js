// ===== minigame/Coin.js =====

export class Coin {
  constructor({ lane, laneWidth, y, value }) {
    this.lane = lane;
    this.x = laneWidth * lane + laneWidth / 2;
    this.y = y;
    this.value = 1;
    this.radius = 13;
    this.collected = false;
    this.spinPhase = Math.random() * Math.PI * 2;
  }

  get bounds() {
    return {
      left: this.x - this.radius,
      right: this.x + this.radius,
      top: this.y - this.radius,
      bottom: this.y + this.radius,
    };
  }

  update(dt) {
    this.spinPhase += dt * 4;
  }

  draw(ctx) {
    if (this.collected) return;
    const squish = Math.abs(Math.cos(this.spinPhase));
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(Math.max(0.25, squish), 1);

    const grad = ctx.createLinearGradient(-this.radius, 0, this.radius, 0);
    grad.addColorStop(0, '#F2A93B');
    grad.addColorStop(0.5, '#FFDA8A');
    grad.addColorStop(1, '#D98B1F');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a86c1d';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#7a4f10';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐾', 0, 1);

    ctx.restore();
  }
}

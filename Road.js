// ===== minigame/Road.js =====

export class Road {
  constructor({ width, height, laneCount }) {
    this.width = width;
    this.height = height;
    this.laneCount = laneCount;
    this.laneWidth = width / laneCount;
    this.dashOffset = 0;
  }

  update(dt, scrollSpeed) {
    this.dashOffset = (this.dashOffset + scrollSpeed * dt) % 48;
  }

  draw(ctx) {
    // Asfalt
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#3a2b45');
    grad.addColorStop(1, '#241730');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Kenar şeritleri (kaldırım)
    ctx.fillStyle = '#4f3a5c';
    ctx.fillRect(0, 0, 10, this.height);
    ctx.fillRect(this.width - 10, 0, 10, this.height);

    // Şerit ayraç çizgileri
    ctx.strokeStyle = 'rgba(242,169,59,0.55)';
    ctx.lineWidth = 4;
    ctx.setLineDash([22, 26]);
    for (let i = 1; i < this.laneCount; i++) {
      const x = this.laneWidth * i;
      ctx.beginPath();
      ctx.lineDashOffset = -this.dashOffset;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }
}

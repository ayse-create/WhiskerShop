// ===== minigame/Obstacle.js =====
import { roundRect } from './Car.js';

const TYPES = ['crate', 'cone', 'puddle'];

export class Obstacle {
  constructor({ lane, laneWidth, y, type }) {
    this.lane = lane;
    this.laneWidth = laneWidth;
    this.x = laneWidth * lane + laneWidth / 2;
    this.y = y;
    this.type = type || TYPES[Math.floor(Math.random() * TYPES.length)];
    this.width = this.type === 'puddle' ? 54 : 40;
    this.height = this.type === 'puddle' ? 26 : 40;
    this.passed = false;
  }

  get bounds() {
    return {
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      top: this.y - this.height / 2,
      bottom: this.y + this.height / 2,
    };
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Gölge
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, this.height / 2, this.width / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.type === 'crate') {
      ctx.fillStyle = '#a9713f';
      roundRect(ctx, -this.width / 2, -this.height / 2, this.width, this.height, 4);
      ctx.fill();
      ctx.strokeStyle = '#7a4f28';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.beginPath();
      ctx.moveTo(-this.width / 2, -this.height / 2);
      ctx.lineTo(this.width / 2, this.height / 2);
      ctx.moveTo(this.width / 2, -this.height / 2);
      ctx.lineTo(-this.width / 2, this.height / 2);
      ctx.stroke();
    } else if (this.type === 'cone') {
      ctx.fillStyle = '#E15B3F';
      ctx.beginPath();
      ctx.moveTo(0, -this.height / 2);
      ctx.lineTo(this.width / 2, this.height / 2);
      ctx.lineTo(-this.width / 2, this.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(251,243,230,0.9)';
      ctx.fillRect(-this.width / 2 + 6, 2, this.width - 12, 6);
    } else {
      ctx.fillStyle = 'rgba(60,120,180,0.55)';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(120,180,220,0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }
}

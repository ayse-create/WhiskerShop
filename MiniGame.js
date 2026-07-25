// ===== minigame/MiniGame.js =====
import { Car } from './Car.js';
import { Road } from './Road.js';
import { Obstacle } from './Obstacle.js';
import { Coin } from './Coin.js';
import { InputHandler } from './InputHandler.js';
import { getDifficultyConfig } from './DifficultyManager.js';
import { Sound } from './soundManager.js';

const LANE_COUNT = 3;
const CANVAS_W = 420;
const CANVAS_H = 620;

export class MiniGame {
  constructor({ mountEl, orderNumber, product, onComplete, totalItems = 1 }) {
    this.mountEl = mountEl;
    this.product = product;
    this.onComplete = onComplete;
    this.totalItems = totalItems;
    this.config = getDifficultyConfig(orderNumber);

    this.distanceTraveled = 0;
    this.sessionCoins = 0;
    this.hitCount = 0;
    this.speedPenaltyTimer = 0;
    this.state = 'intro';
    this.popups = [];

    this._buildDom();
    this._buildEntities();
    this._bindEvents();

    this.lastTs = null;
    this.rafId = null;
    this._loop = this._loop.bind(this);
  }

  _buildDom() {
    const wrap = document.createElement('div');
    wrap.className = 'game-overlay';
    wrap.innerHTML = `
      <div class="game-modal">
        <div class="game-hud">
          <div class="game-hud-group">
            <span class="hud-order-badge">Sipariş #${this.config.orderNumber} · ${this.config.label}</span>
          </div>
          <div class="game-hud-group">
            <span class="hud-stat coins">🐾 <span data-el="hudCoins">0</span></span>
          </div>
        </div>
        <div class="game-canvas-wrap">
          <canvas id="gameCanvas" width="${CANVAS_W}" height="${CANVAS_H}"></canvas>
          <div class="game-intro" data-el="intro">
            <div class="big-emoji">🚚</div>
            <h3>Teslimat Zamanı!</h3>
            <p><strong>${this._escapeHtml(this.product.name)}</strong> siparişini eve götürmelisin.</p>
            <button class="btn btn-primary" data-el="startBtn" style="font-size:15px;padding:14px 28px;">Teslimata Başla 🐾</button>
          </div>
          <div class="game-result hidden" data-el="result">
            <div class="big-emoji">🏠</div>
            <h3>Eve Ulaştı!</h3>
            <div class="earned"><span data-el="earnedAmount">0</span> 🐾</div>
            <button class="btn btn-primary" data-el="continueBtn" style="font-size:15px;padding:14px 28px;">Bakiyeye Ekle ve Devam Et</button>
          </div>
        </div>
        <div class="game-controls-mobile">
          <button class="control-btn" data-el="btnLeft">◀</button>
          <button class="control-btn" data-el="btnRight">▶</button>
        </div>
        <div class="game-hint">
          <span class="kbd-hint"><kbd>←</kbd> <kbd>A</kbd> sola · <kbd>→</kbd> <kbd>D</kbd> sağa</span>
        </div>
      </div>
    `;
    this.mountEl.appendChild(wrap);
    this.el = {
      overlay: wrap,
      canvas: wrap.querySelector('#gameCanvas'),
      intro: wrap.querySelector('[data-el="intro"]'),
      result: wrap.querySelector('[data-el="result"]'),
      startBtn: wrap.querySelector('[data-el="startBtn"]'),
      continueBtn: wrap.querySelector('[data-el="continueBtn"]'),
      hudCoins: wrap.querySelector('[data-el="hudCoins"]'),
      earnedAmount: wrap.querySelector('[data-el="earnedAmount"]'),
      btnLeft: wrap.querySelector('[data-el="btnLeft"]'),
      btnRight: wrap.querySelector('[data-el="btnRight"]'),
    };
    this.ctx = this.el.canvas.getContext('2d');
    requestAnimationFrame(() => this.el.overlay.classList.add('open'));
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  _buildEntities() {
    const laneWidth = CANVAS_W / LANE_COUNT;
    this.road = new Road({ width: CANVAS_W, height: CANVAS_H, laneCount: LANE_COUNT });
    this.car = new Car({ laneCount: LANE_COUNT, laneWidth, roadTop: 0, roadBottom: CANVAS_H });

    this.obstacles = [];
    this.coins = [];

   const baseDistance = 6000; // 2 kat uzun
const totalDistance = baseDistance * Math.max(1, this.totalItems);
const obstacleGap = 180;
const coinGap = 120;
    let d = 500;

    while (d < totalDistance - 200) {
      const blockCount = Math.random() < 0.3 ? 2 : 1;
      const lanes = this._pickLanes(blockCount);
      const jitter = (Math.random() - 0.5) * obstacleGap * 0.3;
      lanes.forEach((lane) => {
        this.obstacles.push(new Obstacle({ lane, laneWidth, y: d + jitter }));
      });
      d += obstacleGap * (0.85 + Math.random() * 0.3);
    }

    d = 300;
    while (d < totalDistance - 100) {
      const blockedLanesHere = this.obstacles
        .filter((o) => Math.abs(o.y - d) < 60)
        .map((o) => o.lane);
      const freeLanes = [0, 1, 2].filter((l) => !blockedLanesHere.includes(l));
      if (freeLanes.length > 0) {
        const lane = freeLanes[Math.floor(Math.random() * freeLanes.length)];
        this.coins.push(new Coin({ lane, laneWidth, y: d, value: 1 }));
      }
      d += coinGap * (0.8 + Math.random() * 0.4);
    }

    this.finishLineY = totalDistance;
  }

  _pickLanes(count) {
    const lanes = [0, 1, 2];
    const chosen = [];
    for (let i = 0; i < count && lanes.length > 1; i++) {
      if (lanes.length <= 1) break;
      const idx = Math.floor(Math.random() * lanes.length);
      chosen.push(lanes[idx]);
      lanes.splice(idx, 1);
    }
    return chosen;
  }

  _bindEvents() {
    this.el.startBtn.addEventListener('click', () => this._start());
    this.el.continueBtn.addEventListener('click', () => this._finish());

    this.input = new InputHandler({
      target: this.el.canvas,
      onLeft: () => {
        if (this.state !== 'playing') return;
        this.car.moveLeft();
        Sound.laneSwitch();
      },
      onRight: () => {
        if (this.state !== 'playing') return;
        this.car.moveRight();
        Sound.laneSwitch();
      },
      controlButtons: { left: this.el.btnLeft, right: this.el.btnRight },
    });
  }

  _start() {
    this.state = 'playing';
    this.el.intro.classList.add('hidden');
    this.lastTs = null;
    this.rafId = requestAnimationFrame(this._loop);
  }

  _loop(ts) {
    if (this.state !== 'playing') return;
    if (this.lastTs === null) this.lastTs = ts;
    let dt = (ts - this.lastTs) / 1000;
    dt = Math.min(dt, 0.05);
    this.lastTs = ts;

    this._update(dt);
    this._render();

    if (this.distanceTraveled >= this.finishLineY) {
      this._showResult();
      return;
    }

    this.rafId = requestAnimationFrame(this._loop);
  }

  _update(dt) {
    if (this.speedPenaltyTimer > 0) this.speedPenaltyTimer -= dt;
    const speedFactor = this.speedPenaltyTimer > 0 ? 0.45 : 1;
    const speed = this.config.baseSpeed * speedFactor;

    this.distanceTraveled += speed * dt;
    this.road.update(dt, speed);
    this.car.update(dt);
    this.coins.forEach((c) => c.update(dt));

    const carY = this.car.y;

    this.obstacles.forEach((o) => {
      if (o.passed) return; // ← BURASI DÜZELTİLDİ!
      const screenY = carY - (o.y - this.distanceTraveled);
      if (screenY > CANVAS_H + 60) { 
        o.passed = true; 
        return; 
      }
      o._screenY = screenY;
      if (Math.abs(screenY - carY) < 34 && o.lane === this.car.lane) {
        o.passed = true;
        this._onObstacleHit(o);
      }
    });

    this.coins.forEach((c) => {
      if (c.collected) return;
      const screenY = carY - (c.y - this.distanceTraveled);
      c._screenY = screenY;
      if (Math.abs(screenY - carY) < 38 && c.lane === this.car.lane) {
        c.collected = true;
        this._onCoinCollect(c);
      }
    });

    this.popups.forEach((p) => { p.life -= dt; p.y -= dt * 40; });
    this.popups = this.popups.filter((p) => p.life > 0);
  }

  _onObstacleHit(o) {
    this.hitCount += 1;
    this.sessionCoins = Math.max(0, this.sessionCoins - 1);
    this.speedPenaltyTimer = 0.5;
    this.car.registerHit();
    Sound.crash();
    this.popups.push({ text: '-1 🐾', x: this.car.x, y: this.car.y - 40, life: 0.7, color: '#E15B3F' });
    o.passed = true;
    if (navigator.vibrate) navigator.vibrate(60);
  }

  _onCoinCollect(c) {
    this.sessionCoins += 1;
    this.el.hudCoins.textContent = this.sessionCoins;
    Sound.coin();
    this.popups.push({ text: '+1', x: c.x, y: this.car.y - 30, life: 0.6, color: '#F2A93B' });
  }

  _render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    this.road.draw(ctx);

    const distToFinish = this.finishLineY - this.distanceTraveled;
    if (distToFinish < 700) {
      const screenY = this.car.y - distToFinish;
      if (screenY > -60) {
        ctx.save();
        ctx.fillStyle = 'rgba(76,154,106,0.85)';
        ctx.fillRect(0, screenY - 10, CANVAS_W, 20);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏠 EV — VARIŞ ÇİZGİSİ', CANVAS_W / 2, screenY + 5);
        ctx.restore();
      }
    }

    this.obstacles.forEach((o) => {
      if (o.passed || o._screenY === undefined || o._screenY < -60 || o._screenY > CANVAS_H + 60) return;
      const realY = o.y;
      o.y = o._screenY;
      o.draw(ctx);
      o.y = realY;
    });

    this.coins.forEach((c) => {
      if (c.collected || c._screenY === undefined || c._screenY < -40 || c._screenY > CANVAS_H + 40) return;
      const realY = c.y;
      c.y = c._screenY;
      c.draw(ctx);
      c.y = realY;
    });

    this.car.draw(ctx);

    ctx.textAlign = 'center';
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    this.popups.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / 0.7);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
      ctx.globalAlpha = 1;
    });

    const progress = Math.min(1, this.distanceTraveled / this.finishLineY);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, CANVAS_W, 6);
    ctx.fillStyle = '#F2A93B';
    ctx.fillRect(0, 0, CANVAS_W * progress, 6);
  }

  _showResult() {
    this.state = 'result';
    cancelAnimationFrame(this.rafId);
    Sound.victory();
    this.el.result.classList.remove('hidden');
    this.el.earnedAmount.textContent = this.sessionCoins;
  }

  _finish() {
    this.input.destroy();
    this.el.overlay.classList.remove('open');
    const coins = this.sessionCoins;
    setTimeout(() => {
      this.mountEl.removeChild(this.el.overlay);
      this.onComplete(coins);
    }, 300);
  }
}

// ===== audio/soundManager.js =====
// Dış ses dosyası kullanmadan Web Audio API osilatörleri ile anlık SFX üretir.
// Böylece kullanıcı sadece PNG eklemekle uğraşır, ses dosyası yönetmesi gerekmez.

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  _ensureCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  _tone({ freq = 440, duration = 0.15, type = 'sine', volume = 0.2, sweep = null, delay = 0 }) {
    if (this.muted) return;
    try {
      const ctx = this._ensureCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      const startAt = ctx.currentTime + delay;
      osc.frequency.setValueAtTime(freq, startAt);
      if (sweep) osc.frequency.exponentialRampToValueAtTime(sweep, startAt + duration);
      gain.gain.setValueAtTime(volume, startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.02);
    } catch (e) {
      /* Audio engellenmiş olabilir (autoplay policy) - sessizce geç */
    }
  }

  click() {
    this._tone({ freq: 520, duration: 0.06, type: 'triangle', volume: 0.15 });
  }

  addToCart() {
    this._tone({ freq: 440, duration: 0.09, type: 'sine', volume: 0.18 });
    this._tone({ freq: 660, duration: 0.1, type: 'sine', volume: 0.15, delay: 0.06 });
  }

  purchase() {
    this._tone({ freq: 300, duration: 0.12, type: 'sawtooth', volume: 0.12 });
    this._tone({ freq: 500, duration: 0.14, type: 'sine', volume: 0.16, delay: 0.08 });
  }

  coin() {
    this._tone({ freq: 880, duration: 0.08, type: 'square', volume: 0.14, sweep: 1320 });
  }

  crash() {
    this._tone({ freq: 180, duration: 0.22, type: 'sawtooth', volume: 0.22, sweep: 60 });
  }

  laneSwitch() {
    this._tone({ freq: 700, duration: 0.05, type: 'sine', volume: 0.08 });
  }

  victory() {
    [523, 659, 784, 1046].forEach((f, i) => {
      this._tone({ freq: f, duration: 0.22, type: 'sine', volume: 0.16, delay: i * 0.1 });
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

export const Sound = new SoundManager();

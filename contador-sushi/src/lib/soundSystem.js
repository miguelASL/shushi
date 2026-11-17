let muted = false;
let sharedCtx = null;

function getCtx() {
  if (muted) return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedCtx) sharedCtx = new AudioCtx();
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

function tone(freqs, { type = 'sine', gap = 0.08, duration = 0.2, gain = 0.28 } = {}) {
  const ctx = getCtx();
  if (!ctx) return;
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = typeof type === 'function' ? type(i) : type;
    const start = ctx.currentTime + i * gap;
    g.gain.setValueAtTime(gain, start);
    g.gain.exponentialRampToValueAtTime(0.01, start + duration);
    osc.start(start);
    osc.stop(start + duration);
  });
}

function slide(from, to, { type = 'sine', duration = 0.25, gain = 0.22 } = {}) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = type;
  const start = ctx.currentTime;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), start + duration);
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.01, start + duration);
  osc.start(start);
  osc.stop(start + duration);
}

function noiseBurst({ duration = 0.12, gain = 0.12 } = {}) {
  const ctx = getCtx();
  if (!ctx) return;
  const len = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  }
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 900;
  src.buffer = buffer;
  src.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  src.start();
}

export const SoundSystem = {
  setMuted(value) {
    muted = Boolean(value);
  },
  isMuted() {
    return muted;
  },
  playEat() {
    const variants = [
      [520, 680, 820],
      [480, 640, 900],
      [600, 750, 700],
    ];
    const pick = variants[Math.floor(Math.random() * variants.length)];
    tone(pick, {
      type: (i) => (i === 1 ? 'triangle' : 'sine'),
      gap: 0.045,
      duration: 0.12,
      gain: 0.2,
    });
    noiseBurst({ duration: 0.06, gain: 0.05 });
  },
  playStreak(level = 5) {
    // Silly ascending "nom" fanfare — higher level = crazier
    const base = 400 + Math.min(level, 20) * 18;
    tone([base, base * 1.25, base * 1.5, base * 1.9], {
      type: (i) => (i % 2 === 0 ? 'square' : 'triangle'),
      gap: 0.07,
      duration: 0.18,
      gain: 0.2,
    });
    setTimeout(() => slide(base * 2, base * 0.6, { type: 'sawtooth', duration: 0.2, gain: 0.12 }), 280);
  },
  playBurp() {
    slide(180, 90, { type: 'sine', duration: 0.35, gain: 0.3 });
    setTimeout(() => noiseBurst({ duration: 0.15, gain: 0.08 }), 80);
  },
  playWin() {
    tone([523, 659, 784, 1047, 1319], {
      type: (i) => (i < 3 ? 'sine' : 'triangle'),
      gap: 0.12,
      duration: 0.35,
      gain: 0.35,
    });
  },
  playTie() {
    tone([440, 440, 392, 349], { gap: 0.18, duration: 0.28, gain: 0.22 });
  },
  playMilestone() {
    tone([784, 988, 1175], {
      type: 'triangle',
      gap: 0.08,
      duration: 0.22,
      gain: 0.28,
    });
  },
  playBattleEnd() {
    // Dramatic "ta-da + silly slide"
    tone([220, 330, 440, 660], {
      type: 'square',
      gap: 0.11,
      duration: 0.28,
      gain: 0.26,
    });
    setTimeout(() => {
      tone([880, 990, 1320, 1760], {
        type: 'triangle',
        gap: 0.06,
        duration: 0.2,
        gain: 0.22,
      });
    }, 420);
    setTimeout(() => slide(600, 120, { type: 'sawtooth', duration: 0.4, gain: 0.14 }), 700);
  },
};

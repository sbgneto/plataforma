let audioCtx = null;
let muted = false;

function getContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(value) {
  muted = value;
}

function playTone({ frequency, duration, type = 'sine', volume = 0.2, delay = 0 }) {
  if (muted) return;
  const ctx = getContext();
  const startTime = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playCorrect() {
  playTone({ frequency: 523.25, duration: 0.12, type: 'sine', volume: 0.18 });
  playTone({ frequency: 783.99, duration: 0.18, type: 'sine', volume: 0.18, delay: 0.1 });
}

export function playWrong() {
  playTone({ frequency: 220, duration: 0.25, type: 'square', volume: 0.12 });
}

export function playClick() {
  playTone({ frequency: 440, duration: 0.05, type: 'sine', volume: 0.1 });
}

export function playCombo() {
  playTone({ frequency: 523.25, duration: 0.1, type: 'triangle', volume: 0.16 });
  playTone({ frequency: 659.25, duration: 0.1, type: 'triangle', volume: 0.16, delay: 0.08 });
  playTone({ frequency: 987.77, duration: 0.18, type: 'triangle', volume: 0.18, delay: 0.16 });
}

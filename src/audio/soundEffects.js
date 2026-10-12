let audioContext = null;
let enabled = false;
const listeners = new Set();

const melodies = {
  on: [
    { frequency: 659, at: 0, duration: 0.13, type: "sine", volume: 0.026 },
    { frequency: 880, at: 0.12, duration: 0.2, type: "sine", volume: 0.024 }
  ],
  pet: [
    { frequency: 510, endFrequency: 740, at: 0, duration: 0.12, type: "triangle", volume: 0.022 },
    { frequency: 730, endFrequency: 500, at: 0.1, duration: 0.17, type: "triangle", volume: 0.021 },
    { frequency: 370, endFrequency: 330, at: 0.23, duration: 0.14, type: "sine", volume: 0.012 }
  ],
  dance: [
    { frequency: 392, at: 0, duration: 0.13, type: "triangle", volume: 0.021 },
    { frequency: 494, at: 0.12, duration: 0.13, type: "triangle", volume: 0.022 },
    { frequency: 587, at: 0.24, duration: 0.13, type: "triangle", volume: 0.022 },
    { frequency: 784, at: 0.36, duration: 0.18, type: "sine", volume: 0.024 },
    { frequency: 659, at: 0.55, duration: 0.13, type: "triangle", volume: 0.02 },
    { frequency: 784, at: 0.68, duration: 0.22, type: "sine", volume: 0.023 }
  ],
  note: [
    { frequency: 587, at: 0, duration: 0.16, type: "sine", volume: 0.018 },
    { frequency: 784, at: 0.12, duration: 0.23, type: "sine", volume: 0.02 }
  ],
  love: [
    { frequency: 523, at: 0, duration: 0.13, type: "sine", volume: 0.019 },
    { frequency: 659, at: 0.1, duration: 0.14, type: "sine", volume: 0.02 },
    { frequency: 784, at: 0.2, duration: 0.28, type: "sine", volume: 0.021 }
  ],
  collect: [
    { frequency: 740, at: 0, duration: 0.09, type: "sine", volume: 0.018 },
    { frequency: 988, at: 0.065, duration: 0.17, type: "sine", volume: 0.02 }
  ],
  tease: [
    { frequency: 330, at: 0, duration: 0.13, type: "triangle", volume: 0.014 },
    { frequency: 294, at: 0.13, duration: 0.18, type: "triangle", volume: 0.013 }
  ],
  reveal: [
    { frequency: 523, at: 0, duration: 0.18, type: "sine", volume: 0.02 },
    { frequency: 659, at: 0.14, duration: 0.18, type: "sine", volume: 0.021 },
    { frequency: 880, at: 0.28, duration: 0.28, type: "sine", volume: 0.022 }
  ],
  reward: [
    { frequency: 523, at: 0, duration: 0.18, type: "triangle", volume: 0.021 },
    { frequency: 659, at: 0.11, duration: 0.18, type: "triangle", volume: 0.022 },
    { frequency: 784, at: 0.22, duration: 0.2, type: "triangle", volume: 0.023 },
    { frequency: 1047, at: 0.34, duration: 0.3, type: "sine", volume: 0.025 }
  ]
};

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

function announceState() {
  listeners.forEach((listener) => listener(enabled));
}

export function isCuteSoundEnabled() {
  return enabled;
}

export function subscribeToCuteSounds(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function setCuteSoundEnabled(nextEnabled) {
  if (!nextEnabled) {
    enabled = false;
    announceState();
    return true;
  }

  try {
    const context = getAudioContext();
    if (!context) return false;
    if (context.state !== "running") await context.resume();
    if (context.state !== "running") return false;
    enabled = true;
    announceState();
    playCuteSound("on");
    return true;
  } catch {
    enabled = false;
    announceState();
    return false;
  }
}

export function playCuteSound(kind = "collect") {
  if (!enabled || typeof document !== "undefined" && document.hidden) return false;
  const context = getAudioContext();
  if (!context) return false;
  if (context.state !== "running") {
    context.resume().catch(() => {});
    return false;
  }

  const notes = melodies[kind] || melodies.collect;
  const origin = context.currentTime;
  for (const note of notes) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = origin + note.at;
    const end = start + note.duration;
    oscillator.type = note.type || "sine";
    oscillator.frequency.setValueAtTime(note.frequency, start);
    if (note.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(note.endFrequency, end);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(note.volume || 0.018, start + Math.min(0.025, note.duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  }
  return true;
}

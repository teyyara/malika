let audioContext = null;
let enabled = false;
const listeners = new Set();
let loveThemeSession = null;
let loveThemeRequested = false;

const animalAudio = {
  cuteMeow: { url: "/audio/mimi-meow-cute.mp3", volume: 0.62 },
  shortMeow: { url: "/audio/mimi-meow-short.mp3", volume: 0.59 },
  purr: { url: "/audio/mimi-purr.mp3", volume: 0.23 }
};
const decodedAnimalAudio = new Map();
const loadingAnimalAudio = new Map();
const activeAnimalVoices = new Set();
const activeOneShotTones = new Set();
let nextMeowVariant = 0;
let softEchoBus = null;

const melodies = {
  on: [
    { frequency: 659, at: 0, duration: 0.13, type: "sine", volume: 0.026 },
    { frequency: 880, at: 0.12, duration: 0.2, type: "sine", volume: 0.024 }
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
    { frequency: 523.25, at: 0, duration: 0.3, type: "triangle", volume: 0.024 },
    { frequency: 659.25, at: 0.12, duration: 0.31, type: "triangle", volume: 0.024 },
    { frequency: 783.99, at: 0.24, duration: 0.34, type: "triangle", volume: 0.025 },
    { frequency: 1046.5, at: 0.38, duration: 0.6, type: "sine", volume: 0.028 },
    { frequency: 1318.51, at: 0.48, duration: 0.55, type: "sine", volume: 0.015 },
    { frequency: 1567.98, at: 0.62, duration: 0.44, type: "sine", volume: 0.012 }
  ],
  "achievement-stars": [
    { frequency: 523.25, at: 0, duration: 0.2, type: "triangle", volume: 0.024 },
    { frequency: 659.25, at: 0.105, duration: 0.23, type: "triangle", volume: 0.024 },
    { frequency: 783.99, at: 0.21, duration: 0.25, type: "triangle", volume: 0.025 },
    { frequency: 1046.5, at: 0.33, duration: 0.52, type: "sine", volume: 0.029 },
    { frequency: 1567.98, at: 0.49, duration: 0.45, type: "sine", volume: 0.013 }
  ],
  "achievement-memory": [
    { frequency: 523.25, at: 0, duration: 0.48, type: "sine", volume: 0.021 },
    { frequency: 659.25, at: 0.015, duration: 0.47, type: "sine", volume: 0.02 },
    { frequency: 783.99, at: 0.03, duration: 0.46, type: "sine", volume: 0.018 },
    { frequency: 987.77, at: 0.045, duration: 0.45, type: "sine", volume: 0.016 },
    { frequency: 659.25, at: 0.48, duration: 0.26, type: "triangle", volume: 0.018 },
    { frequency: 1046.5, at: 0.62, duration: 0.47, type: "sine", volume: 0.026 }
  ],
  "achievement-rhythm": [
    { frequency: 392, at: 0, duration: 0.12, type: "triangle", volume: 0.024 },
    { frequency: 494, at: 0.12, duration: 0.12, type: "triangle", volume: 0.024 },
    { frequency: 587.33, at: 0.24, duration: 0.12, type: "triangle", volume: 0.024 },
    { frequency: 783.99, at: 0.36, duration: 0.18, type: "triangle", volume: 0.026 },
    { frequency: 587.33, at: 0.54, duration: 0.12, type: "triangle", volume: 0.024 },
    { frequency: 783.99, at: 0.66, duration: 0.17, type: "triangle", volume: 0.026 },
    { frequency: 1174.66, at: 0.82, duration: 0.5, type: "sine", volume: 0.026 }
  ],
  "achievement-fireflies": [
    { frequency: 587.33, at: 0, duration: 0.18, type: "sine", volume: 0.02 },
    { frequency: 880, at: 0.1, duration: 0.21, type: "sine", volume: 0.022 },
    { frequency: 1174.66, at: 0.22, duration: 0.22, type: "sine", volume: 0.024 },
    { frequency: 1567.98, at: 0.36, duration: 0.28, type: "sine", volume: 0.02 },
    { frequency: 1318.51, at: 0.55, duration: 0.28, type: "sine", volume: 0.02 },
    { frequency: 1760, at: 0.72, duration: 0.58, type: "sine", volume: 0.024 }
  ],
  "achievement-wishes": [
    { frequency: 392, at: 0, duration: 0.34, type: "triangle", volume: 0.02 },
    { frequency: 523.25, at: 0.08, duration: 0.39, type: "sine", volume: 0.022 },
    { frequency: 659.25, at: 0.2, duration: 0.43, type: "sine", volume: 0.023 },
    { frequency: 783.99, at: 0.33, duration: 0.48, type: "sine", volume: 0.023 },
    { frequency: 1046.5, at: 0.53, duration: 0.58, type: "sine", volume: 0.026 },
    { frequency: 1318.51, at: 0.67, duration: 0.65, type: "sine", volume: 0.016 }
  ],
  "achievement-heart-garden": [
    { frequency: 392, at: 0, duration: 0.23, type: "triangle", volume: 0.025 },
    { frequency: 523.25, at: 0.12, duration: 0.28, type: "triangle", volume: 0.025 },
    { frequency: 659.25, at: 0.25, duration: 0.31, type: "triangle", volume: 0.026 },
    { frequency: 783.99, at: 0.4, duration: 0.34, type: "sine", volume: 0.028 },
    { frequency: 1046.5, at: 0.56, duration: 0.63, type: "sine", volume: 0.028 },
    { frequency: 1318.51, at: 0.7, duration: 0.62, type: "sine", volume: 0.014 }
  ],
  "grand-achievement": [
    { frequency: 392, at: 0, duration: 0.22, type: "triangle", volume: 0.025 },
    { frequency: 493.88, at: 0.13, duration: 0.22, type: "triangle", volume: 0.025 },
    { frequency: 587.33, at: 0.26, duration: 0.24, type: "triangle", volume: 0.026 },
    { frequency: 783.99, at: 0.4, duration: 0.32, type: "triangle", volume: 0.026 },
    { frequency: 987.77, at: 0.54, duration: 0.65, type: "sine", volume: 0.028 },
    { frequency: 1174.66, at: 0.64, duration: 0.7, type: "sine", volume: 0.026 },
    { frequency: 1567.98, at: 0.76, duration: 0.86, type: "sine", volume: 0.023 },
    { frequency: 1975.53, at: 0.92, duration: 0.7, type: "sine", volume: 0.014 }
  ]
};

const LOVE_THEME_PHRASE_SECONDS = 12.8;
const loveProgression = [
  { bass: 130.81, chord: [261.63, 329.63, 392, 493.88], arpeggio: [523.25, 659.25, 783.99, 659.25, 587.33], melody: [659.25, 587.33, 523.25] },
  { bass: 110, chord: [220, 261.63, 329.63, 392], arpeggio: [523.25, 659.25, 783.99, 659.25, 523.25], melody: [587.33, 523.25, 493.88] },
  { bass: 87.31, chord: [174.61, 220, 261.63, 329.63], arpeggio: [523.25, 659.25, 698.46, 659.25, 587.33], melody: [523.25, 440, 493.88] },
  { bass: 98, chord: [196, 246.94, 293.66, 392], arpeggio: [493.88, 587.33, 783.99, 659.25, 587.33], melody: [587.33, 523.25, 440]
  }
];

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

function trackOscillator(session, oscillator, gain, context) {
  if (session) {
    session.nodes.add(oscillator);
    oscillator.addEventListener("ended", () => session.nodes.delete(oscillator), { once: true });
    return;
  }
  const voice = { context, oscillator, gain };
  activeOneShotTones.add(voice);
  oscillator.addEventListener("ended", () => activeOneShotTones.delete(voice), { once: true });
}

function stopOneShotTones() {
  for (const voice of activeOneShotTones) {
    try {
      const now = voice.context.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now);
      voice.gain.gain.linearRampToValueAtTime(0.0001, now + 0.025);
      voice.oscillator.stop(now + 0.035);
    } catch {
      // The tone may already have finished.
    }
  }
  activeOneShotTones.clear();
}

function getSoftEchoInput(context) {
  if (softEchoBus?.context === context) return softEchoBus.input;
  const delay = context.createDelay(1.2);
  const wet = context.createGain();
  const feedback = context.createGain();
  delay.delayTime.setValueAtTime(0.24, context.currentTime);
  wet.gain.setValueAtTime(0.13, context.currentTime);
  feedback.gain.setValueAtTime(0.12, context.currentTime);
  delay.connect(wet);
  wet.connect(context.destination);
  delay.connect(feedback);
  feedback.connect(delay);
  softEchoBus = { context, input: delay, wet };
  return delay;
}

function loadAnimalAudio(context, key) {
  if (decodedAnimalAudio.has(key)) return Promise.resolve(decodedAnimalAudio.get(key));
  if (loadingAnimalAudio.has(key)) return loadingAnimalAudio.get(key);
  const asset = animalAudio[key];
  if (!asset) return Promise.resolve(null);

  const pending = fetch(asset.url, { cache: "force-cache" })
    .then((response) => {
      if (!response.ok) throw new Error("Could not load local cat sound: " + key);
      return response.arrayBuffer();
    })
    .then((bytes) => context.decodeAudioData(bytes.slice(0)))
    .then((buffer) => {
      decodedAnimalAudio.set(key, buffer);
      return buffer;
    })
    .catch(() => null)
    .finally(() => loadingAnimalAudio.delete(key));
  loadingAnimalAudio.set(key, pending);
  return pending;
}

function preloadAnimalAudio(context) {
  return Promise.all(Object.keys(animalAudio).map((key) => loadAnimalAudio(context, key)));
}

function stopAnimalVoices() {
  for (const voice of activeAnimalVoices) {
    try {
      const now = voice.context.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now);
      voice.gain.gain.linearRampToValueAtTime(0.0001, now + 0.025);
      voice.source.stop(now + 0.035);
    } catch {
      // The clip may already have finished.
    }
  }
  activeAnimalVoices.clear();
}

function playAnimalAudio(kind = "meow") {
  if (!enabled || (typeof document !== "undefined" && document.hidden)) return false;
  const context = getAudioContext();
  if (!context) return false;
  if (context.state !== "running") {
    context.resume().then(() => {
      if (enabled) playAnimalAudio(kind);
    }).catch(() => {});
    return false;
  }

  let key = kind;
  if (kind === "meow" || kind === "pet") {
    key = nextMeowVariant % 2 === 0 ? "cuteMeow" : "shortMeow";
    nextMeowVariant += 1;
  }
  const asset = animalAudio[key];
  if (!asset) return false;

  loadAnimalAudio(context, key).then((buffer) => {
    if (!buffer || !enabled || context.state !== "running" || (typeof document !== "undefined" && document.hidden)) return;
    const now = context.currentTime;
    const source = context.createBufferSource();
    const gain = context.createGain();
    const isPurr = key === "purr";
    const rate = isPurr ? 0.94 + Math.random() * 0.11 : 0.94 + Math.random() * 0.1;
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(rate, now);
    const maxDuration = isPurr ? 1.95 : Math.min(2.35, buffer.duration);
    const offsetLimit = Math.max(0, buffer.duration - maxDuration - 0.05);
    const offset = isPurr ? Math.random() * offsetLimit : Math.random() * Math.min(0.065, offsetLimit);
    const duration = Math.max(0.15, Math.min(maxDuration, (buffer.duration - offset) / rate));
    const stopAt = now + duration;
    const level = asset.volume * (0.93 + Math.random() * 0.12);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + (isPurr ? 0.08 : 0.025));
    gain.gain.setValueAtTime(level, Math.max(now + 0.09, stopAt - 0.16));
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
    source.connect(gain);
    gain.connect(context.destination);
    const voice = { context, source, gain };
    activeAnimalVoices.add(voice);
    source.addEventListener("ended", () => activeAnimalVoices.delete(voice), { once: true });
    source.start(now, offset);
    source.stop(stopAt + 0.03);
  });
  return true;
}

function scheduleTone(context, note, start, session = null) {
  if (!context || !Number.isFinite(start) || !Number.isFinite(note.frequency) || note.frequency <= 0) return;
  const duration = Math.max(0.04, note.duration || 0.18);
  const end = start + duration;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = note.type || "sine";
  oscillator.frequency.setValueAtTime(note.frequency, start);
  if (note.endFrequency && note.endFrequency > 0) {
    oscillator.frequency.exponentialRampToValueAtTime(note.endFrequency, end);
  }

  let output = oscillator;
  if (note.filterFrequency) {
    const filter = context.createBiquadFilter();
    filter.type = note.filterType || "lowpass";
    filter.frequency.setValueAtTime(note.filterFrequency, start);
    filter.Q.setValueAtTime(note.filterQ || 0.7, start);
    oscillator.connect(filter);
    output = filter;
  }
  const volume = Math.max(0.0002, note.volume || 0.012);
  const attack = Math.min(note.attack || 0.025, duration * 0.4);
  const release = Math.min(note.release || 0.09, duration * 0.4);
  const releaseAt = Math.max(start + attack, end - release);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + attack);
  gain.gain.setValueAtTime(volume, releaseAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);
  output.connect(gain);
  gain.connect(context.destination);
  gain.connect(getSoftEchoInput(context));
  trackOscillator(session, oscillator, gain, context);
  oscillator.start(start);
  oscillator.stop(end + 0.025);
}

function scheduleLovePhrase(context, start, session) {
  const barDuration = LOVE_THEME_PHRASE_SECONDS / loveProgression.length;
  loveProgression.forEach((bar, barIndex) => {
    const barAt = start + barIndex * barDuration;
    scheduleTone(context, { frequency: bar.bass, duration: 3.06, type: "sine", volume: 0.0042, attack: 0.32, release: 0.7 }, barAt, session);
    bar.chord.forEach((frequency, index) => {
      scheduleTone(context, { frequency, duration: 2.98, type: "sine", volume: 0.0042 + (index === 0 ? 0.0006 : 0), attack: 0.42, release: 0.7 }, barAt, session);
    });
    bar.arpeggio.forEach((frequency, index) => {
      scheduleTone(context, { frequency, duration: 0.86, type: "triangle", volume: 0.014, attack: 0.075, release: 0.32 }, barAt + 0.12 + index * 0.59, session);
    });
    bar.melody.forEach((frequency, index) => {
      scheduleTone(context, { frequency, duration: 1.06, type: "sine", volume: 0.009, attack: 0.16, release: 0.42 }, barAt + [0.39, 1.48, 2.42][index], session);
    });
  });
}

function stopLoveThemeSession() {
  if (!loveThemeSession) return;
  const session = loveThemeSession;
  loveThemeSession = null;
  if (session.interval !== null) window.clearInterval(session.interval);
  const now = session.context.currentTime;
  session.nodes.forEach((oscillator) => {
    try {
      oscillator.stop(now + 0.08);
    } catch {
      // Already stopped or already ended.
    }
  });
  session.nodes.clear();
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
    stopLoveTheme();
    stopAnimalVoices();
    stopOneShotTones();
    if (softEchoBus?.context === audioContext) {
      softEchoBus.wet.gain.cancelScheduledValues(audioContext.currentTime);
      softEchoBus.wet.gain.setValueAtTime(0, audioContext.currentTime);
    }
    announceState();
    return true;
  }

  try {
    const context = getAudioContext();
    if (!context) return false;
    if (context.state !== "running") await context.resume();
    if (context.state !== "running") return false;
    enabled = true;
    if (softEchoBus?.context === context) {
      softEchoBus.wet.gain.cancelScheduledValues(context.currentTime);
      softEchoBus.wet.gain.setValueAtTime(0.13, context.currentTime);
    }
    announceState();
    void preloadAnimalAudio(context);
    playCuteSound("on");
    return true;
  } catch {
    enabled = false;
    announceState();
    return false;
  }
}

export function playCuteSound(kind = "collect") {
  if (!enabled || (typeof document !== "undefined" && document.hidden)) return false;
  const context = getAudioContext();
  if (!context) return false;
  if (context.state !== "running") {
    context.resume().catch(() => {});
    return false;
  }

  if (kind === "meow" || kind === "pet" || kind === "purr") {
    return playAnimalAudio(kind === "pet" ? "meow" : kind);
  }

  const notes = melodies[kind] || melodies.collect;
  const origin = context.currentTime;
  for (const note of notes) scheduleTone(context, note, origin + note.at);

  if (kind === "dance") playAnimalAudio("meow");
  return true;
}

export function startLoveTheme() {
  loveThemeRequested = true;
  if (!enabled || (typeof document !== "undefined" && document.hidden)) return false;
  const context = getAudioContext();
  if (!context) return false;
  if (context.state !== "running") {
    context.resume().then(() => {
      if (loveThemeRequested && enabled) startLoveTheme();
    }).catch(() => {});
    return false;
  }
  if (loveThemeSession?.context === context) return true;

  stopLoveThemeSession();
  const session = { context, nodes: new Set(), interval: null };
  loveThemeSession = session;
  let nextPhraseAt = context.currentTime + 0.08;
  scheduleLovePhrase(context, nextPhraseAt, session);
  nextPhraseAt += LOVE_THEME_PHRASE_SECONDS;
  session.interval = window.setInterval(() => {
    if (!enabled || !loveThemeRequested || (typeof document !== "undefined" && document.hidden)) {
      stopLoveThemeSession();
      return;
    }
    const horizon = context.currentTime + 1.4;
    while (nextPhraseAt < horizon) {
      scheduleLovePhrase(context, nextPhraseAt, session);
      nextPhraseAt += LOVE_THEME_PHRASE_SECONDS;
    }
  }, 450);
  return true;
}

export function stopLoveTheme() {
  loveThemeRequested = false;
  stopLoveThemeSession();
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopLoveThemeSession();
      stopAnimalVoices();
      stopOneShotTones();
      if (softEchoBus?.context === audioContext) {
        softEchoBus.wet.gain.cancelScheduledValues(audioContext.currentTime);
        softEchoBus.wet.gain.setValueAtTime(0, audioContext.currentTime);
      }
    } else if (loveThemeRequested && enabled) startLoveTheme();
    else if (enabled && softEchoBus?.context === audioContext) {
      softEchoBus.wet.gain.setValueAtTime(0.13, audioContext.currentTime);
    }
  });
}

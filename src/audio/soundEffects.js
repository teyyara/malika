let audioContext = null;
let enabled = false;
const listeners = new Set();
let loveThemeSession = null;
let loveThemeRequested = false;

const animalAudio = {
  cuteMeow: { url: "/audio/mimi-meow-cute.mp3", volume: 0.62 },
  shortMeow: { url: "/audio/mimi-meow-short.mp3", volume: 0.59 },
  purr: { url: "/audio/mimi-purr.mp3", volume: 0.29 }
};
const decodedAnimalAudio = new Map();
const loadingAnimalAudio = new Map();
const activeAnimalVoices = new Set();
const activeOneShotTones = new Set();
let nextMeowVariant = 0;
let animalPlaybackRequest = 0;
const softEchoBuses = new Map();
const categoryOutputBuses = new Map();
let masterOutputBus = null;
const soundLevels = { master: 0.7, mimi: 1, music: 1, effects: 1 };
const volumeListeners = new Set();

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

function getMasterOutput(context) {
  if (masterOutputBus?.context === context) return masterOutputBus.output;
  const output = context.createGain();
  output.gain.setValueAtTime(soundLevels.master, context.currentTime);
  output.connect(context.destination);
  masterOutputBus = { context, output };
  return output;
}

function getCategoryOutput(context, category) {
  const existing = categoryOutputBuses.get(category);
  if (existing?.context === context) return existing.output;
  const output = context.createGain();
  output.gain.setValueAtTime(soundLevels[category] ?? 1, context.currentTime);
  output.connect(getMasterOutput(context));
  categoryOutputBuses.set(category, { context, output });
  return output;
}

function getSoftEchoInput(context, category = "effects") {
  const existing = softEchoBuses.get(category);
  if (existing?.context === context) return existing.input;
  const delay = context.createDelay(1.2);
  const wet = context.createGain();
  const feedback = context.createGain();
  delay.delayTime.setValueAtTime(0.24, context.currentTime);
  wet.gain.setValueAtTime(0.13, context.currentTime);
  feedback.gain.setValueAtTime(0.12, context.currentTime);
  delay.connect(wet);
  wet.connect(getCategoryOutput(context, category));
  delay.connect(feedback);
  feedback.connect(delay);
  softEchoBuses.set(category, { context, input: delay, wet });
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

function fadeActiveAnimalVoices(fadeSeconds = 0.05) {
  const release = Math.max(0.02, fadeSeconds);
  for (const voice of activeAnimalVoices) {
    try {
      const now = voice.context.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now);
      voice.gain.gain.linearRampToValueAtTime(0.0001, now + release);
      voice.source.stop(now + release + 0.015);
    } catch {
      // The clip may already have finished.
    }
  }
  activeAnimalVoices.clear();
}

function stopAnimalVoices() {
  // Invalidate sample decodes that are still in flight (for example, when muted).
  animalPlaybackRequest += 1;
  fadeActiveAnimalVoices(0.025);
}

function playAnimalAudio(kind = "meow") {
  if (!enabled || (typeof document !== "undefined" && document.hidden)) return false;
  const context = getAudioContext();
  if (!context) return false;

  let key = kind;
  if (kind === "meow" || kind === "pet") {
    // Alternate the two recorded calls rather than pitch-shifting one synthetic voice.
    key = nextMeowVariant % 2 === 0 ? "cuteMeow" : "shortMeow";
    nextMeowVariant += 1;
  }
  if (!animalAudio[key]) return false;

  // Each pet owns the voice slot. If a sample is still decoding, older requests
  // become stale instead of playing three delayed meows/purrs on top of one another.
  const request = ++animalPlaybackRequest;
  fadeActiveAnimalVoices(0.045);

  if (context.state !== "running") {
    context.resume().then(() => {
      if (request === animalPlaybackRequest && enabled && context.state === "running") {
        playAnimalBuffer(context, key, request);
      }
    }).catch(() => {});
    return false;
  }

  playAnimalBuffer(context, key, request);
  return true;
}

function playAnimalBuffer(context, key, request) {
  const asset = animalAudio[key];
  if (!asset) return false;

  loadAnimalAudio(context, key).then((buffer) => {
    if (!buffer || request !== animalPlaybackRequest || !enabled || context.state !== "running"
      || (typeof document !== "undefined" && document.hidden)) return;

    const now = context.currentTime;
    const source = context.createBufferSource();
    const gain = context.createGain();
    const isPurr = key === "purr";
    // Keep authentic recordings close to their recorded pitch; very small variation
    // prevents the two meows feeling like a perfectly mechanical A/B sequence.
    const rate = 0.985 + Math.random() * 0.03;
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(rate, now);

    // Let the purr breathe for over three seconds, rather than clipping it to a tiny
    // fragment. Meows stay short and clear, with their onset preserved.
    const maxDuration = isPurr ? 3.2 : Math.min(2.35, buffer.duration);
    const offsetLimit = Math.max(0, buffer.duration - maxDuration - 0.05);
    const offset = isPurr ? Math.random() * offsetLimit : Math.random() * Math.min(0.025, Math.max(0, buffer.duration - 0.12));
    const duration = Math.max(0.15, Math.min(maxDuration, (buffer.duration - offset) / rate));
    const stopAt = now + duration;
    const level = asset.volume * (0.95 + Math.random() * 0.1);
    const attack = isPurr ? 0.14 : 0.028;
    const release = isPurr ? 0.34 : 0.18;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + attack);
    gain.gain.setValueAtTime(level, Math.max(now + attack + 0.04, stopAt - release));
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    source.connect(gain);
    gain.connect(getCategoryOutput(context, "mimi"));
    const voice = { context, source, gain };
    activeAnimalVoices.add(voice);
    source.addEventListener("ended", () => activeAnimalVoices.delete(voice), { once: true });
    source.start(now, offset);
    source.stop(stopAt + 0.03);
  }).catch(() => {});
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

  // A quiet upper partial gives the long notes a warmer, less "single beep" quality.
  // Reward cues can opt into it too, while the original one-shot notes stay subtle.
  let toneBus;
  if (note.filterFrequency) {
    toneBus = context.createBiquadFilter();
    toneBus.type = note.filterType || "lowpass";
    toneBus.frequency.setValueAtTime(note.filterFrequency, start);
    toneBus.Q.setValueAtTime(note.filterQ || 0.7, start);
  } else {
    toneBus = context.createGain();
    toneBus.gain.setValueAtTime(1, start);
  }
  oscillator.connect(toneBus);

  const harmonicLevel = Number.isFinite(note.harmonic) ? Math.max(0, Math.min(0.25, note.harmonic)) : 0;
  if (harmonicLevel > 0) {
    const harmonic = context.createOscillator();
    const harmonicGain = context.createGain();
    harmonic.type = "sine";
    harmonic.frequency.setValueAtTime(note.frequency * 2, start);
    if (note.endFrequency && note.endFrequency > 0) {
      harmonic.frequency.exponentialRampToValueAtTime(note.endFrequency * 2, end);
    }
    harmonicGain.gain.setValueAtTime(harmonicLevel, start);
    harmonic.connect(harmonicGain);
    harmonicGain.connect(toneBus);
    trackOscillator(session, harmonic, gain, context);
    harmonic.start(start);
    harmonic.stop(end + 0.025);
  }

  toneBus.connect(gain);
  const volume = Math.max(0.0002, note.volume || 0.012);
  const attack = Math.min(note.attack || 0.025, duration * 0.4);
  const release = Math.min(note.release || 0.09, duration * 0.4);
  const releaseAt = Math.max(start + attack, end - release);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + attack);
  gain.gain.setValueAtTime(volume, releaseAt);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  const category = session ? "music" : "effects";
  if (Number.isFinite(note.pan) && typeof context.createStereoPanner === "function") {
    const panner = context.createStereoPanner();
    panner.pan.setValueAtTime(Math.max(-1, Math.min(1, note.pan)), start);
    gain.connect(panner);
    panner.connect(getCategoryOutput(context, category));
    panner.connect(getSoftEchoInput(context, category));
  } else {
    gain.connect(getCategoryOutput(context, category));
    gain.connect(getSoftEchoInput(context, category));
  }

  trackOscillator(session, oscillator, gain, context);
  oscillator.start(start);
  oscillator.stop(end + 0.025);
}

function scheduleLovePhrase(context, start, session) {
  const barDuration = LOVE_THEME_PHRASE_SECONDS / loveProgression.length;
  const chordPans = [-0.18, 0.12, -0.08, 0.2];
  loveProgression.forEach((bar, barIndex) => {
    const barAt = start + barIndex * barDuration;
    scheduleTone(context, {
      frequency: bar.bass, duration: 3.06, type: "sine", volume: 0.0052,
      attack: 0.38, release: 0.78, pan: 0
    }, barAt, session);
    bar.chord.forEach((frequency, index) => {
      scheduleTone(context, {
        frequency, duration: 2.98, type: "triangle",
        volume: 0.0046 + (index === 0 ? 0.0005 : 0),
        attack: 0.5, release: 0.82, filterFrequency: 3100, harmonic: 0.075,
        pan: chordPans[index % chordPans.length]
      }, barAt, session);
    });
    bar.arpeggio.forEach((frequency, index) => {
      scheduleTone(context, {
        frequency, duration: 0.92, type: "triangle", volume: 0.012,
        attack: 0.08, release: 0.34, harmonic: 0.085,
        filterFrequency: 4300, pan: index % 2 === 0 ? -0.22 : 0.22
      }, barAt + 0.12 + index * 0.59, session);
    });
    bar.melody.forEach((frequency, index) => {
      scheduleTone(context, {
        frequency, duration: 1.12, type: "sine", volume: 0.0105,
        attack: 0.18, release: 0.46, harmonic: 0.055,
        pan: index === 1 ? 0.12 : -0.08
      }, barAt + [0.39, 1.48, 2.42][index], session);
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

export function getCuteSoundVolume() {
  return soundLevels.master;
}

export function getCuteSoundLevels() {
  return { ...soundLevels };
}

function notifyVolumeListeners() {
  const levels = getCuteSoundLevels();
  volumeListeners.forEach((listener) => listener(levels));
}

export function subscribeToCuteSoundVolume(listener) {
  volumeListeners.add(listener);
  return () => volumeListeners.delete(listener);
}

function rampGain(gainNode, volume, context) {
  if (!gainNode || !context) return;
  const param = gainNode.gain;
  const now = context.currentTime;
  param.cancelScheduledValues(now);
  param.setValueAtTime(param.value, now);
  param.linearRampToValueAtTime(volume, now + 0.035);
}

export function setCuteSoundVolume(nextVolume) {
  const parsed = Number(nextVolume);
  if (!Number.isFinite(parsed)) return soundLevels.master;
  soundLevels.master = Math.max(0, Math.min(1, parsed));
  if (masterOutputBus?.context === audioContext) {
    rampGain(masterOutputBus.output, soundLevels.master, masterOutputBus.context);
  }
  notifyVolumeListeners();
  return soundLevels.master;
}

export function setCuteSoundChannelVolume(channel, nextVolume) {
  if (!Object.hasOwn(soundLevels, channel) || channel === "master") return soundLevels[channel] ?? 1;
  const parsed = Number(nextVolume);
  if (!Number.isFinite(parsed)) return soundLevels[channel];
  soundLevels[channel] = Math.max(0, Math.min(1, parsed));
  const bus = categoryOutputBuses.get(channel);
  if (bus?.context === audioContext) rampGain(bus.output, soundLevels[channel], bus.context);
  notifyVolumeListeners();
  return soundLevels[channel];
}

export async function setCuteSoundEnabled(nextEnabled) {
  if (!nextEnabled) {
    enabled = false;
    stopLoveTheme();
    stopAnimalVoices();
    stopOneShotTones();
    for (const bus of softEchoBuses.values()) {
      if (bus.context !== audioContext) continue;
      bus.wet.gain.cancelScheduledValues(audioContext.currentTime);
      bus.wet.gain.setValueAtTime(0, audioContext.currentTime);
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
    for (const bus of softEchoBuses.values()) {
      if (bus.context !== context) continue;
      bus.wet.gain.cancelScheduledValues(context.currentTime);
      bus.wet.gain.setValueAtTime(0.13, context.currentTime);
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
      for (const bus of softEchoBuses.values()) {
        if (bus.context !== audioContext) continue;
        bus.wet.gain.cancelScheduledValues(audioContext.currentTime);
        bus.wet.gain.setValueAtTime(0, audioContext.currentTime);
      }
      return;
    }
    if (enabled) {
      for (const bus of softEchoBuses.values()) {
        if (bus.context !== audioContext) continue;
        bus.wet.gain.setValueAtTime(0.13, audioContext.currentTime);
      }
    }
    if (loveThemeRequested && enabled) startLoveTheme();
  });
}

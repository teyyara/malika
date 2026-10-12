import { test, expect } from "@playwright/test";

test("the sound mixer adjusts the master level and lets you audition Mimi's local recordings", async ({ page }) => {
  await page.addInitScript(() => {
    window.__soundMixerProbe = { masterTargets: [], animalClips: [] };
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;

    const originalCreateGain = AudioClass.prototype.createGain;
    AudioClass.prototype.createGain = function () {
      const context = this;
      const node = originalCreateGain.call(context);
      const originalConnect = node.connect.bind(node);
      const originalRamp = node.gain.linearRampToValueAtTime.bind(node.gain);
      node.gain.linearRampToValueAtTime = (value, ...args) => {
        if (node.__soundMixerIsMaster) window.__soundMixerProbe.masterTargets.push(value);
        return originalRamp(value, ...args);
      };
      node.connect = (destination, ...args) => {
        if (destination === context.destination) node.__soundMixerIsMaster = true;
        return originalConnect(destination, ...args);
      };
      return node;
    };

    const originalCreateSource = AudioClass.prototype.createBufferSource;
    AudioClass.prototype.createBufferSource = function () {
      const source = originalCreateSource.call(this);
      const start = source.start.bind(source);
      source.start = (...args) => {
        window.__soundMixerProbe.animalClips.push(source.buffer?.duration || 0);
        return start(...args);
      };
      return source;
    };
  });

  const audioResponses = [];
  page.on("response", (response) => {
    if (response.url().includes("/audio/mimi-")) audioResponses.push(response.status());
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByText("Mixer", { exact: true }).click();

  const volume = page.getByRole("slider", { name: "Overall sound volume" });
  await expect(volume).toHaveValue("70");
  await volume.focus();
  await volume.press("ArrowLeft");
  await expect(volume).toHaveValue("69");
  await expect(page.getByText("69%", { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__soundMixerProbe.masterTargets.includes(0.69))).toBeTruthy();

  await page.getByRole("button", { name: "Hear a meow" }).click();
  await expect.poll(() => page.evaluate(() => window.__soundMixerProbe.animalClips.length)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => window.__soundMixerProbe.animalClips.some((duration) => duration >= 1.3 && duration <= 2.5))).toBeTruthy();

  await page.getByRole("button", { name: "Hear a purr" }).click();
  await expect.poll(() => page.evaluate(() => window.__soundMixerProbe.animalClips.some((duration) => duration >= 7))).toBeTruthy();
  await expect.poll(() => audioResponses.length).toBe(3);
  expect(audioResponses.every((status) => status === 200)).toBeTruthy();
});


test("Mimi, love-note music and game effects can be mixed independently", async ({ page }) => {
  await page.addInitScript(() => {
    window.__soundMixerChannels = { masterNode: null, channelNodes: [], ramps: [] };
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;
    const originalCreateGain = AudioClass.prototype.createGain;
    AudioClass.prototype.createGain = function () {
      const context = this;
      const node = originalCreateGain.call(context);
      const originalConnect = node.connect.bind(node);
      const originalRamp = node.gain.linearRampToValueAtTime.bind(node.gain);
      node.gain.linearRampToValueAtTime = (value, ...args) => {
        if (Number.isInteger(node.__soundMixerChannelIndex)) {
          window.__soundMixerChannels.ramps.push({ channel: node.__soundMixerChannelIndex, value });
        }
        return originalRamp(value, ...args);
      };
      node.connect = (destination, ...args) => {
        if (destination === context.destination) {
          window.__soundMixerChannels.masterNode = node;
        } else if (destination === window.__soundMixerChannels.masterNode && !Number.isInteger(node.__soundMixerChannelIndex)) {
          node.__soundMixerChannelIndex = window.__soundMixerChannels.channelNodes.length;
          window.__soundMixerChannels.channelNodes.push(node);
        }
        return originalConnect(destination, ...args);
      };
      return node;
    };
  });

  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Touch the pink flower to find a birthday wish" }).click();

  const note = page.getByRole("dialog", { name: "Brave new chapters" });
  await expect(note).toBeVisible();
  await note.getByRole("button", { name: "Keep this close" }).click();
  await expect(note).not.toBeVisible();
  await page.getByText("Mixer", { exact: true }).click();

  const musicVolume = page.getByRole("slider", { name: "Love-note music volume" });
  await expect(musicVolume).toHaveValue("100");
  await musicVolume.focus();
  await musicVolume.press("ArrowLeft");
  await expect(page.getByText("99%", { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__soundMixerChannels.ramps.some((ramp) => ramp.channel === 1 && ramp.value === 0.99))).toBeTruthy();

  await page.getByRole("button", { name: "Hear a meow" }).click();
  await expect.poll(() => page.evaluate(() => window.__soundMixerChannels.channelNodes.length)).toBeGreaterThanOrEqual(3);
  const mimiVolume = page.getByRole("slider", { name: "Mimi voice volume" });
  await mimiVolume.focus();
  await mimiVolume.press("ArrowLeft");
  await expect.poll(() => page.evaluate(() => window.__soundMixerChannels.ramps.some((ramp) => ramp.channel === 2 && ramp.value === 0.99))).toBeTruthy();

  const effectsVolume = page.getByRole("slider", { name: "Game and effects volume" });
  await effectsVolume.focus();
  await effectsVolume.press("ArrowDown");
  await expect(effectsVolume).toHaveValue("99");
  await expect.poll(() => page.evaluate(() => window.__soundMixerChannels.ramps.some((ramp) => ramp.channel === 0 && ramp.value === 0.99))).toBeTruthy();
});

test("sound starts on by default, unlocks with the first welcome tap, and can be hushed", async ({ page }) => {
  await page.addInitScript(() => {
    window.__defaultSoundChimeStarts = 0;
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;
    const originalCreate = AudioClass.prototype.createOscillator;
    AudioClass.prototype.createOscillator = function () {
      const oscillator = originalCreate.call(this);
      const start = oscillator.start.bind(oscillator);
      oscillator.start = (...args) => {
        window.__defaultSoundChimeStarts += 1;
        return start(...args);
      };
      return oscillator;
    };
  });
  await page.goto("/");

  const soundOn = page.getByRole("button", { name: "Turn off tiny sounds" });
  await expect(soundOn).toBeVisible();
  await expect(soundOn).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await expect(page.getByRole("heading", { name: /A garden full of little things/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Turn off tiny sounds" })).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.evaluate(() => window.__defaultSoundChimeStarts)).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Turn off tiny sounds" }).click();
  const soundOff = page.getByRole("button", { name: "Turn on tiny sounds" });
  await expect(soundOff).toHaveAttribute("aria-pressed", "false");

  await soundOff.click();
  await expect(page.getByRole("button", { name: "Turn off tiny sounds" })).toHaveAttribute("aria-pressed", "true");
});

test("Mimi dances and scatters little sparkles after three quick pets", async ({ page }) => {
  await page.goto("/");
  const mimi = page.getByRole("button", { name: "Pet Mimi to wake her up" });

  await mimi.click();
  await mimi.click();
  await mimi.click();

  await expect(mimi.locator("svg.cat-art")).toHaveClass(/cat-is-dancing/);
  await expect(mimi.locator(".cat-dance-sparkles i")).toHaveCount(4);
  await expect(mimi).toContainText("Mimi is dancing!");
});

test("a love note lets Malika send a heart back to Zack", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Touch the pink flower to find a birthday wish" }).click();

  const note = page.getByRole("dialog", { name: "Brave new chapters" });
  await expect(note).toBeVisible();
  const heart = note.getByRole("button", { name: "Tap the floating heart to send a little heart back to Zack" });
  await heart.click();

  await expect(note.getByRole("status")).toContainText("A little heart has found its way back to Zack");
  await expect(note.getByRole("button", { name: "A heart was sent back to Zack" })).toHaveAttribute("aria-pressed", "true");
});

test("a victory prize can replay its chime without dismissing the celebration", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
    await page.keyboard.press(key);
  }

  await expect(page.getByRole("dialog", { name: "The secret arcade" })).toBeVisible();
  await page.getByRole("button", { name: /Mimi's constellation chase/ }).click();
  for (let step = 1; step <= 8; step += 1) await page.getByTestId("star-target-" + step).click();

  const reward = page.getByRole("dialog", { name: "You found the heart in the stars." });
  await expect(reward).toBeVisible();
  const medallion = reward.getByRole("button", { name: "Tap your prize to replay the victory fanfare" });
  await expect(medallion).toBeVisible();
  await medallion.click();
  await expect(reward).toBeVisible();
  await expect(reward.getByRole("heading", { name: "You found the heart in the stars." })).toBeVisible();
});


test("Mimi makes a real local cat meow and opens her mouth with the sound", async ({ page }) => {
  await page.addInitScript(() => {
    window.__malikaAudioProbe = { starts: 0, durations: [], stops: 0 };
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;
    const originalCreate = AudioClass.prototype.createBufferSource;
    AudioClass.prototype.createBufferSource = function () {
      const source = originalCreate.call(this);
      const start = source.start.bind(source);
      const stop = source.stop.bind(source);
      source.start = (...args) => {
        window.__malikaAudioProbe.starts += 1;
        window.__malikaAudioProbe.durations.push(source.buffer?.duration || 0);
        return start(...args);
      };
      source.stop = (...args) => {
        window.__malikaAudioProbe.stops += 1;
        return stop(...args);
      };
      return source;
    };
  });
  const audioResponses = [];
  page.on("response", (response) => {
    if (response.url().includes("/audio/mimi-")) audioResponses.push({ url: response.url(), status: response.status() });
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();

  await expect.poll(() => new Set(audioResponses.map((item) => new URL(item.url).pathname)).size).toBe(3);
  expect(audioResponses.every((item) => item.status === 200)).toBeTruthy();
  expect(audioResponses.every((item) => new URL(item.url).origin === new URL(page.url()).origin)).toBeTruthy();

  const mimi = page.getByRole("button", { name: "Pet Mimi to wake her up" });
  await mimi.click();
  await expect(mimi.locator("svg.cat-art")).toHaveClass(/cat-is-meowing/);
  await expect(mimi).toContainText("Mimi says meow!");
  await expect.poll(() => page.evaluate(() => window.__malikaAudioProbe.starts)).toBeGreaterThan(0);

  const durations = await page.evaluate(() => window.__malikaAudioProbe.durations);
  expect(durations.some((duration) => duration >= 1.3 && duration <= 2.5)).toBeTruthy();
});

test("Mimi's mouth and glow follow the changing envelope of her recorded meow", async ({ page }) => {
  await page.goto("/");
  const mimi = page.getByRole("button", { name: "Pet Mimi to wake her up" });
  const svg = mimi.locator("svg.cat-art");

  await page.evaluate(() => {
    const art = document.querySelector("svg.cat-art");
    window.__mimiAudioEnvelopeValues = [];
    const observer = new MutationObserver(() => {
      const value = art.style.getPropertyValue("--mimi-voice-level");
      if (value) window.__mimiAudioEnvelopeValues.push(value);
    });
    observer.observe(art, { attributes: true, attributeFilter: ["style"] });
  });

  await mimi.click();
  await expect(svg).toHaveClass(/cat-is-meowing/);
  await expect.poll(() => page.evaluate(() => new Set(window.__mimiAudioEnvelopeValues).size)).toBeGreaterThan(2);
  await expect.poll(() => svg.evaluate((element) => Number(element.style.getPropertyValue("--mimi-mouth-open")))).toBeGreaterThan(0.14);
  await expect.poll(() => svg.evaluate((element) => parseFloat(element.style.getPropertyValue("--mimi-glow-blur")))).toBeGreaterThan(1.5);

  await expect.poll(() => svg.evaluate((element) => element.style.getPropertyValue("--mimi-voice-level"))).toBe("0.000");
  await expect.poll(() => svg.evaluate((element) => element.style.getPropertyValue("--mimi-glow-blur"))).toBe("0.00px");
});

test("Mimi answers a second pet with a longer recorded purr and the mute control cuts it off", async ({ page }) => {
  await page.addInitScript(() => {
    window.__malikaAudioProbe = { sources: [], stops: 0 };
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;
    const originalCreate = AudioClass.prototype.createBufferSource;
    AudioClass.prototype.createBufferSource = function () {
      const context = this;
      const source = originalCreate.call(this);
      const start = source.start.bind(source);
      const stop = source.stop.bind(source);
      source.start = (...args) => {
        source.__malikaAudioProbe = {
          bufferDuration: source.buffer?.duration || 0,
          startAt: typeof args[0] === "number" ? args[0] : context.currentTime,
          plannedStopAt: null
        };
        window.__malikaAudioProbe.sources.push(source.__malikaAudioProbe);
        return start(...args);
      };
      source.stop = (...args) => {
        if (source.__malikaAudioProbe) {
          source.__malikaAudioProbe.plannedStopAt = typeof args[0] === "number" ? args[0] : context.currentTime;
        }
        window.__malikaAudioProbe.stops += 1;
        return stop(...args);
      };
      return source;
    };
  });
  await page.goto("/");
  const mimi = page.getByRole("button", { name: "Pet Mimi to wake her up" });

  await mimi.click();
  await expect.poll(() => page.evaluate(() => window.__malikaAudioProbe.sources.length)).toBeGreaterThan(0);
  await mimi.click();
  await expect(mimi.locator("svg.cat-art")).toHaveClass(/cat-is-purring/);
  await expect(mimi).toContainText("Mimi is purring!");

  await expect.poll(() => page.evaluate(() => window.__malikaAudioProbe.sources.some(
    (clip) => clip.bufferDuration >= 7 && clip.plannedStopAt !== null
  ))).toBeTruthy();
  const purrDuration = await page.evaluate(() => {
    const purr = window.__malikaAudioProbe.sources.find((clip) => clip.bufferDuration >= 7 && clip.plannedStopAt !== null);
    return purr.plannedStopAt - purr.startAt;
  });
  expect(purrDuration).toBeGreaterThanOrEqual(2.7);
  expect(purrDuration).toBeLessThanOrEqual(3.4);

  const stopsBeforeMute = await page.evaluate(() => window.__malikaAudioProbe.stops);
  await page.getByRole("button", { name: "Turn off tiny sounds" }).click();
  await expect.poll(() => page.evaluate(() => window.__malikaAudioProbe.stops)).toBeGreaterThan(stopsBeforeMute);
});

test("rapid petting during audio decoding plays only the latest cat voice", async ({ page }) => {
  await page.addInitScript(() => {
    window.__malikaAudioProbe = { durations: [] };
    window.__malikaPendingDecodes = 0;
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;
    const originalDecode = AudioClass.prototype.decodeAudioData;
    const pending = [];
    AudioClass.prototype.decodeAudioData = function (bytes) {
      window.__malikaPendingDecodes += 1;
      return new Promise((resolve, reject) => pending.push({ context: this, bytes, resolve, reject }));
    };
    window.__releaseMalikaDecodes = async () => {
      const batch = pending.splice(0);
      await Promise.all(batch.map(({ context, bytes, resolve, reject }) =>
        originalDecode.call(context, bytes).then(resolve, reject)
      ));
    };

    const originalCreate = AudioClass.prototype.createBufferSource;
    AudioClass.prototype.createBufferSource = function () {
      const source = originalCreate.call(this);
      const start = source.start.bind(source);
      source.start = (...args) => {
        window.__malikaAudioProbe.durations.push(source.buffer?.duration || 0);
        return start(...args);
      };
      return source;
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await expect.poll(() => page.evaluate(() => window.__malikaPendingDecodes)).toBe(3);

  const mimi = page.getByRole("button", { name: "Pet Mimi the kitten and hear a new greeting" });
  await mimi.click();
  await mimi.click();
  await mimi.click();
  await expect(mimi.locator("svg.cat-art")).toHaveClass(/cat-is-dancing/);

  await page.evaluate(() => window.__releaseMalikaDecodes());
  await expect.poll(() => page.evaluate(() => window.__malikaAudioProbe.durations.length)).toBe(1);
  const playedDuration = await page.evaluate(() => window.__malikaAudioProbe.durations[0]);
  // The third, dance-triggering pet owns the voice slot and uses the one-second recording.
  expect(playedDuration).toBeGreaterThanOrEqual(0.8);
  expect(playedDuration).toBeLessThanOrEqual(1.25);
});

test("a love note starts its romantic score and stops it when the note closes", async ({ page }) => {
  await page.addInitScript(() => {
    window.__malikaAudioProbe = { starts: 0, stops: 0 };
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return;
    const originalCreate = AudioClass.prototype.createOscillator;
    AudioClass.prototype.createOscillator = function () {
      const oscillator = originalCreate.call(this);
      const start = oscillator.start.bind(oscillator);
      const stop = oscillator.stop.bind(oscillator);
      oscillator.start = (...args) => {
        window.__malikaAudioProbe.starts += 1;
        return start(...args);
      };
      oscillator.stop = (...args) => {
        window.__malikaAudioProbe.stops += 1;
        return stop(...args);
      };
      return oscillator;
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  const beforeNote = await page.evaluate(() => window.__malikaAudioProbe.starts);
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Touch the pink flower to find a birthday wish" }).click();

  const note = page.getByRole("dialog", { name: "Brave new chapters" });
  await expect(note).toBeVisible();
  await expect(note.locator(".note-score-indicator")).toBeVisible();
  await expect(note).toHaveClass(/is-score-playing/);
  const whileOpen = await page.evaluate(() => window.__malikaAudioProbe.starts);
  expect(whileOpen - beforeNote).toBeGreaterThan(35);

  const beforeClose = await page.evaluate(() => window.__malikaAudioProbe.stops);
  await note.getByRole("button", { name: "Keep this close" }).click();
  await expect(note).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__malikaAudioProbe.stops)).toBeGreaterThan(beforeClose + 20);
});

test("each arcade prize advertises its own achievement sound", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
    await page.keyboard.press(key);
  }
  await page.getByRole("dialog", { name: "The secret arcade" }).getByRole("button", { name: /Mimi's constellation chase/ }).click();
  for (let step = 1; step <= 8; step += 1) await page.getByTestId("star-target-" + step).click();
  const reward = page.getByRole("dialog", { name: "You found the heart in the stars." });
  await expect(reward.getByRole("button", { name: "Tap your prize to replay the victory fanfare" }))
    .toHaveAttribute("data-sound-cue", "achievement-stars");
});

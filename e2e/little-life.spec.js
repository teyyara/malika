import { test, expect } from "@playwright/test";

test("tiny sounds are opt-in, work after a user gesture, and can be hushed", async ({ page }) => {
  await page.goto("/");

  const soundOff = page.getByRole("button", { name: "Turn on tiny sounds" });
  await expect(soundOff).toBeVisible();
  await expect(soundOff).toHaveAttribute("aria-pressed", "false");

  await soundOff.click();
  const soundOn = page.getByRole("button", { name: "Turn off tiny sounds" });
  await expect(soundOn).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await expect(page.getByRole("heading", { name: /A garden full of little things/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Turn off tiny sounds" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Turn off tiny sounds" }).click();
  await expect(page.getByRole("button", { name: "Turn on tiny sounds" })).toHaveAttribute("aria-pressed", "false");
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
  await page.getByRole("button", { name: "Turn on tiny sounds" }).click();
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
  await page.getByRole("button", { name: "Turn on tiny sounds" }).click();

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

test("Mimi answers a second pet with a real purr and the mute control cuts it off", async ({ page }) => {
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
  await page.goto("/");
  await page.getByRole("button", { name: "Turn on tiny sounds" }).click();
  const mimi = page.getByRole("button", { name: "Pet Mimi to wake her up" });

  await mimi.click();
  await expect.poll(() => page.evaluate(() => window.__malikaAudioProbe.starts)).toBeGreaterThan(0);
  await mimi.click();
  await expect(mimi.locator("svg.cat-art")).toHaveClass(/cat-is-purring/);
  await expect(mimi).toContainText("Mimi is purring!");
  await expect.poll(() => page.evaluate(() => window.__malikaAudioProbe.durations.some((duration) => duration >= 7))).toBeTruthy();

  const stopsBeforeMute = await page.evaluate(() => window.__malikaAudioProbe.stops);
  await page.getByRole("button", { name: "Turn off tiny sounds" }).click();
  await expect.poll(() => page.evaluate(() => window.__malikaAudioProbe.stops)).toBeGreaterThan(stopsBeforeMute);
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
  await page.getByRole("button", { name: "Turn on tiny sounds" }).click();
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
  await page.getByRole("button", { name: "Turn on tiny sounds" }).click();
  for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
    await page.keyboard.press(key);
  }
  await page.getByRole("dialog", { name: "The secret arcade" }).getByRole("button", { name: /Mimi's constellation chase/ }).click();
  for (let step = 1; step <= 8; step += 1) await page.getByTestId("star-target-" + step).click();
  const reward = page.getByRole("dialog", { name: "You found the heart in the stars." });
  await expect(reward.getByRole("button", { name: "Tap your prize to replay the victory fanfare" }))
    .toHaveAttribute("data-sound-cue", "achievement-stars");
});

import { test, expect } from "@playwright/test";

async function enterGarden(page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Malika, this little universe is yours." })).toBeVisible();
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await expect(page.getByRole("heading", { name: /A garden full of little things/ })).toBeVisible();
}

test("Mimi has a tiny routine and responds through her own love language", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  await page.getByRole("tab", { name: "Mimi's little life" }).click();

  await expect(page.getByRole("heading", { name: "She has a whole tiny life of her own." })).toBeVisible();
  await expect(page.locator(".mimi-life-stage")).toBeVisible();
  await expect(page.locator(".mimi-life-stats")).toContainText("0 little notes found");
  await expect(page.locator(".mimi-life-message")).toContainText(/Mimi is keeping|Mimi has decided|Mimi just spotted|Mimi is saving/);

  await page.getByRole("button", { name: /Play with ribbon/ }).click();
  await expect(page.locator(".mimi-life-message")).toHaveText("Ribbon spotted. Dignity lost. Mimi has entered full zoomie mode.");
  await expect(page.locator(".mimi-life-stage")).toHaveClass(/mood-happy/);

  await page.getByRole("button", { name: /Tell her a secret/ }).click();
  await expect(page.locator(".mimi-life-message")).toContainText("Mimi slow-blinks");
  await expect(page.locator(".mimi-life-stage")).toHaveClass(/mood-love/);
});

test("prepared and custom wishes become glowing stars and stay in the sky while navigating", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  const sky = page.locator(".ambient-world");
  await expect(sky).toHaveAttribute("data-sky-mood", "twilight");
  await page.getByRole("tab", { name: "Wish sky" }).click();

  const draft = page.getByRole("textbox", { name: "Write a wish in your own words" });
  await page.getByRole("button", { name: /Tiny wonders/ }).click();
  await expect(draft).toHaveValue(/cats, unexpected kindness/i);

  await page.getByRole("button", { name: /Release into the sky/ }).click();
  await expect(page.locator(".released-wish-star")).toHaveCount(1);
  await expect(page.locator(".released-wish-list button")).toHaveCount(1);
  await expect(page.locator(".wish-selected-note")).toContainText("Released with love by Zack");
  await expect(sky).toHaveAttribute("data-wish-count", "1");
  await expect(sky).toHaveAttribute("data-sky-mood", "moonrise");

  await draft.fill("May Malika always find a reason to smile, even on an ordinary Tuesday.");
  await page.getByRole("button", { name: /Release into the sky/ }).click();
  await expect(page.locator(".released-wish-star")).toHaveCount(2);
  await expect(page.locator(".released-wish-list button")).toHaveCount(2);
  await expect(sky).toHaveAttribute("data-wish-count", "2");

  await page.getByRole("button", { name: /Birthday letter/ }).click();
  await page.getByRole("button", { name: /The garden/ }).click();
  await page.getByRole("tab", { name: "Wish sky" }).click();
  await expect(page.locator(".released-wish-star")).toHaveCount(2);
  await expect(page.locator(".released-wish-list")).toContainText("ordinary Tuesday");
});

test("the soundtrack player switches to distinct original mood arrangements and yields back to the garden", async ({ page }) => {
  await enterGarden(page);
  await page.getByRole("tab", { name: "Our soundtrack" }).click();

  await page.getByRole("button", { name: /Rain against the window/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-soundtrack-theme", "soundtrack-rainy-window");
  await expect(page.locator(".soundtrack-now-playing")).toContainText("Rain against the window");

  await page.getByRole("tab", { name: "Wish sky" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-soundtrack-theme", "soundtrack-rainy-window");
  await page.getByRole("tab", { name: "Our soundtrack" }).click();
  await expect(page.getByRole("button", { name: /Rain against the window/ })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /A sky full of stars/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-soundtrack-theme", "soundtrack-starlight");

  await page.getByRole("button", { name: /Pause our soundtrack/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-soundtrack-theme", "garden");
  await expect(page.locator(".soundtrack-now-playing")).toContainText("Choose a little soundtrack");
});

test("the keepsake picture can come alive and settle back into a still moment", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  await page.getByRole("tab", { name: "Living picture" }).click();

  const frame = page.locator(".living-picture-frame");
  await frame.click();
  await expect(frame).toHaveClass(/is-alive/);
  await expect(frame).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".living-picture-count")).toContainText("picture is awake");

  await page.getByRole("button", { name: "Let the moment rest" }).click();
  await expect(page.locator(".living-picture-frame")).not.toHaveClass(/is-alive/);
});

test("the grand finale awakens the universe sky and celebrates the wishes she released", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  await page.getByRole("tab", { name: "Wish sky" }).click();
  await page.getByRole("button", { name: /More laughter/ }).click();
  await page.getByRole("button", { name: /Release into the sky/ }).click();

  await page.getByRole("button", { name: /Birthday letter/ }).click();
  await page.getByRole("button", { name: /One last little surprise/ }).click();

  await expect(page.locator(".app-shell")).toHaveClass(/is-grand-finale/);
  await expect(page.locator(".ambient-world")).toHaveAttribute("data-sky-mood", "universe");
  await expect(page.getByRole("heading", { name: "Look what your little world has become." })).toBeVisible();
  await expect(page.locator(".extra-surprise")).toContainText("You sent 1 wish into the stars");
  await page.getByRole("button", { name: /Keep the little magic/ }).click();
  await expect(page.locator(".app-shell")).not.toHaveClass(/is-grand-finale/);
  await expect(page.locator(".ambient-world")).not.toHaveAttribute("data-sky-mood", "universe");
});

test("all companion panels stay inside laptop and phone viewports", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [{ width: 1366, height: 768 }, { width: 375, height: 812 }]) {
    await page.setViewportSize(viewport);
    await enterGarden(page);

    for (const tab of ["Mimi's little life", "Wish sky", "Our soundtrack", "Living picture", "Mimi's tiny storybook"]) {
      await page.getByRole("tab", { name: tab }).click();
      const layout = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        panel: document.querySelector(".companion-panel")?.getBoundingClientRect().toJSON(),
        tabs: document.querySelector(".companion-tab-list")?.getBoundingClientRect().toJSON()
      }));
      expect(layout.document, tab + " must not cause horizontal overflow at " + viewport.width).toBeLessThanOrEqual(layout.viewport);
      expect(layout.panel.width).toBeGreaterThan(0);
      expect(layout.panel.x).toBeGreaterThanOrEqual(0);
      expect(layout.panel.right).toBeLessThanOrEqual(viewport.width + 1);
      expect(layout.tabs.right).toBeLessThanOrEqual(viewport.width + 1);
    }
  }
});


test("the love blossom grows with discoveries and reveals Zack's note when fully open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);

  const flower = page.locator(".interactive-flower");
  await expect(flower).toHaveAttribute("data-blossom-level", "0");

  await page.getByRole("tab", { name: "Wish sky" }).click();
  await page.getByRole("button", { name: /Tiny wonders/ }).click();
  await page.getByRole("button", { name: /Release into the sky/ }).click();
  await page.getByRole("button", { name: "The garden", exact: true }).click();
  await expect(flower).toHaveAttribute("data-blossom-level", "1");
  await flower.click();
  await expect(page.locator(".cat-reply")).toContainText("1 of 5 petals are awake");
  await page.getByRole("dialog", { name: "Brave new chapters" })
    .getByRole("button", { name: "Close love note" }).click();

  for (let wish = 0; wish < 2; wish += 1) {
    await page.getByRole("tab", { name: "Wish sky" }).click();
    await page.getByRole("button", { name: /Tiny wonders/ }).click();
    await page.getByRole("button", { name: /Release into the sky/ }).click();
  }

  await page.getByRole("button", { name: "Heart game", exact: true }).click();
  await page.getByRole("button", { name: /Let's find some hearts/ }).click();
  const hearts = page.getByRole("button", { name: /Collect purple heart/ });
  for (let count = 0; count < 7; count += 1) await hearts.first().click();

  await page.getByRole("button", { name: "The garden", exact: true }).click();
  await expect(flower).toHaveAttribute("data-blossom-level", "5");
  await expect(flower).toHaveAttribute("aria-label", "Touch the pink flower to find a birthday wish");
  await expect(flower).toHaveAttribute("aria-description", "Love blossom: 5 of 5 petals open.");
  await expect(flower).toHaveAttribute("title", "Love blossom · 5 of 5 petals");
  await flower.click();
  await expect(page.locator(".cat-reply")).toContainText("a hundred little reasons to smile");
});


test("Letters from Future Us reveals imagined letters without changing the keepsake collection", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Love notes", exact: true }).click();

  await expect(page.getByRole("heading", { name: "The love collection" })).toBeVisible();
  const disclosure = page.locator(".future-letters-disclosure");
  await expect(disclosure).not.toHaveAttribute("open", "");
  await expect(page.locator(".collection-meta")).toContainText("35 little keepsakes");
  await disclosure.locator("summary").click();

  await expect(page.getByText(/These are imagined little tomorrows—not memories, predictions, or promises/i)).toBeVisible();
  const choices = page.getByRole("button", { name: /Read future letter:/ });
  await expect(choices).toHaveCount(4);

  const rainyLetter = page.getByRole("button", { name: "Read future letter: A rainy Sunday together" });
  await rainyLetter.click();
  const revealed = page.locator(".future-letter-reveal");
  await expect(page.getByRole("article", { name: "A rainy Sunday together" })).toBeVisible();
  await expect(revealed).toBeVisible();
  await expect(revealed).toContainText("Imagine rain drawing little rivers down the window");
  await expect(rainyLetter).toHaveAttribute("aria-pressed", "true");

  const tuesdayLetter = page.getByRole("button", { name: "Read future letter: A Tuesday we'd never post about" });
  await tuesdayLetter.click();
  await expect(page.getByRole("article", { name: "A Tuesday we'd never post about" })).toBeVisible();
  await expect(revealed).not.toContainText("Imagine rain drawing little rivers down the window");
  await expect(tuesdayLetter).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Close future letter" }).click();
  await expect(page.locator(".future-letter-reveal")).toHaveCount(0);

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator(".future-letters-disclosure")).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Read future letter: For a day that feels heavy" }).click();
  await expect(page.getByRole("article", { name: "For a day that feels heavy" })).toBeVisible();
  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    section: document.querySelector(".future-letters").getBoundingClientRect().toJSON(),
    letter: document.querySelector(".future-letter-reveal").getBoundingClientRect().toJSON()
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport);
  expect(layout.section.x).toBeGreaterThanOrEqual(0);
  expect(layout.section.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.letter.right).toBeLessThanOrEqual(layout.viewport + 1);
});


test("Mimi's tiny storybook turns three choices into a repeatable branching fairytale", async ({ page }) => {
  await page.addInitScript(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      const originalCreateOscillator = AudioContextClass.prototype.createOscillator;
      AudioContextClass.prototype.createOscillator = function (...args) {
        window.__storybookCueCount = (window.__storybookCueCount || 0) + 1;
        return originalCreateOscillator.apply(this, args);
      };
    }
    window.__copiedFairytales = [];
    window.__failFairytaleCopy = false;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          if (window.__failFairytaleCopy) throw new Error("Clipboard write blocked");
          window.__copiedFairytales.push(text);
        }
      }
    });
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 768 });
  await enterGarden(page);
  await page.getByRole("tab", { name: "Wish sky" }).click();
  await page.getByRole("button", { name: /Tiny wonders/ }).click();
  await page.getByRole("button", { name: /Release into the sky/ }).click();
  await page.getByRole("tab", { name: "Mimi's tiny storybook" }).click();

  const panel = page.locator(".companion-panel-storybook");
  const petMimi = panel.getByRole("button", { name: "Pet Mimi while reading her storybook" });
  await expect(petMimi).toBeVisible();
  await petMimi.click();
  await expect(panel.getByRole("status")).toContainText("Mimi slow-blinks, then nudges the envelope");
  await page.evaluate(() => { window.__storybookCueCount = 0; });
  const storyUi = panel.locator(".mimi-storybook-layout");
  await expect(storyUi).toHaveAttribute("data-storybook-phase", "intro");
  await expect(panel.getByRole("heading", { name: "One tiny story. Three little choices." })).toBeVisible();
  await expect(panel).toContainText("not a memory of something that happened");
  await page.getByRole("button", { name: /Begin Mimi's story/ }).click();
  await expect.poll(() => page.evaluate(() => window.__storybookCueCount || 0)).toBeGreaterThan(0);
  await expect(panel.locator(".mimi-storybook-page")).toHaveAttribute("data-motion-mode", "reduced");
  await expect(storyUi).toHaveAttribute("data-storybook-phase", "choices");
  await expect(storyUi).toHaveAttribute("data-storybook-chapter", "1");

  const progress = page.getByRole("progressbar", { name: "Story choices completed" });
  await expect(panel.getByRole("heading", { name: "Where should Mimi begin?" })).toBeVisible();
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  const lantern = page.getByRole("button", { name: /Follow a ladybug lantern/ });
  const cueCountBeforeChoice = await page.evaluate(() => window.__storybookCueCount || 0);
  await lantern.click();
  await expect.poll(() => page.evaluate(() => window.__storybookCueCount || 0)).toBeGreaterThan(cueCountBeforeChoice);
  await expect(lantern).toHaveAttribute("aria-pressed", "true");
  await expect(progress).toHaveAttribute("aria-valuenow", "1");
  await page.getByRole("button", { name: /Turn the tiny page/ }).click();

  await expect(storyUi).toHaveAttribute("data-storybook-chapter", "2");
  await expect(panel.getByRole("heading", { name: "The path has one little puzzle." })).toBeVisible();
  const friends = page.getByRole("button", { name: /Invite the tiny friends/ });
  await friends.click();
  await expect(friends).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Turn the tiny page/ }).click();

  await expect(storyUi).toHaveAttribute("data-storybook-chapter", "3");
  await expect(panel.getByRole("heading", { name: "What little gift should the envelope hold?" })).toBeVisible();
  const softness = page.getByRole("button", { name: /A wish for softer days/ });
  await softness.click();
  await expect(softness).toHaveAttribute("aria-pressed", "true");
  await expect(progress).toHaveAttribute("aria-valuenow", "3");
  await page.getByRole("button", { name: /Reveal our ending/ }).click();
  await expect(storyUi).toHaveAttribute("data-storybook-phase", "ending");

  const story = page.getByRole("article", { name: "Mimi's tiny fairytale for Malika" });
  await expect(story).toBeVisible();
  await expect(story).toContainText("Mimi followed a ladybug carrying a lantern");
  await expect(story).toContainText("Mimi called to the ladybug and the sleepy garden moth");
  await expect(story).toContainText("It could not promise every day would be easy");
  await expect(story).toContainText("Mimi curled up beside the now-empty envelope");
  await expect(story).toContainText("May you keep finding flowers, cats, unexpected kindness");

  await page.getByRole("button", { name: /Copy this tiny fairytale/ }).click();
  await expect(panel.locator(".mimi-storybook-copy-status")).toContainText("Copied. Nothing was sent or saved");
  const copiedStory = await page.evaluate(() => window.__copiedFairytales[0]);
  expect(copiedStory).toContain("Mimi followed a ladybug carrying a lantern");
  expect(copiedStory).toContain("A wish from your sky:\nMay you keep finding flowers, cats, unexpected kindness");
  expect(copiedStory).toContain("It could not promise every day would be easy");

  await page.evaluate(() => { window.__failFairytaleCopy = true; });
  await page.getByRole("button", { name: /Copy this tiny fairytale/ }).click();
  const manualCopy = panel.getByRole("textbox", { name: "Story text for manual copying" });
  await expect(panel.locator(".mimi-storybook-copy-status")).toContainText("Automatic copy is unavailable");
  await expect(manualCopy).toBeVisible();
  await expect(manualCopy).toHaveValue(copiedStory);
  await manualCopy.click();
  const selectedLength = await manualCopy.evaluate((element) => element.selectionEnd - element.selectionStart);
  expect(selectedLength).toBe(copiedStory.length);

  await page.getByRole("button", { name: /Tell another tiny story/ }).click();
  await expect(panel.locator(".mimi-storybook-copy-status")).toHaveCount(0);
  await expect(panel.getByRole("textbox", { name: "Story text for manual copying" })).toHaveCount(0);
  await expect(storyUi).toHaveAttribute("data-storybook-phase", "intro");
  await expect(panel.getByRole("heading", { name: "One tiny story. Three little choices." })).toBeVisible();
  await page.getByRole("button", { name: /Begin Mimi's story/ }).click();
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  await page.getByRole("button", { name: /Chase a runaway star/ }).click();
  await page.getByRole("button", { name: /Turn the tiny page/ }).click();
  await page.getByRole("button", { name: /Ask the moon for a hint/ }).click();
  await page.getByRole("button", { name: /Previous chapter/ }).click();
  await expect(storyUi).toHaveAttribute("data-storybook-chapter", "1");
  await page.getByRole("button", { name: /Take the velvet ribbon path/ }).click();
  await page.getByRole("button", { name: /Turn the tiny page/ }).click();
  await expect(progress).toHaveAttribute("aria-valuenow", "1");
  await expect(page.getByRole("button", { name: /Ask the moon for a hint/ })).toHaveAttribute("aria-pressed", "false");

  await page.getByRole("button", { name: /Ask the moon for a hint/ }).click();
  await page.getByRole("button", { name: /Turn the tiny page/ }).click();
  await page.getByRole("button", { name: /A pocket star for courage/ }).click();
  await page.getByRole("button", { name: /Reveal our ending/ }).click();
  await expect(story).toContainText("Mimi followed every twist like a very serious detective");
  await expect(story).toContainText("one small next step is enough");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: /Copy this tiny fairytale/ }).click();
  const mobileManualCopy = panel.getByRole("textbox", { name: "Story text for manual copying" });
  await expect(mobileManualCopy).toBeVisible();
  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    panel: document.querySelector(".companion-panel-storybook").getBoundingClientRect().toJSON(),
    stage: document.querySelector(".mimi-storybook-stage").getBoundingClientRect().toJSON(),
    ending: document.querySelector(".mimi-storybook-ending").getBoundingClientRect().toJSON(),
    manualCopy: document.querySelector(".mimi-storybook-manual-copy textarea").getBoundingClientRect().toJSON(),
    controls: document.querySelector(".mimi-storybook-restart").getBoundingClientRect().toJSON()
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport);
  expect(layout.panel.x).toBeGreaterThanOrEqual(0);
  expect(layout.panel.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.stage.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.ending.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.manualCopy.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.controls.right).toBeLessThanOrEqual(layout.viewport + 1);
});



test("companion tabs support roving focus, arrow navigation, Home and End", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(5);
  await expect(tabs.nth(0)).toHaveAttribute("tabindex", "0");
  await expect(tabs.nth(1)).toHaveAttribute("tabindex", "-1");
  await tabs.nth(0).focus();

  await tabs.nth(0).press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(1)).toHaveAttribute("tabindex", "0");
  await expect(page.locator(".companion-panel-wishes").getByRole("heading", { name: "Give a wish to the sky." })).toBeVisible();

  await tabs.nth(1).press("ArrowRight");
  await expect(tabs.nth(2)).toBeFocused();
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await tabs.nth(2).press("ArrowLeft");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

  await tabs.nth(1).press("Home");
  await expect(tabs.nth(0)).toBeFocused();
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

  await tabs.nth(0).press("End");
  await expect(tabs.nth(4)).toBeFocused();
  await expect(tabs.nth(4)).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".companion-panel-storybook").getByRole("heading", { name: "One tiny story. Three little choices." })).toBeVisible();

  await tabs.nth(4).press("ArrowRight");
  await expect(tabs.nth(0)).toBeFocused();
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
  await tabs.nth(0).press("ArrowLeft");
  await expect(tabs.nth(4)).toBeFocused();
  await expect(tabs.nth(4)).toHaveAttribute("aria-selected", "true");

  const keyboardState = await tabs.evaluateAll((elements) => ({
    tabStops: elements.filter((element) => element.tabIndex === 0).length,
    focused: elements.findIndex((element) => document.activeElement === element),
    selected: elements.findIndex((element) => element.getAttribute("aria-selected") === "true")
  }));
  expect(keyboardState.tabStops).toBe(1);
  expect(keyboardState.focused).toBe(4);
  expect(keyboardState.selected).toBe(4);
});


test("a wish released into the sky can be woven into Mimi's story ending", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 768 });
  await enterGarden(page);
  await page.getByRole("tab", { name: "Wish sky" }).click();

  const draft=page.getByRole("textbox", { name: "Write a wish in your own words" });
  await page.getByRole("button", { name: /Tiny wonders/ }).click();
  await page.getByRole("button", { name: /Release into the sky/ }).click();
  const firstWish="May you keep finding flowers, cats, unexpected kindness, and little bits of magic tucked into ordinary days.";
  const secondWish="May the small wonders you notice find their way back to you again.";
  await draft.fill(secondWish);
  await page.getByRole("button", { name: /Release into the sky/ }).click();
  await expect(page.locator(".released-wish-star")).toHaveCount(2);

  await page.getByRole("tab", { name: "Mimi's tiny storybook" }).click();
  const panel=page.locator(".companion-panel-storybook");
  await expect(panel).toContainText("One of the stars you sent into the sky can find its way into the ending");
  await page.getByRole("button", { name: /Begin Mimi's story/ }).click();
  await page.getByRole("button", { name: /Follow a ladybug lantern/ }).click();
  await page.getByRole("button", { name: /Turn the tiny page/ }).click();
  await page.getByRole("button", { name: /Invite the tiny friends/ }).click();
  await page.getByRole("button", { name: /Turn the tiny page/ }).click();
  await page.getByRole("button", { name: /A wish for softer days/ }).click();
  await page.getByRole("button", { name: /Reveal our ending/ }).click();

  const story=panel.getByRole("article", { name: "Mimi's tiny fairytale for Malika" });
  const chooser=panel.locator(".mimi-storybook-wish-chooser");
  await expect(chooser.getByRole("button")).toHaveCount(2);
  const latestWish=chooser.getByRole("button", { name: "Weave this wish into the ending: " + secondWish });
  const firstWishButton=chooser.getByRole("button", { name: "Weave this wish into the ending: " + firstWish });
  await expect(latestWish).toHaveAttribute("aria-pressed", "true");
  await expect(story.locator(".mimi-storybook-wish-inlay")).toContainText(secondWish);
  await firstWishButton.click();
  await expect(firstWishButton).toHaveAttribute("aria-pressed", "true");
  await expect(latestWish).toHaveAttribute("aria-pressed", "false");
  await expect(story.locator(".mimi-storybook-wish-inlay")).toContainText(firstWish);
  await expect(story.locator(".mimi-storybook-wish-inlay")).not.toContainText(secondWish);

  await page.setViewportSize({ width: 375, height: 812 });
  const layout=await page.evaluate(()=>({
    viewport:window.innerWidth,
    document:document.documentElement.scrollWidth,
    chooser:document.querySelector(".mimi-storybook-wish-chooser").getBoundingClientRect().toJSON(),
    inlay:document.querySelector(".mimi-storybook-wish-inlay").getBoundingClientRect().toJSON(),
    options:[...document.querySelectorAll(".mimi-storybook-wish-option")].map(e=>e.getBoundingClientRect().toJSON())
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport);
  expect(layout.chooser.x).toBeGreaterThanOrEqual(0);
  expect(layout.chooser.right).toBeLessThanOrEqual(layout.viewport+1);
  expect(layout.inlay.right).toBeLessThanOrEqual(layout.viewport+1);
  for(const option of layout.options) expect(option.right).toBeLessThanOrEqual(layout.viewport+1);

  await page.getByRole("button", { name: /Tell another tiny story/ }).click();
  await page.getByRole("button", { name: /Begin Mimi's story/ }).click();
  await page.getByRole("button", { name: /Follow a ladybug lantern/ }).click();
  await page.getByRole("button", { name: /Turn the tiny page/ }).click();
  await page.getByRole("button", { name: /Invite the tiny friends/ }).click();
  await page.getByRole("button", { name: /Turn the tiny page/ }).click();
  await page.getByRole("button", { name: /A wish for softer days/ }).click();
  await page.getByRole("button", { name: /Reveal our ending/ }).click();
  await expect(chooser.getByRole("button", { name: "Weave this wish into the ending: " + secondWish })).toHaveAttribute("aria-pressed", "true");
  await expect(story.locator(".mimi-storybook-wish-inlay")).toContainText(secondWish);
});


test("released wishes connect into a quiet constellation without blocking star controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 768 });
  await enterGarden(page);
  await page.getByRole("tab", { name: "Wish sky" }).click();

  const release=page.getByRole("button", { name: /Release into the sky/ });
  const draft=page.getByRole("textbox", { name: "Write a wish in your own words" });
  const field=page.locator(".wish-sky-field");
  await expect(field.locator(".released-wish-star")).toHaveCount(0);
  await expect(field.locator(".wish-constellation-lines")).toHaveCount(0);

  await page.getByRole("button", { name: /Tiny wonders/ }).click();
  await release.click();
  await expect(field.locator(".released-wish-star")).toHaveCount(1);
  await expect(field.locator(".wish-constellation-lines")).toHaveCount(0);

  await draft.fill("May small joys find their way to you, even on ordinary days.");
  await release.click();
  await draft.fill("May every new beginning feel a little gentler.");
  await release.click();

  const stars=field.locator(".released-wish-star");
  const overlay=field.locator(".wish-constellation-lines");
  const trace=overlay.locator(".wish-constellation-path");
  await expect(stars).toHaveCount(3);
  await expect(overlay).toHaveAttribute("aria-hidden","true");
  await expect(overlay).toHaveAttribute("focusable","false");
  await expect(trace).toHaveCount(1);
  const points=await trace.getAttribute("points");
  expect(points.trim().split(/\s+/)).toHaveLength(3);
  await expect(stars.nth(0)).toBeVisible();
  await stars.nth(2).click();
  await expect(stars.nth(2)).toHaveAttribute("aria-pressed","true");
  await expect(page.locator(".wish-selected-note")).toContainText("May every new beginning feel a little gentler");

  for (const viewport of [{width:1366,height:768},{width:375,height:812}]) {
    await page.setViewportSize(viewport);
    const bounds=await page.evaluate(()=>({
      viewport:window.innerWidth,
      document:document.documentElement.scrollWidth,
      field:document.querySelector(".wish-sky-field").getBoundingClientRect().toJSON(),
      trace:document.querySelector(".wish-constellation-lines").getBoundingClientRect().toJSON(),
      stars:[...document.querySelectorAll(".released-wish-star")].map(el=>el.getBoundingClientRect().toJSON())
    }));
    expect(bounds.document).toBeLessThanOrEqual(bounds.viewport);
    expect(bounds.trace.x).toBeGreaterThanOrEqual(bounds.field.x-1);
    expect(bounds.trace.right).toBeLessThanOrEqual(bounds.field.right+1);
    for(const star of bounds.stars){
      expect(star.left).toBeGreaterThanOrEqual(bounds.field.left-1);
      expect(star.right).toBeLessThanOrEqual(bounds.field.right+1);
    }
  }
});

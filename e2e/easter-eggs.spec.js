import { test, expect } from "@playwright/test";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

async function openArcade(page) {
  await page.goto("/");
  for (const key of KONAMI) await page.keyboard.press(key);
  await expect(page.getByRole("dialog", { name: "The secret arcade" })).toBeVisible();
}

async function expectCelebration(page, title, theme, score) {
  const reward = page.getByRole("dialog", { name: title });
  await expect(reward).toBeVisible();
  await expect(reward.locator(".egg-celebration")).toHaveClass(new RegExp("egg-celebration-theme-" + theme));
  await expect(reward.locator(".egg-celebration-particle")).toHaveCount(64);
  await expect(reward.locator(".egg-celebration-heart-burst i")).toHaveCount(24);
  await expect(reward.locator(".egg-celebration-shockwaves i")).toHaveCount(3);
  await expect(reward.locator(".egg-reward-score")).toHaveText(score);
  const viewport = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const bounds = await reward.boundingBox();
  expect(bounds.width, "celebration must span the full viewport width").toBeGreaterThanOrEqual(viewport.width - 1);
  expect(bounds.height, "celebration must span the full viewport height").toBeGreaterThanOrEqual(viewport.height - 1);
}

test("the classic Konami sequence opens the Secret Arcade with five side quests", async ({ page }) => {
  await openArcade(page);
  await expect(page.getByRole("button", { name: /Mimi's constellation chase/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Mimi's memory match/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Pawprint rhythm/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Firefly hunt/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /The little wish jar/ })).toBeVisible();
  await page.getByRole("button", { name: "Close secret surprise" }).click();

  // The visible brand heart is another concealed entrance.
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  const heartMark = page.locator(".brand-heart");
  for (let i = 0; i < 5; i += 1) await heartMark.click();
  await expect(page.getByRole("dialog", { name: "The secret arcade" })).toBeVisible();
});

test("typing MALIKA creates a starfall and typing MIMI opens Memory Match directly", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.type("MALIKA");
  await expect(page.getByRole("dialog", { name: "Her name lit up the sky" })).toBeVisible();
  await page.getByRole("button", { name: "Enter the Secret Arcade" }).click();
  await expect(page.getByRole("dialog", { name: "The secret arcade" })).toBeVisible();
  await page.getByRole("button", { name: "Close secret surprise" }).click();

  await page.keyboard.type("MIMI");
  await expect(page.getByRole("dialog", { name: "Mimi's memory match" })).toBeVisible();
});

test("the constellation chase rejects decoys and out-of-order stars before rewarding the full heart trail", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Mimi's constellation chase/ }).click();

  await page.getByTestId("star-target-3").click();
  await expect(page.locator(".egg-progress")).toHaveText("0 / 8 trail stars found");
  await expect(page.locator(".egg-toast")).toContainText("skipping ahead");
  await page.getByTestId("star-decoy-9").click();
  await expect(page.locator(".egg-progress")).toHaveText("0 / 8 trail stars found");
  await expect(page.locator(".egg-toast")).toContainText("decoy");

  for (let step = 1; step <= 8; step += 1) await page.getByTestId("star-target-" + step).click();
  await expectCelebration(page, "You found the heart in the stars.", "starlight", "8 / 8 trail stars found");
  await expect(page.locator(".egg-reward-score")).toHaveText("8 / 8 trail stars found");
});

test("Mimi's shuffled memory match hides pair identities and unlocks after four pairs", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Mimi's memory match/ }).click();

  const cards = page.locator(".egg-memory-card");
  await expect(cards).toHaveCount(8);
  const order = await cards.evaluateAll((nodes) => nodes.map((node) => node.dataset.testid));
  expect(new Set(order).size).toBe(8);
  for (const id of order) {
    const card = page.getByTestId(id);
    await expect(card).toHaveAttribute("aria-label", /^Turn over memory card \d+$/);
    await expect(card).not.toHaveAttribute("aria-label", /moon-a|moon-b|paw-a|paw-b|heart-a|heart-b|sparkle-a|sparkle-b/);
  }

  for (const card of ["moon-a", "moon-b", "paw-a", "paw-b", "heart-a", "heart-b", "sparkle-a", "sparkle-b"]) {
    await page.getByTestId("memory-card-" + card).click();
  }

  await expectCelebration(page, "You remembered every little wonder.", "memory", "4 / 4 matching pairs");
  await expect(page.locator(".egg-reward-score")).toHaveText("4 / 4 matching pairs");
});

test("Mimi's six-beat rhythm can be replayed and must be repeated in sequence", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Pawprint rhythm/ }).click();

  const watch = page.locator(".egg-rhythm-watch");
  const paw = page.getByRole("button", { name: "Play pawprints" });
  await watch.click();
  await expect(page.getByTestId("rhythm-cue")).toContainText("🐾");
  await expect(paw).toBeDisabled();
  await expect(watch).toBeDisabled();
  await expect(paw).toBeEnabled({ timeout: 6500 });

  await page.getByRole("button", { name: "Play moon" }).click();
  await expect(page.locator(".egg-progress")).toHaveText("Beats repeated: 0 / 6");
  await expect(page.locator(".egg-toast")).toContainText("combo is gone");
  await watch.click();
  await expect(paw).toBeEnabled({ timeout: 6500 });

  for (const symbol of ["Play pawprints", "Play moon", "Play purple heart", "Play sparkle", "Play pawprints", "Play moon"]) {
    await page.getByRole("button", { name: symbol }).click();
  }
  await expectCelebration(page, "Mimi's tiny concert is a HIT!", "rhythm", "6 / 6 beats in sync");
});

test("the firefly hunt rejects dim decoys and rewards the five golden lights", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Firefly hunt/ }).click();
  await page.getByTestId("firefly-decoy-3").click();
  await expect(page.locator(".egg-progress")).toHaveText("0 / 5 real fireflies caught");
  await expect(page.locator(".egg-toast")).toContainText("fake light");
  for (const id of [1, 2, 4, 5, 7]) await page.getByTestId("firefly-target-" + id).click();
  await expectCelebration(page, "You just lit up the whole garden.", "fireflies", "5 / 5 fireflies caught");
  await expect(page.locator(".egg-reward-score")).toHaveText("5 / 5 fireflies caught");
});

test("the hidden moon and fifth Mimi pet each reveal their own animated secret", async ({ page }) => {
  await page.goto("/");
  const moon = page.getByRole("button", { name: "The moon hides a wish—tap 7 times" });
  for (let i = 0; i < 7; i += 1) await moon.click();
  await expect(page.getByRole("dialog", { name: "The moon kept a secret" })).toBeVisible();
  await page.getByRole("button", { name: "Close secret surprise" }).click();

  const mimi = page.getByRole("button", { name: "Pet Mimi to wake her up" });
  for (let i = 0; i < 5; i += 1) await mimi.click();
  await expect(page.getByRole("dialog", { name: "Mimi's fifth hello" })).toBeVisible();
});

test("three footer stars reveal a wish, and four ladybug discoveries hint at the arcade", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();

  const footerStar = page.getByRole("button", { name: /Reveal the tiny footer star/ });
  await footerStar.click();
  await footerStar.click();
  await footerStar.focus();
  await expect(footerStar).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "A tiny star said thank you" })).toBeVisible();
  await page.getByRole("button", { name: "Close secret surprise" }).click();

  const bug = page.getByRole("button", { name: /Follow this ladybug: A little thought/ });
  for (let i = 0; i < 4; i += 1) {
    await bug.click();
    const closeNote = page.getByRole("button", { name: "Close love note" });
    if (await closeNote.count()) await closeNote.click();
  }
  await expect(page.locator(".egg-toast")).toContainText("Four ladybugs, one hidden trail");
  await page.getByRole("button", { name: "Open Secret Arcade" }).click();
  await expect(page.getByRole("dialog", { name: "The secret arcade" })).toBeVisible();
  // The toast timer must survive opening the arcade and still dismiss itself.
  await expect(page.locator(".egg-toast")).toHaveCount(0, { timeout: 8500 });
});


test("completing all five arcade quests unlocks the grand-secret finale", async ({ page }) => {
  await openArcade(page);

  test.setTimeout(45_000);
  await page.getByRole("button", { name: /Mimi's constellation chase/ }).click();
  for (let step = 1; step <= 8; step += 1) await page.getByTestId("star-target-" + step).click();
  await expectCelebration(page, "You found the heart in the stars.", "starlight", "8 / 8 trail stars found");
  await page.getByRole("button", { name: "Back to Secret Arcade" }).click();

  await page.getByRole("button", { name: /Mimi's memory match/ }).click();
  for (const card of ["moon-a", "moon-b", "paw-a", "paw-b", "heart-a", "heart-b", "sparkle-a", "sparkle-b"]) {
    await page.getByTestId("memory-card-" + card).click();
  }
  await expectCelebration(page, "You remembered every little wonder.", "memory", "4 / 4 matching pairs");
  await page.getByRole("button", { name: "Back to Secret Arcade" }).click();

  await page.getByRole("button", { name: /Pawprint rhythm/ }).click();
  for (const symbol of ["Play pawprints", "Play moon", "Play purple heart", "Play sparkle", "Play pawprints", "Play moon"]) {
    await page.getByRole("button", { name: symbol }).click();
  }
  await expectCelebration(page, "Mimi's tiny concert is a HIT!", "rhythm", "6 / 6 beats in sync");
  await page.getByRole("button", { name: "Back to Secret Arcade" }).click();

  await page.getByRole("button", { name: /Firefly hunt/ }).click();
  for (const id of [1, 2, 4, 5, 7]) await page.getByTestId("firefly-target-" + id).click();
  await expectCelebration(page, "You just lit up the whole garden.", "fireflies", "5 / 5 fireflies caught");
  await page.getByRole("button", { name: "Back to Secret Arcade" }).click();
  await expect(page.getByRole("progressbar", { name: "Arcade games completed" })).toHaveAttribute("aria-valuenow", "4");
  await expect(page.getByRole("button", { name: "Open the grand secret" })).toHaveCount(0);

  await page.getByRole("button", { name: /The little wish jar/ }).click();
  await page.getByTestId("wish-key-paws").click();
  await expect(page.locator(".egg-toast")).toContainText("wax and wane");
  for (const answer of ["moon", "paws", "heart", "star", "shooting-star"]) {
    await page.getByTestId("wish-key-" + answer).click();
  }
  await expectCelebration(page, "Five wishes. One very bright future.", "wishes", "5 / 5 wishes unlocked");
  await expect(page.locator(".egg-reward-score")).toHaveText("5 / 5 wishes unlocked");
  await page.getByRole("button", { name: "Back to Secret Arcade" }).click();

  await expect(page.getByRole("progressbar", { name: "Arcade games completed" })).toHaveAttribute("aria-valuenow", "5");
  await expect(page.getByText("You found every side quest")).toBeVisible();
  await page.getByRole("button", { name: "Open the grand secret" }).click();

  const grandSecret = page.getByRole("dialog", { name: "Keeper of Little Wonders" });
  await expect(grandSecret).toBeVisible();
  await expect(grandSecret).toContainText("The grand secret was never just the stars or the prizes");
  await expect(grandSecret.locator(".egg-grand-finale")).toBeVisible();
  await expect(grandSecret.locator(".grand-flight-object")).toHaveCount(112);
  await expect(grandSecret.locator(".grand-comet-trails i")).toHaveCount(9);
  await expect(grandSecret.locator(".grand-heart-depth")).toHaveCount(13);
  await expect(grandSecret.locator(".grand-treasure")).toHaveCount(5);
  const grandViewport = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const grandBounds = await grandSecret.boundingBox();
  expect(grandBounds.width, "the grand secret must fill the viewport width").toBeGreaterThanOrEqual(grandViewport.width - 1);
  expect(grandBounds.height, "the grand secret must fill the viewport height").toBeGreaterThanOrEqual(grandViewport.height - 1);
  await page.waitForTimeout(1300); // Entrance sequence completes in about 1.15s after the performance pass.
  const desktopBackdrop = await grandSecret.locator("xpath=..").evaluate((element) => ({
    className: element.className,
    position: getComputedStyle(element).position,
    background: getComputedStyle(element).backgroundColor
  }));
  expect(desktopBackdrop.className).toContain("is-grand-finale");
  expect(desktopBackdrop.position).toBe("fixed");
  expect(desktopBackdrop.background).toBe("rgb(8, 4, 17)");
  await page.screenshot({ path: "test-results/screenshots/loop-010-grand-finale-desktop.png", fullPage: false });
  await grandSecret.getByRole("button", { name: "Return to your Secret Arcade" }).click();
  await expect(page.getByRole("dialog", { name: "The secret arcade" })).toBeVisible();

  await page.setViewportSize({ width: 320, height: 740 });
  await page.getByRole("button", { name: "Open the grand secret" }).click();
  const mobileGrand = page.getByRole("dialog", { name: "Keeper of Little Wonders" });
  await expect(mobileGrand).toBeVisible();
  const mobileSizes = await mobileGrand.locator(".grand-finale-content").evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  }));
  expect(mobileSizes.scrollWidth, "the finale content should fit a 320px phone").toBeLessThanOrEqual(mobileSizes.clientWidth);
  await page.waitForTimeout(1300); // Capture the staged phone-sized finale without an unnecessary extra wait.
  await page.screenshot({ path: "test-results/screenshots/loop-010-grand-finale-mobile.png", fullPage: false });
  const keepWonder = mobileGrand.getByRole("button", { name: "Keep this little wonder" });
  // Reset the pointer from the previous desktop position, then verify hover feedback does not move the CTA.
  await page.mouse.move(0, 0);
  await keepWonder.hover();
  const beforeHover = await keepWonder.boundingBox();
  await page.waitForTimeout(250);
  const afterHover = await keepWonder.boundingBox();
  expect(Math.abs(afterHover.y - beforeHover.y), "hover glow must not shift the mobile CTA").toBeLessThan(0.5);
  await keepWonder.click();
  await expect(mobileGrand).toHaveCount(0);
});


test("Memory Match explains a wrong pair, flips it back, and remains winnable", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Mimi's memory match/ }).click();

  await page.getByTestId("memory-card-moon-a").click();
  await page.getByTestId("memory-card-paw-a").click();
  await expect(page.locator(".egg-memory-card.is-mismatch")).toHaveCount(2);
  await expect(page.locator(".egg-progress")).toContainText("Mimi saw that");
  await expect(page.getByTestId("memory-card-moon-a")).toBeVisible();
  await expect(page.getByTestId("memory-card-paw-a")).toBeVisible();

  await page.getByTestId("memory-card-moon-a").click();
  await page.getByTestId("memory-card-paw-a").click();
  await expect(page.locator(".egg-memory-card.is-mismatch")).toHaveCount(2);
  await page.getByTestId("memory-card-heart-a").click();
  await expect(page.locator(".egg-memory-card.is-open")).toHaveCount(1);
  await page.waitForTimeout(1200);
  await expect(page.locator(".egg-memory-card.is-open")).toHaveCount(1);

  await page.getByTestId("memory-card-heart-b").click();
  await page.getByTestId("memory-card-moon-a").click();
  await page.getByTestId("memory-card-moon-b").click();
  await page.getByTestId("memory-card-paw-a").click();
  await page.getByTestId("memory-card-paw-b").click();
  await page.getByTestId("memory-card-sparkle-a").click();
  await page.getByTestId("memory-card-sparkle-b").click();
  await expectCelebration(page, "You remembered every little wonder.", "memory", "4 / 4 matching pairs");
  await expect(page.locator(".egg-reward-score")).toHaveText("4 / 4 matching pairs");
});

test("Pawprint rhythm rejects an incorrect beat and allows the code to be replayed", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Pawprint rhythm/ }).click();
  await page.getByRole("button", { name: "Play moon" }).click();
  await expect(page.locator(".egg-progress")).toHaveText("Beats repeated: 0 / 6");
  await expect(page.locator(".egg-toast")).toContainText("combo is gone");

  await page.getByRole("button", { name: /Watch Mimi's rhythm/ }).click();
  await expect(page.getByRole("button", { name: "Play pawprints" })).toBeEnabled({ timeout: 6500 });
  for (const symbol of ["Play pawprints", "Play moon", "Play purple heart", "Play sparkle", "Play pawprints", "Play moon"]) {
    await page.getByRole("button", { name: symbol }).click();
  }
  await expectCelebration(page, "Mimi's tiny concert is a HIT!", "rhythm", "6 / 6 beats in sync");
});

test("the Secret Arcade fits a narrow phone viewport and can always be closed", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  const brandMark = page.getByRole("button", { name: "Return to Malika's birthday garden" });
  const heart = page.locator(".brand-heart");
  for (let tap = 0; tap < 5; tap += 1) await heart.click();

  const dialog = page.getByRole("dialog", { name: "The secret arcade" });
  await expect(dialog).toBeVisible();
  const dimensions = await dialog.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  }));
  expect(dimensions.scrollWidth, "the arcade must not overflow horizontally on a 320px phone").toBeLessThanOrEqual(dimensions.clientWidth);
  await expect(dialog.getByRole("button", { name: "Close secret surprise" })).toBeVisible();
  await page.getByRole("button", { name: "Close secret surprise" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(brandMark).toBeFocused();
});


test("Secret Arcade keeps keyboard focus inside its dialog when focus starts behind it", async ({ page }) => {
  await openArcade(page);

  const dialog = page.getByRole("dialog", { name: "The secret arcade" });
  const closeButton = dialog.getByRole("button", { name: "Close secret surprise" });
  const lastFocusable = dialog.locator('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])').last();
  await expect(closeButton).toBeFocused();

  await page.getByRole("button", { name: /Open your birthday surprise/ }).evaluate((node) => node.focus());
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect(lastFocusable).toBeFocused();
});


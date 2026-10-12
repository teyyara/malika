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
  await expect(reward.locator(".egg-celebration-particle")).toHaveCount(96);
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
  await expect(page.getByRole("button", { name: /Seven-star catcher/ })).toBeVisible();
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

test("the seven-star catcher tracks unique stars and plays its victory reveal", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Seven-star catcher/ }).click();
  const stars = page.getByRole("button", { name: /^Catch secret star/ });
  for (let i = 0; i < 7; i += 1) await stars.first().click();
  await expectCelebration(page, "A whole galaxy belongs to you.", "starlight", "7 / 7 stars caught");
  await expect(page.locator(".egg-reward-score")).toHaveText("7 / 7 stars caught");
});

test("Mimi's memory match unlocks after the three icon pairs are found", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Mimi's memory match/ }).click();

  await page.getByRole("button", { name: "Turn over memory card moon-a" }).click();
  await page.getByRole("button", { name: "Turn over memory card moon-b" }).click();
  await page.getByRole("button", { name: "Turn over memory card paw-a" }).click();
  await page.getByRole("button", { name: "Turn over memory card paw-b" }).click();
  await page.getByRole("button", { name: "Turn over memory card heart-a" }).click();
  await page.getByRole("button", { name: "Turn over memory card heart-b" }).click();

  await expectCelebration(page, "You remembered every little wonder.", "memory", "3 / 3 matching pairs");
  await expect(page.locator(".egg-reward-score")).toHaveText("3 / 3 matching pairs");
});

test("the pawprint rhythm accepts the secret four-beat pattern", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Pawprint rhythm/ }).click();
  for (const symbol of ["Play pawprints", "Play moon", "Play purple heart", "Play sparkle"]) {
    await page.getByRole("button", { name: symbol }).click();
  }
  await expectCelebration(page, "Mimi's tiny concert is a HIT!", "rhythm", "4 / 4 beats in sync");
});

test("the firefly hunt catches five unique lights without a timer", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Firefly hunt/ }).click();
  const flies = page.getByRole("button", { name: /^Catch glowing firefly/ });
  for (let i = 0; i < 5; i += 1) await flies.first().click();
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

  await page.getByRole("button", { name: /Seven-star catcher/ }).click();
  const stars = page.getByRole("button", { name: /^Catch secret star/ });
  for (let i = 0; i < 7; i += 1) await stars.first().click();
  await expectCelebration(page, "A whole galaxy belongs to you.", "starlight", "7 / 7 stars caught");
  await page.getByRole("button", { name: "Back to Secret Arcade" }).click();

  await page.getByRole("button", { name: /Mimi's memory match/ }).click();
  for (const card of ["moon-a", "moon-b", "paw-a", "paw-b", "heart-a", "heart-b"]) {
    await page.getByRole("button", { name: "Turn over memory card " + card }).click();
  }
  await expectCelebration(page, "You remembered every little wonder.", "memory", "3 / 3 matching pairs");
  await page.getByRole("button", { name: "Back to Secret Arcade" }).click();

  await page.getByRole("button", { name: /Pawprint rhythm/ }).click();
  for (const symbol of ["Play pawprints", "Play moon", "Play purple heart", "Play sparkle"]) {
    await page.getByRole("button", { name: symbol }).click();
  }
  await expectCelebration(page, "Mimi's tiny concert is a HIT!", "rhythm", "4 / 4 beats in sync");
  await page.getByRole("button", { name: "Back to Secret Arcade" }).click();

  await page.getByRole("button", { name: /Firefly hunt/ }).click();
  const flies = page.getByRole("button", { name: /^Catch glowing firefly/ });
  for (let i = 0; i < 5; i += 1) await flies.first().click();
  await expectCelebration(page, "You just lit up the whole garden.", "fireflies", "5 / 5 fireflies caught");
  await page.getByRole("button", { name: "Back to Secret Arcade" }).click();
  await expect(page.getByRole("progressbar", { name: "Arcade games completed" })).toHaveAttribute("aria-valuenow", "4");
  await expect(page.getByRole("button", { name: "Open the grand secret" })).toHaveCount(0);

  await page.getByRole("button", { name: /The little wish jar/ }).click();
  for (let i = 0; i < 5; i += 1) {
    await page.getByRole("button", { name: /^Shake the wish jar/ }).click();
  }
  await expectCelebration(page, "Five wishes. One very bright future.", "wishes", "5 / 5 wishes revealed");
  await expect(page.locator(".egg-reward-score")).toHaveText("5 / 5 wishes revealed");
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
  await page.waitForTimeout(2600); // Let the heart, title, treasures and final actions finish their staged entrance.
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
  await page.waitForTimeout(2600); // Capture the fully staged phone-sized finale, not its initial fade frame.
  await page.screenshot({ path: "test-results/screenshots/loop-010-grand-finale-mobile.png", fullPage: false });
  await mobileGrand.getByRole("button", { name: "Keep this little wonder" }).click();
  await expect(mobileGrand).toHaveCount(0);
});


test("Memory Match explains a wrong pair, flips it back, and remains winnable", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Mimi's memory match/ }).click();

  await page.getByRole("button", { name: "Turn over memory card moon-a" }).click();
  await page.getByRole("button", { name: "Turn over memory card paw-a" }).click();
  await expect(page.locator(".egg-memory-card.is-mismatch")).toHaveCount(2);
  await expect(page.locator(".egg-progress")).toContainText("Not a match");
  await expect(page.getByRole("button", { name: "Turn over memory card moon-a" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Turn over memory card paw-a" })).toBeVisible();

  await page.getByRole("button", { name: "Turn over memory card moon-a" }).click();
  await page.getByRole("button", { name: "Turn over memory card paw-a" }).click();
  await expect(page.locator(".egg-memory-card.is-mismatch")).toHaveCount(2);
  await page.getByRole("button", { name: "Turn over memory card heart-a" }).click();
  await expect(page.locator(".egg-memory-card.is-open")).toHaveCount(1);
  await page.waitForTimeout(1200);
  await expect(page.locator(".egg-memory-card.is-open")).toHaveCount(1);

  await page.getByRole("button", { name: "Turn over memory card heart-b" }).click();
  await page.getByRole("button", { name: "Turn over memory card moon-a" }).click();
  await page.getByRole("button", { name: "Turn over memory card moon-b" }).click();
  await page.getByRole("button", { name: "Turn over memory card paw-a" }).click();
  await page.getByRole("button", { name: "Turn over memory card paw-b" }).click();
  await expectCelebration(page, "You remembered every little wonder.", "memory", "3 / 3 matching pairs");
  await expect(page.locator(".egg-reward-score")).toHaveText("3 / 3 matching pairs");
});

test("Pawprint rhythm gives a recoverable wrong-input hint", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Pawprint rhythm/ }).click();
  await page.getByRole("button", { name: "Play moon" }).click();
  await expect(page.locator(".egg-progress")).toHaveText("Beats repeated: 0 / 4");
  await expect(page.locator(".egg-toast")).toContainText("The rhythm starts with pawprints");

  for (const symbol of ["Play pawprints", "Play moon", "Play purple heart", "Play sparkle"]) {
    await page.getByRole("button", { name: symbol }).click();
  }
  await expectCelebration(page, "Mimi's tiny concert is a HIT!", "rhythm", "4 / 4 beats in sync");
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

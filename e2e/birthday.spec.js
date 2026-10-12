import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

async function enterGarden(page) {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Malika, this little universe is yours." })
  ).toBeVisible();
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await expect(
    page.getByRole("heading", { name: /A garden full of little things/ })
  ).toBeVisible();
}

async function expectNoHorizontalOverflow(page, width, scene) {
  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(
    layout.document,
    "Horizontal overflow at " + width + "px while viewing " + scene +
      " (document " + layout.document + "px)"
  ).toBeLessThanOrEqual(layout.viewport);
}

test("keyboard entry and visible navigation reach every scene without runtime errors", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page).toHaveTitle(/For Malika, With All My Heart/);

  const skipLink = page.getByRole("link", { name: "Skip to the surprise" });
  const welcomeButton = page.getByRole("button", { name: /Open your birthday surprise/ });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(welcomeButton).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("heading", { name: /A garden full of little things/ })).toBeVisible();

  await page.getByRole("button", { name: "Heart game", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Mimi's Little Heart Garden" })).toBeVisible();

  await page.getByRole("button", { name: "Love notes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "The love collection" })).toBeVisible();

  await page.getByRole("button", { name: "Birthday letter", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Happy birthday, Malika/ })).toBeVisible();

  await page.getByRole("button", { name: "The garden", exact: true }).click();
  await expect(page.getByRole("heading", { name: /A garden full of little things/ })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("collecting seven hearts unlocks a secret note and the dialog supports keyboard focus and Escape", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);

  await page.getByRole("button", { name: "Heart game", exact: true }).click();
  await page.getByRole("button", { name: /Let's find some hearts/ }).click();
  const heartButtons = page.getByRole("button", { name: /Collect purple heart/ });
  await expect(heartButtons).toHaveCount(4);

  for (let count = 0; count < 7; count += 1) {
    await heartButtons.first().click();
  }

  await expect(page.getByRole("heading", { name: "You found every heart…" })).toBeVisible();
  await expect(page.locator(".header-heart-count")).toHaveAttribute("aria-label", "Hearts collected: 7 of 7");

  await page.getByRole("button", { name: "Love notes", exact: true }).click();
  const secretNote = page.getByRole("button", { name: "Open note: A letter behind the stars" });
  await expect(secretNote).toBeEnabled();
  await secretNote.click();

  const dialog = page.getByRole("dialog", { name: "A letter behind the stars" });
  const closeButton = dialog.getByRole("button", { name: "Close love note" });
  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Keep this close" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();
  await page.keyboard.press("Escape");

  await expect(dialog).toHaveCount(0);
  await expect(secretNote).toBeFocused();
});

test("welcome, garden, game, collection, and finale avoid page overflow at phone and tablet widths", async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 375, height: 812 },
    { width: 768, height: 1024 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Malika, this little universe is yours." })).toBeVisible();
    await expectNoHorizontalOverflow(page, viewport.width, "welcome");

    await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
    await expect(page.getByRole("heading", { name: /A garden full of little things/ })).toBeVisible();
    await expectNoHorizontalOverflow(page, viewport.width, "garden");

    await page.getByRole("button", { name: "Heart game", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Mimi's Little Heart Garden" })).toBeVisible();
    await expectNoHorizontalOverflow(page, viewport.width, "heart game");

    await page.getByRole("button", { name: "Love notes", exact: true }).click();
    await expect(page.getByRole("heading", { name: "The love collection" })).toBeVisible();
    await expectNoHorizontalOverflow(page, viewport.width, "love collection");

    await page.getByRole("button", { name: "Birthday letter", exact: true }).click();
    await expect(page.getByRole("heading", { name: /Happy birthday, Malika/ })).toBeVisible();
    await expectNoHorizontalOverflow(page, viewport.width, "birthday finale");
  }
});

test("the heart game can reset halfway and still complete a fresh run", async ({ page }) => {
  // This test checks state/restart behavior; the independent visual tests cover floating animation.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  await page.getByRole("button", { name: "Heart game", exact: true }).click();
  await page.getByRole("button", { name: /Let's find some hearts/ }).click();

  const hearts = page.getByRole("button", { name: /Collect purple heart/ });
  await expect(hearts).toHaveCount(4);
  await hearts.first().click();
  await hearts.first().click();
  await expect(page.locator(".game-progress-copy strong span")).toHaveText("2");

  await page.getByRole("button", { name: "Start over" }).click();
  await expect(page.getByRole("button", { name: /Let's find some hearts/ })).toBeVisible();
  await expect(page.locator(".collectible-heart")).toHaveCount(0);
  await page.getByRole("button", { name: /Let's find some hearts/ }).click();

  const freshHearts = page.getByRole("button", { name: /Collect purple heart/ });
  await expect(freshHearts).toHaveCount(4);
  for (let count = 0; count < 7; count += 1) await freshHearts.first().click();
  await expect(page.getByRole("heading", { name: "You found every heart…" })).toBeVisible();
  await expect(page.locator(".header-heart-count")).toHaveAttribute("aria-label", "Hearts collected: 7 of 7");
});

test("the garden clue guide offers a gentle nudge without exposing a spoiler map", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await enterGarden(page);

  const guide = page.getByRole("complementary", { name: "Optional clues for curious explorers" });
  await expect(guide).toBeVisible();
  const rootDetails = guide.locator(".curiosity-guide-root");
  const summary = rootDetails.locator(":scope > summary");
  await summary.focus();
  await expect(summary).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(rootDetails).toHaveAttribute("open", "");

  await expect(guide.locator(".curiosity-guide-intro")).toBeVisible();
  await expect(guide.locator(".curiosity-guide-step")).toHaveCount(1);
  await expect(guide.getByText(/full secret map/i)).toHaveCount(0);
  await expect(guide.locator(".curiosity-guide-spoilers")).toHaveCount(0);

  const clearerClue = guide.locator(".curiosity-guide-step").first();
  await clearerClue.locator("summary").click();
  await expect(clearerClue).toHaveAttribute("open", "");
  await expect(clearerClue).toContainText("3, 4, 5, and 7");
  await expect(guide.locator(".curiosity-guide-spoilers")).toHaveCount(0);

  const dimensions = await guide.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  }));
  expect(dimensions.scrollWidth, "the clue guide must fit a 320px phone viewport").toBeLessThanOrEqual(dimensions.clientWidth);
  await expectNoHorizontalOverflow(page, 320, "the garden clue guide");
});

test("garden depth, heart bursts, note search, and final letter portal work together", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await enterGarden(page);
  await expect(page.locator(".garden-sky-depth .garden-mote")).toHaveCount(30);
  await expect(page.locator(".garden-orbit")).toHaveCount(3);

  await page.getByRole("button", { name: "Heart game", exact: true }).click();
  await page.getByRole("button", { name: /Let's find some hearts/ }).click();
  const hearts = page.getByRole("button", { name: /Collect purple heart/ });
  // Hearts gently float forever; force this one action so the test checks the capture effect, not pointer stability.
  await hearts.first().click({ force: true });
  await expect(page.locator(".heart-capture-burst")).toHaveCount(1);
  await expect(page.locator(".heart-capture-fragment")).toHaveCount(18);
  await expect(page.locator(".game-progress-copy strong span")).toHaveText("1");

  await page.getByRole("button", { name: "Love notes", exact: true }).click();
  const search = page.getByRole("searchbox", { name: "Search love notes" });
  await search.fill("Brave new chapters");
  await expect(page.getByRole("button", { name: "Open note: Brave new chapters" })).toBeVisible();
  await expect(page.locator(".collection-results")).toContainText("1 little keepsake");
  await search.fill("");

  await page.getByRole("button", { name: "Birthday letter", exact: true }).click();
  await expect(page.locator(".finale-depth-field .finale-orbit")).toHaveCount(3);
  await expect(page.locator(".letter-card")).toBeVisible();
  await expect(page.locator(".letter-postmark")).toHaveText("12 · X");

  await page.getByRole("button", { name: /One last little surprise/ }).click();
  await expect(page.locator(".extra-surprise-portal")).toBeVisible();
  await expect(page.locator(".extra-portal-heart")).toHaveText("♥");
});

test("reduced motion disables decorative CSS animation across scenes and notes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".app-shell")).toHaveClass(/prefers-less-motion/);
  await expect.poll(() => page.locator(".star").first().evaluate((node) => getComputedStyle(node).animationIterationCount)).toBe("1");

  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await expect.poll(() => page.locator(".garden-mote").first().evaluate((node) => getComputedStyle(node).animationIterationCount)).toBe("1");
  await page.locator(".garden-bug .ladybug-button").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect.poll(() => page.locator(".love-note-modal::before").evaluate((node) => getComputedStyle(node).animationIterationCount)).toBe("1");
});

test("Mimi reacts to a pet and the three-star constellation reveals two environmental wishes", async ({ page }) => {
  await page.goto("/");
  const welcomeMimi = page.getByRole("button", { name: "Pet Mimi to wake her up" });
  await welcomeMimi.click();
  await expect(welcomeMimi.locator("svg.cat-art")).toHaveClass(/cat-reaction-curious/);
  await welcomeMimi.click();
  await expect(welcomeMimi.locator("svg.cat-art")).toHaveClass(/cat-reaction-delighted/);

  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Trace the first star of a hidden birthday wish" }).click();
  await page.getByRole("button", { name: "Trace the second star of a hidden birthday wish" }).click();
  await page.getByRole("button", { name: "Trace the last star to reveal a secret wish" }).click();

  const constellationWish = page.getByRole("dialog", { name: "A little more wonder" });
  await expect(constellationWish).toBeVisible();
  await expect(page.locator(".garden-constellation-lines .is-complete")).toHaveCount(1);
  await constellationWish.getByRole("button", { name: "Keep this close" }).click();

  await page.getByRole("button", { name: "Touch the pink flower to find a birthday wish" }).click();
  await expect(page.getByRole("dialog", { name: "Brave new chapters" })).toBeVisible();
});

test("the moonlit background gently tracks a fine-pointer movement", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");
  await page.mouse.move(12, 14);
  const firstPosition = await page.locator(".ambient-world").evaluate(
    (element) => getComputedStyle(element).getPropertyValue("--parallax-x-near").trim()
  );
  await page.mouse.move(940, 680);
  await expect.poll(async () => page.locator(".ambient-world").evaluate(
    (element) => getComputedStyle(element).getPropertyValue("--parallax-x-near").trim()
  )).not.toBe(firstPosition);
});

test("capture rendered art direction across the birthday journey", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await mkdir("test-results/screenshots", { recursive: true });
  // Keep pointer-hit targets deterministic for the visual capture; the ordinary E2E suite checks animation separately.
  await page.goto("/");
  await page.screenshot({ path: "test-results/screenshots/01-welcome.png", fullPage: true });

  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await expect(page.getByRole("heading", { name: /A garden full of little things/ })).toBeVisible();
  await page.screenshot({ path: "test-results/screenshots/02-garden.png", fullPage: true });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Heart game", exact: true }).click();
  await page.getByRole("button", { name: /Let's find some hearts/ }).click();
  await page.screenshot({ path: "test-results/screenshots/03-heart-game.png", fullPage: true });

  const hearts = page.getByRole("button", { name: /Collect purple heart/ });
  for (let count = 0; count < 7; count += 1) {
    await hearts.first().click();
  }
  await expect(page.getByRole("heading", { name: "You found every heart…" })).toBeVisible();
  await expect(page.locator(".game-won")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/screenshots/04-victory.png", fullPage: true });

  await page.getByRole("button", { name: "Birthday letter", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Happy birthday, Malika/ })).toBeVisible();
  await expect(page.locator(".letter-card > p").last()).toHaveCSS("opacity", "1");
  await expect(page.locator(".letter-signoff strong")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/screenshots/05-birthday-letter.png", fullPage: true });

  await page.getByRole("button", { name: /One last little surprise/ }).click();
  await expect(page.getByRole("status")).toBeVisible();
  await expect(page.locator(".extra-surprise")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/screenshots/06-final-surprise.png", fullPage: true });
});


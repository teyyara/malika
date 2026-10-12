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

  // A stray focus behind a modal must not let Tab escape into the page.
  await page.getByRole("button", { name: "Return to Malika's birthday garden" }).evaluate((node) => node.focus());
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await page.keyboard.press("Tab");
  const returnHeart = dialog.getByRole("button", { name: "Tap the floating heart to send a little heart back to Zack" });
  await expect(returnHeart).toBeFocused();

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
  await expect.poll(() => page.locator(".love-note-modal").evaluate((node) => getComputedStyle(node, "::before").animationIterationCount)).toBe("1");
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



test("reduced motion removes the heart game's floating JavaScript victory particles", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  await page.getByRole("button", { name: "Heart game", exact: true }).click();
  await page.getByRole("button", { name: /Let's find some hearts/ }).click();

  const hearts = page.getByRole("button", { name: /Collect purple heart/ });
  for (let count = 0; count < 7; count += 1) await hearts.first().click();

  await expect(page.getByRole("heading", { name: "You found every heart…" })).toBeVisible();
  await expect(page.locator(".celebration-particle")).toHaveCount(0);
});



test("Mimi teases a shortcut when the constellation is traced out of order", async ({ page }) => {
  await enterGarden(page);
  const secondStar = page.getByRole("button", { name: "Trace the second star of a hidden birthday wish" });
  await secondStar.click();

  await expect(page.locator(".cat-reply")).toContainText("Caught you skipping ahead");
  await expect(page.locator(".constellation-hint")).toContainText("0/3");
  await page.getByRole("button", { name: "Trace the first star of a hidden birthday wish" }).click();
  await expect(page.locator(".constellation-hint")).toContainText("1/3");
});



test("standard laptop viewports keep the welcome, garden, game, collection and letter carefully composed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Malika, this little universe is yours." })).toBeVisible();

    const welcome = await page.evaluate(() => {
      const rect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
      };
      return {
        viewportHeight: window.innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        scene: rect(".welcome-scene"),
        character: rect(".welcome-character"),
        cta: rect(".welcome-cta")
      };
    });
    expect(welcome.documentWidth, "welcome must not overflow at " + viewport.width).toBeLessThanOrEqual(viewport.width);
    expect(welcome.scene.height, "welcome composition should fit the laptop viewport").toBeLessThanOrEqual(viewport.height + 2);
    expect(welcome.character.height, "Mimi should feel prominent without dominating the welcome layout").toBeLessThanOrEqual(440);
    expect(welcome.cta.bottom, "the welcome action should be visible without a scroll").toBeLessThanOrEqual(viewport.height + 2);

    await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
    await expect(page.getByRole("heading", { name: /A garden full of little things/ })).toBeVisible();

    const header = await page.evaluate(() => {
      const box = (selector) => {
        const element = document.querySelector(selector);
        const r = element.getBoundingClientRect();
        return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      };
      return {
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        brand: box(".brand-mark"),
        nav: box(".scene-navigation"),
        tools: box(".header-tools"),
        garden: box(".garden-landscape"),
        destinations: [...document.querySelectorAll(".garden-destinations .destination-link")].map((node) => {
          const r = node.getBoundingClientRect();
          return { x: r.x, y: r.y, right: r.right, height: r.height, width: r.width };
        })
      };
    });
    expect(header.documentWidth, "garden must not overflow at " + viewport.width).toBeLessThanOrEqual(viewport.width);
    expect(header.brand.right, "brand and navigation should not collide").toBeLessThanOrEqual(header.nav.x + 1);
    expect(header.nav.right, "navigation and sound tools should not collide").toBeLessThanOrEqual(header.tools.x + 1);
    expect(header.garden.height).toBeGreaterThanOrEqual(285);
    expect(header.garden.height).toBeLessThanOrEqual(385);
    expect(header.destinations).toHaveLength(3);
    expect(Math.max(...header.destinations.map((card) => card.y)) - Math.min(...header.destinations.map((card) => card.y)),
      "the three garden destinations should line up in one deliberate row").toBeLessThanOrEqual(2);

    await page.getByRole("button", { name: "Heart game", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Mimi's Little Heart Garden" })).toBeVisible();
    await page.getByRole("button", { name: /Let's find some hearts/ }).click();
    const arena = await page.locator(".game-arena").boundingBox();
    expect(arena.height, "the heart arena should be sized for a laptop, not a giant desktop").toBeLessThanOrEqual(352);
    expect(arena.height).toBeGreaterThanOrEqual(245);
    await expectNoHorizontalOverflow(page, viewport.width, "laptop heart game");

    await page.getByRole("button", { name: "Love notes", exact: true }).click();
    await expect(page.getByRole("heading", { name: "The love collection" })).toBeVisible();
    const collection = await page.evaluate(() => {
      const grid = document.querySelector(".message-grid");
      return {
        documentWidth: document.documentElement.scrollWidth,
        columns: getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length,
        firstCard: grid.querySelector(".message-card")?.getBoundingClientRect().toJSON()
      };
    });
    expect(collection.documentWidth).toBeLessThanOrEqual(viewport.width);
    expect(collection.columns).toBe(3);
    expect(collection.firstCard.width).toBeGreaterThan(220);

    await page.getByRole("button", { name: "Birthday letter", exact: true }).click();
    await expect(page.getByRole("heading", { name: /Happy birthday, Malika/ })).toBeVisible();
    const finale = await page.evaluate(() => {
      const rect = (selector) => {
        const r = document.querySelector(selector).getBoundingClientRect();
        return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
      };
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        art: rect(".finale-top-art"),
        letter: rect(".finale-letter-wrap"),
        paper: rect(".letter-card")
      };
    });
    expect(finale.documentWidth).toBeLessThanOrEqual(viewport.width);
    expect(finale.art.right, "birthday art and letter should never collide").toBeLessThanOrEqual(finale.letter.x + 1);
    expect(finale.art.height).toBeLessThanOrEqual(392);
    expect(finale.paper.width).toBeGreaterThan(440);
  }
});

test("the Secret Arcade and mini-game overlays fit a standard 1366 by 768 laptop", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();

  for (const key of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
    await page.keyboard.press(key);
  }

  const gate = page.getByRole("dialog", { name: "A door only you can open" });
  await expect(gate).toBeVisible();
  await gate.getByLabel("The secret password").fill("iloveyou");
  await gate.getByRole("button", { name: "Unlock the Secret Arcade" }).click();

  const arcade = page.getByRole("dialog", { name: "The secret arcade" });
  await expect(arcade).toBeVisible();
  let bounds = await arcade.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(1366);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(768);
  await expectNoHorizontalOverflow(page, 1366, "laptop secret arcade");

  await arcade.getByRole("button", { name: /Firefly hunt/ }).click();
  await expect(page.locator(".egg-firefly-field")).toBeVisible();
  bounds = await page.getByRole("dialog", { name: "Firefly hunt" }).boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.y).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(1366);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(768);
  await expectNoHorizontalOverflow(page, 1366, "laptop firefly hunt");
});

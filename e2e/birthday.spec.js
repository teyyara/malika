import { test, expect } from "@playwright/test";

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
  await expect(page.getByLabel("Hearts collected: 7 of 7")).toBeVisible();

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

test("reduced-motion preference reaches the application shell", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".app-shell")).toHaveClass(/prefers-less-motion/);
});

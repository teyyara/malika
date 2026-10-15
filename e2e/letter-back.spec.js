import { test, expect } from "@playwright/test";

test("A Little Letter Back stays private, preserves the draft, and can be copied by its author", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (text) => { window.__letterBackClipboard = text; } }
    });
  });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Malika, this little universe is yours." })).toBeVisible();
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Love notes", exact: true }).click();

  const disclosure = page.locator(".letter-back-disclosure");
  await expect(page.getByRole("heading", { name: "The love collection" })).toBeVisible();
  await expect(disclosure).not.toHaveAttribute("open", "");
  await disclosure.locator("summary").click();
  await expect(page.getByText(/Nothing is sent or saved, and refreshing clears the draft/i)).toBeVisible();

  const draft = page.getByRole("textbox", { name: "Your letter to Zack" });
  const fold = page.getByRole("button", { name: "Fold my little letter" });
  await expect(fold).toBeDisabled();
  await page.getByRole("button", { name: "Add opening: A little wish for us" }).click();
  await expect(draft).toHaveValue("A little wish I have for us is…");
  await draft.fill("I hope we always make room for kind words, honest conversations, and little reasons to laugh.");
  await expect(page.locator(".letter-back-counter")).toHaveText(/\d+ \/ 800 characters/);
  await fold.click();

  const letter = page.getByRole("article", { name: "A little note for Zack" });
  await expect(letter).toBeVisible();
  await expect(letter).toContainText("Dear Zack,");
  await expect(letter).toContainText("I hope we always make room for kind words");
  await expect(letter).toContainText("With love,");
  await expect(letter).toContainText("Malika");

  await page.getByRole("button", { name: "Keep writing" }).click();
  await expect(draft).toHaveValue("I hope we always make room for kind words, honest conversations, and little reasons to laugh.");
  await draft.fill("A small note, written by me, to keep for the right moment.");
  await fold.click();
  await page.getByRole("button", { name: "Copy my letter" }).click();
  await expect(page.getByRole("status")).toContainText("Copied. Nothing was sent");
  const copied = await page.evaluate(() => window.__letterBackClipboard);
  expect(copied).toBe("Dear Zack,\n\nA small note, written by me, to keep for the right moment.\n\nWith love,\nMalika ♡");

  await page.setViewportSize({ width: 375, height: 812 });
  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    section: document.querySelector(".letter-back").getBoundingClientRect().toJSON(),
    summary: document.querySelector(".letter-back-disclosure > summary").getBoundingClientRect().toJSON(),
    letter: document.querySelector(".letter-back-envelope").getBoundingClientRect().toJSON()
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport);
  expect(layout.section.x).toBeGreaterThanOrEqual(0);
  expect(layout.section.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.summary.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.letter.right).toBeLessThanOrEqual(layout.viewport + 1);

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Malika, this little universe is yours." })).toBeVisible();
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Love notes", exact: true }).click();
  await expect(page.locator(".collection-meta")).toContainText("35 little keepsakes");
  const afterReload = page.locator(".letter-back-disclosure");
  await expect(afterReload).not.toHaveAttribute("open", "");
  await afterReload.locator("summary").click();
  await expect(page.getByRole("textbox", { name: "Your letter to Zack" })).toHaveValue("");
});

test("A Little Letter Back explains the local-only fallback when clipboard access is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
  });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Love notes", exact: true }).click();
  const disclosure = page.locator(".letter-back-disclosure");
  await disclosure.locator("summary").click();
  await page.getByRole("textbox", { name: "Your letter to Zack" }).fill("A few words from my heart.");
  await page.getByRole("button", { name: "Fold my little letter" }).click();
  await page.getByRole("button", { name: "Copy my letter" }).click();
  await expect(page.getByRole("status")).toContainText("select the letter above and copy it yourself");
});


test("letter starters never silently truncate a draft near its character limit", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Malika, this little universe is yours." })).toBeVisible();
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Love notes", exact: true }).click();

  const disclosure = page.locator(".letter-back-disclosure");
  await disclosure.locator("summary").click();
  const draft = page.getByRole("textbox", { name: "Your letter to Zack" });
  const starter = page.getByRole("button", { name: "Add opening: A small thank-you" });

  const almostFull = "x".repeat(795);
  await draft.fill(almostFull);
  await starter.click();
  await expect(draft).toHaveValue(almostFull);
  await expect(page.getByRole("status")).toContainText("nothing was removed");
  await expect(page.locator(".letter-back-starter-status")).toContainText("more character");

  await draft.fill("x".repeat(750));
  await starter.click();
  const updatedDraft = await draft.inputValue();
  expect(updatedDraft).toContain("\n\nSomething I want to thank you for is…");
  expect(updatedDraft.length).toBeLessThanOrEqual(800);
  await expect(page.locator(".letter-back-starter-status")).toHaveCount(0);
});

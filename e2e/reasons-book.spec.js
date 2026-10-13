import { test, expect } from "@playwright/test";

test("the birthday letter contains an optional 100-page book with working page controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Malika, this little universe is yours." })).toBeVisible();
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Birthday letter", exact: true }).click();

  const disclosure = page.locator(".reasons-book-disclosure");
  await expect(page.getByRole("heading", { name: /Happy birthday, Malika/ })).toBeVisible();
  await expect(disclosure).not.toHaveAttribute("open", "");
  await disclosure.locator("summary").click();

  const pageCount = page.locator(".reasons-book-page-count");
  const progress = page.getByRole("progressbar", { name: "Pages read in the little book" });
  const reason = page.locator(".reasons-book-reason");
  const previous = page.getByRole("button", { name: /Previous page/ });
  const next = page.getByRole("button", { name: /Next little reason/ });
  await expect(pageCount).toContainText("01");
  await expect(progress).toHaveAttribute("aria-valuenow", "1");
  await expect(previous).toBeDisabled();
  const firstReason = await reason.textContent();

  await next.click();
  await expect(pageCount).toContainText("02");
  await expect(progress).toHaveAttribute("aria-valuenow", "2");
  await expect(reason).not.toHaveText(firstReason);
  await previous.click();
  await expect(pageCount).toContainText("01");
  await expect(reason).toHaveText(firstReason);

  for (let i = 1; i < 100; i += 1) await next.click();
  await expect(pageCount).toContainText("100");
  await expect(progress).toHaveAttribute("aria-valuenow", "100");
  await expect(page.getByText(/That was the last page for now/)).toBeVisible();
  const beginAgain = page.getByRole("button", { name: /Begin again/ });
  await expect(beginAgain).toBeVisible();
  await beginAgain.click();
  await expect(pageCount).toContainText("01");
  await expect(progress).toHaveAttribute("aria-valuenow", "1");

  await page.setViewportSize({ width: 375, height: 812 });
  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    section: document.querySelector(".reasons-book").getBoundingClientRect().toJSON(),
    page: document.querySelector(".reasons-book-page").getBoundingClientRect().toJSON(),
    controls: document.querySelector(".reasons-book-controls").getBoundingClientRect().toJSON()
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport);
  expect(layout.section.x).toBeGreaterThanOrEqual(0);
  expect(layout.section.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.page.right).toBeLessThanOrEqual(layout.viewport + 1);
  expect(layout.controls.right).toBeLessThanOrEqual(layout.viewport + 1);
});

test("the reasons book resets when the birthday letter scene is left and revisited", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Birthday letter", exact: true }).click();
  const disclosure = page.locator(".reasons-book-disclosure");
  await disclosure.locator("summary").click();
  await page.getByRole("button", { name: /Next little reason/ }).click();
  await expect(page.locator(".reasons-book-page-count")).toContainText("02");
  await page.getByRole("button", { name: "The garden", exact: true }).click();
  await page.getByRole("button", { name: "Birthday letter", exact: true }).click();
  await expect(page.locator(".reasons-book-disclosure")).not.toHaveAttribute("open", "");
  await page.locator(".reasons-book-disclosure").locator("summary").click();
  await expect(page.locator(".reasons-book-page-count")).toContainText("01");
});

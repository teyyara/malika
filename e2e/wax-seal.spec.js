import { test, expect } from "@playwright/test";

async function openBirthdayLetter(page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await page.getByRole("button", { name: "Birthday letter", exact: true }).click();
  await expect(page.getByRole("heading", { name: /Happy birthday, Malika/ })).toBeVisible();
}

test("the wax seal reveals its extra note on the third tap, including keyboard activation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openBirthdayLetter(page);

  const seal = page.getByRole("button", { name: "Tap the wax seal three times to uncover a final secret" });
  const reveal = page.locator(".seal-secret-reveal");
  await expect(seal).toBeVisible();

  await seal.click();
  await seal.click();
  await expect(reveal).toHaveCount(0);

  await seal.press("Enter");
  await expect(reveal).toBeVisible();
  await expect(reveal).toContainText("Three careful taps");
  await expect(seal).toHaveAttribute("aria-label", "The wax seal's secret has been revealed");
  await expect(seal).toBeFocused();
});

test("the wax-seal reveal fits a 320px phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openBirthdayLetter(page);

  const seal = page.getByRole("button", { name: "Tap the wax seal three times to uncover a final secret" });
  for (let tap = 0; tap < 3; tap += 1) await seal.click();

  const reveal = page.locator(".seal-secret-reveal");
  await expect(reveal).toBeVisible();
  const dimensions = await reveal.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  }));
  expect(dimensions.scrollWidth, "the secret note must fit its own mobile card").toBeLessThanOrEqual(dimensions.clientWidth);

  const pageDimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth
  }));
  expect(pageDimensions.document, "the secret note must not cause page overflow").toBeLessThanOrEqual(pageDimensions.viewport);
});

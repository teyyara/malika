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

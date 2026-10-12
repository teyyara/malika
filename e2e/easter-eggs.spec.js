import { test, expect } from "@playwright/test";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

async function openArcade(page) {
  await page.goto("/");
  for (const key of KONAMI) await page.keyboard.press(key);
  await expect(page.getByRole("dialog", { name: "The secret arcade" })).toBeVisible();
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
  await expect(page.getByRole("status").filter({ hasText: "Star shower!" })).toBeVisible();
  await expect(page.locator(".egg-progress")).toHaveText("7 / 7 stars caught");
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

  await expect(page.getByRole("status").filter({ hasText: "Mimi remembers all the little things" })).toBeVisible();
  await expect(page.locator(".egg-progress")).toHaveText("3 / 3 matching pairs found");
});

test("the pawprint rhythm accepts the secret four-beat pattern", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Pawprint rhythm/ }).click();
  for (const symbol of ["Play pawprints", "Play moon", "Play purple heart", "Play sparkle"]) {
    await page.getByRole("button", { name: symbol }).click();
  }
  await expect(page.getByRole("status").filter({ hasText: "Mimi does a little victory dance" })).toBeVisible();
});

test("the firefly hunt catches five unique lights without a timer", async ({ page }) => {
  await openArcade(page);
  await page.getByRole("button", { name: /Firefly hunt/ }).click();
  const flies = page.getByRole("button", { name: /^Catch glowing firefly/ });
  for (let i = 0; i < 5; i += 1) await flies.first().click();
  await expect(page.getByRole("status").filter({ hasText: "garden is glowing a little brighter" })).toBeVisible();
  await expect(page.locator(".egg-progress")).toHaveText("5 / 5 fireflies caught");
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

  const footerStar = page.locator(".site-footer > span:last-child");
  for (let i = 0; i < 3; i += 1) await footerStar.click();
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
});


test("completing all five arcade quests unlocks the grand-secret finale", async ({ page }) => {
  await openArcade(page);

  await page.getByRole("button", { name: /Seven-star catcher/ }).click();
  const stars = page.getByRole("button", { name: /^Catch secret star/ });
  for (let i = 0; i < 7; i += 1) await stars.first().click();
  await expect(page.getByRole("status").filter({ hasText: "Star shower!" })).toBeVisible();
  await page.getByRole("button", { name: /Back to arcade/ }).click();

  await page.getByRole("button", { name: /Mimi's memory match/ }).click();
  for (const card of ["moon-a", "moon-b", "paw-a", "paw-b", "heart-a", "heart-b"]) {
    await page.getByRole("button", { name: "Turn over memory card " + card }).click();
  }
  await expect(page.getByRole("status").filter({ hasText: "Mimi remembers all the little things" })).toBeVisible();
  await page.getByRole("button", { name: /Back to arcade/ }).click();

  await page.getByRole("button", { name: /Pawprint rhythm/ }).click();
  for (const symbol of ["Play pawprints", "Play moon", "Play purple heart", "Play sparkle"]) {
    await page.getByRole("button", { name: symbol }).click();
  }
  await expect(page.getByRole("status").filter({ hasText: "Mimi does a little victory dance" })).toBeVisible();
  await page.getByRole("button", { name: /Back to arcade/ }).click();

  await page.getByRole("button", { name: /Firefly hunt/ }).click();
  const flies = page.getByRole("button", { name: /^Catch glowing firefly/ });
  for (let i = 0; i < 5; i += 1) await flies.first().click();
  await expect(page.getByRole("status").filter({ hasText: "garden is glowing a little brighter" })).toBeVisible();
  await page.getByRole("button", { name: /Back to arcade/ }).click();

  await page.getByRole("button", { name: /The little wish jar/ }).click();
  for (let i = 0; i < 5; i += 1) {
    await page.getByRole("button", { name: "Shake the wish jar" }).click();
  }
  await expect(page.getByRole("status").filter({ hasText: "All five wishes are yours" })).toBeVisible();
  await expect(page.locator(".egg-progress")).toHaveText("5 / 5 wishes revealed");
  await page.getByRole("button", { name: /Back to arcade/ }).click();

  await expect(page.getByRole("progressbar", { name: "Arcade games completed" })).toHaveAttribute("aria-valuenow", "5");
  await expect(page.getByText("You found every side quest")).toBeVisible();
  await page.getByRole("button", { name: "Open the grand secret" }).click();

  const grandSecret = page.getByRole("dialog", { name: "Keeper of Little Wonders" });
  await expect(grandSecret).toBeVisible();
  await expect(grandSecret).toContainText("The grand secret was never just the stars or the prizes");
});

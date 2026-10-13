import { test, expect } from "@playwright/test";

async function enterGarden(page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Malika, this little universe is yours." })).toBeVisible();
  await page.getByRole("button", { name: /Open your birthday surprise/ }).click();
  await expect(page.getByRole("heading", { name: /A garden full of little things/ })).toBeVisible();
}

test("Mimi has a tiny routine and responds through her own love language", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  await page.getByRole("tab", { name: "Mimi's little life" }).click();

  await expect(page.getByRole("heading", { name: "She has a whole tiny life of her own." })).toBeVisible();
  await expect(page.locator(".mimi-life-stage")).toBeVisible();
  await expect(page.locator(".mimi-life-stats")).toContainText("0 little notes found");
  await expect(page.locator(".mimi-life-message")).toContainText(/Mimi is keeping|Mimi has decided|Mimi just spotted|Mimi is saving/);

  await page.getByRole("button", { name: /Play with ribbon/ }).click();
  await expect(page.locator(".mimi-life-message")).toHaveText("Ribbon spotted. Dignity lost. Mimi has entered full zoomie mode.");
  await expect(page.locator(".mimi-life-stage")).toHaveClass(/mood-happy/);

  await page.getByRole("button", { name: /Tell her a secret/ }).click();
  await expect(page.locator(".mimi-life-message")).toContainText("Mimi slow-blinks");
  await expect(page.locator(".mimi-life-stage")).toHaveClass(/mood-love/);
});

test("prepared and custom wishes become glowing stars and stay in the sky while navigating", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  const sky = page.locator(".ambient-world");
  await expect(sky).toHaveAttribute("data-sky-mood", "twilight");
  await page.getByRole("tab", { name: "Wish sky" }).click();

  const draft = page.getByRole("textbox", { name: "Write a wish in your own words" });
  await page.getByRole("button", { name: /Tiny wonders/ }).click();
  await expect(draft).toHaveValue(/cats, unexpected kindness/i);

  await page.getByRole("button", { name: /Release into the sky/ }).click();
  await expect(page.locator(".released-wish-star")).toHaveCount(1);
  await expect(page.locator(".released-wish-list button")).toHaveCount(1);
  await expect(page.locator(".wish-selected-note")).toContainText("Released with love by Zack");
  await expect(sky).toHaveAttribute("data-wish-count", "1");
  await expect(sky).toHaveAttribute("data-sky-mood", "moonrise");

  await draft.fill("May Malika always find a reason to smile, even on an ordinary Tuesday.");
  await page.getByRole("button", { name: /Release into the sky/ }).click();
  await expect(page.locator(".released-wish-star")).toHaveCount(2);
  await expect(page.locator(".released-wish-list button")).toHaveCount(2);
  await expect(sky).toHaveAttribute("data-wish-count", "2");

  await page.getByRole("button", { name: /Birthday letter/ }).click();
  await page.getByRole("button", { name: /The garden/ }).click();
  await page.getByRole("tab", { name: "Wish sky" }).click();
  await expect(page.locator(".released-wish-star")).toHaveCount(2);
  await expect(page.locator(".released-wish-list")).toContainText("ordinary Tuesday");
});

test("the soundtrack player switches to distinct original mood arrangements and yields back to the garden", async ({ page }) => {
  await enterGarden(page);
  await page.getByRole("tab", { name: "Our soundtrack" }).click();

  await page.getByRole("button", { name: /Rain against the window/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-soundtrack-theme", "soundtrack-rainy-window");
  await expect(page.locator(".soundtrack-now-playing")).toContainText("Rain against the window");

  await page.getByRole("tab", { name: "Wish sky" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-soundtrack-theme", "soundtrack-rainy-window");
  await page.getByRole("tab", { name: "Our soundtrack" }).click();
  await expect(page.getByRole("button", { name: /Rain against the window/ })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /A sky full of stars/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-soundtrack-theme", "soundtrack-starlight");

  await page.getByRole("button", { name: /Pause our soundtrack/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-soundtrack-theme", "garden");
  await expect(page.locator(".soundtrack-now-playing")).toContainText("Choose a little soundtrack");
});

test("the keepsake picture can come alive and settle back into a still moment", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  await page.getByRole("tab", { name: "Living picture" }).click();

  const frame = page.locator(".living-picture-frame");
  await frame.click();
  await expect(frame).toHaveClass(/is-alive/);
  await expect(frame).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".living-picture-count")).toContainText("picture is awake");

  await page.getByRole("button", { name: "Let the moment rest" }).click();
  await expect(page.locator(".living-picture-frame")).not.toHaveClass(/is-alive/);
});

test("the grand finale awakens the universe sky and celebrates the wishes she released", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);
  await page.getByRole("tab", { name: "Wish sky" }).click();
  await page.getByRole("button", { name: /More laughter/ }).click();
  await page.getByRole("button", { name: /Release into the sky/ }).click();

  await page.getByRole("button", { name: /Birthday letter/ }).click();
  await page.getByRole("button", { name: /One last little surprise/ }).click();

  await expect(page.locator(".app-shell")).toHaveClass(/is-grand-finale/);
  await expect(page.locator(".ambient-world")).toHaveAttribute("data-sky-mood", "universe");
  await expect(page.getByRole("heading", { name: "Look what your little world has become." })).toBeVisible();
  await expect(page.locator(".extra-surprise")).toContainText("You sent 1 wish into the stars");
  await page.getByRole("button", { name: /Keep the little magic/ }).click();
  await expect(page.locator(".app-shell")).not.toHaveClass(/is-grand-finale/);
  await expect(page.locator(".ambient-world")).not.toHaveAttribute("data-sky-mood", "universe");
});

test("all companion panels stay inside laptop and phone viewports", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [{ width: 1366, height: 768 }, { width: 375, height: 812 }]) {
    await page.setViewportSize(viewport);
    await enterGarden(page);

    for (const tab of ["Mimi's little life", "Wish sky", "Our soundtrack", "Living picture"]) {
      await page.getByRole("tab", { name: tab }).click();
      const layout = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        panel: document.querySelector(".companion-panel")?.getBoundingClientRect().toJSON(),
        tabs: document.querySelector(".companion-tab-list")?.getBoundingClientRect().toJSON()
      }));
      expect(layout.document, tab + " must not cause horizontal overflow at " + viewport.width).toBeLessThanOrEqual(layout.viewport);
      expect(layout.panel.width).toBeGreaterThan(0);
      expect(layout.panel.x).toBeGreaterThanOrEqual(0);
      expect(layout.panel.right).toBeLessThanOrEqual(viewport.width + 1);
      expect(layout.tabs.right).toBeLessThanOrEqual(viewport.width + 1);
    }
  }
});


test("the love blossom grows with discoveries and reveals Zack's note when fully open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterGarden(page);

  const flower = page.locator(".interactive-flower");
  await expect(flower).toHaveAttribute("data-blossom-level", "0");

  await page.getByRole("tab", { name: "Wish sky" }).click();
  await page.getByRole("button", { name: /Tiny wonders/ }).click();
  await page.getByRole("button", { name: /Release into the sky/ }).click();
  await page.getByRole("button", { name: "The garden", exact: true }).click();
  await expect(flower).toHaveAttribute("data-blossom-level", "1");
  await flower.click();
  await expect(page.locator(".cat-reply")).toContainText("1 of 5 petals are awake");

  for (let wish = 0; wish < 2; wish += 1) {
    await page.getByRole("tab", { name: "Wish sky" }).click();
    await page.getByRole("button", { name: /Tiny wonders/ }).click();
    await page.getByRole("button", { name: /Release into the sky/ }).click();
  }

  await page.getByRole("button", { name: "Heart game", exact: true }).click();
  await page.getByRole("button", { name: /Let's find some hearts/ }).click();
  const hearts = page.getByRole("button", { name: /Collect purple heart/ });
  for (let count = 0; count < 7; count += 1) await hearts.first().click();

  await page.getByRole("button", { name: "The garden", exact: true }).click();
  await expect(flower).toHaveAttribute("data-blossom-level", "5");
  await expect(flower).toHaveAttribute("aria-label", /fully blossomed/);
  await flower.click();
  await expect(page.locator(".cat-reply")).toContainText("a hundred little reasons to smile");
});

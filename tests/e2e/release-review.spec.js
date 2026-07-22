const { expect, test } = require("@playwright/test");

test("ready state exposes the bounded release decision", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Make the decision visible." })).toBeVisible();
  await expect(page.locator('[data-state-view="ready"]')).toBeVisible();
  await expect(page.getByText("Independent sample - fictional data - not client work")).toBeVisible();
  await expect(page.getByText("One missing performance artifact prevents a clean ship decision.")).toBeVisible();
});

test("state controls expose loading, empty, and error behavior", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Empty" }).click();
  await expect(page.getByRole("heading", { name: "No requirements yet" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Empty state shown.");

  await page.getByRole("button", { name: "Error" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Error state shown.");

  await page.getByRole("button", { name: "Loading" }).click();
  await expect(page.locator('[aria-busy="true"]')).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Loading state shown.");
});

test("error retry moves focus to a visible control", async ({ page }) => {
  await page.goto("/?state=error");
  const retry = page.getByRole("button", { name: "Retry evidence request" });
  await retry.focus();

  await retry.click();

  await expect(page.locator('[aria-busy="true"]')).toBeVisible();
  await expect(page.getByRole("button", { name: "Loading" })).toBeFocused();
});

test("mobile layout does not create page-level horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});

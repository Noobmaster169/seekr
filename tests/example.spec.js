// @ts-check
import { test, expect } from '@playwright/test';
import { performCheckout, setupCookieDismissal } from '../src/AutoCheckout.js';

// Increase timeout for slow site
test.setTimeout(60000);

// Auto-dismiss cookie banner in the background for all tests
test.beforeEach(async ({ page }) => {
  setupCookieDismissal(page);
});

/*
test('has title', async ({ page }) => {
  await page.goto(currentLink);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/UNIQLO/);
});

test('add to cart', async ({ page }) => {
  await page.goto(currentLink);

  // Click the Add to Cart button
  await page.getByRole('button', { name: /add to cart/i }).click();
});*/

// ============================================
// TESTS
// ============================================

test('checkout with default config', async ({ page }) => {
  await performCheckout(page);
});

// Example: Test with custom options
/*
test('checkout different product', async ({ page }) => {
  await performCheckout(page, {
    productUrl: "https://www.uniqlo.com/my/en/products/ANOTHER-PRODUCT",
    size: "L",
    color: "Black",
  });
});
*/
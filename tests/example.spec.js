// @ts-check
import { test, expect } from '@playwright/test';

let currentLink = "https://www2.hm.com/en_my/productpage.1308114001.html";

// Increase timeout for slow Uniqlo site
test.setTimeout(60000);

// Auto-dismiss cookie banner in the background for all tests
test.beforeEach(async ({ page }) => {
  let dismissed = false;
  
  // Common cookie accept button selectors for different sites
  const cookieSelectors = [
    '#onetrust-accept-btn-handler',           // OneTrust (Uniqlo, etc.)
    'button[id*="accept"]',                   // Generic accept buttons
    'button:has-text("Accept all")',          // H&M, generic
    'button:has-text("Accept All")',          // H&M, generic
    'button:has-text("Accept cookies")',      // Generic
    'button:has-text("Allow all")',           // Generic
    'button:has-text("Allow all cookies")',   // H&M, generic
    '[data-testid="cookie-accept"]',          // Test IDs
  ];

  // Check for cookie banner every 200ms (faster detection)
  const intervalId = setInterval(async () => {
    if (dismissed) return;
    
    try {
      for (const selector of cookieSelectors) {
        const acceptButton = page.locator(selector).first();
        if (await acceptButton.isVisible().catch(() => false)) {
          await acceptButton.click();
          dismissed = true;
          clearInterval(intervalId);
          break;
        }
      }
    } catch {
      // Page might be navigating, ignore errors
    }
  }, 200);

  // Clean up interval when test ends
  page.on('close', () => clearInterval(intervalId));
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

test('checkout', async ({ page }) => {
  await page.goto(currentLink);

  // Click the Add to Cart button (matches "Add", "Add to cart", "Add to bag", etc.)
  await page.getByRole('button', { name: /add to (cart|bag|basket)|^add$/i }).click();

  // Short delay for popup to animate in
  await page.waitForTimeout(5000);

  // Wait for the "View Cart" button to appear in the popup
  await page.getByRole('button', { name: /view cart/i }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: /view cart/i }).click();

  // Wait for checkout button to be visible and ready on the cart page
  await page.getByRole('button', { name: /checkout/i }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: /checkout/i }).click();
});
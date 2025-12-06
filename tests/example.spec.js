// @ts-check
import { test, expect } from '@playwright/test';

let currentLink = "https://www.uniqlo.com/my/en/products/E474244-000?colorCode=COL69&sizeCode=SMA006";
let size = "0";      // e.g., "S", "M", "L", "XL", "32", "34", etc.
let color = "0"; // e.g., "Black", "White", "Blue", etc.

// Helper function for random delays (more human-like)
function randomDelay(min = 500, max = 1500) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Increase timeout for slow site
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

  // Wait for the page to load
  //await page.waitForLoadState('networkidle');

  // Select color if specified (clicks button/swatch containing the color name)
  /*if (color) {
    const colorOption = page.locator(`button:has-text("${color}"), [aria-label*="${color}" i], [title*="${color}" i], [data-color*="${color}" i]`).first();
    if (await colorOption.isVisible().catch(() => false)) {
      await colorOption.click();
    }
  }

  // Select size if specified (clicks button containing the size)
  if (size) {
    const sizeOption = page.locator(`button:has-text("${size}"), [aria-label*="${size}"], [data-size="${size}"]`).first();
    if (await sizeOption.isVisible().catch(() => false)) {
      await sizeOption.click();
    }
  }*/
  
  // Click the Add to Cart button (matches "Add", "Add to cart", "Add to bag", etc.)
  await page.getByRole('button', { name: /(add to (cart|bag|basket)|^add$)/i }).click();

  // Random delay for popup to animate in (2-5 seconds)
  await page.waitForTimeout(randomDelay(2000, 5000));

  // Wait for the "View Cart" button to appear in the popup
  await page.getByRole('button', { name: /view cart/i }).waitFor({ state: 'visible' });
  await page.waitForTimeout(randomDelay(300, 800)); // Small random delay before clicking
  await page.getByRole('button', { name: /view cart/i }).click();

  // Random delay before looking for checkout
  await page.waitForTimeout(randomDelay(1000, 2500));

  // Wait for checkout button to be visible and ready on the cart page
  await page.getByRole('button', { name: /checkout/i }).waitFor({ state: 'visible' });
  await page.waitForTimeout(randomDelay(300, 800)); // Small random delay before clicking
  await page.getByRole('button', { name: /checkout/i }).click();

  // Random delay for popup to animate in (2-5 seconds)
  await page.waitForTimeout(randomDelay(2000, 5000));

  // Check if login page appears, otherwise skip
  const loginVisible = await page.getByText(/log\s*in|sign\s*in/i).first().isVisible().catch(() => false);
  
  if (loginVisible) {
    // Fill in login details
    await page.waitForTimeout(randomDelay(500, 1000));
    
    // Find email field (try multiple selectors)
    const emailField = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]').first();
    await emailField.fill('yash.mahmud@gmail.com');
    
    // Find password field
    const passwordField = page.locator('input[type="password"]').first();
    await passwordField.fill('CursorTestThing!92');
    

    // Click login button - try many selectors
    const loginSelectors = [
      '[data-test*="login"]',                    // Uniqlo uses data-test attributes
      '[data-test*="submit"]',
      'button[type="submit"]',
      'input[type="submit"]',
      'button.login',
      '.login-button',
      '#login-button',
    ];
    
    let clicked = false;
    
    // First try: any element with login-related text
    const textButton = page.locator('button, a, [role="button"]').filter({ hasText: /^(log\s*in|sign\s*in)$/i }).first();
    if (await textButton.isVisible().catch(() => false)) {
      await textButton.click();
      clicked = true;
    }
    
    // If text-based didn't work, try the selectors
    if (!clicked) {
      for (const selector of loginSelectors) {
        const btn = page.locator(selector).first();
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          clicked = true;
          break;
        }
      }
    }
    
    if (!clicked) {
      throw new Error('Could not find login button');
    }
  }
  
  await page.waitForTimeout(randomDelay(1000, 2500));
});
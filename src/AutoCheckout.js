// Configuration
export const config = {
    productUrl: "https://www.uniqlo.com/my/en/products/E474244-000?colorCode=COL69&sizeCode=SMA006",
    size: "0",      // e.g., "S", "M", "L", "XL", "32", "34", etc.
    color: "0",     // e.g., "Black", "White", "Blue", etc.
    email: "yash.mahmud@gmail.com",
    password: "CursorTestThing!92",
  };
  
  // Helper function for random delays (more human-like)
  export function randomDelay(min = 500, max = 1500) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // ============================================
  // CHECKOUT FUNCTION
  // ============================================
  export async function performCheckout(page, options = {}) {
    const { productUrl, size, color, email, password } = { ...config, ...options };
  
    // Navigate to product page
    await page.goto(productUrl);
  
    // Select color if specified
    if (color && color !== "0") {
      const colorOption = page.locator(`button:has-text("${color}"), [aria-label*="${color}" i], [title*="${color}" i], [data-color*="${color}" i]`).first();
      if (await colorOption.isVisible().catch(() => false)) {
        await colorOption.click();
        await page.waitForTimeout(randomDelay(300, 600));
      }
    }
  
    // Select size if specified
    if (size && size !== "0") {
      const sizeOption = page.locator(`button:has-text("${size}"), [aria-label*="${size}"], [data-size="${size}"]`).first();
      if (await sizeOption.isVisible().catch(() => false)) {
        await sizeOption.click();
        await page.waitForTimeout(randomDelay(300, 600));
      }
    }
    
    // Click the Add to Cart button
    await page.getByRole('button', { name: /(add to (cart|bag|basket)|^add$)/i }).click();
  
    // Wait for popup
    await page.waitForTimeout(randomDelay(2000, 5000));
  
    // Click View Cart
    await page.getByRole('button', { name: /view cart/i }).waitFor({ state: 'visible' });
    await page.waitForTimeout(randomDelay(300, 800));
    await page.getByRole('button', { name: /view cart/i }).click();
  
    // Wait and click Checkout
    await page.waitForTimeout(randomDelay(1000, 2500));
    await page.getByRole('button', { name: /checkout/i }).waitFor({ state: 'visible' });
    await page.waitForTimeout(randomDelay(300, 800));
    await page.getByRole('button', { name: /checkout/i }).click();
  
    // Wait for login page
    await page.waitForTimeout(randomDelay(2000, 5000));
  
    // Handle login if needed
    const loginVisible = await page.getByText(/log\s*in|sign\s*in/i).first().isVisible().catch(() => false);
    
    if (loginVisible && email && password) {
      await page.waitForTimeout(randomDelay(500, 1000));
      
      // Fill email
      const emailField = page.locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]').first();
      await emailField.fill(email);
      
      // Fill password
      const passwordField = page.locator('input[type="password"]').first();
      await passwordField.fill(password);
  
      // Click login button
      const loginSelectors = [
        '[data-test*="login"]',
        '[data-test*="submit"]',
        'button[type="submit"]',
        'input[type="submit"]',
        'button.login',
        '.login-button',
        '#login-button',
      ];
      
      let clicked = false;
      
      // Try text-based button first
      const textButton = page.locator('button, a, [role="button"]').filter({ hasText: /^(log\s*in|sign\s*in)$/i }).first();
      if (await textButton.isVisible().catch(() => false)) {
        await textButton.click();
        clicked = true;
      }
      
      // Try other selectors
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
  }

  // Common cookie accept button selectors for different sites
  export const cookieSelectors = [
    '#onetrust-accept-btn-handler',           // OneTrust (Uniqlo, etc.)
    'button[id*="accept"]',                   // Generic accept buttons
    'button:has-text("Accept all")',          // H&M, generic
    'button:has-text("Accept All")',          // H&M, generic
    'button:has-text("Accept cookies")',      // Generic
    'button:has-text("Allow all")',           // Generic
    'button:has-text("Allow all cookies")',   // H&M, generic
    '[data-testid="cookie-accept"]',          // Test IDs
  ];

  // Helper function to setup cookie dismissal (for use in test.beforeEach)
  export function setupCookieDismissal(page) {
    let dismissed = false;
    
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
  }
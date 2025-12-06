// Configuration
export const config = {
    productUrl: "https://www.uniqlo.com/my/en/products/E453754-000?",
    size: "M",      // e.g., "S", "M", "L", "XL", "32", "34", etc.
    color: "0",     // e.g., "Black", "White", "Blue", etc.
    email: "yash.mahmud@gmail.com",
    password: "CursorTestThing!92",
  };
  
  // Helper function for random delays (more human-like)
  export function randomDelay(min = 500, max = 1500) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper function to check if error is due to heavy traffic
  function isHeavyTrafficError(error) {
    const errorMessage = error.message || error.toString();
    const heavyTrafficIndicators = [
      'timeout',
      'Navigation timeout',
      'net::ERR',
      '503',
      '429',
      'Service Unavailable',
      'Too Many Requests',
      'rate limit',
      'server error',
      'connection',
      'heavy traffic',
    ];
    
    return heavyTrafficIndicators.some(indicator => 
      errorMessage.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  // Helper function to throw heavy traffic error
  function throwHeavyTrafficError() {
    throw new Error('⚠️ Website is experiencing heavy traffic. Please try again later. The site may be slow or temporarily unavailable.');
  }
  
  // ============================================
  // CHECKOUT FUNCTION
  // ============================================
  export async function performCheckout(page, options = {}) {
    const { productUrl, size, color, email, password } = { ...config, ...options };

    try {
      // Navigate to product page
      await page.goto(productUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 
      });
    } catch (error) {
      // Check for heavy traffic indicators
      if (isHeavyTrafficError(error)) {
        throwHeavyTrafficError();
      }
      throw error;
    }
    
    try {
  
    // Select color if specified
    if (color && color !== "0") {
      try {
        await page.locator('[data-test="' + color + '"] label').filter({ hasText: color }).click();
      } catch (error) {
        console.error('Error selecting color: ' + error);
      }
    }
  
    // Select size if specified
    if (size && size !== "0") {
      await page.locator('[data-test="' + size + '"] label').filter({ hasText: size }).click();
    }

    await page.waitForTimeout(randomDelay(2000, 5000));
    
    // Click the Add to Cart button
    await page.getByRole('button', { name: /(add to (cart|bag|basket)|^add$)/i }).click();
  
    // Wait for popup
    await page.waitForTimeout(randomDelay(2000, 5000));
  
    // Click View Cart
    await page.getByRole('button', { name: /view cart/i }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: /view cart/i }).click();
  
    await page.waitForTimeout(randomDelay(300, 800));

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

      // Wait and click Checkout
      await page.waitForTimeout(randomDelay(1000, 2500));
      await page.getByRole('button', { name: /checkout/i }).waitFor({ state: 'visible' });
      await page.waitForTimeout(randomDelay(300, 800));
      await page.getByRole('button', { name: /checkout/i }).click();
    }
    
    // If address is found on page, click on "Continue to Payment"
    const addressFound = await page.getByText(/address/i).first().isVisible().catch(() => false);
    if (!addressFound) {
      await page.getByRole('button', { name: /register a new address/i }).waitFor({ state: 'visible' });
      await page.getByRole('button', { name: /register a new address/i }).click();
      await page.waitForTimeout(randomDelay(300, 800));

      // Fill in the address fields "First Name", "Last name", "Address 1", "Address 2", "City", "State", "Zip Code/Postal Code", "Country", "Phone", "Mobile Phone"
      await page.getByLabel('First Name').fill('John');
      await page.getByLabel('Last Name').fill('Doe');
      await page.getByLabel('Address 1').fill('Jalan Lagoon Selatan, Bandar Sunway');
      await page.getByLabel('Address 2').fill('Address Values');
      await page.getByLabel('City').fill('Subang Jaya');
      
      // Select the state from the dropdown
      await page.getByLabel('State Please select a state.').selectOption('Selangor');
      await page.waitForTimeout(randomDelay(300, 600)); // Wait for dropdown to open

      
      await page.waitForTimeout(randomDelay(3200, 3400));

      await page.getByRole('textbox', { name: 'Postal code' }).click();
      await page.getByRole('textbox', { name: 'Postal code' }).fill('47500');
      await page.getByRole('textbox', { name: 'Phone', exact: true }).click();
      await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('143472169');
      await page.getByRole('textbox', { name: 'Mobile phone' }).click();
      await page.getByRole('textbox', { name: 'Mobile phone' }).fill('143472169');
      await page.locator('[data-test="register-button"]').click();

    }

    await page.getByRole('button', { name: /continue to payment/i }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: /continue to payment/i }).click();

    await page.waitForTimeout(randomDelay(1000, 2500));

    // Select "Ship to address" or "Click & Collect" depending on the settings (its a single choice)
    const shipToAddress = await page.getByRole('button', { name: /ship to address/i }).isVisible().catch(() => false);
    if (shipToAddress) {
      await page.getByRole('button', { name: /ship to address/i }).click();
    }
    else {
      await page.getByRole('button', { name: /click & collect/i }).click();
    }

    await page.waitForTimeout(randomDelay(1000, 2500));

    // Click on "Continue to Payment"
    await page.locator('[data-test="continue-to-payment-button"]').click();
    await page.locator('[data-test="continue-to-payment-button"]').click();

    await page.waitForTimeout(randomDelay(1000, 2500));

    await page.locator('[data-test="continue-to-payment-button"]').click();

    await page.waitForTimeout(randomDelay(1000, 2500));

    await page.locator('[data-test="credit-card-type"]').click();
    await page.locator('label').filter({ hasText: 'Online Banking' }).click();
    await page.getByLabel('Bank name Please selectAffin').selectOption('fpx_mb2u');

    await page.waitForTimeout(randomDelay(1000, 2500));

    await page.locator('[data-test="continue-button"]').click();
    await page.waitForTimeout(randomDelay(1000, 2500));
    await page.locator('[data-test="place-order-button"]').click();
    await page.waitForTimeout(randomDelay(1000, 2500));
    await page.getByRole('textbox').click();
    await page.getByRole('textbox').fill('MaybankUsername');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox').fill('MaybankPassword');
    await page.getByRole('textbox').press('Enter');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('combobox').selectOption('MaybankAccountNumber');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByRole('button', { name: 'I\'ve approved/rejected my' }).click();
    
    } catch (error) {
      // Check for heavy traffic indicators throughout the checkout process
      if (isHeavyTrafficError(error)) {
        throwHeavyTrafficError();
      }
      // Re-throw other errors as-is
      throw error;
    }
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
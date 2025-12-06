import { chromium } from '@playwright/test';

async function scrapeUniqloProductOptions(productId) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    const url = `https://www.uniqlo.com/my/en/products/${productId}`;
    
    console.log(`🔍 Fetching: ${url}`);
    
    // Navigate to the page and wait for it to load
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for the product info to load
    console.log('⏳ Waiting for page to render...');
    await page.waitForSelector('[name="product-color-picker"]', { timeout: 15000 });
    console.log('✓ Page loaded!');
    
    // Scrape color options
    const colorOptions = await page.$$eval('[name="product-color-picker"]', (inputs) => {
      return inputs.map((input) => {
        const inputId = input.id;
        const label = document.querySelector(`label[for="${inputId}"]`);
        
        if (label) {
          const colorNameEl = label.querySelector('.fr-implicit');
          const colorName = colorNameEl ? colorNameEl.textContent.trim() : '';
          const colorValue = input.value || '';
          const style = label.getAttribute('style') || '';
          
          // Extract URL from background-image style
          let iconUrl = '';
          const match = style.match(/background-image:\s*url\(["\']?(.+?)["\']?\)/);
          if (match) {
            iconUrl = match[1];
          }
          
          return {
            name: colorName,
            value: colorValue,
            iconUrl: iconUrl
          };
        }
        return null;
      }).filter(Boolean);
    });
    
    // Scrape size options
    const sizeOptions = await page.$$eval('[name="product-size-picker"]', (inputs) => {
      return inputs.map((input) => {
        const inputId = input.id;
        const label = document.querySelector(`label[for="${inputId}"]`);
        
        if (label) {
          const sizeTextEl = label.querySelector('.fr-chip-text');
          const sizeText = sizeTextEl ? sizeTextEl.textContent.trim() : '';
          const sizeValue = input.value || '';
          
          // Check if size is unavailable (has strikethrough icon)
          const hasStrikethrough = label.querySelector('.chip-strikethrough-icon') !== null;
          const isAvailable = !hasStrikethrough;
          
          return {
            name: sizeText,
            value: sizeValue,
            available: isAvailable
          };
        }
        return null;
      }).filter(Boolean);
    });
    
    await browser.close();
    
    return {
      success: true,
      productId: productId,
      url: url,
      colors: colorOptions,
      sizes: sizeOptions
    };
    
  } catch (error) {
    await browser.close();
    console.error('Error scraping Uniqlo product:', error);
    return {
      success: false,
      error: error.message,
      productId: productId
    };
  }
}

// Test function
async function runTest() {
  console.log('🧪 Testing Uniqlo Product Scraper (with Playwright)\n');
  console.log('='.repeat(50));
  
  const productId = process.argv[2] || 'E465191-000';
  
  console.log(`\n📦 Product ID: ${productId}\n`);
  
  const result = await scrapeUniqloProductOptions(productId);
  
  if (result.success) {
    console.log('✅ SUCCESS!\n');
    console.log('='.repeat(50));
    console.log(`\n🎨 Colors Found: ${result.colors.length}`);
    result.colors.forEach((color, idx) => {
      console.log(`  ${idx + 1}. ${color.name} (${color.value})`);
      console.log(`     Icon: ${color.iconUrl}`);
    });
    
    console.log(`\n📏 Sizes Found: ${result.sizes.length}`);
    const availableSizes = result.sizes.filter(s => s.available);
    const unavailableSizes = result.sizes.filter(s => !s.available);
    
    console.log(`\n  ✓ Available (${availableSizes.length}):`);
    availableSizes.forEach(size => {
      console.log(`    - ${size.name} (${size.value})`);
    });
    
    if (unavailableSizes.length > 0) {
      console.log(`\n  ✗ Out of Stock (${unavailableSizes.length}):`);
      unavailableSizes.forEach(size => {
        console.log(`    - ${size.name} (${size.value})`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('\n📄 Full JSON Response:');
    console.log(JSON.stringify(result, null, 2));
    
  } else {
    console.log('❌ FAILED!\n');
    console.log(`Error: ${result.error}`);
    console.log('\nFull response:');
    console.log(JSON.stringify(result, null, 2));
  }
}

// Run the test
runTest().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});

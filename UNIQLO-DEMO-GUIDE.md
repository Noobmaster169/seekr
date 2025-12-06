# 🛍️ Uniqlo Product Demo Guide

This demo showcases the integration of real-time Uniqlo product scraping with an interactive shopping interface.

## 🎯 What This Demo Does

1. **Scrapes Live Uniqlo Data** - Fetches real product information from Uniqlo Malaysia website
2. **Interactive Color Selection** - Displays all available colors with their actual product icons
3. **Size Availability** - Shows which sizes are in stock and which are out of stock
4. **Purchase Flow** - Simulates a complete shopping experience
5. **Direct Link to Uniqlo** - Redirects to the exact product page with selected options

## 📁 Files Created

### Components
- **`src/components/UniqloDemo.jsx`** - Main demo component that orchestrates the flow
- **`src/components/ItemSelection.jsx`** - Updated to support Uniqlo color icons and size availability
- **`src/components/ItemConfirmation.jsx`** - Updated to display Uniqlo product details

### Utils
- **`utils/scraper/index.js`** - Browser-compatible scraper function
- **`test-scraper-playwright.js`** - Test script using Playwright

### Demo Page
- **`uniqlo-demo.html`** - Standalone HTML page for testing

## 🚀 How to Run the Demo

### Option 1: Using Vite Dev Server

1. Start the dev server:
```bash
npm run dev
```

2. Navigate to the Uniqlo demo page:
```
http://localhost:5173/uniqlo-demo.html
```

### Option 2: Add to Existing App

Import the UniqloDemo component in your app:

```javascript
import UniqloDemo from './src/components/UniqloDemo.jsx';

// In your component
<UniqloDemo />
```

## 🎨 Features Demonstrated

### 1. Real-Time Scraping
The demo fetches live data from:
```
https://www.uniqlo.com/my/en/products/E465191-000
```

Product: **DRY-EX Crew Neck T-shirt | Short Sleeve**

### 2. Color Selection with Icons
- Displays 8 color options with actual Uniqlo product chip icons
- Colors: WHITE, GRAY, DARK GRAY, BLACK, RED, ORANGE, GREEN, BLUE
- Visual selection with check marks

### 3. Size Availability
- Shows all 8 sizes: XS, S, M, L, XL, XXL, 3XL, 4XL
- Available sizes are clickable
- Out-of-stock sizes are:
  - Grayed out
  - Strikethrough text
  - "Out" badge indicator
  - Cannot be selected

### 4. Purchase Flow
```
Loading → Selection → Confirmation → Redirect to Uniqlo
```

### 5. Uniqlo Redirect
When confirmed, opens Uniqlo with exact product URL:
```
https://www.uniqlo.com/my/en/products/E465191-000?colorDisplayCode=09&sizeDisplayCode=003
```
- `colorDisplayCode` = selected color value
- `sizeDisplayCode` = selected size value

## 🔧 Technical Implementation

### Scraper Function
```javascript
// From utils/scraper/index.js
const result = await scrapeUniqloProductOptions('E465191-000');

// Returns:
{
  success: true,
  productId: "E465191-000",
  url: "https://www.uniqlo.com/my/en/products/E465191-000",
  colors: [
    { name: "WHITE", value: "00", iconUrl: "https://..." },
    // ... more colors
  ],
  sizes: [
    { name: "XS", value: "002", available: true },
    { name: "M", value: "004", available: false },
    // ... more sizes
  ]
}
```

### Data Transformation
The `UniqloDemo` component transforms scraped data to match UI requirements:

```javascript
colors: result.colors.map(color => ({
  name: color.name,
  value: color.value,
  iconUrl: color.iconUrl,  // Uniqlo product chip icon
  hex: getColorHex(color.name)  // Fallback hex color
}))

sizes: result.sizes.map(size => ({
  name: size.name,
  value: size.value,
  available: size.available
}))
```

### Component Updates

#### ItemSelection.jsx
- **Color Icons**: Checks for `color.iconUrl` and displays image instead of colored circle
- **Size Availability**: Disables unavailable sizes and shows "Out" badge

#### ItemConfirmation.jsx
- **Color Display**: Shows icon in confirmation summary
- **Size Format**: Handles both string and object size formats

## 🧪 Testing

### Test with Playwright (Recommended)
```bash
node test-scraper-playwright.js
```

This will:
1. Launch a headless Chromium browser
2. Navigate to the Uniqlo product page
3. Wait for dynamic content to load
4. Scrape color and size data
5. Display formatted results

### Expected Output
```
🧪 Testing Uniqlo Product Scraper (with Playwright)

📦 Product ID: E465191-000

🎨 Colors Found: 8
  1. WHITE (00)
  2. GRAY (03)
  ...

📏 Sizes Found: 8
  ✓ Available (4):
    - XS (002)
    - S (003)
    - XL (006)
    - XXL (007)

  ✗ Out of Stock (4):
    - M (004)
    - L (005)
    - 3XL (008)
    - 4XL (009)
```

## 🎮 User Flow

### Step 1: Loading Screen
- Animated spinner
- "Loading Uniqlo Product..." message
- Fetches data in background

### Step 2: Product Selection
- Product image and details
- 8 color options with icons
- Size selector with availability
- Quantity selector
- Continue button (enabled when color + size selected)

### Step 3: Confirmation
- Review selected options
- Color chip icon displayed
- Size and quantity summary
- Total price calculation
- "Confirm & Go to Store" button

### Step 4: Redirect
- Opens Uniqlo page in new tab
- Pre-filled with selected color and size
- User can complete purchase on Uniqlo

## 🛠️ Customization

### Change Product
Edit `UniqloDemo.jsx`:
```javascript
const DEMO_PRODUCT_ID = 'E465191-000';  // Change this
const DEMO_PRODUCT_NAME = 'Your Product Name';
const DEMO_PRODUCT_PRICE = 49.90;
const DEMO_PRODUCT_IMAGE = 'https://...';
```

### Add More Products
Create a product carousel:
```javascript
const products = [
  { id: 'E465191-000', name: 'T-Shirt' },
  { id: 'E469158-000', name: 'Jacket' },
];
```

## 📊 Browser Compatibility

The scraper uses:
- **DOMParser** - Available in all modern browsers
- **fetch()** - Native browser API
- **querySelector/All** - Standard DOM methods

No external dependencies required for production!

## ⚠️ Important Notes

1. **CORS**: The scraper fetches HTML directly. Uniqlo must allow CORS or use a proxy
2. **Dynamic Content**: Some products load data via JavaScript, so scraping static HTML may not work for all products
3. **Rate Limiting**: Don't spam requests to Uniqlo servers
4. **Data Structure**: Uniqlo may change their HTML structure, requiring scraper updates

## 🔍 Troubleshooting

### No Colors/Sizes Found
- Check if product page structure has changed
- Verify product ID is correct
- Check browser console for errors

### CORS Errors
- Run through a local dev server (not file://)
- Use browser extension context (has elevated permissions)
- Consider using a proxy server

### Page Not Loading
- Check internet connection
- Verify Uniqlo website is accessible
- Increase timeout in scraper settings

## 🚀 Next Steps

1. **Add More Products** - Create a catalog of Uniqlo items
2. **Search Functionality** - Let users input product IDs
3. **Favorites** - Save favorite color/size combinations
4. **Price Tracking** - Monitor price changes
5. **Stock Alerts** - Notify when out-of-stock items return

## 📝 Example Usage in Extension

```javascript
// In your Chrome extension content script
import { scrapeUniqloProductOptions } from './utils/scraper/index.js';

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'scrapeProduct') {
    const result = await scrapeUniqloProductOptions(request.productId);
    sendResponse(result);
  }
});
```

## 🎉 Demo Product Details

- **Product**: DRY-EX Crew Neck T-shirt | Short Sleeve
- **ID**: E465191-000
- **Price**: RM 49.90
- **Colors**: 8 options
- **Sizes**: XS to 4XL
- **Features**: Quick-drying, recycled materials

---

**Built with ❤️ using React, Vite, Framer Motion, and Tailwind CSS**

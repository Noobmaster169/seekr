# 🛍️ Uniqlo Carousel Integration Guide

## Overview

The Uniqlo product is now integrated into the main shopping carousel! When users select it, the app dynamically fetches live product data (colors and sizes) from Uniqlo Malaysia's website.

## 🎯 How It Works

### Step 1: Product Carousel
- Uniqlo T-shirt appears as the **first item** in the carousel
- Shows "UNIQLO" badge in red
- Displays "RM 49.90" (Malaysian Ringgit)
- Static product image and info

### Step 2: User Selects Uniqlo Product
- User clicks "Select This Product"
- App navigates to ItemSelection view

### Step 3: Dynamic Data Loading
- **Loading overlay** appears with spinner
- Message: "Loading Uniqlo Data... Fetching colors and sizes"
- App calls `scrapeUniqloProductOptions('E465191-000')`
- Fetches live data from: `https://www.uniqlo.com/my/en/products/E465191-000`

### Step 4: Data Display
- **Loading completes** (usually 2-5 seconds)
- "UNIQLO LIVE" badge appears in top-right
- **8 Color Options** with actual Uniqlo product chip images:
  - WHITE, GRAY, DARK GRAY, BLACK, RED, ORANGE, GREEN, BLUE
- **8 Size Options** with live availability:
  - ✅ Available: XS, S, XL, XXL (clickable)
  - ❌ Out of Stock: M, L, 3XL, 4XL (grayed out, strikethrough)

### Step 5: User Selection
- User picks a color (sees actual product color chip)
- User picks an available size (unavailable ones can't be selected)
- Adjusts quantity
- Clicks "Continue to Confirmation"

### Step 6: Confirmation
- Reviews selection with color icon
- Shows selected size and total price
- Clicks "Confirm & Go to Store"

### Step 7: Redirect to Uniqlo
- Opens Uniqlo website in **new tab**
- URL includes selected options:
  ```
  https://www.uniqlo.com/my/en/products/E465191-000?colorDisplayCode=09&sizeDisplayCode=003
  ```
- User can complete purchase directly on Uniqlo

---

## 📁 Modified Files

### 1. `ShopDemo.jsx`
**Added:**
- Uniqlo product as first item in `demoProducts` array
- Product has `isUniqlo: true` flag
- Product has `uniqloProductId: 'E465191-000'`
- Updated `handleFinalConfirm` to build and open Uniqlo URL

### 2. `ItemSelection.jsx`
**Added:**
- `useEffect` hook to detect Uniqlo products
- `loadUniqloData()` function to fetch scraped data
- Loading state with animated overlay
- Error handling with notification
- "UNIQLO LIVE" badge
- Dynamic color and size population

### 3. `ItemCarousel.jsx`
**Added:**
- "UNIQLO" badge on carousel item
- RM currency display for Uniqlo products

### 4. `ItemConfirmation.jsx`
**Already updated to:**
- Show color icons
- Handle object-based sizes

---

## 🎨 Visual Features

### Uniqlo Indicators
1. **Carousel Badge**: Red "UNIQLO" tag on product card
2. **Live Badge**: "UNIQLO LIVE" badge in selection view
3. **Currency**: Shows "RM" instead of "$"
4. **Loading Overlay**: Full-screen with spinner animation
5. **Color Icons**: Real Uniqlo product chip images
6. **Size Status**: Visual indicators for stock availability

### Error Handling
- If scraping fails, shows error notification at bottom
- Falls back to basic product data
- User can dismiss error and continue

---

## 🚀 Testing the Integration

### Run the Demo
```bash
npm run dev
```

### Test Flow
1. Open `http://localhost:5173/` (or your main app)
2. Look for ShopDemo component
3. See Uniqlo T-shirt as first item in carousel
4. Click "Select This Product"
5. Watch loading animation
6. See live colors and sizes populate
7. Select color and size
8. Confirm and watch redirect to Uniqlo

---

## 📊 Data Flow Diagram

```
ItemCarousel (Static Data)
      ↓
  [User Clicks]
      ↓
ItemSelection
      ↓
  [Detects isUniqlo]
      ↓
[Shows Loading Overlay]
      ↓
scrapeUniqloProductOptions()
      ↓
  [Fetches from Uniqlo]
      ↓
[Transforms Data]
      ↓
[Updates UI with Live Data]
      ↓
[User Makes Selection]
      ↓
ItemConfirmation
      ↓
[User Confirms]
      ↓
[Opens Uniqlo URL]
```

---

## 🔧 Customization

### Add More Uniqlo Products

In `ShopDemo.jsx`, add to `demoProducts`:
```javascript
{
  id: 'uniqlo-E469158-000',
  title: 'Product Name',
  price: 59.90,
  description: 'Product description',
  image: 'https://image.uniqlo.com/...',
  isUniqlo: true,
  uniqloProductId: 'E469158-000',
  colors: [],
  sizes: [],
}
```

### Change Product ID

Edit in `ShopDemo.jsx`:
```javascript
uniqloProductId: 'YOUR-PRODUCT-ID',
```

### Adjust Loading Timeout

In `utils/scraper/index.js`, modify fetch timeout if needed.

---

## ⚠️ Important Notes

### Browser Compatibility
- Requires modern browser with `fetch()` and `DOMParser`
- Best tested in Chrome/Edge

### CORS Considerations
- May encounter CORS issues in some environments
- Works in browser extension context
- May need proxy for production

### Data Freshness
- Scrapes live data each time product is selected
- Reflects real-time stock availability
- Colors and sizes update dynamically

### Performance
- Loading takes 2-5 seconds depending on network
- User sees loading indicator
- Non-blocking UI

---

## 🐛 Troubleshooting

### "Failed to load live data"
- **Cause**: Network error or Uniqlo structure changed
- **Solution**: Check console for details, verify product ID exists

### Colors/Sizes Not Showing
- **Cause**: Scraper returned empty arrays
- **Solution**: Test with `node test-scraper-playwright.js` to verify

### Loading Forever
- **Cause**: Network timeout or CORS block
- **Solution**: Check network tab, verify Uniqlo is accessible

### Can't Select Sizes
- **Cause**: All sizes out of stock or scraper error
- **Solution**: Try different product or check Uniqlo website

---

## 💡 Tips

1. **Test with Playwright first**: Run `node test-scraper-playwright.js` to verify scraper works
2. **Check console logs**: Lots of debug info printed during scraping
3. **Network tab**: Watch for fetch requests to Uniqlo
4. **Try different browsers**: Chrome works best for development

---

## 🎉 Features Comparison

| Feature | Regular Products | Uniqlo Product |
|---------|-----------------|----------------|
| **Data Source** | Hardcoded | Live scraping |
| **Colors** | Static hex | Real product chips |
| **Sizes** | All available | Live stock status |
| **Loading** | Instant | 2-5 seconds |
| **Currency** | $ | RM |
| **Redirect** | Alert | Opens Uniqlo |
| **Badge** | None | "UNIQLO" + "LIVE" |

---

## 📝 Example User Experience

### Regular Product
```
Select → Choose options → Confirm → Alert message
```

### Uniqlo Product
```
Select → Loading... → Live colors/sizes → Choose → Confirm → Opens Uniqlo website
```

---

## 🚀 Next Steps

1. **Add More Products**: Include other Uniqlo items in carousel
2. **Favorites**: Let users save favorite combinations
3. **Price Comparison**: Compare Uniqlo prices across products
4. **Stock Alerts**: Notify when out-of-stock items return
5. **Reviews Integration**: Fetch and display Uniqlo reviews

---

**Built with ❤️ using React, Vite, Framer Motion, and live web scraping**

Enjoy the seamless Uniqlo shopping experience! 🛍️

# 🚀 Quick Start: Uniqlo Demo

## Run the Demo in 3 Steps

### 1. Start Development Server
```bash
npm run dev
```

### 2. Open Browser
Navigate to: **http://localhost:5173/uniqlo-demo.html**

### 3. Test the Flow
1. Wait for product data to load
2. Select a color (click on any color chip)
3. Select an available size (unavailable ones are grayed out)
4. Adjust quantity if needed
5. Click "Continue to Confirmation"
6. Review your selection
7. Click "Confirm & Go to Store"
8. Opens Uniqlo website in new tab with your selection

---

## Alternative: Test Scraper Only

```bash
node test-scraper-playwright.js
```

This will show you the scraped data without running the UI.

---

## What You'll See

### Product Info
- **Name**: DRY-EX Crew Neck T-shirt
- **Price**: RM 49.90
- **Colors**: 8 options with real Uniqlo color chip images
- **Sizes**: XS, S, M, L, XL, XXL, 3XL, 4XL
  - Available: XS, S, XL, XXL ✅
  - Out of Stock: M, L, 3XL, 4XL ❌

### Features
- ✨ Real-time scraping from Uniqlo Malaysia
- 🎨 Actual product color icons
- 📏 Live stock availability
- 🛒 Direct link to complete purchase
- 💫 Beautiful animations and transitions

---

## Troubleshooting

**Port already in use?**
```bash
# Kill existing process or use different port
npm run dev -- --port 5174
```

**Can't see the page?**
- Make sure dev server is running
- Check URL is correct: `localhost:5173/uniqlo-demo.html`
- Try clearing browser cache

**No data loading?**
- Check browser console for errors
- Verify internet connection
- Uniqlo website must be accessible

---

## File Structure

```
plugin/
├── src/
│   └── components/
│       ├── UniqloDemo.jsx           ← Main demo component
│       ├── ItemSelection.jsx         ← Updated with Uniqlo support
│       └── ItemConfirmation.jsx      ← Updated with icon support
├── utils/
│   └── scraper/
│       ├── index.js                  ← Browser scraper
│       └── README.md                 ← Scraper docs
├── uniqlo-demo.html                  ← Demo page
├── test-scraper-playwright.js        ← Test script
└── UNIQLO-DEMO-GUIDE.md             ← Full documentation
```

Enjoy the demo! 🎉

# 🔧 Fix: Popup Not Showing

## If the popup is blank or not appearing:

### Step 1: Check Extension Errors
1. Go to `chrome://extensions/`
2. Find "Seekr - Instagram Reel Product Detector"
3. Click "Errors" or "Inspect views: popup.html"
4. Check for any red error messages
5. Share the errors if you see any

### Step 2: Reload Extension
1. In `chrome://extensions/`
2. Click the **reload icon** (circular arrow) on the Seekr extension
3. Close any open popup
4. Click the extension icon again

### Step 3: Check Console
1. Right-click the extension icon
2. Select "Inspect popup" (if available)
3. Or: Click extension icon → Right-click in popup → Inspect
4. Check Console tab for errors

### Step 4: Verify Files
Make sure these files exist in `dist/`:
- ✅ `popup.html`
- ✅ `popup.js`
- ✅ `manifest.json`

### Step 5: Complete Reset
1. Remove extension from `chrome://extensions/`
2. Close Chrome completely
3. Rebuild: `npm run build:extension`
4. Reopen Chrome
5. Load extension from `dist/` folder

---

## Expected Popup UI

When you click the extension icon, you should see:

```
┌─────────────────────────────────┐
│ 🔍 Seekr                        │
│ Instagram Reel Product Detector │
│                                 │
│ Instagram Reel URL              │
│ [___________________________]   │
│                                 │
│ [🔍 Detect Products]           │
│                                 │
│ ● Ready  [No API Key]           │
│                                 │
│ Configure Claude API Key        │
└─────────────────────────────────┘
```

If you see a blank popup or nothing at all, check the browser console for errors!


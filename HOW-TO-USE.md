# 🎯 How to Use Seekr Extension

## ⚠️ Important: The Extension Has TWO Parts

### 1. **Content Script** (What you see in console)
- Runs on web pages automatically
- Extracts Instagram Reel data when needed
- **You don't interact with this directly**

### 2. **Popup UI** (What you click to use)
- Appears when you click the extension icon
- This is where you paste URLs and see results
- **This is what you need to access!**

---

## 📍 How to Access the Popup

### Step 1: Find the Extension Icon
1. Look at your browser toolbar (top right)
2. Find the **Seekr extension icon** (🔍 or puzzle piece icon)
3. If you don't see it, click the **puzzle piece icon** (extensions menu)
4. Pin "Seekr" to your toolbar

### Step 2: Click the Icon
1. **Click the Seekr extension icon**
2. A popup window should appear below/above the icon
3. This is the "Seekr" product detector UI

### Step 3: If Popup Doesn't Appear
1. **Check for errors:**
   - Right-click the extension icon
   - Select "Inspect popup" (if available)
   - Check Console for errors

2. **Or check extension page:**
   - Go to `chrome://extensions/`
   - Find "Seekr"
   - Click "Inspect views: popup.html"
   - Check for errors

---

## 🎨 What the Popup Should Look Like

When you click the extension icon, you should see a popup with:

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

---

## 🔧 If Popup is Blank or Missing

### Check 1: Extension is Enabled
- Go to `chrome://extensions/`
- Make sure "Seekr" is **enabled** (toggle is ON)

### Check 2: Reload Extension
- In `chrome://extensions/`
- Click the **reload icon** (circular arrow) on Seekr
- Try clicking the icon again

### Check 3: Check for Errors
- Right-click extension icon → "Inspect popup"
- Or: `chrome://extensions/` → "Inspect views: popup.html"
- Look for red error messages

### Check 4: Verify Files
Make sure these exist in `dist/`:
- ✅ `popup.html`
- ✅ `popup.js`
- ✅ `manifest.json`

---

## 📝 Usage Steps

1. **Open Instagram Reel** in a browser tab
2. **Click Seekr extension icon** (in toolbar)
3. **Paste Reel URL** in the input field
4. **Click "Detect Products"**
5. **View results** in the popup

---

## 🐛 Common Issues

### "Extension icon not visible"
- Click puzzle piece icon → Pin "Seekr"

### "Popup is blank"
- Check console for errors
- Reload extension
- Rebuild: `npm run build:extension`

### "Nothing happens when I click"
- Check if extension is enabled
- Check for errors in popup console

---

**The console logs you see are normal - they're from the content script. The popup appears when you click the extension icon!**


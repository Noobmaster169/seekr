# 🔧 Troubleshooting - UI Not Showing Input Fields

## Problem: Can't see Instagram Reel URL input or Claude API Key settings

## ✅ Solution Steps

### Step 1: Reload the Extension

1. **Open Chrome Extensions Page:**
   - Go to `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage Extensions

2. **Find "Seekr - Instagram Reel Product Detector"**

3. **Click the Reload/Refresh Icon** (circular arrow icon)
   - This reloads the extension with the latest code
   - **IMPORTANT:** Do this after every code change!

4. **Close and Reopen the Popup:**
   - Close the extension popup if it's open
   - Click the extension icon again to reopen

### Step 2: Check What You Should See

When you click the extension icon, you should see:

1. **Title:** "Seekr" with 🔍 icon
2. **Subtitle:** "Instagram Reel Product Detector"
3. **Input Field:** "Instagram Reel URL" with placeholder text
4. **Button:** "Detect Products" button
5. **Status Bar:** Shows "Ready" and "No API Key" (red badge)
6. **Link at Bottom:** "Configure Claude API Key"

### Step 3: If Still Not Visible

**Check Browser Console for Errors:**
1. Right-click the extension popup
2. Select "Inspect" or "Inspect Popup"
3. Go to the "Console" tab
4. Look for any red error messages
5. Share those errors if you see any

**Force Rebuild:**
```bash
# Delete dist folder
rm -rf dist

# Rebuild
npm run build:extension
```

Then reload the extension again.

### Step 4: Verify Files Are Correct

Check that `dist/popup.html` contains:
- `<input id="reelUrlInput"` (line ~315)
- `<div id="settingsSection"` (line ~338)
- `<input id="apiKeyInput"` (line ~343)

If these are missing, the build didn't copy the files correctly.

---

## 🎯 Quick Fix Checklist

- [ ] Extension reloaded in `chrome://extensions/`
- [ ] Popup closed and reopened
- [ ] Browser console checked for errors
- [ ] Files rebuilt with `npm run build:extension`
- [ ] Extension reloaded again after rebuild

---

## 📸 What the UI Should Look Like

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

When you click "Configure Claude API Key", it expands to show:
- Claude API Key input field
- Save API Key button
- Cancel button

---

## 🐛 Common Issues

### Issue: "Extension icon doesn't appear"
- **Fix:** Make sure extension is enabled in `chrome://extensions/`

### Issue: "Popup is blank/white"
- **Fix:** Check console for errors, reload extension

### Issue: "Old UI still showing"
- **Fix:** Hard reload - remove extension, rebuild, re-add

### Issue: "Input fields not visible"
- **Fix:** Check CSS isn't hiding them (inspect element)

---

## 🔄 Complete Reset

If nothing works:

1. **Remove Extension:**
   - Go to `chrome://extensions/`
   - Click "Remove" on Seekr extension

2. **Clean Build:**
   ```bash
   rm -rf dist node_modules
   npm install
   npm run build:extension
   ```

3. **Re-add Extension:**
   - Load unpacked from `dist/` folder
   - Test popup

---

**Still having issues?** Check the browser console for specific error messages!



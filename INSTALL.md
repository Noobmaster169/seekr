# 🚀 How to Install Seekr Extension

## Step 1: Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

This installs all required packages (React, Vite, etc.).

---

## Step 2: Build the Extension

Run the build command:

```bash
npm run build:extension
```

This will:
- Build the React overlay bundle
- Copy all extension files to the `dist/` folder
- Create the extension package

**Expected output:**
```
🔨 Building Liquid Glass Browser Extension...
📦 Building overlay bundle...
📋 Copying extension files...
  ✓ manifest.json
  ✓ popup.html
  ✓ popup.js
  ✓ background.js
  ✓ content.js
  ✓ content.css
✨ Extension built successfully!
📁 Output directory: dist/
```

---

## Step 3: Load Extension in Chrome

1. **Open Chrome Extensions Page:**
   - Go to `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode:**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension:**
   - Click "Load unpacked" button
   - Navigate to your project folder
   - Select the `dist/` folder (NOT the root folder!)
   - Click "Select Folder"

4. **Verify Installation:**
   - You should see "Seekr - Instagram Reel Product Detector" in your extensions list
   - The extension icon should appear in your browser toolbar

---

## Step 4: Configure Claude API Key

1. **Get Your API Key:**
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Sign up or log in
   - Navigate to API Keys
   - Create a new API key
   - Copy the key

2. **Set API Key in Extension:**
   - Click the Seekr extension icon in your toolbar
   - Click "Configure Claude API Key"
   - Paste your API key
   - Click OK

---

## Step 5: Test the Extension

1. **Open Extension Popup:**
   - Click the Seekr icon in your toolbar

2. **Test Detection:**
   - Paste an Instagram Reel URL (e.g., `https://www.instagram.com/reel/ABC123/`)
   - Click "Detect Products"
   - Wait for Claude to analyze the reel
   - View the detected products in the results

---

## 🐛 Troubleshooting

### Build Fails
- Make sure you ran `npm install` first
- Check that Node.js is installed: `node --version`
- Try deleting `node_modules/` and running `npm install` again

### Extension Won't Load
- Make sure you selected the `dist/` folder, not the root folder
- Check that `dist/manifest.json` exists
- Look for errors in the Extensions page (red error messages)

### "Claude API key not configured"
- Make sure you set the API key via the popup settings
- Check that the key is valid in Anthropic Console
- Try setting it again

### Detection Fails
- Verify your API key is correct
- Check you have API credits/quota
- Ensure the Reel URL is valid
- Check browser console (F12) for errors

---

## 📁 Folder Structure After Build

```
seekr/
├── dist/              ← This is what you load in Chrome
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   ├── content.js
│   ├── content.css
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── assets/
│       └── overlay.js
└── ...
```

**Important:** Always load the `dist/` folder, not the root folder!

---

## ✅ Quick Checklist

- [ ] Ran `npm install`
- [ ] Ran `npm run build:extension`
- [ ] Enabled Developer mode in Chrome
- [ ] Loaded `dist/` folder as unpacked extension
- [ ] Configured Claude API key
- [ ] Tested with an Instagram Reel URL

---

## 🎉 You're Done!

The extension is now installed and ready to detect products from Instagram Reels!

**Remember:** The extension only detects products - it doesn't search for them. Lindy handles all searching.



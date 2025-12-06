# 🚀 Quick Start Guide - Liquid Glass Browser Extension

Get your beautiful glassmorphism overlay running in 5 minutes!

## 📋 Prerequisites

- Node.js 16+ installed
- Chrome, Edge, or Brave browser
- Basic command line knowledge

## ⚡ Fast Setup

### Step 1: Install Dependencies

```bash
npm install
```

Wait for all packages to install (~1-2 minutes).

### Step 2: Generate Icons (Optional but Recommended)

**Option A - Use Icon Generator:**
1. Open `create-icons.html` in your browser
2. Click "Generate Icons"
3. Download all three PNG files
4. Save them in the `public/` folder as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

**Option B - Use Existing SVG:**
The project includes `public/icon.svg` which will work temporarily, but PNG icons are recommended.

**Option C - Skip for now:**
The extension will work without icons, just won't look as polished in the browser toolbar.

### Step 3: Build the Extension

```bash
npm run build:extension
```

This creates a `dist/` folder with your extension files.

### Step 4: Load in Browser

#### For Chrome:
1. Open `chrome://extensions/`
2. Toggle "Developer mode" ON (top-right)
3. Click "Load unpacked"
4. Select the `dist` folder
5. Done! ✨

#### For Edge:
1. Open `edge://extensions/`
2. Toggle "Developer mode" ON (left sidebar)
3. Click "Load unpacked"
4. Select the `dist` folder
5. Done! ✨

#### For Brave:
1. Open `brave://extensions/`
2. Toggle "Developer mode" ON (top-right)
3. Click "Load unpacked"
4. Select the `dist` folder
5. Done! ✨

## 🎮 Using the Extension

### Method 1: Extension Popup
1. Click the extension icon in your toolbar
2. Click "Toggle Overlay"
3. The beautiful glass overlay appears!

### Method 2: Keyboard Shortcut
1. Visit any website
2. Press `Alt + L`
3. The overlay toggles on/off

### Moving the Overlay
- Click and drag the header bar to move it around
- Position it anywhere on the page!

### Minimizing
- Click the minimize button (⊟) to collapse it
- Click maximize (⊡) to expand again

### Hiding
- Click the hide button (eye icon)
- Or press `Alt + L`
- A floating button appears to show it again

## 🎨 Testing the UI (Development Mode)

Want to test the UI without building the extension?

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser to see the standalone version.

## 🔧 Troubleshooting

### Extension doesn't appear after loading
- Make sure you selected the `dist` folder, not the project root
- Check browser console for errors
- Try rebuilding: `npm run build:extension`

### Overlay doesn't show on websites
- Click the extension icon and try "Toggle Overlay"
- Check if the website has strict CSP (Content Security Policy)
- Press `F12` and check console for errors

### Icons not showing
- Generate PNG icons using `create-icons.html`
- Make sure they're in the `public/` folder
- Rebuild the extension

### Keyboard shortcut not working
- Make sure no other extension is using `Alt + L`
- Try clicking the extension popup button instead
- Check browser console for errors

## 📁 What's in the dist/ folder?

After building, you should see:
```
dist/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup
├── popup.js           # Popup logic
├── content.js         # Content script
├── content.css        # Overlay styles
├── assets/
│   └── overlay.js     # React overlay bundle
├── icon16.png         # Small icon
├── icon48.png         # Medium icon
└── icon128.png        # Large icon
```

## 🎯 Next Steps

1. ✅ Customize the theme colors in `src/index.css`
2. ✅ Modify overlay content in `src/OverlayApp.jsx`
3. ✅ Add new features or widgets
4. ✅ Change keyboard shortcuts
5. ✅ Test on different websites

## 💡 Pro Tips

- **Pin the extension**: Right-click the icon → "Pin" to keep it visible
- **Test locally**: Use `npm run dev` for fast UI development
- **Check permissions**: Review `manifest.json` for required permissions
- **Customize shortcut**: Change the key in `src/OverlayApp.jsx`
- **Watch the console**: Press F12 to see overlay logs

## 🆘 Need Help?

Check these files:
- `README-EXTENSION.md` - Complete documentation
- `README.md` - Original standalone app docs
- `public/manifest.json` - Extension configuration
- `src/OverlayApp.jsx` - Main overlay component

## ✨ You're Ready!

Your beautiful Liquid Glass overlay is now ready to use. Visit any website and press `Alt + L` to see the magic! 🌊

Enjoy your new glassmorphism overlay! 🎨

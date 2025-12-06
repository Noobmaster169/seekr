# Seekr Extension - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Claude API Key

**Option A: Via Extension UI (Recommended)**
1. Build the extension: `npm run build:extension`
2. Load extension in Chrome (see step 3)
3. Click extension icon → "Configure Claude API Key"
4. Enter your Claude API key

**Option B: Via Chrome Storage (Developer)**
1. Open Chrome DevTools Console
2. Run:
```javascript
chrome.storage.sync.set({ claudeApiKey: 'your-api-key-here' })
```

### 3. Build & Load Extension

```bash
# Build extension
npm run build:extension

# Load in Chrome:
# 1. Go to chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the dist/ folder
```

### 4. Test Detection

1. Open extension popup
2. Paste an Instagram Reel URL (e.g., `https://www.instagram.com/reel/...`)
3. Click "Detect Products"
4. View results in popup
5. Check Chrome storage for Lindy data

---

## 🔑 Getting a Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key
6. Paste it in the extension settings

---

## 📋 Requirements

- Node.js 16+ and npm
- Chrome/Edge browser
- Claude API key from Anthropic

---

## 🐛 Troubleshooting

### "Claude API key not configured"
- Make sure you've set the API key via the popup settings
- Check Chrome storage: `chrome.storage.sync.get(['claudeApiKey'])`

### "Detection failed"
- Verify your API key is valid
- Check network connectivity
- Ensure you have API credits/quota

### Extension not loading
- Make sure you built with `npm run build:extension`
- Check that `dist/` folder exists
- Verify `manifest.json` is in `dist/` folder

### No results displayed
- Check browser console for errors
- Verify the Reel URL is valid
- Ensure Claude API returned valid JSON

---

## 📁 Project Structure

```
seekr/
├── public/
│   ├── manifest.json       # Extension manifest
│   ├── popup.html          # Popup UI
│   ├── popup.js            # Popup logic
│   ├── background.js       # Service worker (API calls)
│   └── content.js          # Content script
├── src/
│   ├── services/
│   │   ├── productDetection.js  # Core detection service
│   │   └── lindyMessaging.js    # Lindy integration
│   └── ...
└── dist/                   # Built extension (after build)
```

---

## 🔍 How It Works

1. **User Input:** User pastes Instagram Reel URL in popup
2. **Validation:** Extension validates URL format
3. **API Call:** Background script calls Claude API
4. **Detection:** Claude analyzes and returns product data
5. **Display:** Results shown in popup UI
6. **Lindy:** Results stored/emitted for Lindy agent

---

## 🎯 Key Features

- ✅ Pure product detection (no searching)
- ✅ Claude AI-powered analysis
- ✅ Structured JSON output
- ✅ Lindy integration ready
- ✅ Secure API key storage
- ✅ Error handling & validation

---

## 📝 Next Steps

- [ ] Implement Instagram page scraping for caption/hashtags
- [ ] Add image capture/screenshot functionality
- [ ] Improve error messages
- [ ] Add loading states
- [ ] Implement result history

---

**Ready to detect products!** 🎉



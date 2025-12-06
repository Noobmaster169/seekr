# Quick Start: Ngrok Setup for Seekr

## Step-by-Step Instructions

### 1. Install Ngrok

```bash
npm install -g ngrok
```

Or download from: https://ngrok.com/download

### 2. Start Your Callback Server

**Terminal 1:**
```bash
node lindy-callback-server.js
```

You should see:
```
🚀 Callback server running on http://localhost:5000
```

### 3. Start Ngrok

**Terminal 2 (NEW TERMINAL):**
```bash
ngrok http 5000
```

You'll see output like:
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:5000
```

**Copy the HTTPS URL** (the one starting with `https://`)

### 4. Configure Extension

**Option A: Via Overlay UI**
1. Open any webpage
2. The Seekr overlay should appear
3. Scroll down in the overlay
4. Find "Ngrok Callback URL" input field
5. Paste your ngrok URL: `https://abc123.ngrok-free.app/callback`
6. Press Enter

**Option B: Via Browser Console**
1. Open browser console (F12)
2. Run:
```javascript
chrome.storage.local.set({ 
  callbackUrl: 'https://your-ngrok-url.ngrok-free.app/callback' 
}, () => console.log('✅ Saved!'))
```

### 5. Test It!

1. Navigate to an Instagram Reel
2. Paste the URL in the overlay
3. Click "Detect Products"
4. **Check Terminal 1** (callback server) for results!

## What Happens

1. Extension extracts image from reel
2. Sends image to Lindy with callback URL
3. Lindy analyzes image and searches for products
4. Lindy sends results to your ngrok URL
5. Your callback server receives and displays results

## Troubleshooting

**No results in callback server?**
- Check ngrok is running: Visit `https://your-ngrok-url.ngrok-free.app` in browser
- Check callback URL is saved: Open console, run `chrome.storage.local.get(['callbackUrl'], console.log)`
- Check callback server is running: Visit `http://localhost:5000`

**Ngrok URL expired?**
- Free ngrok URLs expire after 2 hours
- Just restart ngrok and update the callback URL again


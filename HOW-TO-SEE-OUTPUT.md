# How to See Output Results

Currently, after reverting ngrok, results can only be viewed in the **callback server terminal**. Here's how:

## Option 1: View Results in Callback Server Terminal (Recommended)

### Step 1: Start Your Callback Server

```bash
node lindy-callback-server.js
```

Keep this terminal open - results will appear here.

### Step 2: Set Up Ngrok (to receive callbacks from Lindy)

In a **separate terminal**:

```bash
ngrok http 5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### Step 3: Manually Add Callback URL to Code

Edit `public/background.js` around line 200, find this section:

```javascript
// Note: Add callbackUrl if you have ngrok running
// Uncomment and update with your ngrok URL:
// payload.callbackUrl = 'https://your-ngrok-url.ngrok.io/callback'
```

Change it to:

```javascript
// Add your ngrok URL here
payload.callbackUrl = 'https://abc123.ngrok-free.app/callback'  // Replace with your ngrok URL
```

### Step 4: Rebuild Extension

```bash
npm run build:extension
```

### Step 5: Reload Extension in Chrome

1. Go to `chrome://extensions/`
2. Click the reload button on Seekr extension

### Step 6: Test It!

1. Navigate to an Instagram Reel
2. Paste URL in overlay
3. Click "Detect Products"
4. **Check your callback server terminal** - results will appear there!

## What You'll See in Terminal

```
✅ Received response from Lindy:
{
  "products": [
    {
      "name": "White Leather Jacket",
      "price": "$89.99",
      "link": "https://example.com/product/123"
    }
  ]
}

📦 Found 1 products:
  - White Leather Jacket: $89.99
    Link: https://example.com/product/123
```

## Option 2: Check Browser Console

You can also check the browser console (F12) for any logs:

1. Open browser console (F12)
2. Go to Console tab
3. Look for messages like:
   - `✅ Successfully sent to Lindy!`
   - Any error messages

## Option 3: View Raw JSON Response

The callback server logs the full JSON response from Lindy, so you'll see all the data in your terminal.

## Quick Summary

**Current Setup:**
- ✅ Extension sends images to Lindy
- ✅ Callback server receives results (if callback URL is configured)
- ❌ Results NOT displayed in extension overlay (after revert)
- ✅ Results displayed in callback server terminal

**To see results:**
1. Start callback server
2. Start ngrok
3. Add callback URL to `background.js`
4. Rebuild extension
5. Check terminal for results!


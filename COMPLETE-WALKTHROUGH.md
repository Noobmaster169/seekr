# Complete Walkthrough: Setting Up Seekr to See Results

## Prerequisites Check

Before we start, make sure you have:
- ✅ Node.js installed (you have v24.11.1)
- ✅ The callback server file (`lindy-callback-server.js`)
- ✅ The extension built and loaded in Chrome

---

## Step 1: Start the Callback Server

**Open Terminal/PowerShell #1:**

1. Navigate to your project folder:
   ```bash
   cd "C:\Users\New HP\Documents\Hackathon\seekr"
   ```

2. Start the callback server:
   ```bash
   node lindy-callback-server.js
   ```

3. **What you should see:**
   ```
   🚀 Callback server running on http://localhost:5000
   📡 Send POST requests to http://localhost:5000/callback
   
   💡 To expose publicly, run: npx ngrok http 5000
   ```

4. **Keep this terminal open!** Don't close it.

---

## Step 2: Start Ngrok

**Open a NEW Terminal/PowerShell window (Terminal #2):**

1. Navigate to your project folder:
   ```bash
   cd "C:\Users\New HP\Documents\Hackathon\seekr"
   ```

2. Start ngrok:
   ```bash
   npx ngrok http 5000
   ```

3. **What you should see:**
   ```
   ngrok                                                                             
   
   Session Status                online
   Forwarding                    https://unspaded-stipitiform-estell.ngrok-free.dev -> http://localhost:5000
   
   Connections                   ttl     opn     rt1     rt5     p50     p90
                                 0       0       0.00    0.00    0.00    0.00
   ```

4. **Copy the HTTPS URL** (the one starting with `https://`)
   - Example: `https://unspaded-stipitiform-estell.ngrok-free.dev`

5. **Keep this terminal open too!** Ngrok must stay running.

---

## Step 3: Verify Code is Updated

The code should already be updated with your ngrok URL. Let me verify:

**Check `public/background.js` around line 171:**

It should have:
```javascript
payload.callbackUrl = 'https://unspaded-stipitiform-estell.ngrok-free.dev/callback'
```

If it's not there, I'll update it for you.

---

## Step 4: Rebuild Extension (if needed)

If you just updated the code, rebuild:

```bash
npm run build:extension
```

You should see:
```
✨ Extension built successfully!
```

---

## Step 5: Reload Extension in Chrome

1. **Open Chrome**
2. **Go to:** `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top-right)
4. **Find "Seekr - Instagram Reel Product Detector"**
5. **Click the reload button** (circular arrow icon) on the extension card
6. **Verify it reloaded** - you should see the extension refresh

---

## Step 6: Test the Extension

### 6.1 Open a Webpage

1. Open any webpage in Chrome (e.g., `https://www.google.com`)
2. **The Seekr overlay should appear** in the top-left corner
   - If you don't see it, press `Alt+L` to toggle it

### 6.2 Use the Extension

1. **In the overlay**, you'll see:
   - Input field for "Instagram Reel URL"
   - "Detect Products" button

2. **Paste an Instagram Reel URL** (or any Instagram URL):
   ```
   https://www.instagram.com/reel/ABC123/
   ```

3. **Click "Detect Products"**

4. **What happens:**
   - Button shows "Detecting..." with a spinner
   - Extension extracts image from the reel
   - Sends image to Lindy for analysis
   - Lindy searches for products
   - Results are sent back to your callback server

### 6.3 Check Results

**Look at Terminal #1 (callback server):**

You should see output like:

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

---

## Troubleshooting

### No results appearing?

1. **Check Terminal #1** - Is callback server still running?
2. **Check Terminal #2** - Is ngrok still running?
3. **Check browser console** (F12) - Any errors?
4. **Verify ngrok URL** - Make sure it matches in `background.js`

### Extension not showing?

1. Press `Alt+L` to toggle overlay
2. Check if extension is enabled in `chrome://extensions/`
3. Reload the extension again

### "Request timeout" or errors?

1. Make sure both terminals are running
2. Check that ngrok URL hasn't expired (restart ngrok if needed)
3. Verify callback server is on port 5000

---

## Summary

**You need 3 things running:**
1. ✅ Callback server (Terminal #1)
2. ✅ Ngrok (Terminal #2)
3. ✅ Extension loaded in Chrome

**Results appear in:**
- 📺 **Terminal #1** (callback server) - Detailed product information

**Ready to test!** Follow the steps above and let me know what you see! 🚀


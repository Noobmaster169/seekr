# Step-by-Step Guide to See Output Results

## ✅ Step 1: Start Callback Server (DONE)
The callback server is now running in the background on port 5000.

## 📋 Step 2: Start Ngrok

Open a **NEW terminal window** (keep the callback server running) and run:

```bash
ngrok http 5000
```

**What to look for:**
- You'll see output like:
  ```
  Forwarding    https://abc123.ngrok-free.app -> http://localhost:5000
  ```
- **Copy the HTTPS URL** (the one starting with `https://`)
- Example: `https://abc123.ngrok-free.app`

## 🔧 Step 3: Add Callback URL to Code

1. Open `public/background.js` in your editor
2. Find line ~170 (around the `sendImageToLindy` function)
3. Look for this comment:
   ```javascript
   // Note: Add callbackUrl if you have ngrok running
   // Uncomment and update with your ngrok URL:
   // payload.callbackUrl = 'https://your-ngrok-url.ngrok.io/callback'
   ```
4. Replace it with (use YOUR ngrok URL):
   ```javascript
   // Add callback URL for receiving results
   payload.callbackUrl = 'https://YOUR-NGROK-URL.ngrok-free.app/callback'
   ```
   Replace `YOUR-NGROK-URL` with the actual URL from Step 2!

## 🔨 Step 4: Rebuild Extension

In your main terminal (where you ran the callback server), run:

```bash
npm run build:extension
```

## 🔄 Step 5: Reload Extension in Chrome

1. Open Chrome
2. Go to `chrome://extensions/`
3. Find "Seekr - Instagram Reel Product Detector"
4. Click the **reload button** (circular arrow icon)

## 🧪 Step 6: Test It!

1. Navigate to an Instagram Reel (or any page)
2. The Seekr overlay should appear (or press `Alt+L` to show it)
3. Paste an Instagram Reel URL in the input field
4. Click "Detect Products"
5. **Check your callback server terminal** - results will appear there!

## 📊 What You'll See

In your callback server terminal, you'll see:

```
✅ Received response from Lindy:
{
  "products": [
    {
      "name": "Product Name",
      "price": "$XX.XX",
      "link": "https://..."
    }
  ]
}

📦 Found 1 products:
  - Product Name: $XX.XX
    Link: https://...
```

## ⚠️ Troubleshooting

**No results appearing?**
- Make sure ngrok is still running
- Check that callback URL in `background.js` matches your ngrok URL
- Verify callback server is running (should see "🚀 Callback server running...")
- Check browser console (F12) for errors

**Ngrok URL expired?**
- Free ngrok URLs expire after 2 hours
- Just restart ngrok and update the URL in `background.js` again


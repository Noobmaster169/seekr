# How to Receive Output Results from Lindy

## Overview

After you send an Instagram Reel to Lindy for product detection, results will appear in **two places**:

1. **Extension Overlay** (automatically updates)
2. **Callback Server Terminal** (detailed logs)

## Setup Steps

### 1. Start Your Callback Server

```bash
node lindy-callback-server.js
```

You should see:
```
🚀 Callback server running on http://localhost:5000
```

### 2. Start Ngrok (for public access)

In a **separate terminal**:
```bash
ngrok http 5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

### 3. Configure Callback URL in Extension

1. Open the Seekr overlay on any webpage
2. Scroll down to "Ngrok Callback URL"
3. Paste: `https://abc123.ngrok-free.app/callback`
4. Press Enter

### 4. Use the Extension

1. Navigate to an Instagram Reel
2. Paste the URL in the overlay
3. Click "Detect Products"
4. **Wait for results** - they'll appear automatically!

## Where Results Appear

### In the Extension Overlay

Results will automatically appear in the overlay after Lindy processes your request:

- **Product Name**
- **Price**
- **Product Link** (clickable)
- **Description** (if available)

The overlay polls for results every 2 seconds for up to 60 seconds.

### In the Callback Server Terminal

You'll see detailed logs:

```
✅ ========================================
✅ Received response from Lindy!
✅ ========================================

📦 Found 3 products:

  Product 1:
    Name: White Leather Jacket
    Price: $89.99
    Link: https://example.com/product/123
    Description: Classic white leather jacket...
```

### In the Results File

Results are also saved to `lindy-results.json` in your project folder.

## How It Works

1. **Extension** sends image to Lindy with callback URL
2. **Lindy** analyzes image and searches for products
3. **Lindy** sends results to your ngrok URL → callback server
4. **Callback server** saves results to file
5. **Extension overlay** polls the callback server and displays results

## Troubleshooting

### Results not appearing in overlay?

1. **Check callback server is running**: Visit `http://localhost:5000`
2. **Check ngrok is running**: Visit `https://your-ngrok-url.ngrok-free.app`
3. **Check browser console** (F12) for errors
4. **Verify callback URL** is saved in extension

### Results only in terminal, not overlay?

- Make sure callback server is running on `localhost:5000`
- Check browser console for CORS errors
- Try refreshing the page and trying again

### No results at all?

- Check ngrok URL hasn't expired (free tier expires after 2 hours)
- Verify callback URL is correctly configured
- Check callback server terminal for any errors
- Make sure Lindy webhook is working

## Quick Test

1. Start callback server: `node lindy-callback-server.js`
2. Start ngrok: `ngrok http 5000`
3. Configure callback URL in extension
4. Test with an Instagram Reel
5. Check both overlay and terminal for results!


# Setting Up Ngrok for Lindy Callbacks

## Quick Setup Guide

### Step 1: Install Ngrok

```bash
# Option 1: Using npm (recommended)
npm install -g ngrok

# Option 2: Download from https://ngrok.com/download
```

### Step 2: Start Your Callback Server

In one terminal, start the callback server:

```bash
node lindy-callback-server.js
```

You should see:
```
🚀 Callback server running on http://localhost:5000
📡 Send POST requests to http://localhost:5000/callback
```

### Step 3: Start Ngrok

In a **separate terminal**, run:

```bash
ngrok http 5000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:5000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

### Step 4: Configure the Extension

1. Open the extension overlay on any webpage
2. The extension will automatically use the callback URL from storage
3. Or manually set it by opening the browser console and running:

```javascript
chrome.storage.local.set({ 
  callbackUrl: 'https://your-ngrok-url.ngrok-free.app/callback' 
}, () => {
  console.log('Callback URL saved!')
})
```

### Step 5: Test It!

1. Navigate to an Instagram Reel
2. Paste the URL in the overlay
3. Click "Detect Products"
4. Check your callback server terminal for results!

## Important Notes

- **Ngrok URL changes**: If you restart ngrok, you'll get a new URL. Update the extension storage again.
- **Ngrok free tier**: Free ngrok URLs expire after 2 hours. For production, consider ngrok paid plan or another tunneling solution.
- **HTTPS required**: Lindy requires HTTPS for callbacks, which is why we use ngrok.

## Troubleshooting

### Callback not receiving data?
1. Check ngrok is running: `curl https://your-ngrok-url.ngrok-free.app`
2. Check callback server is running: `curl http://localhost:5000`
3. Check browser console for errors
4. Verify callback URL in extension storage

### Ngrok URL expired?
Just restart ngrok and update the callback URL in extension storage again.


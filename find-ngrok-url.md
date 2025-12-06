# How to Find Your Ngrok URL

## Method 1: Check Ngrok Terminal Output

If ngrok is running, look at the terminal where you started it. You'll see something like:

```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:5000
```

The **HTTPS URL** (the one starting with `https://`) is your ngrok URL.

## Method 2: Check Ngrok Web Interface

1. Open your browser
2. Go to: **http://127.0.0.1:4040**
3. You'll see the ngrok web interface
4. Look for the "Forwarding" section
5. Copy the HTTPS URL

## Method 3: Check Extension Storage

If you've already configured it in the extension:

1. Open browser console (F12)
2. Run this command:
```javascript
chrome.storage.local.get(['callbackUrl'], (result) => {
  console.log('Current callback URL:', result.callbackUrl)
})
```

## Method 4: Check if Ngrok is Running

If ngrok isn't running, start it:

```bash
ngrok http 5000
```

Then use Method 1 or 2 to get the URL.

## Important Notes

- **Free ngrok URLs expire** after 2 hours
- If you restart ngrok, you'll get a **new URL**
- Make sure to update the callback URL in the extension when it changes


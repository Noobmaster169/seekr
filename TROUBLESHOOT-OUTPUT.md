# Troubleshooting: Output Not Appearing

## Quick Checklist

### 1. Is Callback Server Running?
**Check Terminal #1:**
```bash
node lindy-callback-server.js
```

**Should see:**
```
🚀 Callback server running on http://localhost:5000
```

**If not running:**
- Start it: `node lindy-callback-server.js`
- Keep the terminal open!

### 2. Is Ngrok Running?
**Check Terminal #2:**
```bash
npx ngrok http 5000
```

**Should see:**
```
Forwarding    https://your-url.ngrok-free.dev -> http://localhost:5000
```

**If not running:**
- Start it in a NEW terminal
- Keep it running!

### 3. Is Callback URL Correct?
**Check `public/background.js` line ~172:**
```javascript
payload.callbackUrl = 'https://your-ngrok-url.ngrok-free.dev/callback'
```

**Important:**
- Must match your CURRENT ngrok URL
- Must include `/callback` at the end
- Ngrok URLs expire after 2 hours - restart if needed

### 4. Did You Rebuild Extension?
After changing code:
```bash
npm run build:extension
```

Then reload in Chrome (`chrome://extensions/`)

### 5. Check Browser Console
Press F12 → Console tab

**Look for:**
- `✅ Successfully sent to Lindy!`
- `📤 Sending to Lindy webhook with callback URL...`
- Any error messages

### 6. Check Callback Server Terminal
**Watch Terminal #1 for:**
- `✅ Received response from Lindy:`
- Any incoming requests
- Error messages

## Common Issues

### Issue: Ngrok URL Changed
**Solution:** Restart ngrok, update URL in `background.js`, rebuild extension

### Issue: Callback Server Not Receiving
**Check:**
- Is ngrok still running?
- Is callback URL correct?
- Try visiting: `https://your-ngrok-url.ngrok-free.dev` in browser

### Issue: No Image Captured
**Check browser console for:**
- `✅ Captured video frame: X bytes`
- `✅ Captured screenshot: X bytes`
- Any capture errors

### Issue: Lindy Not Responding
**Wait:** Lindy can take 10-30 seconds to process
**Check:** Browser console for Lindy API errors

## Step-by-Step Debug

1. **Start callback server:**
   ```bash
   node lindy-callback-server.js
   ```

2. **Start ngrok (new terminal):**
   ```bash
   npx ngrok http 5000
   ```

3. **Update callback URL in code:**
   - Copy ngrok URL
   - Update `public/background.js` line 172
   - Rebuild: `npm run build:extension`
   - Reload extension in Chrome

4. **Test:**
   - Go to Instagram Reel
   - Click "Detect Products"
   - Watch Terminal #1 for results

## Still Not Working?

Check these in order:
1. ✅ Callback server running?
2. ✅ Ngrok running?
3. ✅ Callback URL correct?
4. ✅ Extension reloaded?
5. ✅ Browser console shows "sent to Lindy"?
6. ✅ Waiting 10-30 seconds for response?


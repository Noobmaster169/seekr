# Quick Fix: Output Not Appearing

## Most Common Issues

### 1. Ngrok URL Expired (Most Likely!)
**Free ngrok URLs expire after 2 hours**

**Fix:**
1. Check if ngrok is still running in Terminal #2
2. If not, restart it: `npx ngrok http 5000`
3. Copy the NEW URL
4. Update `public/background.js` line 173 with new URL
5. Rebuild: `npm run build:extension`
6. Reload extension in Chrome

### 2. Callback Server Not Running
**Check Terminal #1:**
- Should see: `🚀 Callback server running on http://localhost:5000`
- If not, run: `node lindy-callback-server.js`

### 3. Extension Not Reloaded
**After rebuilding:**
1. Go to `chrome://extensions/`
2. Find Seekr extension
3. Click reload button
4. Try again

### 4. No Image Captured
**Check browser console (F12):**
- Look for: `✅ Captured video frame: X bytes`
- If you see errors, the image might not be captured

### 5. Lindy Processing Time
**Wait 10-30 seconds** - Lindy needs time to process the image

## Quick Test Steps

1. **Verify callback server:**
   ```bash
   # Terminal #1
   node lindy-callback-server.js
   ```

2. **Verify ngrok:**
   ```bash
   # Terminal #2 (NEW terminal)
   npx ngrok http 5000
   # Copy the HTTPS URL
   ```

3. **Update code with new ngrok URL:**
   - Edit `public/background.js` line 173
   - Replace with your current ngrok URL + `/callback`

4. **Rebuild and reload:**
   ```bash
   npm run build:extension
   ```
   - Then reload extension in Chrome

5. **Test:**
   - Go to Instagram Reel
   - Click "Detect Products"
   - Watch Terminal #1 for results

## Debug Checklist

- [ ] Callback server running? (Terminal #1)
- [ ] Ngrok running? (Terminal #2)
- [ ] Ngrok URL matches code? (Check line 173)
- [ ] Extension reloaded? (chrome://extensions/)
- [ ] Browser console shows "sent to Lindy"?
- [ ] Waited 10-30 seconds?
- [ ] Checked Terminal #1 for incoming requests?


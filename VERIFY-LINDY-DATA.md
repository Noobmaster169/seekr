# How to Verify Data Sent to Lindy

This guide explains how to verify that the correct data is being sent to Lindy, so you can determine if the issue is with your code or with Lindy.

## 🔍 Methods to Verify Data

### Method 1: Overlay UI (Easiest)

After clicking "Detect Products" and the image is sent:

1. **Look for the "Show Payload Details" button** in the overlay
2. Click it to expand and see:
   - Callback URL
   - Message length
   - Image type and MIME type
   - Image data length
   - Preview of the image data (first 100 characters)

This shows you the structure of what was sent without the full base64 string.

### Method 2: Browser Console (Most Detailed)

1. **Open Developer Tools**:
   - Press `F12` or right-click → "Inspect"
   - Go to the **Console** tab

2. **Look for these log messages**:
   - `📤 Sending image to Lindy for product detection`
   - `📦 Payload structure:` - Shows what fields are present
   - `📋 Full payload (truncated image data):` - Shows the full JSON structure
   - `🔗 Webhook URL:` - Shows the Lindy webhook URL
   - `🔑 Using webhook secret:` - Confirms if secret is set
   - `✅ Successfully sent to Lindy! Response:` - Shows Lindy's response

3. **Check the Network Tab**:
   - Go to the **Network** tab in Developer Tools
   - Filter by "Fetch/XHR"
   - Look for a request to your Lindy webhook URL
   - Click on it to see:
     - **Headers**: Request headers including Authorization
     - **Payload**: The full JSON payload sent to Lindy
     - **Response**: What Lindy returned

### Method 3: Background Script Console

1. **Open Extension Background Console**:
   - Go to `chrome://extensions/`
   - Find "Seekr" extension
   - Click "service worker" or "background page" link
   - This opens a console showing all background script logs

2. **Look for detailed logs**:
   - All the same logs as Method 2, but from the service worker context
   - This is especially useful for debugging message passing issues

## 📋 What to Check in the Payload

When verifying, ensure the payload has this structure:

```json
{
  "callbackUrl": "https://your-ngrok-url.ngrok-free.dev/callback",
  "message": "Please analyze this Instagram Reel...",
  "budgetMYR": 200,
  "image": {
    "type": "base64",
    "mimeType": "image/jpeg",
    "data": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
}
```

### ✅ Correct Payload Checklist

- [ ] `callbackUrl` is set and points to your ngrok URL
- [ ] `message` contains the product detection instructions
- [ ] `budgetMYR` is a number (200)
- [ ] `image.type` is exactly `"base64"`
- [ ] `image.mimeType` is exactly `"image/jpeg"`
- [ ] `image.data` starts with `"data:image/jpeg;base64,"`
- [ ] `image.data` contains actual base64 data (not empty)
- [ ] Image data length is reasonable (typically 50KB - 500KB for JPEG)

### ❌ Common Issues

1. **Missing `data:` prefix**:
   - ❌ Wrong: `"data": "/9j/4AAQSkZJRg..."`
   - ✅ Correct: `"data": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."`

2. **Wrong image type**:
   - ❌ Wrong: `"type": "url"` or `"type": "image"`
   - ✅ Correct: `"type": "base64"`

3. **Empty or missing image data**:
   - Check if video frame capture succeeded
   - Check console for errors during capture

4. **Wrong callback URL**:
   - Make sure ngrok is running
   - Verify the URL matches what's in `background.js`

## 🐛 Debugging Steps

### Step 1: Verify Image Capture

1. Check if the image appears in the overlay after clicking "Detect Products"
2. If no image appears, the capture failed
3. Check console for errors like:
   - `❌ Error capturing video frame`
   - `❌ Could not capture screenshot`

### Step 2: Verify Payload Structure

1. Click "Show Payload Details" in the overlay
2. Verify all fields are present and correct
3. Check the image data preview starts with `data:image/jpeg;base64,`

### Step 3: Verify Network Request

1. Open Network tab in DevTools
2. Filter by your Lindy webhook URL
3. Check the request:
   - Status code (should be 200 or 201)
   - Request payload matches expected structure
   - Response from Lindy

### Step 4: Check Lindy Response

1. In the Network tab, check the response from Lindy
2. If there's an error:
   - **401/403**: Authentication issue (check webhook secret)
   - **400**: Bad request (check payload structure)
   - **500**: Lindy server error (not your code)

### Step 5: Verify Callback Server

1. Check if your callback server (`lindy-callback-server.js`) is running
2. Check if ngrok is forwarding correctly
3. Look at the callback server console for incoming requests

## 📊 Example Console Output

When everything works correctly, you should see:

```
📤 Sending image to Lindy for product detection
📸 Using base64 video frame (captured from browser)
📊 Image data length: 245678 bytes
✅ Image format matches requirements (Lindy can analyze this directly)
📤 Sending to Lindy webhook with captured video frame...
📦 Payload structure: {
  hasCallbackUrl: true,
  hasMessage: true,
  hasImage: true,
  imageType: "base64",
  imageDataLength: 245678
}
📋 Full payload (truncated image data): {
  "callbackUrl": "https://...",
  "message": "Please analyze...",
  "budgetMYR": 200,
  "image": {
    "type": "base64",
    "mimeType": "image/jpeg",
    "data": "data:image/jpeg;base64,/9j/4AAQSkZJRg... (245678 chars total)"
  }
}
🔗 Webhook URL: https://your-lindy-webhook-url
🔑 Using webhook secret: ✅ Set
✅ Successfully sent to Lindy! Response: { ... }
```

## 🎯 Quick Verification Checklist

Before assuming Lindy has issues, verify:

- [ ] Image is captured and displayed in overlay
- [ ] Payload structure is correct (check overlay or console)
- [ ] Network request shows 200/201 status
- [ ] Image data has correct format (`data:image/jpeg;base64,...`)
- [ ] Callback URL is correct and ngrok is running
- [ ] Webhook secret is set (check console log)

If all of these are correct, the issue is likely with Lindy's processing, not your code.


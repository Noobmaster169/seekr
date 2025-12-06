# Lindy Integration Guide

## Overview
The Seekr extension now automatically detects products from Instagram Reels and sends them to Lindy for searching.

## Setup Instructions

### 1. Start the Callback Server

Open a terminal and run:

```bash
# Install dependencies (if not already installed)
npm install axios express

# Start the callback server
node lindy-callback-server.js
```

### 2. Expose the Server Publicly (for callbacks)

In a **separate terminal**, run:

```bash
# Install ngrok globally (if not already installed)
npm install -g ngrok

# Expose your local server
npx ngrok http 5000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)

### 3. Update Callback URL (Optional)

If you want to receive callbacks from Lindy, update the callback URL in `public/background.js`:

```javascript
const payload = {
  text: query,
  budget: '200 MYR',
  callbackUrl: 'https://your-ngrok-url.ngrok.io/callback'  // Add this
}
```

## How It Works

1. **User pastes Instagram Reel URL** in the overlay
2. **Extension detects products** using Claude AI
3. **Products are automatically sent to Lindy** for searching
4. **Lindy searches** and sends results to your callback server
5. **Callback server** receives and displays the results

## Product Detection

The extension detects:
- **Clothing**: tops, bottoms, dresses, jackets, etc.
- **Footwear**: shoes, sneakers, boots, etc.
- **Accessories**: bags, jewelry, hats, etc.

Each product includes:
- Specific description (e.g., "white leather jacket")
- Color, style, material
- Search queries for Lindy

## Example Flow

1. User enters: `https://www.instagram.com/reel/ABC123/`
2. Extension detects: "white leather jacket"
3. Extension sends to Lindy: "white leather jacket"
4. Lindy searches and finds products
5. Lindy sends results to callback server
6. Callback server displays: product name, price, link

## Testing

1. Start the callback server: `node lindy-callback-server.js`
2. Start ngrok: `npx ngrok http 5000`
3. Use the extension to detect products from a reel
4. Check the callback server console for Lindy responses


# How to Install and Run Ngrok

## Problem: Window Appears and Disappears

If running `ngrok http 5000` causes a window to appear and disappear, ngrok might not be installed or there's an error.

## Solution: Install Ngrok

### Option 1: Install via npm (Recommended)

```bash
npm install -g ngrok
```

### Option 2: Download Manually

1. Go to: https://ngrok.com/download
2. Download for Windows
3. Extract the `ngrok.exe` file
4. Add it to your PATH or place it in your project folder

### Option 3: Use npx (No Installation Needed)

Instead of installing, you can use:

```bash
npx ngrok http 5000
```

This will download and run ngrok automatically!

## After Installation

1. Open a **new terminal/PowerShell window**
2. Navigate to your project folder:
   ```bash
   cd "C:\Users\New HP\Documents\Hackathon\seekr"
   ```
3. Run:
   ```bash
   ngrok http 5000
   ```
   OR
   ```bash
   npx ngrok http 5000
   ```

## What You Should See

You should see output like:

```
ngrok                                                                             

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:5000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Important:** Look for the line that says:
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:5000
```

**Copy the HTTPS URL** (the one starting with `https://`)

## If It Still Doesn't Work

1. **Check if port 5000 is in use:**
   ```bash
   netstat -ano | findstr :5000
   ```

2. **Make sure callback server is running:**
   The callback server must be running on port 5000 before you start ngrok.

3. **Try using npx instead:**
   ```bash
   npx ngrok http 5000
   ```

4. **Check for errors:**
   Look at the terminal output - there might be an error message explaining why it's closing.


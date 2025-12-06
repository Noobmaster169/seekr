#!/bin/bash
echo "========================================"
echo "Starting Ngrok for Seekr Callback Server"
echo "========================================"
echo ""
echo "Make sure your callback server is running first!"
echo "(Run: node lindy-callback-server.js)"
echo ""
read -p "Press Enter to start ngrok..."
echo ""
echo "Starting ngrok..."
ngrok http 5000


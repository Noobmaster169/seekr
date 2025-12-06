# 🤖 AI Chat Assistant - Browser Extension

A beautiful, intelligent AI chat interface that overlays on any website. Chat with advanced AI models like GPT-3.5 and GPT-4 while browsing the web.

## ✨ Features

### 🎯 **Smart AI Conversations**
- Support for Anthropic models (Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku)
- Support for OpenAI models (GPT-3.5, GPT-4, GPT-4 Turbo)
- Real-time streaming responses
- Markdown rendering with syntax highlighting
- Message history persistence

### 🌐 **Universal Overlay**
- Works on any website
- Draggable and resizable interface
- Beautiful glassmorphism design
- Keyboard shortcuts (Alt+L to toggle)

### 💾 **Data Management**
- Local storage for conversations
- Export chat history as JSON
- Clear chat functionality
- API key stored securely in browser

### 🎨 **Modern UI/UX**
- Smooth animations with Framer Motion
- Responsive design
- Dark theme optimized
- Copy message functionality

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Build Extension**
```bash
npm run build:extension
```

### 3. **Load in Browser**
1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder

### 4. **Configure API Key**
1. Press `Alt+L` on any website to open the overlay
2. Go to the "Settings" tab
3. Enter your Anthropic API key (default) or choose another provider
4. Test the connection
5. Start chatting!

## 🔑 Getting an API Key

### Anthropic (Default)
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key
5. Copy and paste it into the extension settings

### OpenAI (Alternative)
1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key
5. Copy and paste it into the extension settings

### Supported Providers
- **Anthropic** - Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **OpenAI** - GPT-3.5, GPT-4, GPT-4 Turbo
- **Custom APIs** - Any OpenAI-compatible endpoint

## 💬 Usage Examples

### Basic Conversation
```
You: Hello! How are you?
AI: Hello! I'm doing well, thank you for asking. I'm here and ready to help you with any questions or tasks you might have. How can I assist you today?
```

### Page Context
```
You: What's on this page?
AI: I can see you're on a webpage, but I don't have direct access to view the page content. However, I can help you with questions about what you're reading or any topics you'd like to discuss!
```

### Code Help
```
You: Explain this JavaScript error: "Cannot read property 'length' of undefined"
AI: This error occurs when you're trying to access the `length` property of a variable that is `undefined`. Here's what's happening and how to fix it...
```

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + L` | Toggle overlay visibility |
| `Enter` | Send message |
| `Shift + Enter` | New line in message |

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18** - Modern UI framework
- **Framer Motion** - Smooth animations
- **TailwindCSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### AI Integration
- **OpenAI SDK** - Direct API integration
- **Streaming Support** - Real-time response rendering
- **Marked** - Markdown parsing
- **DOMPurify** - Safe HTML sanitization

### Browser Extension
- **Manifest V3** - Latest extension standard
- **Content Scripts** - Overlay injection
- **Local Storage** - Data persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatInterface.jsx     # Main chat UI
│   ├── ChatMessage.jsx       # Individual message component
│   ├── ChatInput.jsx         # Message input with suggestions
│   └── ChatSettings.jsx      # API configuration
├── services/
│   └── chatService.js        # AI API integration
└── OverlayApp.jsx           # Main overlay container
```

## 🔧 Configuration Options

### API Settings
- **Provider**: OpenAI, Custom API
- **Model**: GPT-3.5-turbo, GPT-4, etc.
- **Base URL**: Custom endpoint URL
- **API Key**: Your authentication key

### Chat Settings
- **Message History**: Automatically saved
- **Streaming**: Real-time response rendering
- **Markdown**: Rich text formatting

## 🎨 Customization

### Styling
The overlay uses TailwindCSS classes and can be customized by modifying the component styles:

```jsx
// Example: Change overlay colors
className="bg-gradient-to-br from-purple-500/20 to-blue-500/20"
```

### Behavior
Modify chat behavior in `chatService.js`:

```javascript
// Example: Adjust AI parameters
{
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 2000
}
```

## 🔒 Privacy & Security

- ✅ **Local Storage**: All data stored in your browser
- ✅ **No Tracking**: No analytics or data collection
- ✅ **Secure API**: Direct connection to AI providers
- ✅ **Open Source**: Full code transparency

## 🐛 Troubleshooting

### Common Issues

**Overlay not appearing**
- Check if extension is loaded and enabled
- Try refreshing the page
- Press Alt+L to toggle visibility

**API errors**
- Verify your API key is correct
- Check your account has credits/quota
- Test connection in settings

**Styling issues**
- Clear browser cache
- Rebuild extension: `npm run build:extension`
- Check for console errors (F12)

### Debug Mode
Enable debug logging:
```javascript
// In chatService.js
console.log('Debug:', response);
```

## 📈 Performance

- **Bundle Size**: ~250KB (includes React + AI SDK)
- **Memory Usage**: ~15-25MB per tab
- **Load Time**: <200ms on most websites
- **API Latency**: Depends on AI provider (typically 1-3s)

## 🔄 Updates & Maintenance

### Updating Dependencies
```bash
npm update
npm run build:extension
```

### Adding New Features
1. Create new components in `src/components/`
2. Update `OverlayApp.jsx` to include new features
3. Rebuild and test

## 📝 License

MIT License - Free for personal and commercial use.

## 🆘 Support

Need help? Check these resources:

1. **Demo Page**: Open `ai-chat-demo.html` for examples
2. **Console Logs**: Check browser console (F12) for errors
3. **Rebuild**: Try `npm run build:extension`
4. **API Docs**: Check your AI provider's documentation

## 🎉 Success Checklist

You'll know everything is working when:

- ✓ Extension loads without errors
- ✓ Alt+L opens the overlay
- ✓ Settings tab accepts your API key
- ✓ Connection test passes
- ✓ Chat responds to messages
- ✓ Messages are saved between sessions

---

**Ready to chat with AI on any website!** 🚀

Press `Alt+L` and start your conversation!

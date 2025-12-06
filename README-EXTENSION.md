# 🌊 Liquid Glass Browser Extension

A stunning browser extension featuring beautiful Liquid Glass design with glassmorphism effects that overlays on any website!

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎨 **Liquid Glass Design** - Beautiful glassmorphism overlay with frosted glass effects
- 🖱️ **Draggable Interface** - Move the overlay anywhere on the page
- ⌨️ **Keyboard Shortcuts** - Press `Alt+L` to toggle visibility
- 🎭 **Smooth Animations** - Powered by Framer Motion for fluid interactions
- 📱 **Responsive** - Works seamlessly on all screen sizes
- 🔒 **Non-Intrusive** - Minimal performance impact on host websites
- 🎯 **Universal** - Works on any website with `<all_urls>` permission

## 🚀 Quick Start

### For Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server (for testing the UI):**
   ```bash
   npm run dev
   ```

3. **Build the extension:**
   ```bash
   npm run build:extension
   ```

### Loading in Browser

#### Chrome / Edge / Brave

1. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

2. Enable **Developer mode** (toggle in top-right corner)

3. Click **Load unpacked**

4. Select the `dist` folder from this project

5. The extension is now installed! 🎉

#### Testing the Extension

1. Navigate to any website
2. Click the extension icon in your toolbar
3. Click "Toggle Overlay" or press `Alt+L`
4. The beautiful Liquid Glass overlay will appear!

## 🏗️ Project Structure

```
liquid-glass-plugin/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Navigation header
│   │   ├── GlassCard.jsx      # Reusable glass card component
│   │   └── FeatureCard.jsx    # Feature showcase card
│   ├── App.jsx                # Main application (standalone mode)
│   ├── OverlayApp.jsx         # Extension overlay component
│   ├── main.jsx               # Standalone app entry point
│   ├── overlay.jsx            # Extension overlay entry point
│   └── index.css              # Global styles with glass effects
├── public/
│   ├── manifest.json          # Extension manifest
│   ├── popup.html             # Extension popup UI
│   ├── popup.js               # Extension popup logic
│   ├── content.js             # Content script injector
│   ├── content.css            # Overlay styles
│   ├── icon16.png             # Extension icon (16x16)
│   ├── icon48.png             # Extension icon (48x48)
│   └── icon128.png            # Extension icon (128x128)
├── build-extension.js         # Extension build script
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies and scripts
```

## 🎨 How It Works

### Architecture

1. **Content Script (`content.js`)**: Injected into every webpage, loads the overlay bundle
2. **Overlay Bundle (`overlay.js`)**: React app that creates a draggable glass overlay
3. **Popup (`popup.html`)**: Extension popup for controlling the overlay
4. **Manifest (`manifest.json`)**: Extension configuration and permissions

### Overlay Features

The overlay includes:
- **Info Tab**: Introduction and keyboard shortcuts
- **Features Tab**: List of extension capabilities
- **Settings Tab**: Customization options (opacity, theme)

### Interaction

- **Drag**: Click and drag the header to move the overlay
- **Minimize**: Click the minimize button to collapse
- **Hide**: Click the hide button or press `Alt+L`
- **Show**: Click the floating eye button or press `Alt+L` again

## 🛠️ Development

### Building

```bash
# Build standalone web app
npm run build

# Build browser extension
npm run build:extension
```

### Icons

Icons need to be generated as PNG files. Use the included `create-icons.html`:

1. Open `create-icons.html` in your browser
2. Click "Generate Icons"
3. Download the generated PNG files
4. Place them in the `public/` folder

Or create your own 16x16, 48x48, and 128x128 PNG icons.

### Customization

#### Change Theme Colors

Edit `src/index.css`:

```css
.glass-card {
  @apply backdrop-blur-xl bg-white/10 border border-white/20;
}
```

#### Modify Overlay Position

Edit `src/OverlayApp.jsx`:

```javascript
const [position, setPosition] = useState({ x: 20, y: 20 })
```

#### Change Keyboard Shortcut

Edit `src/OverlayApp.jsx`:

```javascript
if (e.altKey && e.key === 'l') {  // Change 'l' to your preferred key
  e.preventDefault()
  setIsVisible(prev => !prev)
}
```

## 📦 Extension Permissions

The extension requires the following permissions:

- **`activeTab`**: To interact with the current tab
- **`storage`**: To save user preferences (future feature)
- **`<all_urls>`**: To inject overlay on any website

## 🎯 Use Cases

- **Development Tool**: Overlay development tools on any website
- **Annotation Tool**: Add notes or highlights to web pages
- **Information Display**: Show real-time data alongside web content
- **Accessibility**: Add custom UI elements for improved accessibility
- **Productivity**: Quick access to tools without leaving the page

## 🔒 Privacy

- No data collection
- No external requests
- All processing happens locally
- No tracking or analytics

## 📝 Scripts

- `npm run dev` - Start Vite development server (for UI development)
- `npm run build` - Build standalone web application
- `npm run build:extension` - Build browser extension
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚧 Known Limitations

- Some websites with strict Content Security Policy (CSP) may block the overlay
- Performance may vary on complex websites
- Icons must be manually generated as PNG files

## 🔮 Future Enhancements

- [ ] Settings persistence with chrome.storage
- [ ] Multiple themes
- [ ] Custom CSS injection
- [ ] Screenshot capability
- [ ] Sync across devices
- [ ] More keyboard shortcuts
- [ ] Widget system

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - free to use for personal and commercial projects

## 💡 Tips

- Use the overlay for quick notes while browsing
- Drag it to a corner to keep it out of the way
- Press `Alt+L` for quick toggle
- Customize the theme colors to match your preference
- The overlay works on ALL websites including local files

## 🎓 Learn More

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Content Scripts Guide](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [React Documentation](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [TailwindCSS](https://tailwindcss.com)

---

**Built with ❤️ using React, Vite, TailwindCSS, and Framer Motion**

🌊 Enjoy your Liquid Glass experience!

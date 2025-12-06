# 🔍 Seekr

> **Stop Scrolling. Start Shopping.**

An AI-powered fashion chatbot that instantly solves your fashion dilemmas and makes any outfit shoppable.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-cyan)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 What is Seekr?

Tired of endlessly scrolling through sites trying to find the perfect outfit or figure out where that one item someone is wearing came from? 

**Seekr** is the AI-powered chatbot that solves your fashion dilemmas instantly. Simply tell it what you're looking for—whether it's an outfit for a specific event or style—and it will curate and recommend pieces tailored to your request. 

Even better, you can upload a photo of anyone's clothing, and Seekr will use visual recognition to find the exact or similar items available for purchase, making street style and inspiration immediately shoppable.

---

## ✨ Features

- 🤖 **AI-Powered Recommendations** - Get personalized outfit suggestions based on your style, occasion, or preferences
- 📸 **Visual Recognition** - Upload any photo and find exact or similar items available for purchase
- 🛒 **Instant Shopping** - Seamlessly browse and shop curated pieces from your conversations
- 💬 **Conversational Interface** - Natural chat experience to describe what you're looking for
- 🎨 **Beautiful Glass UI** - Stunning glassmorphism design with smooth animations
- ⚡ **Lightning Fast** - Built with modern tech stack for instant responses
- 🔌 **Browser Extension** - Shop while you browse with our Chrome extension

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- A modern web browser

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Noobmaster169/seekr.git
   cd seekr
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

---

## 🏗️ Project Structure

```
seekr/
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx    # Main chat UI
│   │   ├── ChatInput.jsx        # Message input component
│   │   ├── ChatMessage.jsx      # Message display component
│   │   ├── ItemCarousel.jsx     # Product carousel
│   │   ├── ItemSelection.jsx    # Item selection interface
│   │   └── ...                  # Additional components
│   ├── services/
│   │   └── chatService.js       # AI chat service integration
│   ├── config/
│   │   └── defaultPrompts.js    # Default AI prompts
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # Application entry point
├── public/
│   ├── manifest.json            # Browser extension manifest
│   ├── background.js            # Extension background script
│   ├── content.js               # Extension content script
│   └── popup.html               # Extension popup
├── utils/
│   └── scraper/                 # Product scraping utilities
└── tests/                       # Test files
```

---

## 🛠️ Built With

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Icon set
- [Playwright](https://playwright.dev/) - Testing framework

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run build:extension` | Build browser extension |

---

## 🔌 Browser Extension

Seekr comes with a browser extension that lets you shop while you browse:

1. Build the extension:
   ```bash
   npm run build:extension
   ```

2. Load in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

---

## � Design

Seekr features a beautiful **Liquid Glass** design with:

- Glassmorphism effects with frosted glass aesthetics
- Smooth animations powered by Framer Motion
- Modern, clean, and intuitive interface
- Responsive design for all devices

---

## 📄 License

MIT License - feel free to use this project for your own applications!

---

## 👥 Team

Built with ❤️ by:

- **Mario Taning**
- **Anas Tarek Qumhiyeh**
- **Yash Mahmud**
- **Dylan Matthew Quah**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the issues page.

---

<p align="center">
  <strong>Seekr</strong> — Stop Scrolling. Start Shopping. 🛍️
</p>

# 🔬 LeetCode AI Debugger

<div align="center">

**An AI-powered Chrome extension that analyzes, debugs, and improves your LeetCode solutions in real-time — without leaving the page.**

![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat&logo=googlechrome&logoColor=white)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange?style=flat)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini-AI-8E44AD?style=flat&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

</div>

---

## ✨ What It Does

Tired of switching between LeetCode and ChatGPT while debugging? This extension puts AI debugging **directly inside LeetCode** — as a sleek sidebar that reads your code and gives instant feedback.

| Feature | Description |
|---|---|
| 🐛 **Smart Debugging** | Detects logical errors, type mismatches, and edge cases |
| 💡 **Complexity Analysis** | Explains time and space complexity of your solution |
| ⚡ **One-click Fix** | Applies the corrected code directly into the editor |
| 💬 **Code Chat** | Ask anything about your code — explain, optimize, compare |
| 🔒 **Privacy First** | Your API key stays on your machine — zero data sent to any server |
| 🎨 **Non-intrusive UI** | Hidden by default, opens on demand with a single click |

---

## 📸 Preview

> Sidebar opens on the right side of LeetCode with a clean dark UI

```
┌─────────────────────┬──────────────────────┐
│                     │  🔬 AI Debugger      │
│   LeetCode Editor   │  ────────────────    │
│                     │  [ Analyze My Code ] │
│   class Solution {  │                      │
│     ...             │  🐛 BUGS FOUND:      │
│   }                 │  - Type mismatch...  │
│                     │                      │
│                     │  💡 IMPROVEMENTS:    │
│                     │  - Use HashMap O(n)  │
│                     │                      │
│                     │  [ Apply Fix ]       │
│                     │  ────────────────    │
│                     │  Ask about your code │
│                     │  [_______________] ➤ │
└─────────────────────┴──────────────────────┘
```

---

## 🛠️ Tech Stack

- **React 18** — Popup UI & sidebar components
- **Chrome Extension APIs** — Manifest V3, storage, messaging
- **Google Gemini API** — AI analysis (free tier)
- **Vite + @crxjs/vite-plugin** — Fast builds for Chrome extensions
- **Shadow DOM** — Style isolation from LeetCode's CSS
- **Monaco Editor API** — Full code extraction (not just visible lines)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Google Chrome
- Free Gemini API key → [Get one here](https://aistudio.google.com/apikey)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/leetcode-ai-debugger.git
cd leetcode-ai-debugger
```

**2. Install dependencies**
```bash
npm install
```

**3. Build the extension**
```bash
npm run build
```

**4. Load into Chrome**
- Open Chrome → go to `chrome://extensions`
- Toggle **Developer mode** ON (top right corner)
- Click **Load unpacked**
- Select the `dist/` folder inside the project

**5. Add your API key**
- Click the extension icon in the Chrome toolbar
- Paste your Gemini API key
- Click **Save Key** ✅

**6. Start debugging!**
- Go to any LeetCode problem
- Write your solution
- Click the **purple button** on the right edge of the screen
- Hit **Analyze My Code**

---

## 🔑 Getting a Free Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key** → **Create new project**
4. Copy the key and paste it in the extension popup

> **Free tier limits:** 20 requests/day, resets at midnight — perfect for daily LeetCode practice!

---

## 📁 Project Structure

```
leetcode-ai-debugger/
├── src/
│   ├── popup/
│   │   ├── Popup.jsx           # Settings UI — API key management
│   │   └── popup.html          # Popup entry point
│   ├── content/
│   │   └── content_script.js   # Sidebar injection + code extraction
│   └── background/
│       └── background.js       # Gemini API calls + message routing
├── manifest.json               # Chrome extension config
├── vite.config.js              # Build configuration
└── package.json
```

### How It Works

```
User clicks "Analyze My Code"
         ↓
content_script.js reads code from Monaco editor
         ↓
Sends message to background.js
         ↓
background.js calls Gemini API with your key
         ↓
Gemini returns bugs + improvements + fixed code
         ↓
Results displayed in the sidebar
         ↓
User clicks "Apply Fix" → code written to editor
```

---

## ⌨️ Keyboard Shortcut

Press **`Cmd + Shift + D`** (Mac) or **`Ctrl + Shift + D`** (Windows) to trigger analysis without clicking.

---

## 🧩 How to Use

### Debug Mode
1. Write your solution in LeetCode editor
2. Click the purple **🔬** button on the right edge
3. Click **Analyze My Code**
4. Review bugs, improvements, and corrected code
5. Click **⚡ Apply Fix** to paste the fix directly

### Chat Mode
Ask questions like:
- *"What is the time complexity of my code?"*
- *"How can I optimize this further?"*
- *"Explain my code step by step"*
- *"Rewrite this using dynamic programming"*

Use the **quick tags** below the chat input for one-tap questions.

---

## 🔐 Privacy & Security

- Your API key is stored **locally** using `chrome.storage.local` — never sent to any third-party server
- Your code is sent **directly** from your browser to Google's Gemini API
- No accounts, no tracking, no data collection

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "Add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

### Ideas for contributions
- [ ] Multi-language syntax highlighting in results
- [ ] History of past debug sessions
- [ ] Complexity chart visualization
- [ ] Support for competitive programming platforms (Codeforces, HackerRank)
- [ ] Dark/light theme toggle

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

- Built with [Google Gemini API](https://ai.google.dev/)
- Extension scaffolding via [@crxjs/vite-plugin](https://crxjs.dev/)
- UI inspired by modern developer tools

---

<div align="center">

Built from scratch with ❤️ — one phase at a time

⭐ **Star this repo if it helped you!** ⭐

</div>

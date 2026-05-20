# 🔬 LeetCode AI Debugger

<div align="center">

**A high-performance, real-time AI assistant injected directly into the LeetCode environment.**

[![GitHub stars](https://img.shields.io/github/stars/HARMANXPAL/leetcode-ai-debugger?style=for-the-badge&color=7C3AED)](https://github.com/HARMANXPAL/leetcode-ai-debugger/stargazers)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![Gemini AI](https://img.shields.io/badge/Gemini_1.5_Flash-8E44AD?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/intro/)

</div>

---

## 🚀 Overview

**LeetCode AI Debugger** is a Chrome extension designed to eliminate the friction of switching tabs between LeetCode and LLMs. It hooks directly into the **Monaco Editor** used by LeetCode, extracts your code via a bridge script, and uses **Google Gemini 1.5 Flash** to provide instant, contextual debugging and optimization feedback.

### Why this exists?
Standard AI tools don't have context of the specific LeetCode problem or the language-specific constraints of the editor. This tool bridges that gap by providing a **seamless, sidebar-integrated experience.**

---

## ✨ Core Features

### 🐛 1. Contextual Debugging
Instead of just checking syntax, the AI analyzes your logic against the problem title and description. It identifies edge cases, infinite loops, and logical fallacies.

### ⚡ 2. Direct Editor Injection (Apply Fix)
The extension uses a **Bridge Script** to bypass Chrome's isolated world restriction. This allows the AI to programmatically update the Monaco Editor instance with corrected code at the click of a button.

### 💬 3. Interactive Code Chat
Ask specific questions about your implementation.
* *"What is the time complexity of this nested loop?"*
* *"Can I solve this using a Monotonic Stack instead?"*
* *"Why am I getting a TLE on large inputs?"*

### 🔒 4. Zero-Footprint Privacy
Your API key is stored locally using `chrome.storage.local`. No middleman servers are used; the connection is direct from your browser to Google's Generative AI endpoints.

---

## 🛠️ Tech Stack & Architecture

### The Stack
* **Framework:** React.js (for the Sidebar and Popup UI)
* **Bundler:** Vite with `@crxjs/vite-plugin` (for Manifest V3 synchronization)
* **Styling:** Custom CSS with **Shadow DOM** isolation to prevent style-bleed from LeetCode.
* **LLM:** Google Gemini 1.5 Flash (API)

### How it Works (The Pipeline)
1.  **Extraction:** `content_script.js` uses a specialized selector to pull code from the `.view-lines` class or via the `window.monaco` API.
2.  **Messaging:** The data is passed to `background.js` (Service Worker) to handle the asynchronous API fetch.
3.  **Processing:** Gemini 1.5 Flash processes the prompt with specific formatting rules.
4.  **Rendering:** The response is streamed back and rendered inside a React-managed Sidebar with Markdown-like formatting.

---

## 📥 Installation

### Developer Setup
1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/HARMANXPAL/leetcode-ai-debugger.git](https://github.com/HARMANXPAL/leetcode-ai-debugger.git)
    cd leetcode-ai-debugger
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Build the Production Bundle:**
    ```bash
    npm run build
    ```
4.  **Load the Extension:**
    * Open `chrome://extensions/`
    * Enable **Developer Mode**.
    * Click **Load Unpacked** and select the `dist` folder.

---

## 🔑 Configuration

1.  Obtain a free API Key from [Google AI Studio](https://aistudio.google.com/apikey).
2.  Click the extension icon in your toolbar.
3.  Paste the key into the **Settings** panel and save.
4.  Navigate to any LeetCode problem and look for the purple **🔬** icon.

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
| :--- | :--- |
| **Trigger Analysis** | `Cmd + Shift + D` (Mac) or `Ctrl + Shift + D` (Windows) |
| **Toggle Sidebar** | Click the floating icon |

---

## 🛣️ Roadmap
- [ ] Support for Codeforces and HackerRank.
- [ ] Dark/Light mode toggle for the Sidebar.
- [ ] Complexity visualization charts.
- [ ] Support for multiple LLM providers (GPT-4o, Claude 3.5).

---

<div align="center">
  Built with ❤️ for Competitive Programmers.
  <br/>
  <strong>If this helped your SDE prep, give it a ⭐ star!</strong>
</div>

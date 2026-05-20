console.log('🐛 LeetCode AI Debugger — content script loaded!')

const isOnProblemPage = window.location.href.includes('/problems/')

if (isOnProblemPage) {
  setTimeout(injectSidebar, 2000)
}

function injectSidebar() {
  if (document.getElementById('lc-ai-debugger-root')) return

  const toggleBtn = document.createElement('button')
  toggleBtn.id = 'lc-debugger-toggle'
  toggleBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`
  toggleBtn.title = 'AI Debugger'
  toggleBtn.style.cssText = `
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: 10000;
    background: #7C3AED;
    color: #fff;
    border: none;
    border-radius: 8px 0 0 8px;
    width: 26px;
    height: 56px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: -2px 0 12px rgba(124,58,237,0.4);
    transition: background 0.2s;
  `
  document.body.appendChild(toggleBtn)

  const container = document.createElement('div')
  container.id = 'lc-ai-debugger-root'
  container.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 320px;
    height: 100vh;
    z-index: 9999;
    display: none;
  `
  document.body.appendChild(container)

  const shadow = container.attachShadow({ mode: 'open' })
  const mountPoint = document.createElement('div')
  mountPoint.style.cssText = 'height: 100%; display: flex; flex-direction: column;'
  shadow.appendChild(mountPoint)

  renderSidebar(mountPoint)

  let isOpen = false
  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen
    container.style.display = isOpen ? 'block' : 'none'
    toggleBtn.style.right = isOpen ? '320px' : '0'
    toggleBtn.style.background = isOpen ? '#5B21B6' : '#7C3AED'
    toggleBtn.innerHTML = isOpen
      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>`
      : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`
  })
}

function renderSidebar(mountPoint) {
  const style = document.createElement('style')
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .sidebar {
      width: 100%;
      height: 100%;
      background: #0F0F13;
      border-left: 1px solid #1E1E2E;
      display: flex;
      flex-direction: column;
      font-family: 'Inter', -apple-system, sans-serif;
      overflow: hidden;
    }

    .header {
      padding: 14px 16px;
      background: #13131A;
      border-bottom: 1px solid #1E1E2E;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-icon {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #7C3AED, #4F46E5);
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .header-title {
      font-size: 13px;
      font-weight: 600;
      color: #E2E8F0;
      letter-spacing: 0.01em;
    }

    .header-subtitle {
      font-size: 10px;
      color: #4B5563;
      margin-top: 1px;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22D3EE;
      box-shadow: 0 0 6px rgba(34,211,238,0.6);
    }

    .debug-btn {
      margin: 14px 14px 8px;
      padding: 10px 14px;
      background: #7C3AED;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      width: calc(100% - 28px);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      letter-spacing: 0.01em;
      transition: background 0.15s, transform 0.1s;
      flex-shrink: 0;
    }

    .debug-btn:hover { background: #6D28D9; }
    .debug-btn:active { transform: scale(0.98); }
    .debug-btn:disabled { background: #1E1E2E; color: #374151; cursor: not-allowed; transform: none; }

    .results {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 12px 14px;
      scrollbar-width: thin;
      scrollbar-color: #2D2D3F #0F0F13;
    }

    .results::-webkit-scrollbar { width: 4px; }
    .results::-webkit-scrollbar-track { background: transparent; }
    .results::-webkit-scrollbar-thumb { background: #2D2D3F; border-radius: 4px; }

    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 10px;
      padding: 24px;
    }

    .placeholder-icon {
      width: 44px;
      height: 44px;
      background: #13131A;
      border: 1px solid #1E1E2E;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .placeholder-title {
      font-size: 13px;
      font-weight: 500;
      color: #94A3B8;
      text-align: center;
    }

    .placeholder-sub {
      font-size: 11px;
      color: #374151;
      text-align: center;
      line-height: 1.7;
    }

    .placeholder-sub span {
      color: #7C3AED;
      font-weight: 500;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
      gap: 12px;
    }

    .loading-ring {
      width: 32px;
      height: 32px;
      border: 2px solid #1E1E2E;
      border-top-color: #7C3AED;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loading-text {
      font-size: 12px;
      color: #4B5563;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .result-section {
      background: #13131A;
      border: 1px solid #1E1E2E;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 10px;
    }

    .result-section-title {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .result-text {
      color: #94A3B8;
      font-size: 12px;
      line-height: 1.75;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .result-text strong { color: #E2E8F0; font-weight: 500; }
    .result-text em { color: #A78BFA; font-style: italic; }

    .result-text code {
      background: #1E1E2E;
      padding: 1px 5px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 11px;
      color: #22D3EE;
    }

    .result-text pre {
      background: #0A0A10;
      border: 1px solid #1E1E2E;
      border-radius: 8px;
      padding: 12px;
      margin: 10px 0;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: #A5F3FC;
      line-height: 1.6;
      white-space: pre;
    }

    .error-box {
      background: #1A0A0A;
      border: 1px solid #3F1515;
      border-radius: 10px;
      padding: 12px;
      font-size: 12px;
      color: #F87171;
      line-height: 1.6;
    }

    .apply-btn {
      margin-top: 10px;
      padding: 9px 14px;
      background: transparent;
      color: #22D3EE;
      border: 1px solid #164E63;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      transition: all 0.15s;
    }

    .apply-btn:hover { background: #0C4A6E; border-color: #22D3EE; }

    .chat-section {
      flex-shrink: 0;
      border-top: 1px solid #1E1E2E;
      padding: 10px 14px 12px;
      background: #13131A;
    }

    .chat-label {
      font-size: 10px;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 8px;
    }

    .chat-row {
      display: flex;
      gap: 7px;
      align-items: flex-end;
    }

    .chat-input {
      flex: 1;
      padding: 8px 11px;
      background: #0F0F13;
      border: 1px solid #1E1E2E;
      border-radius: 8px;
      color: #E2E8F0;
      font-size: 12px;
      outline: none;
      resize: none;
      height: 36px;
      font-family: inherit;
      transition: border-color 0.15s;
      line-height: 1.4;
    }

    .chat-input::placeholder { color: #2D2D3F; }
    .chat-input:focus { border-color: #7C3AED; }

    .chat-send-btn {
      width: 36px;
      height: 36px;
      background: #7C3AED;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s;
    }

    .chat-send-btn:hover { background: #6D28D9; }
    .chat-send-btn:disabled { background: #1E1E2E; cursor: not-allowed; }

    .tag-row {
      display: flex;
      gap: 5px;
      margin: 6px 0 0;
      flex-wrap: wrap;
    }

    .tag {
      padding: 3px 8px;
      background: #13131A;
      border: 1px solid #1E1E2E;
      border-radius: 20px;
      font-size: 10px;
      color: #4B5563;
      cursor: pointer;
      transition: all 0.15s;
    }

    .tag:hover { border-color: #7C3AED; color: #A78BFA; }
  `
  mountPoint.appendChild(style)

  const sidebar = document.createElement('div')
  sidebar.className = 'sidebar'
  sidebar.innerHTML = `
    <div class="header">
      <div class="header-left">
        <div class="header-icon">🔬</div>
        <div>
          <div class="header-title">AI Debugger</div>
          <div class="header-subtitle">Powered by Gemini</div>
        </div>
      </div>
      <div class="status-dot" title="Ready"></div>
    </div>
    <button class="debug-btn" id="debug-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
      Analyze My Code
    </button>
    <div class="results" id="results">
      <div class="placeholder">
        <div class="placeholder-icon">🔍</div>
        <div class="placeholder-title">Ready to debug</div>
        <div class="placeholder-sub">
          Write your solution and click<br/>
          <span>Analyze My Code</span><br/>
          for AI-powered feedback
        </div>
      </div>
    </div>
    <div class="chat-section">
      <div class="chat-label">Ask about your code</div>
      <div class="chat-row">
        <textarea class="chat-input" id="chat-input" placeholder="e.g. What's the time complexity?"></textarea>
        <button class="chat-send-btn" id="chat-send-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
      <div class="tag-row">
        <span class="tag" id="tag-complexity">Time complexity?</span>
        <span class="tag" id="tag-optimize">Optimize this</span>
        <span class="tag" id="tag-explain">Explain my code</span>
      </div>
    </div>
  `
  mountPoint.appendChild(sidebar)

  const debugBtn = mountPoint.querySelector('#debug-btn')
  const resultsDiv = mountPoint.querySelector('#results')
  const chatInput = mountPoint.querySelector('#chat-input')
  const chatSendBtn = mountPoint.querySelector('#chat-send-btn')

  mountPoint.querySelector('#tag-complexity').addEventListener('click', () => { chatInput.value = 'What is the time and space complexity of my code?'; chatInput.focus() })
  mountPoint.querySelector('#tag-optimize').addEventListener('click', () => { chatInput.value = 'How can I optimize this code further?'; chatInput.focus() })
  mountPoint.querySelector('#tag-explain').addEventListener('click', () => { chatInput.value = 'Explain what my code is doing step by step'; chatInput.focus() })

  debugBtn.addEventListener('click', () => {
    const code = extractFullCode()
    const language = extractLanguage()
    const problemTitle = extractProblemTitle()

    if (!code.trim()) {
      resultsDiv.innerHTML = `<div class="error-box">⚠️ No code found.</div>`
      return
    }

    debugBtn.disabled = true
    debugBtn.innerHTML = `<div class="loading-ring" style="width:14px;height:14px;border-width:2px;"></div> Analyzing...`
    resultsDiv.innerHTML = `<div class="loading"><div class="loading-ring"></div><div class="loading-text">Sending to Gemini AI...</div></div>`

    chrome.runtime.sendMessage({
      type: 'CODE_EXTRACTED',
      payload: { code, language, problemTitle }
    }, (response) => {
      debugBtn.disabled = false
      debugBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg> Analyze My Code`

      if (response?.status === 'success') {
        const hasFixedCode = response.result.includes('CORRECTED CODE') || response.result.includes('```')
        resultsDiv.innerHTML = `
          <div class="result-section">
            <div class="result-section-title" style="color:#7C3AED">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              Analysis
            </div>
            <div class="result-text">${formatResponse(response.result)}</div>
          </div>
          ${hasFixedCode ? `<button class="apply-btn" id="apply-btn">⚡ Apply Fix to Editor</button>` : ''}
        `
        resultsDiv.scrollTop = 0

        const applyBtn = resultsDiv.querySelector('#apply-btn')
        if (applyBtn) {
          applyBtn.addEventListener('click', async () => {
            const fixedCode = extractCodeFromResponse(response.result)
            if (fixedCode) {
              applyBtn.textContent = '⏳ Applying...'
              const success = await applyCodeToEditor(fixedCode)
              if (success) {
                applyBtn.textContent = '✅ Applied!'
                applyBtn.style.color = '#22D3EE'
              } else {
                applyBtn.textContent = '❌ Failed — copy manually'
                applyBtn.style.color = '#F87171'
              }
            }
          })
        }
      } else {
        resultsDiv.innerHTML = `<div class="error-box">❌ ${response?.message || 'Something went wrong. Check your API key.'}</div>`
      }
    })
  })

  function sendChat() {
    const question = chatInput.value.trim()
    if (!question) return

    const code = extractFullCode()
    const language = extractLanguage()
    const problemTitle = extractProblemTitle()

    chatInput.value = ''
    chatSendBtn.disabled = true
    resultsDiv.innerHTML = `<div class="loading"><div class="loading-ring"></div><div class="loading-text">Thinking...</div></div>`

    chrome.runtime.sendMessage({
      type: 'CHAT_QUESTION',
      payload: { code, language, problemTitle, question }
    }, (response) => {
      chatSendBtn.disabled = false
      if (response?.status === 'success') {
        resultsDiv.innerHTML = `
          <div class="result-section">
            <div class="result-section-title" style="color:#22D3EE">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Response
            </div>
            <div class="result-text">${formatResponse(response.result)}</div>
          </div>
        `
        resultsDiv.scrollTop = 0
      } else {
        resultsDiv.innerHTML = `<div class="error-box">❌ ${response?.message || 'Error'}</div>`
      }
    })
  }

  chatSendBtn.addEventListener('click', sendChat)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() }
  })
}

// ─── Extraction & Utility Functions ───

function extractFullCode() {
  // Method 1: inject script into page context to access Monaco
  // (content scripts can't access window.monaco directly)
  try {
    const editors = window.monaco?.editor?.getEditors()
    if (editors && editors.length > 0) {
      const code = editors[0].getModel()?.getValue()
      if (code?.trim()) return code
    }
  } catch (e) {}

  // Fallback: visible lines
  const lineElements = document.querySelectorAll('.view-lines .view-line')
  if (lineElements.length === 0) return ''
  return Array.from(lineElements).map(l => l.textContent).join('\n')
}

function extractLanguage() {
  const langNames = ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'C']
  for (const btn of document.querySelectorAll('button')) {
    const text = btn.textContent.trim()
    if (langNames.some(lang => text.includes(lang))) return text
  }
  return 'Unknown'
}

function extractProblemTitle() {
  const el = document.querySelector('[data-cy="question-title"]')
    || document.querySelector('.text-title-large')
    || document.querySelector('h4')
  return el ? el.textContent.trim() : 'Unknown Problem'
}

function extractCodeFromResponse(text) {
  const match = text.match(/```[\w]*\n([\s\S]*?)```/)
  return match ? match[1].trim() : null
}

// Injects into page context to access window.monaco
function applyCodeToEditor(code) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.textContent = `
      (function() {
        try {
          const editors = window.monaco?.editor?.getEditors()
          if (editors && editors.length > 0) {
            editors[0].getModel().setValue(${JSON.stringify(code)})
            window.dispatchEvent(new CustomEvent('lc-debugger-applied', { detail: { success: true } }))
            return
          }
          window.dispatchEvent(new CustomEvent('lc-debugger-applied', { detail: { success: false } }))
        } catch(e) {
          window.dispatchEvent(new CustomEvent('lc-debugger-applied', { detail: { success: false } }))
        }
      })()
    `
    document.head.appendChild(script)
    script.remove()

    window.addEventListener('lc-debugger-applied', (e) => {
      resolve(e.detail.success)
    }, { once: true })
  })
}

function formatResponse(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre>$1</pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TRIGGER_DEBUG') {
    const root = document.getElementById('lc-ai-debugger-root')
    if (root?.shadowRoot) {
      root.shadowRoot.querySelector('#debug-btn')?.click()
    }
  }
})
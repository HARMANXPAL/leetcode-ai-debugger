import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

function Popup() {
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [hasKey, setHasKey] = useState(false)

  // Load existing key on popup open
  useEffect(() => {
    chrome.storage.local.get(['geminiKey'], (result) => {
      if (result.geminiKey) {
        // Show masked version — don't expose full key in UI
        setApiKey(result.geminiKey)
        setHasKey(true)
      }
    })
  }, [])

  function saveKey() {
    if (!apiKey.trim()) return

    chrome.storage.local.set({ geminiKey: apiKey.trim() }, () => {
      setSaved(true)
      setHasKey(true)
      // Reset saved message after 2 seconds
      setTimeout(() => setSaved(false), 2000)
    })
  }

  function clearKey() {
    chrome.storage.local.remove('geminiKey', () => {
      setApiKey('')
      setHasKey(false)
    })
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={{ fontSize: '20px' }}>🐛</span>
        <div>
          <div style={styles.title}>LeetCode AI Debugger</div>
          <div style={styles.subtitle}>Powered by Gemini AI</div>
        </div>
      </div>

      {/* Status badge */}
      <div style={{
        ...styles.badge,
        background: hasKey ? '#0d2d1a' : '#2d1a0d',
        borderColor: hasKey ? '#22c55e' : '#ffa116',
        color: hasKey ? '#22c55e' : '#ffa116',
      }}>
        {hasKey ? '✅ API Key configured' : '⚠️ No API key set'}
      </div>

      {/* API Key input */}
      <div style={styles.section}>
        <label style={styles.label}>Gemini API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="AIzaSy..."
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && saveKey()}
        />
        <div style={styles.hint}>
          Get your free key at{' '}
          <span
            style={styles.link}
            onClick={() => chrome.tabs.create({ url: 'https://aistudio.google.com/apikey' })}
          >
            aistudio.google.com
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div style={styles.buttonRow}>
        <button onClick={saveKey} style={styles.saveBtn}>
          {saved ? '✅ Saved!' : '💾 Save Key'}
        </button>
        {hasKey && (
          <button onClick={clearKey} style={styles.clearBtn}>
            🗑️ Clear
          </button>
        )}
      </div>

      {/* How to use */}
      <div style={styles.howTo}>
        <div style={styles.howToTitle}>How to use:</div>
        <div style={styles.step}>1️⃣ Go to any LeetCode problem</div>
        <div style={styles.step}>2️⃣ Write your solution</div>
        <div style={styles.step}>3️⃣ Click <strong style={{color:'#ffa116'}}>"Debug My Code"</strong> in the sidebar</div>
        <div style={styles.step}>⌨️ Shortcut: <strong style={{color:'#ffa116'}}>Ctrl+Shift+D</strong></div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    width: '340px',
    background: '#1a1a2e',
    color: '#e0e0e0',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    padding: '0 0 16px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#16213e',
    borderBottom: '2px solid #ffa116',
  },
  title: {
    color: '#ffa116',
    fontWeight: '700',
    fontSize: '15px',
  },
  subtitle: {
    color: '#888',
    fontSize: '11px',
    marginTop: '2px',
  },
  badge: {
    margin: '12px 16px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: '600',
  },
  section: {
    padding: '0 16px',
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: '#aaa',
    marginBottom: '6px',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: '#0f3460',
    border: '1px solid #1a4a80',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  hint: {
    fontSize: '11px',
    color: '#666',
    marginTop: '6px',
  },
  link: {
    color: '#ffa116',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  buttonRow: {
    display: 'flex',
    gap: '8px',
    padding: '0 16px',
    marginBottom: '16px',
  },
  saveBtn: {
    flex: 1,
    padding: '10px',
    background: '#ffa116',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
  },
  clearBtn: {
    padding: '10px 14px',
    background: '#2a1a1a',
    color: '#ff6b6b',
    border: '1px solid #ff6b6b',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
  },
  howTo: {
    margin: '0 16px',
    padding: '12px',
    background: '#16213e',
    borderRadius: '8px',
    border: '1px solid #0f3460',
  },
  howToTitle: {
    color: '#ffa116',
    fontWeight: '700',
    fontSize: '12px',
    marginBottom: '8px',
  },
  step: {
    fontSize: '12px',
    color: '#ccc',
    marginBottom: '4px',
    lineHeight: '1.6',
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(<Popup />)

export default Popup
// ============================================
// BACKGROUND SERVICE WORKER — Final Version
// Handles Debug + Chat questions
// ============================================

chrome.runtime.onInstalled.addListener(() => {
  console.log('LeetCode AI Debugger installed ✅')
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received:', message.type)

  if (message.type === 'PING') {
    sendResponse({ type: 'PONG', status: 'Background alive ✅' })
  }

  // Debug my code button
  if (message.type === 'CODE_EXTRACTED') {
    const { code, language, problemTitle } = message.payload
    console.log('Got code for:', problemTitle)
    console.log('Calling Gemini...')

    const prompt = buildPrompt(code, language, problemTitle)
    callGeminiWithPrompt(prompt)
      .then(result => {
        console.log('Gemini replied ✅')
        sendResponse({ status: 'success', result })
      })
      .catch(err => {
        console.error('Gemini error:', err)
        sendResponse({ status: 'error', message: err.message })
      })
  }

  // Chat question about code
  if (message.type === 'CHAT_QUESTION') {
    const { code, language, problemTitle, question } = message.payload
    console.log('Chat question:', question)

    const prompt = `
You are an expert programming assistant helping with LeetCode problems.

Problem: "${problemTitle}"

User's ${language} code:
\`\`\`${language}
${code}
\`\`\`

User's question: ${question}

Answer clearly and concisely. If showing code examples, use proper code blocks.
If the user asks to change or modify the code, provide the complete updated code in a code block.
`
    callGeminiWithPrompt(prompt)
      .then(result => {
        console.log('Gemini chat replied ✅')
        sendResponse({ status: 'success', result })
      })
      .catch(err => {
        console.error('Gemini chat error:', err)
        sendResponse({ status: 'error', message: err.message })
      })
  }

  // IMPORTANT: keeps channel open for async responses
  return true
})

// ─────────────────────────────────────────
// CORE GEMINI CALLER
// All requests go through this one function
// ─────────────────────────────────────────
async function callGeminiWithPrompt(prompt) {
  const storage = await chrome.storage.local.get(['geminiKey'])
  const apiKey = storage.geminiKey

  if (!apiKey) {
    throw new Error('No API key found. Please set your Gemini API key in the extension popup.')
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 3000,
      }
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Gemini API call failed')
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// ─────────────────────────────────────────
// PROMPT BUILDER for Debug button
// ─────────────────────────────────────────
function buildPrompt(code, language, problemTitle) {
  return `
You are an expert competitive programming debugger.

Analyze this ${language} solution for the LeetCode problem: "${problemTitle}"

\`\`\`${language}
${code}
\`\`\`

Provide your analysis in this exact format:

🐛 BUGS FOUND:
- List any logical errors, edge cases missed, or incorrect approaches
- If no bugs, write "No critical bugs found"

💡 IMPROVEMENTS:
- Suggest better time/space complexity if possible
- Code style and readability improvements

✅ CORRECTED CODE:
- Provide the fixed/improved version of the code

Keep your response concise and practical.
`
}

// ─────────────────────────────────────────
// KEYBOARD SHORTCUT HANDLER
// ─────────────────────────────────────────
chrome.commands.onCommand.addListener((command) => {
  if (command === 'trigger-debug') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'TRIGGER_DEBUG' })
    })
  }
})
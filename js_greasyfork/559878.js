// ==UserScript==
// @name         115.com Magnet Link Auto-Adder
// @namespace    http://troublesis.com/
// @version      1.1
// @description  Automatically add magnet links from clipboard to 115.com offline tasks
// @author       troublesis
// @match        https://115.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559878/115com%20Magnet%20Link%20Auto-Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/559878/115com%20Magnet%20Link%20Auto-Adder.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // Guard against multiple instances in iframes or re-injections
  if (window.self !== window.top) return
  if (window.__115_magnet_adder_running) return
  window.__115_magnet_adder_running = true

  // State management
  const state = {
    lastClipboard: '',
    isUserActive: false,
    isProcessing: false,
    lastCheckTime: 0,
    initialized: false,
  }

  // --- Configuration ---
  const CONFIG = {
    CHECK_INTERVAL: 2000,
    ELEMENT_TIMEOUT: 15000,
    TARGET_SELECTOR: '#js_offline_new_add',
    MAGNET_REGEX:
      /magnet:\?xt=urn:(?:btih|btmh):([a-z2-7]{32,40}|[a-f0-9]{40,64})/i,
  }

  // --- Utility Functions ---

  async function waitForElement(selector, timeout = CONFIG.ELEMENT_TIMEOUT) {
    const startTime = Date.now()
    while (Date.now() - startTime < timeout) {
      const element = document.querySelector(selector)
      if (element) return element
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    return null
  }

  function extractMagnetHash(link) {
    const match = link.match(CONFIG.MAGNET_REGEX)
    return match ? match[1].toLowerCase() : null
  }

  function getExistingHashes(content) {
    if (!content) return new Set()
    const lines = content.split('\n')
    const hashes = new Set()
    for (const line of lines) {
      const hash = extractMagnetHash(line)
      if (hash) hashes.add(hash)
    }
    return hashes
  }

  // --- UI Components ---

  const Toast = {
    container: null,

    init() {
      if (this.container) return
      this.container = document.createElement('div')
      this.container.id = 'magnet-adder-toast-container'
      Object.assign(this.container.style, {
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: '2147483647',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        pointerEvents: 'none',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      })
      document.body.appendChild(this.container)
    },

    show(message, type = 'info', duration = 4000) {
      this.init()

      const colors = {
        success: { bg: '#10b981', icon: 'Check', text: '#fff' },
        error: { bg: '#ef4444', icon: '!', text: '#fff' },
        info: { bg: '#3b82f6', icon: 'i', text: '#fff' },
        warning: { bg: '#f59e0b', icon: '!', text: '#fff' },
      }[type] || { bg: '#1f2937', icon: '', text: '#fff' }

      const toast = document.createElement('div')
      Object.assign(toast.style, {
        background: colors.bg,
        color: colors.text,
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.5',
        minWidth: '240px',
        maxWidth: '400px',
        transform: 'translateX(120%)',
        opacity: '0',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      })

      const icon = document.createElement('span')
      icon.textContent = colors.icon
      Object.assign(icon.style, {
        width: '20px',
        height: '20px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        flexShrink: '0',
      })

      const text = document.createElement('div')
      text.textContent = message

      toast.appendChild(icon)
      toast.appendChild(text)
      this.container.appendChild(toast)

      // Trigger animation
      requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)'
        toast.style.opacity = '1'
      })

      // Removal
      const hide = () => {
        toast.style.transform = 'translateX(120%)'
        toast.style.opacity = '0'
        setTimeout(() => toast.remove(), 400)
      }

      setTimeout(hide, duration)
      toast.onclick = hide
    },
  }

  // --- Core Logic ---

  async function getClipboardContent() {
    if (!state.isUserActive) return state.lastClipboard

    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText()
        if (text) {
          state.lastClipboard = text
          state.isUserActive = false // Reset after successful read
          return text
        }
      }
    } catch (err) {
      // Common error: document not focused. We'll just wait for the next active period.
    }
    return state.lastClipboard
  }

  async function processClipboard() {
    if (state.isProcessing) return
    state.isProcessing = true

    try {
      const clipboardText = await getClipboardContent()
      if (!clipboardText) return

      const hash = extractMagnetHash(clipboardText)
      if (!hash) return

      const input = document.querySelector(CONFIG.TARGET_SELECTOR)
      if (!input) {
        // We found a magnet but the UI isn't ready. This shouldn't happen
        // normally if we're initialized, but worth checking.
        return
      }

      const currentContent = input.value || ''
      const existingHashes = getExistingHashes(currentContent)

      if (existingHashes.has(hash)) {
        return // Already in the list
      }

      // Append and trigger events
      const magnetLink = clipboardText.trim()
      const newContent = currentContent
        ? currentContent.trim() + '\n' + magnetLink
        : magnetLink

      input.value = newContent

      // Notify page logic
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))

      Toast.show('Magnet link detected and added!', 'success')
    } catch (err) {
      console.error('[115 Magnet Adder] Processing error:', err)
    } finally {
      state.isProcessing = false
    }
  }

  function setupActivityListeners() {
    const handleActivity = () => {
      state.isUserActive = true
    }
    ;['click', 'keydown', 'focus', 'paste'].forEach(type => {
      document.addEventListener(type, handleActivity, { passive: true })
    })
  }

  async function initialize() {
    try {
      // Find the element first
      const input = await waitForElement(CONFIG.TARGET_SELECTOR)

      if (!input) {
        // Silently fail if not on the right page or element not found
        // Don't show toast here as it might be annoying on pages where it's not expected
        console.warn(
          `[115 Magnet Adder] Could not find target element ${CONFIG.TARGET_SELECTOR}`
        )
        return
      }

      setupActivityListeners()

      // Regular monitoring
      setInterval(processClipboard, CONFIG.CHECK_INTERVAL)

      state.initialized = true
      Toast.show('Magnet Link Monitor Active', 'info', 2000)
      console.log('[115 Magnet Adder] Initialized successfully')
    } catch (err) {
      console.error('[115 Magnet Adder] Init error:', err)
      // Only show error if we're reasonably sure we should be on a page where this works
      if (window.location.href.includes('115.com')) {
        Toast.show('Failed to initialize Magnet Monitor', 'error')
      }
    }
  }

  // Execution
  const readyState = document.readyState
  if (readyState === 'complete' || readyState === 'interactive') {
    initialize()
  } else {
    document.addEventListener('DOMContentLoaded', initialize)
  }
})()

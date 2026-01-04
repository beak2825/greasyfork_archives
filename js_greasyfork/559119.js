// ==UserScript==
// @name         Mobile Base64 Text Decoder
// @version      1.6
// @description  Base64 decoder with movable toggle button, mobile touch support, toast, Tampermonkey menu, color picker, and gesture support
// @match        *://*/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @noframes
// @namespace https://greasyfork.org/users/1548859
// @downloadURL https://update.greasyfork.org/scripts/559119/Mobile%20Base64%20Text%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/559119/Mobile%20Base64%20Text%20Decoder.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  if (window.top !== window.self) return

  const BTN_ID = 'b64-mobile-toggle-btn'
  if (document.getElementById(BTN_ID)) return

  const DEFAULT_PREFS = { autoCopy: false, toastDuration: 1200, colorIndex: 0 }
  const prefs = Object.assign({}, DEFAULT_PREFS, GM_getValue('b64MobileDecoderPrefs', {}))
  const menuIds = {}

  // ==============================
  // 🎨 CSS Styles
  // ==============================
  GM_addStyle(`
.b64-toggle-btn {
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  max-height: 300px;
  overflow: auto;
  z-index: 2147483647;
  user-select: none;
  transition: background 0.2s, box-shadow 0.2s;
  pointer-events: auto;
}
.b64-toggle-btn.active {
  background: var(--accent-color, rgba(0,128,255,0.8));
  box-shadow: 0 0 8px 2px var(--accent-color, rgba(0,128,255,0.8));
}
.b64-toast {
  position: fixed;
  padding: 6px 12px;
  background: rgba(0,0,0,0.8);
  color: var(--accent-color, #0f0);
  font-size: 12px;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 2147483647;
}
.b64-toast.show {
  opacity: 1;
}
.b64-float {
  position: absolute;
  padding: 10px;
  background: rgba(0,0,0,0.8);
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
  z-index: 2147483647;
  display: none;
  max-width: 80%;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  user-select: none;
  cursor: pointer;
}
.b64-color-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 2147483647;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px;
}
.b64-color-swatch {
  width: 40px; height: 40px;
  border-radius: 20px;
  margin: 10px;
  border: 2px solid #fff;
  cursor: pointer;
}
.b64-color-done {
  flex-basis: 100%;
  margin-top: 20px;
  padding: 10px 20px;
  background: #fff;
  color: #000;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}
`)

  // ==============================
  // 🧱 UI Elements
  // ==============================
  const toggleBtn = document.createElement('div')
  toggleBtn.id = BTN_ID
  toggleBtn.className = 'b64-toggle-btn'
  toggleBtn.textContent = 'B64'
  document.body.appendChild(toggleBtn)

  const toast = document.createElement('div')
  toast.className = 'b64-toast'
  document.body.appendChild(toast)

  let floatingWin = null
  function getFloating() {
    if (floatingWin) return floatingWin
    const win = document.createElement('div')
    win.className = 'b64-float'
    document.body.appendChild(win)
    win.addEventListener('click', e => {
      e.stopPropagation()
      if (decodedText) {
        copyToClipboard(decodedText)
        showToast('Copied ✓')
      }
    })
    floatingWin = win
    return win
  }

  function showToast(msg) {
    const color = COLORS[prefs.colorIndex %COLORS.length];
    toast.style.color = color;
    toast.textContent = msg
    toast.style.display = 'block'
    const btnRect = toggleBtn.getBoundingClientRect()
    const toastW = toast.offsetWidth
    const left = btnRect.left + (btnRect.width - toastW) / 2
    const top = btnRect.bottom + 8
    toast.style.left = `${left}px`
    toast.style.top = `${top}px`
    toast.classList.add('show')
    setTimeout(() => {
      toast.classList.remove('show')
      toast.style.display = 'none'
    }, prefs.toastDuration)
  }

  // ==============================
  // 🎨 Color Palette & Initial Color
  // ==============================
  const COLORS = [
    'rgba(0,124,62,0.8)', // green
    'rgba(0,128,255,0.8)', // blue
    'rgba(255,64,64,0.8)', // red
    'rgba(255,165,0,0.8)', // orange
    'rgba(128,0,255,0.8)' // purple
  ]

  function applyUIColor() {
    const color = COLORS[prefs.colorIndex % COLORS.length]
    toggleBtn.style.setProperty('--accent-color', color)
  }

  applyUIColor()

  // Double-tap gesture to cycle colors
  let lastTap = 0
  toggleBtn.addEventListener('touchend', e => {
    const now = Date.now()
    if (now - lastTap < 300) {
      prefs.colorIndex = (prefs.colorIndex + 1) % COLORS.length
      GM_setValue('b64MobileDecoderPrefs', prefs)
      applyUIColor()
      showToast('Color changed')
      e.preventDefault()
    }
    lastTap = now
  }, { passive: false })


  // ==============================
  // 🛠️ Tampermonkey Menu
  // ==============================
  function registerMenu() {
    if (typeof GM_registerMenuCommand !== 'function') return

    // Unregister old commands to prevent duplicates
    if (menuIds.toggleBtn) GM_unregisterMenuCommand(menuIds.toggleBtn)
    if (menuIds.autoCopy) GM_unregisterMenuCommand(menuIds.autoCopy)
    if (menuIds.toastDuration) GM_unregisterMenuCommand(menuIds.toastDuration)
    if (menuIds.resetPos) GM_unregisterMenuCommand(menuIds.resetPos)
    if (menuIds.changeColor) GM_unregisterMenuCommand(menuIds.changeColor)

    // Toggle button visibility
    menuIds.toggleBtn = GM_registerMenuCommand(
      toggleBtn.style.display === 'none' ? 'Show B64' : 'Hide B64',
      () => {
        toggleBtn.style.display = toggleBtn.style.display === 'none' ? '' : 'none'
        registerMenu()
      }
    )

    // Auto-copy toggle
    menuIds.autoCopy = GM_registerMenuCommand(
      prefs.autoCopy ? 'Auto-Copy: ON' : 'Auto-Copy: OFF',
      () => {
        prefs.autoCopy = !prefs.autoCopy
        GM_setValue('b64MobileDecoderPrefs', prefs)
        showToast(`Auto-Copy ${prefs.autoCopy ? 'Enabled' : 'Disabled'}`)
        registerMenu()
      }
    )

    // Toast duration
    menuIds.toastDuration = GM_registerMenuCommand(
      'Set Toast Duration (ms)',
      () => {
        const v = parseInt(prompt('Toast duration in ms:', prefs.toastDuration), 10)
        if (!isNaN(v) && v >= 200) {
          prefs.toastDuration = v
          GM_setValue('b64MobileDecoderPrefs', prefs)
          showToast(`Toast: ${v}ms`)
        } else {
          showToast('Invalid duration')
        }
        registerMenu()
      }
    )

    // Reset button position
    menuIds.resetPos = GM_registerMenuCommand(
      'Restore Button Position',
      () => {
        setBtnPosition(null, true)
        showToast('Position reset')
        registerMenu()
      }
    )

    // Change button color
    menuIds.changeColor = GM_registerMenuCommand(
      'Change Button Color',
      () => showColorPickerOverlay()
    )
  }

  // ==============================
  // 🎨 Color Picker Overlay (Menu + Gesture)
  // ==============================
  function showColorPickerOverlay() {
    if (document.querySelector('.b64-color-overlay')) return

    const overlay = document.createElement('div')
    overlay.className = 'b64-color-overlay'

    COLORS.forEach((c, i) => {
      const swatch = document.createElement('div')
      swatch.className = 'b64-color-swatch'
      swatch.style.background = c
      swatch.addEventListener('click', () => {
        prefs.colorIndex = i
        GM_setValue('b64MobileDecoderPrefs', prefs)
        applyUIColor()
        showToast('Color selected')
        overlay.remove()
      })
      overlay.appendChild(swatch)
    })

    const doneBtn = document.createElement('div')
    doneBtn.className = 'b64-color-done'
    doneBtn.textContent = 'Done'
    doneBtn.addEventListener('click', () => overlay.remove())
    overlay.appendChild(doneBtn)

    document.body.appendChild(overlay)
  }

  // Register menu at startup
  registerMenu()


// ==============================
  // 📍 Button Positioning & Dragging
  // ==============================
  let isActive = false
  let dragging = false
  let startX = 0
  let startY = 0
  let origX = 0
  let origY = 0
  const DRAG_THRESHOLD = 8
  const savedPos = GM_getValue('b64MobileBtnPos', {})

  function setBtnPosition(saved, clearPrefs) {
    toggleBtn.style.right = 'auto'
    toggleBtn.style.bottom = 'auto'
    const btnW = toggleBtn.offsetWidth
    const btnH = toggleBtn.offsetHeight
    const dw = document.documentElement.clientWidth
    const dh = document.documentElement.clientHeight

    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
      let x = Math.min(Math.max(0, saved.x), dw - btnW)
      let y = Math.min(Math.max(0, saved.y), dh - btnH)
      toggleBtn.style.left = x + 'px'
      toggleBtn.style.top = y + 'px'
    } else {
      toggleBtn.style.left = (dw - btnW - 20) + 'px'
      toggleBtn.style.top = (dh - btnH - 20) + 'px'
      if (clearPrefs) GM_setValue('b64MobileBtnPos', {})
    }
  }

  setBtnPosition(savedPos, false)

  toggleBtn.addEventListener('touchstart', e => {
    const touch = e.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    const r = toggleBtn.getBoundingClientRect()
    origX = r.left
    origY = r.top
    dragging = !isActive // can drag only if inactive
    e.preventDefault()
  }, { passive: false })

  window.addEventListener('touchmove', e => {
    if (!dragging) return
    const touch = e.touches[0]
    const dx = touch.clientX - startX
    const dy = touch.clientY - startY
    if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return

    const btnW = toggleBtn.offsetWidth
    const btnH = toggleBtn.offsetHeight
    const maxX = document.documentElement.clientWidth - btnW
    const maxY = document.documentElement.clientHeight - btnH
    const newX = Math.min(Math.max(0, origX + dx), maxX)
    const newY = Math.min(Math.max(0, origY + dy), maxY)

    toggleBtn.style.left = newX + 'px'
    toggleBtn.style.top = newY + 'px'
  }, { passive: false })

  window.addEventListener('touchend', e => {
    const touch = e.changedTouches[0]
    const dx = touch.clientX - startX
    const dy = touch.clientY - startY
    dragging = false
    if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
      isActive = !isActive
      toggleBtn.classList.toggle('active', isActive)
      showToast(isActive ? 'Decoder ON' : 'Decoder OFF')
    } else {
      GM_setValue('b64MobileBtnPos', {
        x: parseInt(toggleBtn.style.left, 10),
        y: parseInt(toggleBtn.style.top, 10)
      })
    }
  }, { passive: false })

  // ==============================
  // 📋 Clipboard Copying
  // ==============================
  function copyToClipboard(s) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(s).catch(() => fallbackCopy(s))
    } else fallbackCopy(s)
  }

  function fallbackCopy(s) {
    const ta = document.createElement('textarea')
    ta.value = s
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }

  // ==============================
  // 🔍 Base64 Detection & Decoding
  // ==============================
  let decodeTimer = null
  let decodedText = ''

  function isLikelyBase64(s) {
    const c = s.trim().replace(/\s+/g, '').replace(/[-_]/g, m => m === '-' ? '+' : '/')
    if (!/^[A-Za-z0-9+/=]+$/.test(c) || c.length % 4 !== 0) return false
    const p = c.indexOf('=')
    if (p > -1) {
      const cnt = c.length - p
      if (cnt > 2 || p !== c.length - cnt) return false
    }
    return true
  }

  function decodeBase64(s) {
    try {
      const norm = s.trim().replace(/\s+/g, '').replace(/\u200B/g, '').replace(/[-_]/g, m => m === '-' ? '+' : '/')
      const bin = atob(norm)
      const bytes = Uint8Array.from(bin, ch => ch.charCodeAt(0))
      const out = new TextDecoder('utf-8').decode(bytes)
      const bad = [...out].filter(ch => {
        const code = ch.charCodeAt(0)
        return code < 32 || code > 126
      }).length
      return bad / out.length > 0.2 ? null : out
    } catch {
      return null
    }
  }

  // ==============================
  // 🧠 Selection Monitoring
  // ==============================
  document.addEventListener('selectionchange', () => {
    if (!isActive) return
    clearTimeout(decodeTimer)
    const txt = window.getSelection().toString().trim().replace(/\u200B/g, '')
    if (!txt || !isLikelyBase64(txt)) {
      if (floatingWin) floatingWin.style.display = 'none'
      return
    }
    decodeTimer = setTimeout(() => {
      const sel = window.getSelection()
      if (!sel.rangeCount) return
      const out = decodeBase64(txt)
      if (!out) return
      decodedText = out
      const win = getFloating()
      win.textContent = `Decoded: ${out}`
      win.style.display = 'block'
      if (prefs.autoCopy) {
        copyToClipboard(out)
        showToast('Copied ✓')
      }
      const r = sel.getRangeAt(0).getBoundingClientRect()
      let x = r.left + scrollX
      let y = r.bottom + scrollY + 5
      const w = win.offsetWidth
      const h = win.offsetHeight
      x = Math.min(Math.max(scrollX + 10, x), document.documentElement.clientWidth + scrollX - w - 10)
      if (y + h > innerHeight + scrollY - 10) y = r.top + scrollY - h - 5
      win.style.left = x + 'px'
      win.style.top = y + 'px'
    }, 200)
  })

  // ==============================
  // 🚫 Touch Dismiss Floating Window
  // ==============================
  document.addEventListener('touchstart', e => {
    if (floatingWin && !floatingWin.contains(e.target)) {
      floatingWin.style.display = 'none'
    }
  }, { passive: false })

  // ==============================
  // 📱 Orientation-Aware Resize Handler
  // ==============================
  let lastScreenWidth = document.documentElement.clientWidth
  let resizeTimer = null

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const btnW = toggleBtn.offsetWidth
      const btnH = toggleBtn.offsetHeight
      const newScreenWidth = document.documentElement.clientWidth
      const newScreenHeight = document.documentElement.clientHeight
      let x = parseInt(toggleBtn.style.left, 10)
      let y = parseInt(toggleBtn.style.top, 10)
      if (isNaN(x) || isNaN(y)) return

      // Clamp to screen bounds to prevent off-screen in landscape
      x = Math.min(Math.max(0, x), newScreenWidth - btnW)
      y = Math.min(Math.max(0, y), newScreenHeight - btnH)

      toggleBtn.style.left = x + 'px'
      toggleBtn.style.top = y + 'px'
      toggleBtn.classList.toggle('active', isActive)
      GM_setValue('b64MobileBtnPos', { x, y })

      lastScreenWidth = newScreenWidth
    }, 100)
  })

  // ==============================
  // 📐 Mobile Viewport Optimization
  // ==============================
  const meta = document.createElement('meta')
  meta.name = 'viewport'
  meta.content = 'width=device-width, initial-scale=1.0'
  document.head.appendChild(meta)

})();
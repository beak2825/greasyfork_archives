// ==UserScript==
// @name         Show Page URL Bar
// @namespace    https://tampermonkey.net/
// @version      3.5.1
// @description  Overlay URL bar with Q+click position toggle and copy support
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564188/Show%20Page%20URL%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/564188/Show%20Page%20URL%20Bar.meta.js
// ==/UserScript==

(() => {
  const HEIGHT = 20
  const BAR_ID = '__tm_url_bar__'
  const BG_ALPHA = 0.85
  const STORE_KEY = '__tm_url_bar_bottom_hosts__'

  let currentUrl = location.href
  let urlSpan
  let hintSpan
  let statusSpan
  let isQPressed = false
  let isBottom = false

  const host = location.hostname

  /* ---------- storage ---------- */

  const loadBottomHosts = () => {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '[]')
    } catch {
      return []
    }
  }

  const saveBottomHosts = list => {
    localStorage.setItem(STORE_KEY, JSON.stringify(list))
  }

  const initPositionFromStorage = () => {
    const list = loadBottomHosts()
    isBottom = list.includes(host)
  }

  const toggleHostPosition = () => {
    const list = loadBottomHosts()
    const idx = list.indexOf(host)

    if (idx === -1) {
      list.push(host)
      isBottom = true
    } else {
      list.splice(idx, 1)
      isBottom = false
    }

    saveBottomHosts(list)
    applyPosition()
  }

  /* ---------- utils ---------- */

  const getPathOnly = () => {
    try {
      return new URL(location.href).pathname
    } catch {
      return location.pathname
    }
  }

  const applyPosition = () => {
    const bar = document.getElementById(BAR_ID)
    if (!bar) return

    if (isBottom) {
      bar.style.top = 'auto'
      bar.style.bottom = '0'
      hintSpan.textContent = 'Q+Click: Top'
    } else {
      bar.style.bottom = 'auto'
      bar.style.top = '0'
      hintSpan.textContent = 'Q+Click: Bottom'
    }
  }

  /* ---------- key state ---------- */

  window.addEventListener('keydown', e => {
    if (e.key === 'q' || e.key === 'Q') isQPressed = true
  })

  window.addEventListener('keyup', e => {
    if (e.key === 'q' || e.key === 'Q') isQPressed = false
  })

  /* ---------- bar ---------- */

  const createBar = () => {
    if (document.getElementById(BAR_ID)) return

    initPositionFromStorage()

    const bar = document.createElement('div')
    bar.id = BAR_ID

    urlSpan = document.createElement('span')
    hintSpan = document.createElement('span')
    statusSpan = document.createElement('span')

    urlSpan.textContent = currentUrl

    urlSpan.style.cssText = `
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `

    hintSpan.style.cssText = `
      flex-shrink: 0;
      margin-left: 10px;
      opacity: 0.7;
      font-size: 9px;
      user-select: none;
    `

    statusSpan.style.cssText = `
      flex-shrink: 0;
      margin-left: 8px;
      opacity: 0.7;
      font-size: 9px;
      user-select: none;
    `

    bar.append(urlSpan, hintSpan, statusSpan)

    bar.style.cssText = `
      position: fixed;
      left: 0;
      width: 100%;
      height: ${HEIGHT}px;
      line-height: ${HEIGHT}px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      background: rgba(0,0,0,${BG_ALPHA});
      color: #eee;
      font-size: 10px;
      font-family: monospace;
      z-index: 2147483647;
      box-sizing: border-box;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: top 0.25s ease, bottom 0.25s ease;
    `

    bar.addEventListener('click', () => {
      // Q + click => toggle position
      if (isQPressed) {
        toggleHostPosition()
        return
      }

      // normal click => copy full URL
      GM_setClipboard(currentUrl)
      statusSpan.textContent = 'Copied URL ✓'
      setTimeout(() => (statusSpan.textContent = ''), 600)
    })

    bar.addEventListener('dblclick', () => {
      const path = getPathOnly()
      GM_setClipboard(path)
      statusSpan.textContent = 'Copied Path ✓'
      setTimeout(() => (statusSpan.textContent = ''), 600)
    })

    document.documentElement.appendChild(bar)
    applyPosition()
  }

  /* ---------- url sync ---------- */

  const onRouteChange = () => {
    const next = location.href
    if (next === currentUrl) return
    currentUrl = next
    if (urlSpan) urlSpan.textContent = currentUrl
  }

  const hookHistory = () => {
    const wrap = k => {
      const orig = history[k]
      history[k] = function () {
        const r = orig.apply(this, arguments)
        onRouteChange()
        return r
      }
    }

    wrap('pushState')
    wrap('replaceState')
    window.addEventListener('popstate', onRouteChange)
  }

  createBar()
  hookHistory()
})()

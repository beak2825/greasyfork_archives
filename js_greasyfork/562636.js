// ==UserScript==
// @name         Show Page URL Bar (Ultra Performance Final)
// @namespace    https://tampermonkey.net/
// @version      2.1.1
// @description  Instant URL bar, ultra low overhead, SPA safe, dblclick copy path
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562636/Show%20Page%20URL%20Bar%20%28Ultra%20Performance%20Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562636/Show%20Page%20URL%20Bar%20%28Ultra%20Performance%20Final%29.meta.js
// ==/UserScript==

(() => {
  const HEIGHT = 20
  const BAR_ID = '__tm_url_bar__'
  const SHIFT_MARK = '__tm_shifted__'
  const HTML_PAD_MARK = '__tm_html_padded__'

  let currentUrl = location.href
  let urlSpan
  let statusSpan

  /* ---------- tiny utils ---------- */

  const set = (el, k, v) => el.style.setProperty(k, v, 'important')

  const setBatch = (el, styles) => {
    for (const k in styles) set(el, k, styles[k])
  }

  const getPathOnly = () => {
    try {
      return new URL(location.href).pathname
    } catch {
      return location.pathname
    }
  }

  /* ---------- html padding (once) ---------- */

  const padHtmlTop = () => {
    const html = document.documentElement
    if (html.dataset[HTML_PAD_MARK]) return

    const current = parseInt(getComputedStyle(html).paddingTop || 0)
    set(html, 'padding-top', current + HEIGHT + 'px')
    html.dataset[HTML_PAD_MARK] = '1'
  }

  /* ---------- bar (early render) ---------- */

  const createBarEarly = () => {
    if (document.getElementById(BAR_ID)) return

    const bar = document.createElement('div')
    bar.id = BAR_ID

    urlSpan = document.createElement('span')
    urlSpan.textContent = currentUrl

    statusSpan = document.createElement('span')
    setBatch(statusSpan, {
      'margin-left': '8px',
      opacity: '0.7',
    })

    bar.append(urlSpan, statusSpan)

    setBatch(bar, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100%',
      height: HEIGHT + 'px',
      'line-height': HEIGHT + 'px',
      padding: '0 8px',
      background: '#000',
      color: '#eee',
      'font-size': '10px',
      'font-family': 'monospace',
      'text-align': 'start',
      'z-index': '2147483647',
      'box-sizing': 'border-box',
      'white-space': 'nowrap',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      cursor: 'pointer',
    })

    // 单击：复制完整 URL
    bar.onclick = () => {
      GM_setClipboard(currentUrl)
      statusSpan.textContent = 'Copied URL ✓'
      setTimeout(() => (statusSpan.textContent = ''), 600)
    }

    // 双击：仅复制 pathname（无 hostname / query / hash）
    bar.ondblclick = () => {
      const path = getPathOnly()
      GM_setClipboard(path)
      statusSpan.textContent = 'Copied Path ✓'
      setTimeout(() => (statusSpan.textContent = ''), 600)
    }

    document.documentElement.appendChild(bar)
  }

  /* ---------- header shift (minimal scan) ---------- */

  const shiftHeaders = root => {
    if (!root) return

    const all = root.querySelectorAll('*')
    for (let i = 0; i < all.length; i++) {
      const el = all[i]
      if (el.id === BAR_ID || el.dataset[SHIFT_MARK]) continue

      const s = getComputedStyle(el)
      if (
        (s.position !== 'fixed' && s.position !== 'sticky') ||
        s.top !== '0px'
      ) {
        continue
      }

      const cur = parseInt(el.style.top || 0)
      el.style.setProperty('top', cur + HEIGHT + 'px', 'important')
      el.dataset[SHIFT_MARK] = '1'
    }
  }

  /* ---------- url sync ---------- */

  const onRouteChange = () => {
    const next = location.href
    if (next === currentUrl) return

    currentUrl = next
    if (urlSpan) urlSpan.textContent = currentUrl

    setTimeout(() => shiftHeaders(document.body), 0)
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

  /* ---------- mount ---------- */

  createBarEarly()
  padHtmlTop()
  hookHistory()

  document.addEventListener('DOMContentLoaded', () => {
    shiftHeaders(document.body)
  })
})()

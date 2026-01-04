// ==UserScript==
// @name         在新标签页打开链接（可取消 + 聚焦新页）
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  强制所有链接和 SPA 路由在新标签页打开并立即聚焦，新页面获得焦点，当前页保持不动。支持按域名禁用。
// @author       AvailableForTheWorld + Grok
// @match        *://*/*
// @icon         https://www.svgrepo.com/show/207466/blank-page-list.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554291/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%EF%BC%88%E5%8F%AF%E5%8F%96%E6%B6%88%20%2B%20%E8%81%9A%E7%84%A6%E6%96%B0%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554291/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5%EF%BC%88%E5%8F%AF%E5%8F%96%E6%B6%88%20%2B%20%E8%81%9A%E7%84%A6%E6%96%B0%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // 如果是由本脚本打开的新标签页，直接退出，避免干扰
  if (sessionStorage.getItem('openedByScript') === 'true') {
    sessionStorage.removeItem('openedByScript')
    return
  }

  const currentDomain = window.location.hostname
  const getDisabledDomains = () => GM_getValue('disabledDomains', {})
  const setDisabledDomains = (obj) => GM_setValue('disabledDomains', obj)

  // Check initial state
  const isDisabled = !!getDisabledDomains()[currentDomain]

  // === UI Management Panel ===
  function openSettingsPanel() {
    // Remove existing panel if any
    const existing = document.getElementById('link-jump-blank-settings')
    if (existing) existing.remove()

    const host = document.createElement('div')
    host.id = 'link-jump-blank-settings'
    document.body.appendChild(host)

    const shadow = host.attachShadow({ mode: 'open' })

    const style = `
      :host {
        all: initial;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        --primary: #6366f1;
        --primary-hover: #4f46e5;
        --danger: #ef4444;
        --bg: #ffffff;
        --bg-sub: #f9fafb;
        --text: #111827;
        --text-sub: #6b7280;
        --border: #e5e7eb;
        --radius: 16px;
        --shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      @media (prefers-color-scheme: dark) {
        :host {
          --bg: #1f2937;
          --bg-sub: #111827;
          --text: #f9fafb;
          --text-sub: #9ca3af;
          --border: #374151;
        }
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        animation: fadeIn 0.2s forwards;
      }

      .panel {
        background: var(--bg);
        color: var(--text);
        width: 480px;
        max-width: 90vw;
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        border: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.95);
        opacity: 0;
        animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      @keyframes fadeIn { to { opacity: 1; } }
      @keyframes popIn { to { opacity: 1; transform: scale(1); } }

      .header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .title-group {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .icon {
        width: 32px;
        height: 32px;
        background: var(--primary);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .title {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }

      .subtitle {
        font-size: 13px;
        color: var(--text-sub);
        margin-top: 2px;
      }

      .close-btn {
        background: transparent;
        border: none;
        color: var(--text-sub);
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .close-btn:hover {
        background: var(--bg-sub);
        color: var(--text);
      }

      .content {
        padding: 24px;
        overflow-y: auto;
        max-height: 65vh;
      }

      .hero-card {
        background: var(--bg-sub);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid var(--border);
        margin-bottom: 24px;
      }

      .domain-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .current-domain {
        font-size: 16px;
        font-weight: 600;
      }

      .status-text {
        font-size: 13px;
        color: var(--text-sub);
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text-sub);
      }
      .status-dot.active { background: #10b981; }
      .status-dot.disabled { background: var(--danger); }

      /* Toggle Switch */
      .switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 28px;
      }
      .switch input { opacity: 0; width: 0; height: 0; }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #e5e7eb;
        transition: .3s;
        border-radius: 34px;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      input:checked + .slider { background-color: var(--primary); }
      input:checked + .slider:before { transform: translateX(20px); }

      /* Dark mode switch adjustment */
      @media (prefers-color-scheme: dark) {
        .slider { background-color: #4b5563; }
      }

      .section-label {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-sub);
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
      }

      .add-group {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      .input {
        flex: 1;
        background: var(--bg);
        border: 1px solid var(--border);
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 14px;
        color: var(--text);
        transition: border-color 0.2s;
      }
      .input:focus {
        outline: none;
        border-color: var(--primary);
      }

      .btn {
        padding: 0 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: background 0.2s;
      }
      .btn-primary {
        background: var(--primary);
        color: white;
      }
      .btn-primary:hover { background: var(--primary-hover); }

      .list-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        background: var(--bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        font-size: 14px;
        transition: transform 0.2s;
      }
      .list-item:hover {
        border-color: var(--text-sub);
      }

      .edit-input {
        flex: 1;
        background: transparent;
        border: 1px solid var(--primary);
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 14px;
        color: var(--text);
        outline: none;
        margin-right: 8px;
      }

      .domain-text {
        flex: 1;
        cursor: text;
        padding: 4px 0;
      }

      .delete-btn {
        background: transparent;
        border: none;
        color: var(--text-sub);
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        display: flex;
        align-items: center;
      }
      .delete-btn:hover {
        background: #fee2e2;
        color: var(--danger);
      }

      .empty-state {
        text-align: center;
        padding: 32px 0;
        color: var(--text-sub);
        font-size: 14px;
        border: 2px dashed var(--border);
        border-radius: 12px;
      }

      .footer {
        padding: 16px 24px;
        background: var(--bg-sub);
        border-top: 1px solid var(--border);
        font-size: 12px;
        color: var(--text-sub);
        text-align: center;
      }

      .toast {
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        opacity: 0;
        transition: all 0.3s;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
      }
      .toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    `

    const disabledList = getDisabledDomains()
    const isCurrentDisabled = !!disabledList[currentDomain]

    shadow.innerHTML = `
      <style>${style}</style>
      <div class="overlay">
        <div class="panel">
          <div class="header">
            <div class="title-group">
              <div class="icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </div>
              <div>
                <h2 class="title">New Tab Manager</h2>
                <div class="subtitle">Control where links open</div>
              </div>
            </div>
            <button class="close-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div class="content">
            <div class="section-label">Current Website</div>
            <div class="hero-card">
              <div class="domain-info">
                <div class="current-domain">${currentDomain}</div>
                <div class="status-text">
                  <div class="status-dot ${
                    isCurrentDisabled ? 'disabled' : 'active'
                  }"></div>
                  ${
                    isCurrentDisabled
                      ? 'Open in same tab (Disabled)'
                      : 'Open in new tab (Active)'
                  }
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" id="toggle-current" ${
                  !isCurrentDisabled ? 'checked' : ''
                }>
                <span class="slider"></span>
              </label>
            </div>

            <div class="section-label">
              <span>Disabled Domains</span>
              <span id="count-badge">0</span>
            </div>

            <div class="add-group">
              <input type="text" class="input" id="add-input" placeholder="example.com">
              <button class="btn btn-primary" id="add-btn">Add</button>
            </div>

            <div class="list-container" id="domain-list">
              <!-- List Items -->
            </div>
          </div>

          <div class="footer">
            Changes to the current domain require a page reload.
          </div>

          <div class="toast" id="toast">Settings Saved</div>
        </div>
      </div>
    `

    // Logic
    const overlay = shadow.querySelector('.overlay')
    const closeBtn = shadow.querySelector('.close-btn')
    const toggleCurrent = shadow.querySelector('#toggle-current')
    const listContainer = shadow.querySelector('#domain-list')
    const addInput = shadow.querySelector('#add-input')
    const addBtn = shadow.querySelector('#add-btn')
    const countBadge = shadow.querySelector('#count-badge')
    const toast = shadow.querySelector('#toast')
    const statusText = shadow.querySelector('.status-text')
    const statusDot = shadow.querySelector('.status-dot')

    function close() {
      host.remove()
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close()
    })
    closeBtn.addEventListener('click', close)

    function showToast(msg) {
      toast.textContent = msg
      toast.classList.add('show')
      setTimeout(() => toast.classList.remove('show'), 2000)
    }

    function updateCurrentStatusUI(enabled) {
      if (enabled) {
        statusDot.className = 'status-dot active'
        statusText.innerHTML =
          '<div class="status-dot active"></div> Open in new tab (Active)'
      } else {
        statusDot.className = 'status-dot disabled'
        statusText.innerHTML =
          '<div class="status-dot disabled"></div> Open in same tab (Disabled)'
      }
    }

    // Toggle Current
    toggleCurrent.addEventListener('change', (e) => {
      const enabled = e.target.checked
      const domains = getDisabledDomains()

      if (enabled) {
        delete domains[currentDomain]
      } else {
        domains[currentDomain] = true
      }

      setDisabledDomains(domains)
      updateCurrentStatusUI(enabled)
      renderList()
      location.reload()
    })

    // Add Domain
    function handleAdd() {
      const val = addInput.value.trim()
      if (!val) return

      const domains = getDisabledDomains()
      domains[val] = true
      setDisabledDomains(domains)

      addInput.value = ''
      renderList()
      showToast(`Added ${val}`)

      if (val === currentDomain) {
        toggleCurrent.checked = false
        updateCurrentStatusUI(false)
      }
    }
    addBtn.addEventListener('click', handleAdd)
    addInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') handleAdd()
    })

    // Render List
    function renderList() {
      const domains = getDisabledDomains()
      const keys = Object.keys(domains).sort()

      countBadge.textContent = keys.length

      if (keys.length === 0) {
        listContainer.innerHTML =
          '<div class="empty-state">No disabled domains</div>'
        return
      }

      listContainer.innerHTML = keys
        .map(
          (domain) => `
        <div class="list-item">
          <span class="domain-text" title="Click to edit">${domain}</span>
          <button class="delete-btn" data-domain="${domain}" title="Remove rule">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      `
        )
        .join('')

      shadow.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const d = btn.dataset.domain
          const current = getDisabledDomains()
          delete current[d]
          setDisabledDomains(current)
          renderList()
          showToast('Rule removed')

          if (d === currentDomain) {
            toggleCurrent.checked = true
            updateCurrentStatusUI(true)
          }
        })
      })

      shadow.querySelectorAll('.domain-text').forEach((span) => {
        span.addEventListener('click', () => {
          const originalDomain = span.textContent
          const input = document.createElement('input')
          input.type = 'text'
          input.value = originalDomain
          input.className = 'edit-input'

          const save = () => {
            const newDomain = input.value.trim()
            if (newDomain && newDomain !== originalDomain) {
              const current = getDisabledDomains()
              delete current[originalDomain]
              current[newDomain] = true
              setDisabledDomains(current)

              if (
                originalDomain === currentDomain ||
                newDomain === currentDomain
              ) {
                const isCurDisabled = !!current[currentDomain]
                toggleCurrent.checked = !isCurDisabled
                updateCurrentStatusUI(!isCurDisabled)
              }
              showToast('Updated')
            }
            renderList()
          }

          input.addEventListener('blur', save)
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur()
          })

          span.replaceWith(input)
          input.focus()
        })
      })
    }

    renderList()
  }

  // === Register Menu ===
  GM_registerMenuCommand('⚙️ Configure New Tab Rules', openSettingsPanel)

  // If current domain is disabled, we still register the menu command so user can re-enable it.
  // But we stop the auto-open logic.
  if (isDisabled) {
    console.log(`【New Tab Script】Disabled on ${currentDomain}`)
    return
  }

  // === 1. Global Click Interception ===
  // 使用捕获阶段拦截所有点击，防止原页面跳转（通过 stopPropagation）
  // ... (Logic continues below)

  let lastOpenTime = 0
  let lastOpenUrl = ''
  let lastTriggerTime = 0

  function safeOpenInTab(url, options = {}) {
    const now = Date.now()
    if (now - lastOpenTime < 2000 && url === lastOpenUrl) {
      console.log('【新标签页脚本】拦截重复打开:', url)
      return
    }
    lastOpenTime = now
    lastOpenUrl = url

    // 默认立即聚焦新标签页
    const finalOptions = { active: true, ...options }
    GM_openInTab(url, finalOptions)
  }

  window.addEventListener(
    'click',
    (e) => {
      // 1. 如果按下了修饰键（Ctrl/Meta/Shift/Alt），由浏览器默认处理（通常是后台打开或新窗口）
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return
      // 2. 仅处理鼠标左键
      if (e.button !== 0) return

      let target = e.target
      while (target && target.tagName !== 'A') {
        target = target.parentNode
      }

      if (!target || !target.href) return

      // 忽略非 HTTP 协议链接 (javascript:, tel:, mailto: 等)
      if (!target.href.startsWith('http')) return

      // 检查是否为本页锚点跳转
      try {
        const urlObj = new URL(target.href)
        if (
          urlObj.origin === location.origin &&
          urlObj.pathname === location.pathname &&
          urlObj.search === location.search
        ) {
          return // 仅哈希变化或相同页面，允许默认行为
        }
      } catch (err) {
        return
      }

      // === 拦截逻辑 ===
      // 阻止默认行为（防止原页面跳转）和冒泡（防止网站 SPA 路由接管）
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()

      const url = target.href

      // 记录触发时间，通知 pushState/replaceState 忽略
      lastTriggerTime = Date.now()
      sessionStorage.setItem('openedByScript', 'true')

      console.log('【新标签页脚本】拦截点击 → 新标签页打开:', url)
      safeOpenInTab(url, { active: true })
    },
    true // Capture phase
  )

  // === 2. 辅助功能：给链接添加 _blank 样式（视觉提示）===
  // 虽然点击被拦截了，但保留这个为了让用户 hover 时看到 cursor 变化或浏览器提示
  function setTargetBlank(node) {
    if (node.tagName === 'A' && (!node.target || node.target === '_self')) {
      node.target = '_blank'
      node.rel = 'noopener noreferrer'
    }
  }

  function processLinks() {
    document.querySelectorAll('a').forEach(setTargetBlank)
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return
        setTargetBlank(node)
        if (node.querySelectorAll)
          node.querySelectorAll('a').forEach(setTargetBlank)
      })
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })
  processLinks()

  // === 3. 拦截 SPA 路由（pushState / hashchange）===
  const origPushState = history.pushState
  const origReplaceState = history.replaceState

  history.pushState = function (state, title, url) {
    if (!url || typeof url !== 'string')
      return origPushState.apply(this, arguments)

    let fullUrl = url
    try {
      fullUrl = new URL(url, location.href).href
    } catch {}

    if (fullUrl === location.href) return origPushState.apply(this, arguments)

    // 如果最近刚点击过链接（被 click 拦截处理了），则忽略此次 pushState
    if (Date.now() - lastTriggerTime < 2000) return

    lastTriggerTime = Date.now()
    sessionStorage.setItem('openedByScript', 'true')
    setTimeout(() => safeOpenInTab(fullUrl, { active: true }), 50)

    console.log('【新标签页脚本】拦截 pushState → 新标签页打开:', fullUrl)
    // 不调用 origPushState
  }

  history.replaceState = function (state, title, url) {
    lastTriggerTime = Date.now()
    lastOpenTime = Date.now()
    if (typeof url === 'string') lastOpenUrl = url
    return origReplaceState.apply(this, arguments)
  }

  window.addEventListener('hashchange', (e) => {
    if (Date.now() - lastTriggerTime < 2000) return
    lastTriggerTime = Date.now()
    sessionStorage.setItem('openedByScript', 'true')
    setTimeout(() => safeOpenInTab(e.newURL, { active: true }), 50)
    console.log('【新标签页脚本】hashchange → 新标签页打开:', e.newURL)
  })

  // === 4. 拦截 window.open ===
  const origOpen = window.open
  window.open = function (url, name, features) {
    if (typeof url === 'string' && url) {
      let fullUrl = url
      try {
        fullUrl = new URL(url, location.href).href
      } catch {}
      if (fullUrl !== location.href) {
        sessionStorage.setItem('openedByScript', 'true')
        safeOpenInTab(fullUrl, { active: true })
        return null
      }
    }
    return origOpen.apply(this, arguments)
  }

  console.log(
    '【新标签页强制脚本】已激活（聚焦新页模式） - 当前域名:',
    currentDomain
  )
})()

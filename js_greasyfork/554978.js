// ==UserScript==
// @name         Discourse 话题预览按钮 (Topic Preview Button) - 侧边栏 & JSON版
// @namespace    https://github.com/stevessr/bug-v3
// @version      1.6.0
// @description  为 Discourse 话题列表添加预览按钮与快捷回复功能，支持侧边栏无感停靠与 JSON 预览，支持最小化到侧边悬浮球，支持下拉切换模式
// @author       stevessr
// @match        https://linux.do/*
// @match        https://meta.discourse.org/*
// @match        https://*.discourse.org/*
// @match        http://localhost:5173/*
// @exclude      https://linux.do/a/*
// @match        https://idcflare.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554978/Discourse%20%E8%AF%9D%E9%A2%98%E9%A2%84%E8%A7%88%E6%8C%89%E9%92%AE%20%28Topic%20Preview%20Button%29%20-%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%20%20JSON%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/554978/Discourse%20%E8%AF%9D%E9%A2%98%E9%A2%84%E8%A7%88%E6%8C%89%E9%92%AE%20%28Topic%20Preview%20Button%29%20-%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%20%20JSON%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // ===== Utility Functions =====

  function createEl(tag, opts) {
    const el = document.createElement(tag)
    if (!opts) return el
    if (opts.className) el.className = opts.className
    if (opts.text) el.textContent = opts.text
    if (opts.value) el.value = opts.value
    if (opts.style) el.style.cssText = opts.style
    if (opts.attrs) for (const k in opts.attrs) el.setAttribute(k, opts.attrs[k])
    if (opts.dataset) for (const k in opts.dataset) el.dataset[k] = opts.dataset[k]
    if (opts.innerHTML) el.innerHTML = opts.innerHTML
    if (opts.title) el.title = opts.title
    if (opts.id) el.id = opts.id
    if (opts.rows && 'rows' in el) el.rows = opts.rows
    if (opts.placeholder && 'placeholder' in el) el.placeholder = opts.placeholder
    if (opts.on) {
      for (const [evt, handler] of Object.entries(opts.on)) {
        el.addEventListener(evt, handler)
      }
    }
    return el
  }

  function ensureStyleInjected(id, css) {
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = css
    document.documentElement.appendChild(style)
  }

  // ===== Styles =====

  const STYLES = `
/* 遮罩层：默认全屏阻挡 */
.raw-preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;
  transition: background 0.2s ease, justify-content 0.2s;
}

/* 隐藏状态 */
.raw-preview-overlay.hidden {
  display: none !important;
}

/* 侧边停靠模式 */
.raw-preview-overlay.dock-right {
  justify-content: flex-end;
  background: transparent;
  pointer-events: none;
}

/* 模态框本体 */
.raw-preview-modal {
  width: 80%;
  height: 85%;
  background: var(--color-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
}

/* 侧边停靠时的模态框样式 */
.raw-preview-overlay.dock-right .raw-preview-modal {
  width: 550px;
  max-width: 100vw;
  height: 100vh;
  border-radius: 0;
  border-left: 1px solid rgba(0,0,0,0.1);
  box-shadow: -4px 0 20px rgba(0,0,0,0.1);
}

/* 侧边悬浮恢复按钮 */
.raw-preview-restore-btn {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 24px;
  height: 60px;
  background: var(--tertiary, #0088cc);
  color: #fff;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  z-index: 2147483648;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: -2px 0 10px rgba(0,0,0,0.2);
  font-size: 14px;
  transition: width 0.2s, background 0.2s;
}
.raw-preview-restore-btn:hover {
  width: 36px;
  background: var(--tertiary-hover, #006699);
}

.raw-preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--secondary, #f8f8f8);
  border-bottom: 1px solid rgba(0,0,0,0.08);
  flex-shrink: 0;
}
.raw-preview-title {
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary, #333);
}
.raw-preview-ctrls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.raw-preview-iframe {
  border: none;
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  background: var(--secondary, #fff);
}

/* 按钮通用样式 */
.raw-preview-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.1);
  background: var(--d-button-secondary-bg-color, #fff);
  cursor: pointer;
  color: var(--primary, #333);
  transition: background 0.2s;
}
.raw-preview-btn:hover { background: var(--d-hover, #f0f0f0); }
.raw-preview-btn.active {
  background: var(--tertiary-low, #e6f7ff);
  border-color: var(--tertiary, #0088cc);
  color: var(--tertiary, #0088cc);
}
.raw-preview-btn.close-btn { color: #d00; background: #fff5f5; border-color: #ffdcdc; }

/* 下拉框样式 */
.raw-preview-select {
  padding: 3px 6px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.1);
  background: var(--d-button-secondary-bg-color, #fff);
  color: var(--primary, #333);
  cursor: pointer;
  outline: none;
  height: 28px; /* 与按钮高度对其 */
}
.raw-preview-select:hover { background: var(--d-hover, #f0f0f0); }
.raw-preview-select:focus { border-color: var(--tertiary, #0088cc); }

/* 底部快捷回复栏 */
.quick-reply-panel {
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  border-top: 1px solid rgba(0,0,0,0.1);
  background: var(--color-bg, #fff);
  flex-shrink: 0;
  z-index: 10;
}
.quick-reply-list-container {
  max-height: 0; overflow-y: auto; transition: max-height 0.3s;
}
.quick-reply-list-container.expanded {
  max-height: 150px; margin-bottom: 8px; border-bottom: 1px solid #eee;
}
.quick-reply-item {
  padding: 6px 10px; margin-bottom: 4px; border-radius: 4px;
  background: var(--secondary-very-high, #f9f9f9); cursor: pointer;
  display: flex; justify-content: space-between;
}
.quick-reply-item:hover { background: var(--tertiary-low, #e6f7ff); }
.quick-reply-input-area { display: flex; gap: 8px; align-items: flex-end; }
.quick-reply-input {
  flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 6px;
  min-height: 38px; height: 38px; max-height: 100px;
  font-family: inherit; resize: none;
}
.quick-reply-input:focus { border-color: var(--tertiary, #0088cc); outline: none; height: 70px; }
.qr-send-btn {
  height: 38px; padding: 0 16px; border-radius: 19px; border: none;
  background: var(--tertiary, #0088cc); color: #fff; font-weight: bold; cursor: pointer;
}
`
  ensureStyleInjected('raw-preview-styles', STYLES)

  // ===== Logic State =====

  let overlay = null
  let restoreBtn = null
  let iframeEl = null
  let currentTopicId = null
  let currentPage = 1
  let currentMode = 'iframe' // 'iframe' (raw) or 'json'
  let currentSlug = 'topic'
  let isDockRight = localStorage.getItem('preview_dock_right') === 'true'

  // JSON Pagination State
  let jsonIsLoading = false
  let jsonReachedEnd = false

  // ===== Main Functions =====

  function rawUrl(topicId, page) {
    return new URL(`/raw/${topicId}?page=${page}`, window.location.origin).toString()
  }

  function jsonUrl(topicId, page, slug) {
    const s = slug || 'topic'
    return new URL(`/t/${s}/${topicId}.json?page=${page}`, window.location.origin).toString()
  }

  function toggleDockMode() {
    if (!overlay) return
    isDockRight = !isDockRight
    localStorage.setItem('preview_dock_right', isDockRight)

    if (isDockRight) {
      overlay.classList.add('dock-right')
    } else {
      overlay.classList.remove('dock-right')
    }
    const btn = overlay.querySelector('.btn-dock-toggle')
    if (btn) btn.textContent = isDockRight ? '◫ 居中' : '◫ 侧边'
  }

  function toggleMinimize(minimize) {
    if (!overlay) return
    if (minimize) {
        overlay.classList.add('hidden')
        if (!restoreBtn) createRestoreBtn()
        restoreBtn.style.display = 'flex'
        restoreBtn.title = `点击恢复 #${currentTopicId}`
    } else {
        overlay.classList.remove('hidden')
        if (restoreBtn) restoreBtn.style.display = 'none'
    }
  }

  function createRestoreBtn() {
    restoreBtn = createEl('div', { className: 'raw-preview-restore-btn', text: '◀', title: '恢复预览' })
    restoreBtn.onclick = () => toggleMinimize(false)
    document.body.appendChild(restoreBtn)
  }

  function switchMode(mode) {
    if (mode === currentMode) return
    currentMode = mode
    currentPage = 1

    // Sync Select if changed programmatically
    const sel = overlay ? overlay.querySelector('.mode-selector') : null
    if (sel && sel.value !== mode) sel.value = mode

    loadContent()
  }

  function createOverlay(topicId, startPage, mode, slug) {
    if (overlay) removeOverlay()

    currentTopicId = topicId
    currentPage = startPage || 1
    currentMode = mode || 'iframe'
    currentSlug = slug || 'topic'

    // Create Container
    overlay = createEl('div', { className: `raw-preview-overlay ${isDockRight ? 'dock-right' : ''}` })
    const modal = createEl('div', { className: 'raw-preview-modal' })

    // Header
    const header = createEl('div', { className: 'raw-preview-header' })
    const title = createEl('div', { className: 'raw-preview-title', text: `话题 #${topicId}` })
    const ctrls = createEl('div', { className: 'raw-preview-ctrls' })

    // Controls - Mode Select (Dropdown)
    const modeSelect = createEl('select', { className: 'raw-preview-select mode-selector' })
    const optRaw = createEl('option', { text: 'Raw 视图', value: 'iframe' })
    const optJson = createEl('option', { text: 'JSON 视图', value: 'json' })
    modeSelect.append(optRaw, optJson)
    modeSelect.value = currentMode
    modeSelect.onchange = (e) => switchMode(e.target.value)

    const btnDock = createEl('button', { className: 'raw-preview-btn btn-dock-toggle', text: isDockRight ? '◫ 居中' : '◫ 侧边' })
    btnDock.onclick = toggleDockMode

    const btnPrev = createEl('button', { className: 'raw-preview-btn', text: '◀' })
    btnPrev.onclick = () => { if (currentPage > 1) { currentPage--; loadContent() } }

    const btnNext = createEl('button', { className: 'raw-preview-btn', text: '▶' })
    btnNext.onclick = () => { currentPage++; loadContent() }

    const btnMin = createEl('button', { className: 'raw-preview-btn', text: '—', title: '隐藏到侧边' })
    btnMin.onclick = () => toggleMinimize(true)

    const btnClose = createEl('button', { className: 'raw-preview-btn close-btn', text: '✕' })
    btnClose.onclick = removeOverlay

    // 组装控制栏
    ctrls.append(modeSelect, btnDock, btnPrev, btnNext, btnMin, btnClose)
    header.append(title, ctrls)

    // Iframe
    iframeEl = createEl('iframe', {
      className: 'raw-preview-iframe',
      attrs: { sandbox: 'allow-same-origin allow-scripts' }
    })

    // Quick Reply
    const qrPanel = createQuickReplyUI()

    modal.append(header, iframeEl, qrPanel)
    overlay.appendChild(modal)
    document.body.appendChild(overlay)

    // Events
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && !isDockRight) removeOverlay()
    })
    window.addEventListener('keydown', handleKeydown)

    loadContent()
  }

  function loadContent() {
    if (!iframeEl) return
    if (currentMode === 'iframe') {
      iframeEl.src = rawUrl(currentTopicId, currentPage)
    } else {
      renderJsonView(currentPage)
    }
  }

  function removeOverlay() {
    if (overlay) {
        overlay.remove()
        overlay = null
    }
    if (restoreBtn) {
        restoreBtn.remove()
        restoreBtn = null
    }
    window.removeEventListener('keydown', handleKeydown)
    iframeEl = null
    currentTopicId = null
  }

  function handleKeydown(e) {
    if (!overlay) return
    const tag = e.target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'contenteditable') return
    if (e.key === 'Escape') removeOverlay()
  }

  // ===== JSON Rendering Logic =====

  function getIframeDoc() {
    return iframeEl.contentDocument || iframeEl.contentWindow?.document
  }

  async function renderJsonView(page) {
    const doc = getIframeDoc()
    doc.open()
    doc.write(`
      <!doctype html>
      <html><head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
          .post-item { border-bottom: 1px solid #eee; padding: 15px 0; }
          .post-meta { font-size: 13px; color: #666; margin-bottom: 8px; display: flex; justify-content: space-between; }
          .post-body { line-height: 1.6; font-size: 14px; overflow-x: auto; }
          .post-body img { max-width: 100%; height: auto; }
          pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
          .loading { text-align: center; color: #999; padding: 20px; }
        </style>
      </head><body>
        <div id="json-container"></div>
        <div id="loading-indicator" class="loading">加载中...</div>
      </body></html>
    `)
    doc.close()

    jsonReachedEnd = false
    jsonIsLoading = false
    await fetchAndAppendJson(page, true)

    const win = iframeEl.contentWindow
    if (win) {
      win.addEventListener('scroll', () => {
        if (jsonIsLoading || jsonReachedEnd) return
        const d = win.document
        if ((win.innerHeight + win.scrollY) >= d.body.offsetHeight - 100) {
          currentPage++
          fetchAndAppendJson(currentPage, false)
        }
      })
    }
  }

  async function fetchAndAppendJson(page, isFirst) {
    if (jsonIsLoading) return
    jsonIsLoading = true

    const doc = getIframeDoc()
    const container = doc.getElementById('json-container')
    const indicator = doc.getElementById('loading-indicator')
    if (indicator) indicator.style.display = 'block'

    try {
      const res = await fetch(jsonUrl(currentTopicId, page, currentSlug))
      if (!res.ok) throw new Error('API Error')
      const data = await res.json()
      const posts = data?.post_stream?.posts || []

      if (posts.length === 0) {
        jsonReachedEnd = true
        if (indicator) indicator.textContent = '--- 已到底部 ---'
        return
      }

      const html = posts.map(p => {
        const body = p.cooked || '<p><em>Content unavailable</em></p>'
        return `
          <div class="post-item" id="post-${p.post_number}">
            <div class="post-meta">
              <strong>#${p.post_number} ${p.username}</strong>
              <span>${p.created_at.substring(0, 10)}</span>
            </div>
            <div class="post-body">${body}</div>
          </div>
        `
      }).join('')

      container.insertAdjacentHTML('beforeend', html)

      if (indicator) indicator.style.display = 'none'

    } catch (e) {
      if (indicator) indicator.textContent = '加载失败: ' + e.message
      jsonReachedEnd = true
    } finally {
      jsonIsLoading = false
    }
  }

  // ===== Quick Reply Logic (Chat Style) =====

  function createQuickReplyUI() {
    const panel = createEl('div', { className: 'quick-reply-panel' })
    const listContainer = createEl('div', { className: 'quick-reply-list-container' })
    const inputArea = createEl('div', { className: 'quick-reply-input-area' })

    const input = createEl('textarea', { className: 'quick-reply-input', placeholder: '输入回复 (Ctrl+Enter 发送)', rows: 1 })
    const sendBtn = createEl('button', { className: 'qr-send-btn', text: '发送' })
    const toggleBtn = createEl('button', {
        className: 'raw-preview-btn',
        innerHTML: '☰',
        title: '预设',
        style: 'height:38px;width:38px;border-radius:50%;'
    })

    // Load presets
    let presets = JSON.parse(localStorage.getItem('preview_quick_replies') || '["感谢分享！","学到了。","Mark。"]')
    let isExpanded = false

    function renderPresets() {
        listContainer.innerHTML = ''
        presets.forEach((txt, idx) => {
            const item = createEl('div', { className: 'quick-reply-item' })
            const t = createEl('span', { text: txt, style: 'flex:1' })
            t.onclick = () => { input.value = txt; input.focus() }
            const d = createEl('span', { text: '×', style: 'color:#999;padding:0 5px' })
            d.onclick = (e) => {
                e.stopPropagation()
                presets.splice(idx, 1)
                localStorage.setItem('preview_quick_replies', JSON.stringify(presets))
                renderPresets()
            }
            item.append(t, d)
            listContainer.appendChild(item)
        })
        if (input.value.trim()) {
            const saveBtn = createEl('div', { className: 'quick-reply-item', text: '+ 保存当前输入为预设', style: 'justify-content:center;color:#0088cc;font-weight:bold' })
            saveBtn.onclick = () => {
                const v = input.value.trim()
                if (v && !presets.includes(v)) {
                    presets.push(v)
                    localStorage.setItem('preview_quick_replies', JSON.stringify(presets))
                    renderPresets()
                }
            }
            listContainer.appendChild(saveBtn)
        }
    }

    toggleBtn.onclick = () => {
        isExpanded = !isExpanded
        listContainer.classList.toggle('expanded', isExpanded)
        if (isExpanded) renderPresets()
    }

    input.addEventListener('input', () => { if (isExpanded) renderPresets() })

    const doSend = async () => {
        const raw = input.value.trim()
        if (!raw || !currentTopicId) return

        sendBtn.disabled = true; sendBtn.text = '...'
        const token = document.querySelector('meta[name="csrf-token"]')?.content
        if (!token) { alert('未登录'); return }

        try {
            const fd = new URLSearchParams()
            fd.append('raw', raw); fd.append('topic_id', currentTopicId); fd.append('archetype', 'regular'); fd.append('nested_post', 'true')
            await fetch('/posts', {
                method: 'POST', headers: { 'x-csrf-token': token, 'x-requested-with': 'XMLHttpRequest', 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: fd.toString()
            })
            input.value = ''; sendBtn.text = '发送'
            if (currentMode === 'json') {
                fetchAndAppendJson(currentPage, false)
            }
        } catch(e) {
            alert('发送失败')
            sendBtn.text = '重试'
        } finally {
            sendBtn.disabled = false
        }
    }

    sendBtn.onclick = doSend
    input.onkeydown = (e) => { if (e.ctrlKey && e.key === 'Enter') doSend() }

    inputArea.append(toggleBtn, input, sendBtn)
    panel.append(listContainer, inputArea)
    return panel
  }

  // ===== Injection =====

  function inject() {
    const rows = document.querySelectorAll('tr[data-topic-id]')
    rows.forEach(row => {
      if (row.querySelector('.raw-preview-trigger')) return
      const tid = row.dataset.topicId
      if (!tid) return

      const link = row.querySelector('a.title')
      let slug = 'topic'
      if (link) {
          const m = link.href.match(/\/t\/([^/]+)\/(\d+)/)
          if (m) slug = m[1]
      }

      const btn = createEl('button', { className: 'raw-preview-btn raw-preview-trigger', text: '预览', style: 'margin-left:8px;font-size:11px;' })
      btn.onclick = (e) => {
        e.preventDefault(); e.stopPropagation()
        createOverlay(tid, 1, 'iframe', slug)
      }

      if (link && link.parentElement) {
          link.parentElement.style.display = 'flex'
          link.parentElement.style.alignItems = 'center'
          link.style.flex = '1'
          link.parentElement.appendChild(btn)
      } else {
          row.appendChild(btn)
      }
    })
  }

  if (document.querySelector('meta[name*="discourse"]')) {
      setInterval(inject, 2000)
      setTimeout(inject, 500)
  }

})()
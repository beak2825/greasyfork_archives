// ==UserScript==
// @name         LocalStorage 编辑器 (Simple)
// @namespace    https://example.com/
// @version      0.1
// @description  在页面上显示一个浮动面板，方便查看/编辑当前页面的 localStorage（查看/编辑/删除/导入/导出）。
// @author       Generated
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551681/LocalStorage%20%E7%BC%96%E8%BE%91%E5%99%A8%20%28Simple%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551681/LocalStorage%20%E7%BC%96%E8%BE%91%E5%99%A8%20%28Simple%29.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // Minimal styles for the panel
  const style = document.createElement('style')
  style.textContent = `
    #ls-editor-toggle { position: fixed; right: 12px; bottom: 12px; z-index:2147483646; }
    #ls-editor-panel { position: fixed; right: 12px; bottom: 56px; width: 520px; max-height: 70vh; z-index:2147483646; background:#fff; border:1px solid #ccc; box-shadow:0 6px 24px rgba(0,0,0,0.2); font-family: Arial, Helvetica, sans-serif; color:#111; border-radius:8px; overflow:hidden; display:none; }
    #ls-editor-panel .header { display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background:#f5f5f5; border-bottom:1px solid #eee; }
    #ls-editor-panel .body { display:flex; gap:8px; padding:8px; }
    #ls-editor-keys { width: 45%; max-height:50vh; overflow:auto; border:1px solid #eee; padding:8px; border-radius:4px; }
    #ls-editor-keys .key { padding:6px; border-radius:4px; cursor:pointer; margin-bottom:6px; background: #fff; }
    #ls-editor-keys .key.selected { background:#e8f0ff; }
    #ls-editor-right { width:55%; display:flex; flex-direction:column; gap:8px; }
    #ls-editor-right textarea { width:100%; height:160px; font-family: monospace; font-size:12px; padding:8px; border-radius:4px; border:1px solid #ddd; resize:vertical; }
    #ls-editor-controls { display:flex; gap:8px; flex-wrap:wrap; }
    #ls-editor-panel input[type="text"], #ls-editor-panel input[type="search"] { width:100%; padding:6px 8px; border:1px solid #ddd; border-radius:4px; }
    #ls-editor-panel button { padding:6px 10px; border-radius:4px; border:1px solid #bbb; background:#fff; cursor:pointer; }
    #ls-editor-panel button.primary { background:#0366d6; color:#fff; border-color:#0366d6; }
    #ls-editor-panel .small { font-size:12px; color:#666; }
  `
  document.head.appendChild(style)

  // Toggle button
  const toggle = document.createElement('button')
  toggle.id = 'ls-editor-toggle'
  toggle.textContent = 'LS'
  toggle.title = 'Open LocalStorage Editor'
  toggle.style.padding = '8px 10px'
  toggle.style.borderRadius = '6px'
  toggle.style.border = '1px solid #bbb'
  toggle.style.background = '#fff'
  toggle.style.cursor = 'pointer'
  document.body.appendChild(toggle)

  // Panel
  const panel = document.createElement('div')
  panel.id = 'ls-editor-panel'

  panel.innerHTML = `
    <div class="header">
      <div style="font-weight:600">LocalStorage 编辑器</div>
      <div style="display:flex;gap:8px;align-items:center">
        <button id="ls-export">导出</button>
        <button id="ls-import">导入</button>
        <button id="ls-close">关闭</button>
      </div>
    </div>
    <div class="body">
      <div id="ls-editor-keys">
        <div style="margin-bottom:8px"><input id="ls-search" type="search" placeholder="搜索 key..." /></div>
        <div id="ls-keys-list"></div>
      </div>
      <div id="ls-editor-right">
        <div>
          <div style="display:flex; gap:8px;">
            <input id="ls-key-input" type="text" placeholder="Key" />
            <button id="ls-new" class="primary">新增/选中</button>
          </div>
          <div class="small">选择一个 key 编辑其值；新增时输入 key 并点击 “新增/选中”。</div>
        </div>
        <textarea id="ls-value"></textarea>
        <div id="ls-editor-controls">
          <button id="ls-save" class="primary">保存</button>
          <button id="ls-delete">删除</button>
          <button id="ls-copy">复制值</button>
          <button id="ls-clear">清空所有（危险）</button>
        </div>
      </div>
    </div>
    <!-- hidden file input for import -->
    <input id="ls-file-input" type="file" accept=".json,application/json" style="display:none" />
  `

  document.body.appendChild(panel)

  const keysListEl = panel.querySelector('#ls-keys-list')
  const searchEl = panel.querySelector('#ls-search')
  const keyInputEl = panel.querySelector('#ls-key-input')
  const valueEl = panel.querySelector('#ls-value')
  const saveBtn = panel.querySelector('#ls-save')
  const deleteBtn = panel.querySelector('#ls-delete')
  const newBtn = panel.querySelector('#ls-new')
  const exportBtn = panel.querySelector('#ls-export')
  const importBtn = panel.querySelector('#ls-import')
  const closeBtn = panel.querySelector('#ls-close')
  const copyBtn = panel.querySelector('#ls-copy')
  const clearBtn = panel.querySelector('#ls-clear')
  const fileInput = panel.querySelector('#ls-file-input')

  let selectedKey = null

  function listKeys(filter = '') {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k == null) continue
      if (!filter || k.includes(filter)) keys.push(k)
    }
    keysListEl.innerHTML = ''
    if (keys.length === 0) {
      keysListEl.innerHTML = '<div class="small">(no keys)</div>'
      return
    }
    keys
      .sort()
      .forEach(k => {
        const el = document.createElement('div')
        el.className = 'key'
        if (k === selectedKey) el.classList.add('selected')
        el.textContent = k + ' (' + (localStorage.getItem(k) || '').length + ' chars)'
        el.addEventListener('click', () => {
          selectKey(k)
        })
        keysListEl.appendChild(el)
      })
  }

  function selectKey(k) {
    selectedKey = k
    keyInputEl.value = k
    valueEl.value = localStorage.getItem(k) || ''
    listKeys(searchEl.value.trim())
  }

  function saveSelected() {
    const k = (keyInputEl.value || '').trim()
    if (!k) return alert('请输入 key')
    try {
      localStorage.setItem(k, valueEl.value)
      selectedKey = k
      listKeys(searchEl.value.trim())
      alert('保存成功')
    } catch (e) {
      alert('保存失败：' + e)
    }
  }

  function deleteSelected() {
    if (!selectedKey) return alert('请先选择要删除的 key')
    if (!confirm('确认删除 key: ' + selectedKey + ' ?')) return
    try {
      localStorage.removeItem(selectedKey)
      selectedKey = null
      keyInputEl.value = ''
      valueEl.value = ''
      listKeys(searchEl.value.trim())
      alert('删除成功')
    } catch (e) {
      alert('删除失败：' + e)
    }
  }

  function exportAll() {
    const obj = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k == null) continue
      obj[k] = localStorage.getItem(k) || ''
    }
    const text = JSON.stringify(obj, null, 2)
    // copy to clipboard if possible
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => alert('已复制到剪贴板'),
        () => downloadText('localStorage-export.json', text)
      )
    } else {
      downloadText('localStorage-export.json', text)
    }
  }

  function downloadText(filename, text) {
    const a = document.createElement('a')
    const blob = new Blob([text], { type: 'application/json' })
    a.href = URL.createObjectURL(blob)
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  function importFromText(text, options = { overwrite: false }) {
    try {
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed === 'object') {
        const keys = Object.keys(parsed)
        if (keys.length === 0) return alert('导入的 JSON 为空')
        let overwritten = 0
        keys.forEach(k => {
          const v = String(parsed[k])
          if (!options.overwrite && localStorage.getItem(k) != null) {
            // skip
          } else {
            if (localStorage.getItem(k) != null) overwritten++
            localStorage.setItem(k, v)
          }
        })
        listKeys(searchEl.value.trim())
        alert('导入完成，已覆盖 ' + overwritten + ' 项')
      } else {
        alert('导入失败：JSON 格式不正确')
      }
    } catch (e) {
      alert('导入失败：解析 JSON 错误\n' + e)
    }
  }

  // UI events
  toggle.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block'
  })

  closeBtn.addEventListener('click', () => (panel.style.display = 'none'))
  searchEl.addEventListener('input', () => listKeys(searchEl.value.trim()))
  newBtn.addEventListener('click', () => {
    const k = (keyInputEl.value || '').trim()
    if (!k) return alert('请输入 key')
    selectKey(k)
  })
  saveBtn.addEventListener('click', saveSelected)
  deleteBtn.addEventListener('click', deleteSelected)
  copyBtn.addEventListener('click', () => {
    const v = valueEl.value
    if (!navigator.clipboard) return alert('复制失败：浏览器不支持剪贴板 API')
    navigator.clipboard.writeText(v).then(
      () => alert('已复制值到剪贴板'),
      () => alert('复制失败')
    )
  })
  clearBtn.addEventListener('click', () => {
    if (!confirm('确认清空 localStorage（当前域）？此操作不可恢复')) return
    try {
      localStorage.clear()
      selectedKey = null
      keyInputEl.value = ''
      valueEl.value = ''
      listKeys(searchEl.value.trim())
      alert('已清空')
    } catch (e) {
      alert('清空失败：' + e)
    }
  })

  exportBtn.addEventListener('click', exportAll)

  importBtn.addEventListener('click', () => {
    // Offer two options: paste JSON or choose file
    const choice = confirm('点击 OK 从文件导入 (.json)，点击 Cancel 粘贴 JSON 导入')
    if (choice) {
      fileInput.value = ''
      fileInput.click()
    } else {
      const text = prompt('请粘贴 JSON 内容：')
      if (text) importFromText(text, { overwrite: true })
    }
  })

  fileInput.addEventListener('change', ev => {
  const input = ev.target
    if (!input.files || input.files.length === 0) return
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      // Ask whether to overwrite existing keys
      const overwrite = confirm('是否覆盖已存在的相同 key？点击 OK 覆盖，Cancel 则跳过已存在 key')
      importFromText(text, { overwrite })
    }
    reader.onerror = () => alert('读取文件失败')
    reader.readAsText(file)
  })

  // initial
  listKeys()

  // expose for debugging in console
  ;(window).__localStorageEditor = {
    open: () => (panel.style.display = 'block'),
    close: () => (panel.style.display = 'none'),
    listKeys
  }
})()

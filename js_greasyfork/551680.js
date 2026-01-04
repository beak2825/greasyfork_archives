// ==UserScript==
// @name         Standalone Image Uploader for discourse
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Extracted image upload UI from bug-v3 as a standalone userscript with improved client_id mapping
// @author       auto
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551680/Standalone%20Image%20Uploader%20for%20discourse.user.js
// @updateURL https://update.greasyfork.org/scripts/551680/Standalone%20Image%20Uploader%20for%20discourse.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // Minimal createE implementation
  function createE(tag, opts) {
    const el = document.createElement(tag)
    if (!opts) return el
    if (opts.wi) el.style.width = opts.wi
    if (opts.he) el.style.height = opts.he
    if (opts.class) el.className = opts.class
    if (opts.text) el.textContent = opts.text
    if (opts.ph && 'placeholder' in el) el.placeholder = opts.ph
    if (opts.type && 'type' in el) el.type = opts.type
    if (opts.val !== undefined && 'value' in el) el.value = opts.val
    if (opts.style) el.style.cssText = opts.style
    if (opts.src && 'src' in el) el.src = opts.src
    if (opts.attrs) for (const k in opts.attrs) el.setAttribute(k, opts.attrs[k])
    if (opts.dataset) for (const k in opts.dataset) el.dataset[k] = opts.dataset[k]
    if (opts.in) el.innerHTML = opts.in
    if (opts.ti) el.title = opts.ti
    if (opts.alt && 'alt' in el) el.alt = opts.alt
    if (opts.id) el.id = opts.id
    if (opts.accept && 'accept' in el) el.accept = opts.accept
    if (opts.multiple !== undefined && 'multiple' in el) el.multiple = opts.multiple
    if (opts.role) el.setAttribute('role', opts.role)
    if (opts.tabIndex !== undefined) el.tabIndex = Number(opts.tabIndex)
    if (opts.ld && 'loading' in el) el.loading = opts.ld
    if (opts.on) {
      for (const [evt, handler] of Object.entries(opts.on)) {
        el.addEventListener(evt, handler)
      }
    }
    return el
  }

  // Helper: insert into common editors (textarea or ProseMirror)
  function insertIntoEditor(text) {
    // Priority 1: Chat composer (highest priority)
    const chatComposer = document.querySelector('textarea#channel-composer.chat-composer__input')
    // Priority 2: Standard editor textarea
    const textArea = document.querySelector('textarea.d-editor-input')
    // Priority 3: Rich text editor
    const richEle = document.querySelector('.ProseMirror.d-editor-input')

    if (!chatComposer && !textArea && !richEle) {
      console.error('找不到输入框')
      return
    }

    if (chatComposer) {
      const start = chatComposer.selectionStart
      const end = chatComposer.selectionEnd
      const value = chatComposer.value

      chatComposer.value = value.substring(0, start) + text + value.substring(end)
      chatComposer.setSelectionRange(start + text.length, start + text.length)
      chatComposer.focus()

      const event = new Event('input', { bubbles: true })
      chatComposer.dispatchEvent(event)
    } else if (textArea) {
      const start = textArea.selectionStart
      const end = textArea.selectionEnd
      const value = textArea.value

      textArea.value = value.substring(0, start) + text + value.substring(end)
      textArea.setSelectionRange(start + text.length, start + text.length)
      textArea.focus()

      const event = new Event('input', { bubbles: true })
      textArea.dispatchEvent(event)
    } else if (richEle) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const textNode = document.createTextNode(text)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      richEle.focus()
    }
  }

  // Parse filenames from markdown image tags
  function parseImageFilenamesFromMarkdown(markdownText) {
    const imageRegex = /!\[([^\]]*)\]\([^\)]+\)/g
    const filenames = []
    let match
    while ((match = imageRegex.exec(markdownText)) !== null) {
      const filename = match[1]
      if (filename && filename.trim()) filenames.push(filename.trim())
    }
    return filenames
  }

  const clientIdMap = new Map([
    ['linux.do', 'f06cb5577ba9410d94b9faf94e48c2d8']
    // Add other domain-client_id pairs here
  ]);
  const defaultClientId = 'b9cdb79908284b25925d62befbff3921';

  // Uploader class (adapted)
  class ImageUploader {
    constructor() {
      this.waitingQueue = []
      this.uploadingQueue = []
      this.failedQueue = []
      this.successQueue = []
      this.isProcessing = false
      this.maxRetries = 2
      this.progressDialog = null
    }

    uploadImage(file) {
      return new Promise((resolve, reject) => {
        const item = {
          id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          file,
          resolve,
          reject,
          retryCount: 0,
          status: 'waiting',
          timestamp: Date.now()
        }

        this.waitingQueue.push(item)
        this.updateProgressDialog()
        this.processQueue()
      })
    }

    moveToQueue(item, targetStatus) {
      this.waitingQueue = this.waitingQueue.filter(i => i.id !== item.id)
      this.uploadingQueue = this.uploadingQueue.filter(i => i.id !== item.id)
      this.failedQueue = this.failedQueue.filter(i => i.id !== item.id)
      this.successQueue = this.successQueue.filter(i => i.id !== item.id)

      item.status = targetStatus
      if (targetStatus === 'waiting') this.waitingQueue.push(item)
      if (targetStatus === 'uploading') this.uploadingQueue.push(item)
      if (targetStatus === 'failed') this.failedQueue.push(item)
      if (targetStatus === 'success') this.successQueue.push(item)

      this.updateProgressDialog()
    }

    async processQueue() {
      if (this.isProcessing || this.waitingQueue.length === 0) return
      this.isProcessing = true

      while (this.waitingQueue.length > 0) {
        const item = this.waitingQueue.shift()
        if (!item) continue
        this.moveToQueue(item, 'uploading')
        try {
          const result = await this.performUpload(item.file)
          item.result = result
          this.moveToQueue(item, 'success')
          item.resolve(result)
          const markdown = `![${result.original_filename}](${result.url})`
          insertIntoEditor(markdown)
        } catch (error) {
          item.error = error
          if (this.shouldRetry(error, item)) {
            item.retryCount++
            if (error.error_type === 'rate_limit' && error.extras?.wait_seconds) {
              await this.sleep(error.extras.wait_seconds * 1000)
            } else {
              await this.sleep(Math.pow(2, item.retryCount) * 1000)
            }
            this.moveToQueue(item, 'waiting')
          } else {
            this.moveToQueue(item, 'failed')
            item.reject(error)
          }
        }
      }

      this.isProcessing = false
    }

    shouldRetry(error, item) {
      if (item.retryCount >= this.maxRetries) return false
      return error.error_type === 'rate_limit'
    }

    retryFailedItem(itemId) {
      const item = this.failedQueue.find(i => i.id === itemId)
      if (item && item.retryCount < this.maxRetries) {
        item.retryCount++
        this.moveToQueue(item, 'waiting')
        this.processQueue()
      }
    }

    showProgressDialog() {
      if (this.progressDialog) return
      this.progressDialog = this.createProgressDialog()
      document.body.appendChild(this.progressDialog)
    }

    hideProgressDialog() {
      if (this.progressDialog) {
        this.progressDialog.remove()
        this.progressDialog = null
      }
    }

    updateProgressDialog() {
      if (!this.progressDialog) return
      const allItems = [...this.waitingQueue, ...this.uploadingQueue, ...this.failedQueue, ...this.successQueue]
      this.renderQueueItems(this.progressDialog, allItems)
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    createProgressDialog() {
      const dialog = createE('div', {
        style: `position: fixed; top: 20px; right: 20px; width: 350px; max-height: 400px; background: white; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border:1px solid #e5e7eb; overflow: hidden;`
      })

      const header = createE('div', { style: `padding: 16px 20px; background:#f9fafb; border-bottom:1px solid #e5e7eb; font-weight:600; font-size:14px; color:#374151; display:flex; justify-content:space-between; align-items:center;`, text: '图片上传队列' })
      const closeButton = createE('button', { text: '✕', style: `background:none; border:none; font-size:16px; cursor:pointer; color:#6b7280; padding:4px; border-radius:4px; transition: background-color .2s;` })
      closeButton.addEventListener('click', () => this.hideProgressDialog())
      header.appendChild(closeButton)
      const content = createE('div', { class: 'upload-queue-content', style: `max-height:320px; overflow-y:auto; padding:12px;` })
      dialog.appendChild(header)
      dialog.appendChild(content)
      return dialog
    }

    renderQueueItems(dialog, allItems) {
      const content = dialog.querySelector('.upload-queue-content')
      if (!content) return
      content.innerHTML = ''
      if (allItems.length === 0) {
        content.appendChild(createE('div', { style: `text-align:center; color:#6b7280; font-size:14px; padding:20px;`, text: '暂无上传任务' }))
        return
      }

      allItems.forEach(item => {
        const itemEl = createE('div', { style: `display:flex; align-items:center; justify-content:space-between; padding:8px 12px; margin-bottom:8px; background:#f9fafb; border-radius:6px; border-left:4px solid ${this.getStatusColor(item.status)};` })
        const leftSide = createE('div', { style: `flex:1; min-width:0;` })
        const fileName = createE('div', { style: `font-size:13px; font-weight:500; color:#374151; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`, text: item.file.name })
        const status = createE('div', { style: `font-size:12px; color:#6b7280; margin-top:2px;` })
        status.textContent = this.getStatusText(item)
        leftSide.appendChild(fileName)
        leftSide.appendChild(status)
        const rightSide = createE('div', { style: `display:flex; align-items:center; gap:8px;` })
        if (item.status === 'failed' && item.retryCount < this.maxRetries) {
          const retryButton = createE('button', { text: '🔄', style: `background:none; border:none; cursor:pointer; font-size:14px; padding:4px; border-radius:4px; transition: background-color .2s;`, ti: '重试上传' })
          retryButton.addEventListener('click', () => this.retryFailedItem(item.id))
          rightSide.appendChild(retryButton)
        }
        const statusIcon = createE('div', { style: 'font-size:16px;', text: this.getStatusIcon(item.status) })
        rightSide.appendChild(statusIcon)
        itemEl.appendChild(leftSide)
        itemEl.appendChild(rightSide)
        content.appendChild(itemEl)
      })
    }

    getStatusColor(status) {
      switch (status) {
        case 'waiting': return '#f59e0b'
        case 'uploading': return '#3b82f6'
        case 'success': return '#10b981'
        case 'failed': return '#ef4444'
        default: return '#6b7280'
      }
    }

    getStatusText(item) {
      switch (item.status) {
        case 'waiting': return '等待上传'
        case 'uploading': return '正在上传...'
        case 'success': return '上传成功'
        case 'failed': return item.error?.error_type === 'rate_limit' ? `上传失败 - 请求过于频繁 (重试 ${item.retryCount}/${this.maxRetries})` : `上传失败 (重试 ${item.retryCount}/${this.maxRetries})`
        default: return '未知状态'
      }
    }

    getStatusIcon(status) {
      switch (status) {
        case 'waiting': return '⏳'
        case 'uploading': return '📤'
        case 'success': return '✅'
        case 'failed': return '❌'
        default: return '❓'
      }
    }

    async performUpload(file) {
      const sha1 = await this.calculateSHA1(file)
      const formData = new FormData()
      formData.append('upload_type', 'composer')
      formData.append('relativePath', 'null')
      formData.append('name', file.name)
      formData.append('type', file.type)
      formData.append('sha1_checksum', sha1)
      formData.append('file', file, file.name)

      const csrfToken = this.getCSRFToken()
      const headers = { 'X-Csrf-Token': csrfToken }
      if (document.cookie) headers['Cookie'] = document.cookie

      const clientId = clientIdMap.get(window.location.host) || defaultClientId;
      const response = await fetch(`${window.location.origin}/uploads.json?client_id=${clientId}`, { method: 'POST', headers, body: formData })

      if (!response.ok) {
        const errorData = await response.json()
        throw errorData
      }

      return await response.json()
    }

    getCSRFToken() {
      const metaToken = document.querySelector('meta[name="csrf-token"]')
      if (metaToken) return metaToken.content
      const match = document.cookie.match(/csrf_token=([^;]+)/)
      if (match) return decodeURIComponent(match[1])
      const hiddenInput = document.querySelector('input[name="authenticity_token"]')
      if (hiddenInput) return hiddenInput.value
      console.warn('[Image Uploader] No CSRF token found')
      return ''
    }

    async calculateSHA1(file) {
      const text = `${file.name}-${file.size}-${file.lastModified}`
      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      if (crypto.subtle) {
        try {
          const hashBuffer = await crypto.subtle.digest('SHA-1', data)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        } catch (e) {
          console.warn('[Image Uploader] Could not calculate SHA1, using fallback')
        }
      }
      let hash = 0
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
      }
      return Math.abs(hash).toString(16).padStart(40, '0')
    }
  }

  const uploader = new ImageUploader()

  // --- tar.gz support helpers ---
  function isTarGzFile(file) {
    const name = (file && file.name) || ''
    return name.toLowerCase().endsWith('.tar.gz') || name.toLowerCase().endsWith('.tgz')
  }

  async function decompressGzipToArrayBuffer(blob) {
    if (typeof DecompressionStream === 'function') {
      try {
        const ds = new DecompressionStream('gzip')
        const decompressedStream = blob.stream().pipeThrough(ds)
        const ab = await new Response(decompressedStream).arrayBuffer()
        return ab
      } catch (e) {
        console.error('DecompressionStream failed', e)
        throw e
      }
    }
    // No native DecompressionStream available
    throw new Error('浏览器不支持 DecompressionStream(gzip)，无法解压 tar.gz')
  }

  function readStringFromBytes(bytes, start, length) {
    const slice = bytes.subarray(start, start + length)
    // Trim at first NUL
    let end = slice.length
    for (let i = 0; i < slice.length; i++) {
      if (slice[i] === 0) { end = i; break }
    }
    return new TextDecoder().decode(slice.subarray(0, end))
  }

  function parseOctalString(s) {
    const str = s.replace(/\0/g, '').trim()
    if (!str) return 0
    return parseInt(str, 8) || 0
  }

  function parseTarFromArrayBuffer(ab) {
    const bytes = new Uint8Array(ab)
    const files = []
    let offset = 0
    while (offset + 512 <= bytes.length) {
      // Check for two consecutive zero blocks
      const isEmpty = (i => {
        for (let j = 0; j < 512; j++) if (bytes[i + j] !== 0) return false
        return true
      })(offset)
      if (isEmpty) break

      const name = readStringFromBytes(bytes, offset + 0, 100)
      if (!name) break
      const sizeStr = readStringFromBytes(bytes, offset + 124, 12)
      const size = parseOctalString(sizeStr)

      const dataStart = offset + 512
      const dataEnd = dataStart + size
      if (dataEnd > bytes.length) break
      const fileBytes = bytes.slice(dataStart, dataEnd)

      files.push({ name, size, bytes: fileBytes })

      // Advance to next header (file data is padded to 512)
      const padded = Math.ceil(size / 512) * 512
      offset = dataStart + padded
    }
    return files
  }

  function isLikelyImageName(name) {
    const lower = name.toLowerCase()
    return /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(lower)
  }

  async function extractFilesFromTarGzFile(file) {
    // returns array of File objects
    try {
      const ab = await decompressGzipToArrayBuffer(file)
      const entries = parseTarFromArrayBuffer(ab)
      const out = []
      for (const e of entries) {
        if (!e.name) continue
        if (!isLikelyImageName(e.name)) continue
        const blob = new Blob([e.bytes], { type: 'application/octet-stream' })
        // infer mime from extension
        const ext = (e.name.split('.').pop() || '').toLowerCase()
        let mime = 'application/octet-stream'
        if (ext === 'png') mime = 'image/png'
        else if (ext === 'jpg' || ext === 'jpeg') mime = 'image/jpeg'
        else if (ext === 'gif') mime = 'image/gif'
        else if (ext === 'webp') mime = 'image/webp'
        else if (ext === 'svg') mime = 'image/svg+xml'
        else if (ext === 'avif') mime = 'image/avif'
        const imageBlob = new Blob([e.bytes], { type: mime })
        const fileObj = new File([imageBlob], e.name, { type: mime })
        out.push(fileObj)
      }
      return out
    } catch (err) {
      console.error('extractFilesFromTarGzFile error', err)
      alert('无法解压 tar.gz：' + (err && err.message ? err.message : String(err)))
      return []
    }
  }
  // --- end tar.gz helpers ---

  function createDragDropUploadPanel() {
    const panel = createE('div', { class: 'drag-drop-upload-panel', style: `position: fixed; top:50%; left:50%; transform: translate(-50%,-50%); width:500px; max-width:90vw; background:white; border-radius:12px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04); z-index:10000; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;` })

    const overlay = createE('div', { style: `position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); z-index:9999;` })

    const header = createE('div', { style: `padding:20px 24px 0; display:flex; justify-content:space-between; align-items:center;` })
    const title = createE('h2', { text: '上传图片', style: `margin:0; font-size:18px; font-weight:600; color:#111827;` })
    const closeButton = createE('button', { in: '✕', style: `background:none; border:none; font-size:20px; cursor:pointer; color:#6b7280; padding:4px; border-radius:4px; transition:background-color .2s;` })
    header.appendChild(title)
    header.appendChild(closeButton)

    const content = createE('div', { class: 'upload-panel-content', style: `padding:24px;` })
    const tabContainer = createE('div', { style: `display:flex; border-bottom:1px solid #e5e7eb; margin-bottom:20px;` })
    const regularTab = createE('button', { text: '常规上传', style: `flex:1; padding:10px 20px; background:none; border:none; border-bottom:2px solid #3b82f6; color:#3b82f6; font-weight:500; cursor:pointer; transition:all .2s;` })
    const diffTab = createE('button', { text: '差分上传', style: `flex:1; padding:10px 20px; background:none; border:none; border-bottom:2px solid transparent; color:#6b7280; font-weight:500; cursor:pointer; transition:all .2s;` })
    tabContainer.appendChild(regularTab)
    tabContainer.appendChild(diffTab)

    const regularPanel = createE('div', { class: 'regular-upload-panel', style: `display:block;` })
    const dropZone = createE('div', { class: 'drop-zone', style: `border:2px dashed #d1d5db; border-radius:8px; padding:40px 20px; text-align:center; background:#f9fafb; transition:all .2s; cursor:pointer;` })
    const dropIcon = createE('div', { in: '📁', style: `font-size:48px; margin-bottom:16px;` })
    const dropText = createE('div', { in: `<div style="font-size:16px; font-weight:500; color:#374151; margin-bottom:8px;">拖拽图片到此处，或点击选择文件</div><div style="font-size:14px; color:#6b7280;">支持 JPG、PNG、GIF 等格式，最大 10MB</div>` })
    const fileInput = createE('input', { type: 'file', accept: 'image/*', multiple: true, style: `display:none;` })
    dropZone.appendChild(dropIcon)
    dropZone.appendChild(dropText)
    regularPanel.appendChild(dropZone)
    regularPanel.appendChild(fileInput)

    const diffPanel = createE('div', { class: 'diff-upload-panel', style: `display:none;` })
    const markdownTextarea = createE('textarea', { ph: '请粘贴包含图片的 markdown 文本...', style: `width:100%; height:120px; padding:12px; border:1px solid #d1d5db; border-radius:6px; font-family:monospace; font-size:14px; resize:vertical; margin-bottom:12px; box-sizing:border-box;` })
    const diffDropZone = createE('div', { class: 'diff-drop-zone', style: `border:2px dashed #d1d5db; border-radius:8px; padding:30px 20px; text-align:center; background:#f9fafb; transition:all .2s; cursor:pointer; margin-bottom:12px;` })
    const diffFileInput = createE('input', { type: 'file', accept: 'image/*', multiple: true, style: `display:none;` })
    diffPanel.appendChild(markdownTextarea)
    diffPanel.appendChild(diffDropZone)
    diffPanel.appendChild(diffFileInput)

    content.appendChild(tabContainer)
    content.appendChild(regularPanel)
    content.appendChild(diffPanel)
    panel.appendChild(header)
    panel.appendChild(content)

    const switchToTab = (activeTab, inactiveTab, activePanel, inactivePanel) => {
      activeTab.style.borderBottomColor = '#3b82f6'
      activeTab.style.color = '#3b82f6'
      inactiveTab.style.borderBottomColor = 'transparent'
      inactiveTab.style.color = '#6b7280'
      activePanel.style.display = 'block'
      inactivePanel.style.display = 'none'
    }

    regularTab.addEventListener('click', () => switchToTab(regularTab, diffTab, regularPanel, diffPanel))
    diffTab.addEventListener('click', () => switchToTab(diffTab, regularTab, diffPanel, regularPanel))

    return { panel, overlay, dropZone, fileInput, closeButton, diffDropZone, diffFileInput, markdownTextarea }
  }

  async function showImageUploadDialog() {
    return new Promise(resolve => {
      const { panel, overlay, dropZone, fileInput, closeButton, diffDropZone, diffFileInput, markdownTextarea } = createDragDropUploadPanel()
      let isDragOver = false
      let isDiffDragOver = false

      const cleanup = () => {
        document.body.removeChild(overlay)
        document.body.removeChild(panel)
        resolve()
      }

      const handleFiles = async files => {
        if (!files || files.length === 0) return
        cleanup()
        uploader.showProgressDialog()
        try {
            const expanded = []
            for (const f of Array.from(files)) {
              if (isTarGzFile(f)) {
                const imgs = await extractFilesFromTarGzFile(f)
                expanded.push(...imgs)
              } else {
                expanded.push(f)
              }
            }

            if (expanded.length === 0) return

            const promises = expanded.map(async file => {
            try { return await uploader.uploadImage(file) } catch (e) { console.error('[Image Uploader] Upload failed:', e); throw e }
          })
          await Promise.allSettled(promises)
        } finally {
          setTimeout(() => uploader.hideProgressDialog(), 3000)
        }
      }

      const handleDiffFiles = async files => {
        if (!files || files.length === 0) return
        const markdownText = markdownTextarea.value
        const existingFilenames = parseImageFilenamesFromMarkdown(markdownText)
          const expanded = []
          for (const f of Array.from(files)) {
            if (isTarGzFile(f)) {
              const imgs = await extractFilesFromTarGzFile(f)
              expanded.push(...imgs)
            } else {
              expanded.push(f)
            }
          }

          const filesToUpload = expanded.filter(file => !existingFilenames.includes(file.name))
        if (filesToUpload.length === 0) { alert('所有选择的图片都已在 markdown 文本中存在，无需上传。'); return }
        if (filesToUpload.length < files.length) {
          const skippedCount = files.length - filesToUpload.length
          const proceed = confirm(`发现 ${skippedCount} 个图片已存在于markdown文本中，将被跳过。是否继续上传剩余 ${filesToUpload.length} 个图片？`)
          if (!proceed) return
        }
        cleanup()
        uploader.showProgressDialog()
        try {
          const promises = filesToUpload.map(async file => { try { return await uploader.uploadImage(file) } catch (e) { console.error('[Image Uploader] Diff upload failed:', e); throw e } })
          await Promise.allSettled(promises)
        } finally {
          setTimeout(() => uploader.hideProgressDialog(), 3000)
        }
      }

      fileInput.addEventListener('change', async event => { const files = event.target.files; if (files) await handleFiles(files) })
      dropZone.addEventListener('click', () => fileInput.click())
      dropZone.addEventListener('dragover', e => { e.preventDefault(); if (!isDragOver) { isDragOver = true; dropZone.style.borderColor = '#3b82f6'; dropZone.style.backgroundColor = '#eff6ff' } })
      dropZone.addEventListener('dragleave', e => { e.preventDefault(); if (!dropZone.contains(e.relatedTarget)) { isDragOver = false; dropZone.style.borderColor = '#d1d5db'; dropZone.style.backgroundColor = '#f9fafb' } })
      dropZone.addEventListener('drop', async e => { e.preventDefault(); isDragOver = false; dropZone.style.borderColor = '#d1d5db'; dropZone.style.backgroundColor = '#f9fafb'; const files = e.dataTransfer?.files; if (files) await handleFiles(files) })

      diffFileInput.addEventListener('change', async event => { const files = event.target.files; if (files) await handleDiffFiles(files) })
      diffDropZone.addEventListener('click', () => diffFileInput.click())
      diffDropZone.addEventListener('dragover', e => { e.preventDefault(); if (!isDiffDragOver) { isDiffDragOver = true; diffDropZone.style.borderColor = '#3b82f6'; diffDropZone.style.backgroundColor = '#eff6ff' } })
      diffDropZone.addEventListener('dragleave', e => { e.preventDefault(); if (!diffDropZone.contains(e.relatedTarget)) { isDiffDragOver = false; diffDropZone.style.borderColor = '#d1d5db'; diffDropZone.style.backgroundColor = '#f9fafb' } })
      diffDropZone.addEventListener('drop', async e => { e.preventDefault(); isDiffDragOver = false; diffDropZone.style.borderColor = '#d1d5db'; diffDropZone.style.backgroundColor = '#f9fafb'; const files = e.dataTransfer?.files; if (files) await handleDiffFiles(files) })

      closeButton.addEventListener('click', cleanup)
      overlay.addEventListener('click', cleanup)

      const preventDefaults = e => { e.preventDefault(); e.stopPropagation() }
      ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => document.addEventListener(eventName, preventDefaults, false))

      const originalCleanup = cleanup
      const enhancedCleanup = () => { ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => document.removeEventListener(eventName, preventDefaults, false)); originalCleanup() }

      closeButton.removeEventListener('click', cleanup)
      overlay.removeEventListener('click', cleanup)
      closeButton.addEventListener('click', enhancedCleanup)
      overlay.addEventListener('click', enhancedCleanup)

      document.body.appendChild(overlay)
      document.body.appendChild(panel)
    })
  }

  // Floating trigger button
  function createFloatingButton() {
    const btn = createE('button', { text: '上传', style: `position:fixed; right:18px; bottom:18px; z-index:100000; padding:10px 14px; border-radius:9999px; background:#3b82f6; color:white; border:none; font-weight:600; cursor:pointer; box-shadow:0 6px 18px rgba(59,130,246,0.3);` })
    btn.addEventListener('click', () => showImageUploadDialog())
    document.body.appendChild(btn)
  }

  // Wait DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFloatingButton)
  } else {
    createFloatingButton()
  }

  // Expose for debugging
  window.__standaloneImageUploader = { uploader, showImageUploadDialog }
})();
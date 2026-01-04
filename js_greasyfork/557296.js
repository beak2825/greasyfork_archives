// ==UserScript==
// @name         JSON 数据查看器
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  优化查看接口返回的 JSON 数据，支持展开/收起和搜索，双击查看路径
// @author       zonahaha
// @match        http://*/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557296/JSON%20%E6%95%B0%E6%8D%AE%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557296/JSON%20%E6%95%B0%E6%8D%AE%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  'use strict'

  // 创建样式
  const style = document.createElement('style')
  style.textContent = `
    .json-viewer-container {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90vw;
      max-width: 1200px;
      height: 80vh;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      transition: all 0.3s ease;
    }

    .json-viewer-container.minimized {
      top: auto;
      left: auto;
      right: 20px;
      bottom: 90px;
      transform: none;
      width: 50px;
      height: 50px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-radius: 50%;
      background: #4C5FC0;
      padding: 0;
    }

    .json-viewer-container.minimized:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transform: scale(1.05);
    }

    .json-viewer-container.minimized .json-viewer-search,
    .json-viewer-container.minimized .json-viewer-content {
      display: none;
    }

    .json-viewer-container.minimized .json-viewer-header {
      border-radius: 50%;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: none;
      background: transparent;
    }

    .json-viewer-container.minimized .json-viewer-title {
      display: none;
    }

    .json-viewer-container.minimized .json-viewer-header-buttons {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 0;
    }

    .json-viewer-container.minimized .json-viewer-minimize {
      padding: 0;
      font-size: 14px;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-weight: 500;
      white-space: nowrap;
    }

    .json-viewer-container.minimized .json-viewer-minimize:hover {
      background: transparent;
    }

    .json-viewer-container.minimized .json-viewer-format,
    .json-viewer-container.minimized .json-viewer-clear,
    .json-viewer-container.minimized .json-viewer-close {
      display: none;
    }

    .json-viewer-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f5f5;
      border-radius: 8px 8px 0 0;
    }

    .json-viewer-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .json-viewer-header-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .json-viewer-minimize {
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .json-viewer-minimize:hover {
      background: #2196A3;
    }

    .json-viewer-close {
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .json-viewer-close:hover {
      background: #cc0000;
    }

    .json-viewer-clear {
      background: #9e9e9e;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .json-viewer-clear:hover {
      background: #757575;
    }

    .json-viewer-format {
      background: #4caf51;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .json-viewer-format:hover {
      background: #7b1fa2;
    }

    .json-viewer-search {
      padding: 12px 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
    }

    .json-viewer-search input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .json-viewer-search input:focus {
      outline: none;
      border-color: #4CAF50;
    }

    .json-viewer-content {
      flex: 1;
      overflow: auto;
      padding: 20px;
      background: #fff;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .json-viewer-toggle-btn {
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 10px;
      margin-left: 5px;
      transition: background 0.2s;
    }

    .json-viewer-toggle-btn:hover {
      background: #45a049;
    }

    .json-viewer-toggle-btn.collapse-all {
      background: #2196F3;
    }

    .json-viewer-toggle-btn.collapse-all:hover {
      background: #0b7dda;
    }

    .json-item {
      margin: 4px 0;
      font-size: 14px;
      line-height: 1.6;
      width: 100%;
    }

    .json-key-container {
      display: block;
      margin: 2px 0;
    }

    .json-key-container.inline-value {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      line-height: 1.6;
    }

    .json-key-container.inline-value .json-key {
      flex-shrink: 0;
      vertical-align: baseline;
    }

    .json-key-container.inline-value .json-value-wrapper {
      flex: 1;
      min-width: 0;
      vertical-align: baseline;
    }

    .json-key-container.inline-value .json-value-wrapper > * {
      vertical-align: baseline;
    }

    .json-key {
      color: #881391;
      font-weight: 500;
      display: inline;
      white-space: nowrap;
      vertical-align: baseline;
    }

    .json-value-wrapper {
      display: inline;
      word-break: break-word;
      overflow-wrap: break-word;
      vertical-align: baseline;
    }

    .json-value-wrapper.multiline {
      display: block;
      width: 100%;
      margin-left: 0;
    }

    .json-string {
      color: #1a1aa6;
    }

    .json-number {
      color: #1c00cf;
    }

    .json-boolean {
      color: #0e22b0;
      font-weight: 600;
    }

    .json-null {
      color: #808080;
      font-style: italic;
    }

    .json-toggle {
      cursor: pointer;
      user-select: none;
      display: inline-block;
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      margin-right: 4px;
      color: #666;
      font-weight: bold;
    }

    .json-toggle:hover {
      color: #333;
    }

    .json-toggle.expanded::before {
      content: '▼';
    }

    .json-toggle.collapsed::before {
      content: '▶';
    }

    .json-children {
      margin-left: 20px;
      border-left: 1px dashed #ddd;
      padding-left: 12px;
      width: 100%;
      box-sizing: border-box;
    }

    .json-children.hidden {
      display: none;
    }

    .json-bracket {
      color: #666;
      font-weight: 500;
    }

    .highlight {
      background: yellow;
      padding: 2px 0;
    }

    .highlight-current {
      background: #ffeb3b;
      padding: 2px 0;
      box-shadow: 0 0 0 2px #ff9800;
      border-radius: 2px;
    }

    .json-viewer-search-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }

    .json-viewer-search-nav {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .json-viewer-search-nav-btn {
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 12px;
      transition: background 0.2s;
    }

    .json-viewer-search-nav-btn:hover {
      background: #0b7dda;
    }

    .json-viewer-search-nav-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .json-viewer-search-count {
      font-size: 12px;
      color: #666;
    }

    .json-viewer-exact-match {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .json-viewer-exact-match label {
      font-size: 14px;
      color: #666;
      cursor: pointer;
      user-select: none;
    }

    .json-viewer-exact-match input[type="checkbox"] {
      cursor: pointer;
      width: 14px;
      height: 14px;
    }

    .json-viewer-floating-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      z-index: 999998;
      transition: transform 0.2s, background 0.2s;
    }

    .json-viewer-floating-btn:hover {
      transform: scale(1.1);
      background: #45a049;
    }

    .json-viewer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999998;
    }

    .json-viewer-path-display {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 10px 20px;
      font-size: 13px;
      font-family: 'Courier New', monospace;
      z-index: 1000000;
      word-break: break-all;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      min-height: 40px;
      display: flex;
      align-items: center;
    }

    .json-viewer-path-display:empty {
      display: none;
    }

    .json-viewer-path-display:not(:empty) {
      display: flex;
    }

    .json-key-container,
    .json-value-wrapper,
    .json-item {
      cursor: pointer;
    }

    .json-key-container:hover,
    .json-value-wrapper:hover {
      background: rgba(0, 0, 0, 0.02);
      border-radius: 2px;
    }
  `
  document.head.appendChild(style)

  // 解析 JSON 字符串（处理序列化的 JSON）
  function parseJsonString(str) {
    if (typeof str !== 'string') return str
    try {
      // 尝试解析 JSON 字符串
      const parsed = JSON.parse(str)
      // 如果解析后是对象或数组，返回解析后的结果
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed
      }
      return str
    } catch (e) {
      return str
    }
  }

  // 深度解析对象中的所有 JSON 字符串
  function deepParseJson(obj) {
    if (typeof obj === 'string') {
      return parseJsonString(obj)
    }
    if (Array.isArray(obj)) {
      return obj.map(item => deepParseJson(item))
    }
    if (obj !== null && typeof obj === 'object') {
      const result = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = deepParseJson(obj[key])
        }
      }
      return result
    }
    return obj
  }

  // 渲染 JSON 数据
  function renderJson(data, searchTerm = '', level = 0, path = '', exactMatch = false) {
    // 确保 searchTerm 是字符串
    searchTerm = searchTerm || ''

    const container = document.createElement('div')
    container.className = 'json-item'
    container.setAttribute('data-path', path)

    if (data === null) {
      container.innerHTML = '<span class="json-null">null</span>'
      return container
    }

    if (typeof data === 'string') {
      const displayText = searchTerm
        ? highlightText(data, searchTerm, exactMatch)
        : escapeHtml(data)
      container.innerHTML = `<span class="json-string">"${displayText}"</span>`
      return container
    }

    if (typeof data === 'number') {
      const shouldHighlight = exactMatch ? String(data) === searchTerm : String(data).includes(searchTerm)
      const displayNumber = searchTerm && shouldHighlight
        ? highlightText(String(data), searchTerm, exactMatch)
        : String(data)
      container.innerHTML = `<span class="json-number">${displayNumber}</span>`
      return container
    }

    if (typeof data === 'boolean') {
      const boolStr = String(data)
      const shouldHighlight = exactMatch ? boolStr === searchTerm : boolStr.toLowerCase().includes(searchTerm.toLowerCase())
      const displayBoolean = searchTerm && shouldHighlight
        ? highlightText(boolStr, searchTerm, exactMatch)
        : boolStr
      container.innerHTML = `<span class="json-boolean">${displayBoolean}</span>`
      return container
    }

    if (Array.isArray(data)) {
      // 移除搜索过滤，始终显示所有数据

      const toggle = document.createElement('span')
      toggle.className = 'json-toggle expanded'
      toggle.onclick = () => toggleChildren(children, toggle)

      const bracket = document.createElement('span')
      bracket.className = 'json-bracket'
      bracket.textContent = '['

      const children = document.createElement('div')
      children.className = 'json-children'

      if (data.length === 0) {
        container.innerHTML = '<span class="json-bracket">[]</span>'
        return container
      }

      // 过滤并渲染匹配的项
      let hasMatchingItems = false

      data.forEach((item, index) => {
        // 始终显示所有项，只高亮匹配的内容
        hasMatchingItems = true
        const itemContainer = document.createElement('div')
        const indexSpan = document.createElement('span')
        indexSpan.className = 'json-key'
        const shouldHighlightIndex = exactMatch ? String(index) === searchTerm : String(index).includes(searchTerm)
        const displayIndex = searchTerm && shouldHighlightIndex
          ? highlightText(String(index), searchTerm, exactMatch)
          : String(index)
        indexSpan.innerHTML = `${displayIndex}: `
        const valueWrapper = document.createElement('span')

        // 计算当前项的路径
        const itemPath = path ? `${path}[${index}]` : `[${index}]`
        itemContainer.setAttribute('data-path', itemPath)

        // 判断值是否是对象或数组
        const isComplexValue = (typeof item === 'object' && item !== null) || Array.isArray(item)

        if (isComplexValue) {
          // 对象或数组：index 和开始括号在同一行，然后换行
          itemContainer.className = 'json-key-container'
          valueWrapper.className = 'json-value-wrapper multiline'

          // 先添加 index 和冒号
          itemContainer.appendChild(indexSpan)

          // 渲染项，始终显示，传递路径
          const itemSearchTerm = searchTerm || ''
          const renderedItem = renderJson(item, itemSearchTerm, level + 1, itemPath, exactMatch)

          if (renderedItem) {
            // 查找 toggle 和开始括号（第一个 json-bracket，应该是 [ 或 {）
            const allBrackets = renderedItem.querySelectorAll('.json-bracket')
            const itemToggle = renderedItem.querySelector('.json-toggle')
            let itemOpenBracket = null

            // 找到第一个 { 或 [
            for (let i = 0; i < allBrackets.length; i++) {
              const bracket = allBrackets[i]
              if (bracket.textContent === '{' || bracket.textContent === '[') {
                itemOpenBracket = bracket
                break
              }
            }

            if (itemToggle && itemOpenBracket) {
              // 先找到 children 元素（在 renderedItem 中）
              const itemChildren = renderedItem.querySelector('.json-children')

              // 将 toggle 和开始括号添加到 index 后面（同一行）
              const clonedItemToggle = itemToggle.cloneNode(true)
              // 重新绑定事件，确保使用正确的 toggle 和 children
              if (itemChildren) {
                clonedItemToggle.onclick = () => toggleChildren(itemChildren, clonedItemToggle)
              } else {
                clonedItemToggle.onclick = () => toggleChildren(valueWrapper, clonedItemToggle)
              }
              itemContainer.appendChild(clonedItemToggle)
              itemContainer.appendChild(itemOpenBracket.cloneNode(true))

              // 移除原始的开始括号和 toggle
              renderedItem.removeChild(itemToggle)
              renderedItem.removeChild(itemOpenBracket)

              // 添加剩余内容到 valueWrapper（换行显示）
              valueWrapper.appendChild(renderedItem)
              itemContainer.appendChild(valueWrapper)
            } else {
              // 如果没有 toggle，直接添加
              valueWrapper.appendChild(renderedItem)
              itemContainer.appendChild(valueWrapper)
            }
            children.appendChild(itemContainer)
          }
        } else {
          // 基本类型：index 和 value 在同一行
          itemContainer.className = 'json-key-container inline-value'
          valueWrapper.className = 'json-value-wrapper'

          // 渲染项，始终显示，传递路径
          const itemSearchTerm = searchTerm || ''
          const renderedItem = renderJson(item, itemSearchTerm, level + 1, itemPath, exactMatch)

          if (renderedItem) {
            itemContainer.appendChild(indexSpan)
            itemContainer.appendChild(valueWrapper)
            valueWrapper.appendChild(renderedItem)
            children.appendChild(itemContainer)
          }
        }
      })

      const closeBracket = document.createElement('span')
      closeBracket.className = 'json-bracket'
      closeBracket.textContent = ']'

      container.appendChild(toggle)
      container.appendChild(bracket)
      container.appendChild(children)
      container.appendChild(closeBracket)

      return container
    }

    if (typeof data === 'object') {
      // 移除搜索过滤，始终显示所有数据

      const keys = Object.keys(data)
      if (keys.length === 0) {
        container.innerHTML = '<span class="json-bracket">{}</span>'
        return container
      }

      const toggle = document.createElement('span')
      toggle.className = 'json-toggle expanded'
      const children = document.createElement('div')
      children.className = 'json-children'

      toggle.onclick = () => toggleChildren(children, toggle)

      const openBrace = document.createElement('span')
      openBrace.className = 'json-bracket'
      openBrace.textContent = '{'

      keys.forEach(key => {
        // 始终显示所有 key，只高亮匹配的内容
        const keyContainer = document.createElement('div')
        const keySpan = document.createElement('span')
        keySpan.className = 'json-key'
        const displayKey = searchTerm ? highlightText(key, searchTerm, exactMatch) : escapeHtml(key)
        keySpan.innerHTML = `"${displayKey}": `
        const valueWrapper = document.createElement('span')

        // 计算当前 key 的路径
        const keyPath = path ? `${path}.${key}` : key
        keyContainer.setAttribute('data-path', keyPath)

        // 判断值是否是对象或数组
        const value = data[key]
        const isComplexValue = (typeof value === 'object' && value !== null) || Array.isArray(value)

        if (isComplexValue) {
          // 对象或数组：key 和开始括号在同一行，然后换行
          keyContainer.className = 'json-key-container'
          valueWrapper.className = 'json-value-wrapper multiline'

          // 先添加 key 和冒号
          keyContainer.appendChild(keySpan)

          // 渲染值，始终显示，传递路径
          const valueSearchTerm = searchTerm || ''
          const renderedValue = renderJson(value, valueSearchTerm, level + 1, keyPath, exactMatch)

          if (renderedValue) {
            // 查找 toggle 和开始括号（第一个 json-bracket，应该是 {）
            const allBrackets = renderedValue.querySelectorAll('.json-bracket')
            const valueToggle = renderedValue.querySelector('.json-toggle')
            let valueOpenBrace = null

            // 找到第一个 { 或 [
            for (let i = 0; i < allBrackets.length; i++) {
              const bracket = allBrackets[i]
              if (bracket.textContent === '{' || bracket.textContent === '[') {
                valueOpenBrace = bracket
                break
              }
            }

            if (valueToggle && valueOpenBrace) {
              // 先找到 children 元素（在 renderedValue 中）
              const valueChildren = renderedValue.querySelector('.json-children')

              // 将 toggle 和开始括号添加到 key 后面（同一行）
              const clonedToggle = valueToggle.cloneNode(true)
              // 重新绑定事件，确保使用正确的 toggle 和 children
              if (valueChildren) {
                clonedToggle.onclick = () => toggleChildren(valueChildren, clonedToggle)
              } else {
                clonedToggle.onclick = () => toggleChildren(valueWrapper, clonedToggle)
              }
              keyContainer.appendChild(clonedToggle)
              keyContainer.appendChild(valueOpenBrace.cloneNode(true))

              // 移除原始的开始括号和 toggle
              renderedValue.removeChild(valueToggle)
              renderedValue.removeChild(valueOpenBrace)

              // 添加剩余内容到 valueWrapper（换行显示）
              valueWrapper.appendChild(renderedValue)
              keyContainer.appendChild(valueWrapper)
            } else {
              // 如果没有 toggle，直接添加
              valueWrapper.appendChild(renderedValue)
              keyContainer.appendChild(valueWrapper)
            }
            children.appendChild(keyContainer)
          } else {
            // 如果返回 null，可能是空对象或空数组，强制重新渲染
            const forceRendered = renderJson(value, '', level + 1, keyPath, exactMatch)
            if (forceRendered) {
              valueWrapper.appendChild(forceRendered)
              keyContainer.appendChild(valueWrapper)
              children.appendChild(keyContainer)
            }
          }
        } else {
          // 基本类型：key 和 value 在同一行
          keyContainer.className = 'json-key-container inline-value'
          valueWrapper.className = 'json-value-wrapper'

          // 渲染值，始终显示，传递路径
          const valueSearchTerm = searchTerm || ''
          const renderedValue = renderJson(value, valueSearchTerm, level + 1, keyPath, exactMatch)

          if (renderedValue) {
            keyContainer.appendChild(keySpan)
            keyContainer.appendChild(valueWrapper)
            valueWrapper.appendChild(renderedValue)
            children.appendChild(keyContainer)
          }
        }
      })

      const closeBrace = document.createElement('span')
      closeBrace.className = 'json-bracket'
      closeBrace.textContent = '}'

      container.appendChild(toggle)
      container.appendChild(openBrace)
      container.appendChild(children)
      container.appendChild(closeBrace)

      return container
    }

    return container
  }

  // 切换子元素显示/隐藏
  function toggleChildren(children, toggle) {
    if (children.classList.contains('hidden')) {
      children.classList.remove('hidden')
      if (toggle) toggle.classList.remove('collapsed')
      if (toggle) toggle.classList.add('expanded')
    } else {
      children.classList.add('hidden')
      if (toggle) toggle.classList.remove('expanded')
      if (toggle) toggle.classList.add('collapsed')
    }
  }

  // 检查数据是否包含搜索关键字
  function matchesSearch(data, searchTerm, exactMatch = false) {
    // 如果没有搜索关键字，返回 true（显示所有内容）
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      return true
    }

    if (exactMatch) {
      // 全匹配模式：完全相等
      if (data === null) {
        return 'null' === searchTerm
      }

      if (typeof data === 'string') {
        return data === searchTerm
      }

      if (typeof data === 'number') {
        return String(data) === searchTerm
      }

      if (typeof data === 'boolean') {
        return String(data) === searchTerm
      }

      if (Array.isArray(data)) {
        return data.some(item => matchesSearch(item, searchTerm, exactMatch))
      }

      if (typeof data === 'object') {
        return Object.keys(data).some(key => {
          return key === searchTerm || matchesSearch(data[key], searchTerm, exactMatch)
        })
      }
    } else {
      // 包含匹配模式
      const lowerSearchTerm = searchTerm.toLowerCase()

      if (data === null) {
        return 'null'.includes(lowerSearchTerm)
      }

      if (typeof data === 'string') {
        return data.toLowerCase().includes(lowerSearchTerm)
      }

      if (typeof data === 'number') {
        return String(data).includes(searchTerm)
      }

      if (typeof data === 'boolean') {
        return String(data).includes(lowerSearchTerm)
      }

      if (Array.isArray(data)) {
        return data.some(item => matchesSearch(item, searchTerm, exactMatch))
      }

      if (typeof data === 'object') {
        return Object.keys(data).some(key => {
          return key.toLowerCase().includes(lowerSearchTerm) || matchesSearch(data[key], searchTerm, exactMatch)
        })
      }
    }

    return false
  }

  // 高亮搜索文本
  function highlightText(text, searchTerm, exactMatch = false) {
    if (!searchTerm) return escapeHtml(text)

    if (exactMatch) {
      // 全匹配模式：只有当文本完全等于搜索词时才高亮
      if (text === searchTerm) {
        return `<span class="highlight">${escapeHtml(text)}</span>`
      }
      return escapeHtml(text)
    } else {
      // 包含匹配模式：文本包含搜索词时高亮
      const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi')
      return escapeHtml(text).replace(regex, '<span class="highlight">$1</span>')
    }
  }

  // 转义 HTML
  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // 转义正则表达式特殊字符
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // 展开/收起所有
  function toggleAll(container, expand) {
    const toggles = container.querySelectorAll('.json-toggle')
    const children = container.querySelectorAll('.json-children')

    toggles.forEach((toggle, index) => {
      if (expand) {
        children[index].classList.remove('hidden')
        toggle.classList.remove('collapsed')
        toggle.classList.add('expanded')
      } else {
        children[index].classList.add('hidden')
        toggle.classList.remove('expanded')
        toggle.classList.add('collapsed')
      }
    })
  }

  // 创建弹窗
  function createViewer(data) {
    // 移除已存在的弹窗
    const existing = document.getElementById('json-viewer-container')
    if (existing) existing.remove()

    // 创建遮罩层
    const overlay = document.createElement('div')
    overlay.className = 'json-viewer-overlay'
    overlay.onclick = () => closeViewer()

    // 创建容器
    const container = document.createElement('div')
    container.id = 'json-viewer-container'
    container.className = 'json-viewer-container'

    // 收起状态下点击容器可以展开
    container.onclick = (e) => {
      if (container.classList.contains('minimized') && !e.target.closest('.json-viewer-header-buttons')) {
        expandViewer(container)
      }
    }

    // 创建头部
    const header = document.createElement('div')
    header.className = 'json-viewer-header'
    const title = document.createElement('h3')
    title.className = 'json-viewer-title'
    title.textContent = 'JSON 数据查看器'

    // 创建按钮容器
    const buttonContainer = document.createElement('div')
    buttonContainer.className = 'json-viewer-header-buttons'

    // 格式化按钮
    const formatBtn = document.createElement('button')
    formatBtn.className = 'json-viewer-format'
    formatBtn.textContent = '修改数据'
    formatBtn.title = '输入新的 JSON 数据并格式化显示'
    formatBtn.onclick = (e) => {
      e.stopPropagation()
      showFormatDialog(container, data)
    }

    // 收起按钮
    const minimizeBtn = document.createElement('button')
    minimizeBtn.className = 'json-viewer-minimize'
    minimizeBtn.textContent = '收起'
    minimizeBtn.onclick = (e) => {
      e.stopPropagation()
      if (container.classList.contains('minimized')) {
        expandViewer(container)
      } else {
        minimizeViewer(container)
      }
    }

    // 关闭按钮
    const closeBtn = document.createElement('button')
    closeBtn.className = 'json-viewer-close'
    closeBtn.textContent = '关闭'
    closeBtn.onclick = (e) => {
      e.stopPropagation()
      closeViewer()
    }

    buttonContainer.appendChild(formatBtn)
    buttonContainer.appendChild(minimizeBtn)
    buttonContainer.appendChild(closeBtn)
    header.appendChild(title)
    header.appendChild(buttonContainer)

    // 创建搜索框
    const searchContainer = document.createElement('div')
    searchContainer.className = 'json-viewer-search'
    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.placeholder = '搜索关键字...'
    searchInput.id = 'json-viewer-search-input'

    // 搜索导航控件
    const searchControls = document.createElement('div')
    searchControls.className = 'json-viewer-search-controls'
    const searchNav = document.createElement('div')
    searchNav.className = 'json-viewer-search-nav'

    const prevBtn = document.createElement('button')
    prevBtn.className = 'json-viewer-search-nav-btn'
    prevBtn.textContent = '↑ 上一个'
    prevBtn.id = 'json-viewer-search-prev'

    const nextBtn = document.createElement('button')
    nextBtn.className = 'json-viewer-search-nav-btn'
    nextBtn.textContent = '↓ 下一个'
    nextBtn.id = 'json-viewer-search-next'

    const searchCount = document.createElement('span')
    searchCount.className = 'json-viewer-search-count'
    searchCount.id = 'json-viewer-search-count'
    searchCount.textContent = ''

    // 全匹配复选框
    const exactMatchContainer = document.createElement('div')
    exactMatchContainer.className = 'json-viewer-exact-match'
    const exactMatchCheckbox = document.createElement('input')
    exactMatchCheckbox.type = 'checkbox'
    exactMatchCheckbox.id = 'json-viewer-exact-match'
    const exactMatchLabel = document.createElement('label')
    exactMatchLabel.setAttribute('for', 'json-viewer-exact-match')
    exactMatchLabel.textContent = '全匹配'
    exactMatchContainer.appendChild(exactMatchCheckbox)
    exactMatchContainer.appendChild(exactMatchLabel)

    searchNav.appendChild(prevBtn)
    searchNav.appendChild(nextBtn)
    searchNav.appendChild(searchCount)
    searchControls.appendChild(searchNav)
    searchControls.appendChild(exactMatchContainer)

    // 存储匹配项和当前索引
    let searchMatches = []
    let currentMatchIndex = -1

    // 搜索函数
    const performSearch = (searchTerm) => {
      searchMatches = []
      currentMatchIndex = -1

      // 读取全匹配复选框的值
      const exactMatch = exactMatchCheckbox.checked

      if (!searchTerm) {
        searchCount.textContent = ''
        prevBtn.disabled = true
        nextBtn.disabled = true
        // 移除所有高亮
        const content = container.querySelector('#json-viewer-content')
        if (content) {
          content.querySelectorAll('.highlight-current').forEach(el => {
            el.classList.remove('highlight-current')
            el.classList.add('highlight')
          })
        }
        updateContent(container, data, searchTerm, exactMatch)
        return
      }

      updateContent(container, data, searchTerm, exactMatch)

      // 收集所有匹配的元素
      setTimeout(() => {
        const content = container.querySelector('#json-viewer-content')
        if (content) {
          const highlights = content.querySelectorAll('.highlight')
          searchMatches = Array.from(highlights)

          if (searchMatches.length > 0) {
            searchCount.textContent = `找到 ${searchMatches.length} 个匹配项`
            prevBtn.disabled = false
            nextBtn.disabled = false
            // 滚动到第一个匹配项
            scrollToMatch(0)
          } else {
            searchCount.textContent = '未找到匹配项'
            prevBtn.disabled = true
            nextBtn.disabled = true
          }
        }
      }, 100)
    }

    // 滚动到匹配项
    const scrollToMatch = (index) => {
      if (searchMatches.length === 0 || index < 0 || index >= searchMatches.length) {
        return
      }

      // 移除当前高亮
      searchMatches.forEach(el => {
        el.classList.remove('highlight-current')
        if (!el.classList.contains('highlight')) {
          el.classList.add('highlight')
        }
      })

      // 设置新的当前高亮
      currentMatchIndex = index
      const currentMatch = searchMatches[index]
      currentMatch.classList.remove('highlight')
      currentMatch.classList.add('highlight-current')

      // 滚动到匹配项
      const content = container.querySelector('#json-viewer-content')
      if (content && currentMatch) {
        // 确保父节点展开
        let parent = currentMatch.parentElement
        while (parent && parent !== content) {
          if (parent.classList.contains('json-children')) {
            parent.classList.remove('hidden')
            const toggle = parent.previousElementSibling
            if (toggle && toggle.classList.contains('json-toggle')) {
              toggle.classList.remove('collapsed')
              toggle.classList.add('expanded')
            }
          }
          parent = parent.parentElement
        }

        // 滚动到元素
        currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      // 更新按钮状态
      prevBtn.disabled = index === 0
      nextBtn.disabled = index === searchMatches.length - 1
    }

    // 上一个匹配项
    prevBtn.onclick = () => {
      if (currentMatchIndex > 0) {
        scrollToMatch(currentMatchIndex - 1)
      }
    }

    // 下一个匹配项
    nextBtn.onclick = () => {
      if (currentMatchIndex < searchMatches.length - 1) {
        scrollToMatch(currentMatchIndex + 1)
      }
    }

    // 键盘快捷键
    searchInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (e.shiftKey) {
          // Shift+Enter: 上一个
          if (!prevBtn.disabled) {
            prevBtn.click()
          }
        } else {
          // Enter: 下一个
          if (!nextBtn.disabled) {
            nextBtn.click()
          }
        }
      }
    }

    let searchTimeout
    searchInput.oninput = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        const searchTerm = searchInput.value.trim()
        performSearch(searchTerm)
      }, 300)
    }

    // 全匹配复选框变化时重新搜索
    exactMatchCheckbox.onchange = () => {
      const searchTerm = searchInput.value.trim()
      if (searchTerm) {
        performSearch(searchTerm)
      }
    }

    prevBtn.disabled = true
    nextBtn.disabled = true

    searchContainer.appendChild(searchInput)
    searchContainer.appendChild(searchControls)

    // 创建内容区域
    const content = document.createElement('div')
    content.className = 'json-viewer-content'
    content.id = 'json-viewer-content'

    // 创建控制按钮
    const controls = document.createElement('div')
    const expandAllBtn = document.createElement('button')
    expandAllBtn.className = 'json-viewer-toggle-btn'
    expandAllBtn.textContent = '展开全部'
    expandAllBtn.onclick = () => toggleAll(content, true)
    const collapseAllBtn = document.createElement('button')
    collapseAllBtn.className = 'json-viewer-toggle-btn collapse-all'
    collapseAllBtn.textContent = '收起全部'
    collapseAllBtn.onclick = () => toggleAll(content, false)
    controls.appendChild(expandAllBtn)
    controls.appendChild(collapseAllBtn)

    content.appendChild(controls)
    updateContent(content, data, '')

    // 创建路径显示区域
    const pathDisplay = document.createElement('div')
    pathDisplay.className = 'json-viewer-path-display'
    pathDisplay.id = 'json-viewer-path-display'
    document.body.appendChild(pathDisplay)

    // 添加双击事件监听
    content.addEventListener('dblclick', (e) => {
      // 查找最近的包含 data-path 的元素
      let target = e.target
      let pathElement = null

      // 向上查找，找到包含 data-path 的元素
      while (target && target !== content) {
        if (target.hasAttribute && target.hasAttribute('data-path')) {
          pathElement = target
          break
        }
        target = target.parentElement
      }

      // 如果点击的是 key 或 value，尝试找到父容器
      if (!pathElement) {
        const keyContainer = e.target.closest('.json-key-container')
        if (keyContainer && keyContainer.hasAttribute('data-path')) {
          pathElement = keyContainer
        }
      }

      if (pathElement) {
        const path = pathElement.getAttribute('data-path')
        if (path) {
          showPath(path)
        }
      }
    })

    container.appendChild(header)
    container.appendChild(searchContainer)
    container.appendChild(content)
    document.body.appendChild(overlay)
    document.body.appendChild(container)
  }

  // 显示路径
  function showPath(path) {
    const pathDisplay = document.getElementById('json-viewer-path-display')
    if (pathDisplay) {
      pathDisplay.textContent = path || ''
    }
  }

  // 更新内容
  function updateContent(container, data, searchTerm, exactMatch = false) {
    const content = container.querySelector('#json-viewer-content') || container
    const controls = content.querySelector('.json-viewer-toggle-btn')?.parentElement

    // 移除旧的 JSON 内容和空数据提示（保留控制按钮）
    const oldJsonContent = content.querySelector('.json-item')
    if (oldJsonContent) {
      oldJsonContent.remove()
    }

    // 移除空数据提示
    const emptyMsg = content.querySelector('div[style*="暂无数据"]')
    if (emptyMsg) {
      emptyMsg.remove()
    }

    // 渲染新的 JSON 内容，从根路径开始
    const jsonContainer = renderJson(data, searchTerm, 0, '', exactMatch)
    if (jsonContainer) {
      if (controls && controls.nextSibling) {
        content.insertBefore(jsonContainer, controls.nextSibling)
      } else {
        content.appendChild(jsonContainer)
      }

      // 如果有搜索关键字，自动展开所有节点以便查看匹配项
      if (searchTerm) {
        toggleAll(content, true)
      }
    } else if (searchTerm) {
      // 如果没有匹配结果，显示提示
      const noResult = document.createElement('div')
      noResult.style.cssText = 'padding: 20px; text-align: center; color: #999;'
      noResult.textContent = '未找到匹配的结果'
      if (controls && controls.nextSibling) {
        content.insertBefore(noResult, controls.nextSibling)
      } else {
        content.appendChild(noResult)
      }
    }
  }

  // 收起弹窗
  function minimizeViewer(container) {
    container.classList.add('minimized')
    const overlay = document.querySelector('.json-viewer-overlay')
    if (overlay) overlay.style.display = 'none'

    // 更新按钮文本
    const minimizeBtn = container.querySelector('.json-viewer-minimize')
    if (minimizeBtn) {
      minimizeBtn.textContent = '展开'
    }
  }

  // 展开弹窗
  function expandViewer(container) {
    container.classList.remove('minimized')
    const overlay = document.querySelector('.json-viewer-overlay')
    if (overlay) overlay.style.display = 'block'

    // 更新按钮文本
    const minimizeBtn = container.querySelector('.json-viewer-minimize')
    if (minimizeBtn) {
      minimizeBtn.textContent = '收起'
    }
  }

  // 显示格式化对话框
  function showFormatDialog(container, currentData) {
    // 创建对话框
    const dialog = document.createElement('div')
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80vw;
      max-width: 800px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 1000000;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `

    const dialogOverlay = document.createElement('div')
    dialogOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999999;
    `
    dialogOverlay.onclick = () => {
      dialog.remove()
      dialogOverlay.remove()
    }

    const title = document.createElement('h3')
    title.style.cssText = 'margin: 0 0 16px 0; font-size: 18px; color: #333;'
    title.textContent = '输入 JSON 数据'

    const textarea = document.createElement('textarea')
    textarea.style.cssText = `
      width: 100%;
      height: 300px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      resize: vertical;
      box-sizing: border-box;
    `
    textarea.placeholder = '请输入 JSON 数据...\n\n示例：\n{\n  "name": "test",\n  "value": 123\n}'

    // 如果有当前数据，尝试格式化后填入
    if (currentData) {
      try {
        textarea.value = JSON.stringify(currentData, null, 2)
      } catch (e) {
        textarea.value = ''
      }
    }

    const buttonContainer = document.createElement('div')
    buttonContainer.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;'

    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = '取消'
    cancelBtn.style.cssText = `
      background: #9e9e9e;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
    `
    cancelBtn.onclick = () => {
      dialog.remove()
      dialogOverlay.remove()
    }

    const formatBtn = document.createElement('button')
    formatBtn.textContent = '格式化'
    formatBtn.style.cssText = `
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
    `
    formatBtn.onclick = () => {
      const jsonStr = textarea.value.trim()
      if (!jsonStr) {
        alert('请输入 JSON 数据')
        return
      }

      try {
        const parsedData = JSON.parse(jsonStr)
        const deepParsedData = deepParseJson(parsedData)

        // 更新内容
        updateContent(container, deepParsedData, '')

        // 清空搜索框
        const searchInput = container.querySelector('#json-viewer-search-input')
        if (searchInput) {
          searchInput.value = ''
        }

        // 重置搜索状态
        const searchCount = container.querySelector('#json-viewer-search-count')
        const prevBtn = container.querySelector('#json-viewer-search-prev')
        const nextBtn = container.querySelector('#json-viewer-search-next')
        if (searchCount) searchCount.textContent = ''
        if (prevBtn) prevBtn.disabled = true
        if (nextBtn) nextBtn.disabled = true

        dialog.remove()
        dialogOverlay.remove()
      } catch (e) {
        alert('JSON 格式错误：' + e.message)
      }
    }

    buttonContainer.appendChild(cancelBtn)
    buttonContainer.appendChild(formatBtn)

    dialog.appendChild(title)
    dialog.appendChild(textarea)
    dialog.appendChild(buttonContainer)

    document.body.appendChild(dialogOverlay)
    document.body.appendChild(dialog)

    // 聚焦到输入框
    textarea.focus()
    // 选中所有文本（如果有）
    if (textarea.value) {
      textarea.select()
    }
  }

  // 关闭弹窗
  function closeViewer() {
    const container = document.getElementById('json-viewer-container')
    const overlay = document.querySelector('.json-viewer-overlay')
    const pathDisplay = document.getElementById('json-viewer-path-display')
    if (container) container.remove()
    if (overlay) overlay.remove()
    if (pathDisplay) pathDisplay.remove()
  }

  // 创建浮动按钮
  function createFloatingButton() {
    // 检查按钮是否已存在
    const existingBtn = document.querySelector('.json-viewer-floating-btn')
    if (existingBtn) {
      return
    }

    // 确保 body 存在
    if (!document.body) {
      setTimeout(createFloatingButton, 100)
      return
    }

    try {
      const btn = document.createElement('button')
      btn.className = 'json-viewer-floating-btn'
      btn.innerHTML = '{^v^}'
      btn.style.cssText += 'font-weight: bold; font-size: 16px;font-color:orange'
      btn.title = '打开 JSON 查看器'
      btn.id = 'json-viewer-floating-btn'
      btn.onclick = () => {
        // 尝试从剪贴板获取数据
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText().then(text => {
            try {
              const data = JSON.parse(text)
              const parsedData = deepParseJson(data)
              createViewer(parsedData)
            } catch (e) {
              // 如果剪贴板不是 JSON，提示输入
              promptForJson()
            }
          }).catch(() => {
            promptForJson()
          })
        } else {
          // 如果不支持剪贴板 API，直接提示输入
          promptForJson()
        }
      }
      document.body.appendChild(btn)
    } catch (error) {
      console.error('创建 JSON 查看器按钮失败:', error)
      // 重试
      setTimeout(createFloatingButton, 500)
    }
  }

  // 提示用户输入 JSON
  function promptForJson() {
    const jsonStr = prompt('请输入 JSON 数据或粘贴 JSON 字符串：')
    if (jsonStr) {
      try {
        const data = JSON.parse(jsonStr)
        const parsedData = deepParseJson(data)
        createViewer(parsedData)
      } catch (e) {
        alert('无效的 JSON 格式：' + e.message)
      }
    }
  }

  // 页面加载完成后创建浮动按钮
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(createFloatingButton, 100)
      })
    } else if (document.body) {
      setTimeout(createFloatingButton, 100)
    } else {
      const checkBody = setInterval(() => {
        if (document.body) {
          clearInterval(checkBody)
          createFloatingButton()
        }
      }, 100)
      // 10 秒后停止检查
      setTimeout(() => {
        clearInterval(checkBody)
        if (!document.querySelector('.json-viewer-floating-btn')) {
          createFloatingButton()
        }
      }, 10000)
    }
  }

  // 立即初始化
  init()
})()
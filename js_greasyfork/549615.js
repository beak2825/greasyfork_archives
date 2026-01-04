// ==UserScript==
// @name         Market Emoji Picker for Linux.do
// @namespace    https://linux.do/
// @version      2.0.0
// @description  从云端市场加载表情包并允许用户组合分组，注入表情选择器到 Linux.do 论坛
// @author       stevessr
// @match        https://linux.do/*
// @match        https://*.linux.do/*
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef76f9c0f8d9_2_32x32.png
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      *
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549615/Market%20Emoji%20Picker%20for%20Linuxdo.user.js
// @updateURL https://update.greasyfork.org/scripts/549615/Market%20Emoji%20Picker%20for%20Linuxdo.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // ============== 配置 ==============
  const CONFIG = {
    // 云端市场基础 URL
    marketBaseUrl: GM_getValue('marketBaseUrl', 'https://video2gif-pages.pages.dev'),
    // 缓存有效期（毫秒）- 默认 24 小时
    cacheDuration: 24 * 60 * 60 * 1000,
    // 图片输出缩放比例
    imageScale: GM_getValue('imageScale', 30),
    // 输出格式：'markdown' 或 'html'
    outputFormat: GM_getValue('outputFormat', 'markdown'),
    // 是否显示搜索栏
    showSearchBar: true,
    // 是否启用悬浮预览
    enableHoverPreview: GM_getValue('enableHoverPreview', true),
    // 视图模式：'auto', 'desktop', 'mobile'
    viewMode: GM_getValue('viewMode', 'auto'),
    // 用户选择的分组 ID 列表
    selectedGroupIds: GM_getValue('selectedGroupIds', [])
  }

  // ============== 移动端检测 ==============
  function isMobile() {
    const userAgent = navigator.userAgent
    const mobileKeywords = ['Android', 'iPhone', 'iPad', 'iPod', 'Windows Phone']
    return mobileKeywords.some(keyword => userAgent.includes(keyword))
  }

  function shouldUseMobileView() {
    if (CONFIG.viewMode === 'mobile') return true
    if (CONFIG.viewMode === 'desktop') return false
    return isMobile()
  }

  // ============== 注册油猴菜单 ==============
  GM_registerMenuCommand('设置市场域名', () => {
    const url = prompt(
      '请输入云端市场域名（不含 https://）:',
      CONFIG.marketBaseUrl.replace('https://', '')
    )
    if (url !== null) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`
      GM_setValue('marketBaseUrl', fullUrl)
      CONFIG.marketBaseUrl = fullUrl
      localStorage.removeItem('emoji_market_cache_timestamp')
      localStorage.removeItem('emoji_groups_cache_timestamp')
      alert('市场域名已设置，请刷新页面加载新配置')
    }
  })

  GM_registerMenuCommand('管理表情分组', () => {
    showGroupManager()
  })

  GM_registerMenuCommand('设置图片缩放比例', () => {
    const scale = prompt('请输入缩放比例 (1-100):', CONFIG.imageScale)
    if (scale !== null) {
      const num = parseInt(scale, 10)
      if (!isNaN(num) && num >= 1 && num <= 100) {
        GM_setValue('imageScale', num)
        CONFIG.imageScale = num
        alert('缩放比例已设置为 ' + num + '%')
      }
    }
  })

  GM_registerMenuCommand('切换输出格式', () => {
    const newFormat = CONFIG.outputFormat === 'markdown' ? 'html' : 'markdown'
    GM_setValue('outputFormat', newFormat)
    CONFIG.outputFormat = newFormat
    alert('输出格式已切换为：' + newFormat)
  })

  GM_registerMenuCommand('清除缓存', () => {
    localStorage.removeItem('emoji_market_cache')
    localStorage.removeItem('emoji_market_cache_timestamp')
    localStorage.removeItem('emoji_groups_cache')
    localStorage.removeItem('emoji_groups_cache_timestamp')
    alert('缓存已清除，请刷新页面')
  })

  GM_registerMenuCommand('切换视图模式', () => {
    const modes = ['auto', 'desktop', 'mobile']
    const modeLabels = { auto: '自动', desktop: '桌面', mobile: '移动' }
    const currentIndex = modes.indexOf(CONFIG.viewMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    GM_setValue('viewMode', nextMode)
    CONFIG.viewMode = nextMode
    alert(
      '视图模式已切换为：' +
        modeLabels[nextMode] +
        (nextMode === 'auto' ? ' (当前检测：' + (isMobile() ? '移动' : '桌面') + ')' : '')
    )
  })

  // ============== 存储工具 ==============
  const MARKET_CACHE_KEY = 'emoji_market_cache'
  const MARKET_CACHE_TIME_KEY = 'emoji_market_cache_timestamp'
  const GROUPS_CACHE_KEY = 'emoji_groups_cache'
  const GROUPS_CACHE_TIME_KEY = 'emoji_groups_cache_timestamp'

  function loadCache(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (e) {
      return null
    }
  }

  function saveCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      const timeKey = key + '_timestamp'
      localStorage.setItem(timeKey, Date.now().toString())
    } catch (e) {
      console.warn('[Market Emoji] 缓存保存失败：', e)
    }
  }

  function isCacheValid(timeKey) {
    try {
      const timestamp = localStorage.getItem(timeKey)
      if (!timestamp) return false
      return Date.now() - parseInt(timestamp, 10) < CONFIG.cacheDuration
    } catch (e) {
      return false
    }
  }

  // ============== 远程加载 ==============
  function fetchRemoteConfig(url) {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('未设置 URL'))
        return
      }

      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText)
            resolve(data)
          } catch (e) {
            reject(e)
          }
        },
        onerror: function (error) {
          reject(error)
        }
      })
    })
  }

  // ============== 表情数据管理 ==============
  let marketMetadata = null
  let marketGroups = []
  let selectedEmojiGroups = []

  // 加载市场元数据
  async function loadMarketMetadata() {
    // 先尝试使用缓存
    if (isCacheValid(MARKET_CACHE_TIME_KEY)) {
      const cached = loadCache(MARKET_CACHE_KEY)
      if (cached && cached.groups) {
        marketMetadata = cached
        marketGroups = cached.groups || []
        console.log('[Market Emoji] 使用市场缓存数据')
        // 后台刷新
        refreshMarketInBackground()
        return
      }
    }

    // 从远程加载
    const metadataUrl = `${CONFIG.marketBaseUrl}/assets/market/metadata.json`
    try {
      console.log('[Market Emoji] 从远程加载市场元数据：', metadataUrl)
      const data = await fetchRemoteConfig(metadataUrl)
      marketMetadata = data
      marketGroups = data.groups || []
      saveCache(MARKET_CACHE_KEY, data)
      console.log('[Market Emoji] 市场元数据加载成功，共', marketGroups.length, '个分组')
    } catch (e) {
      console.error('[Market Emoji] 市场元数据加载失败：', e)
      // 尝试使用过期缓存
      const cached = loadCache(MARKET_CACHE_KEY)
      if (cached && cached.groups) {
        marketMetadata = cached
        marketGroups = cached.groups || []
        console.log('[Market Emoji] 使用过期市场缓存')
      }
    }
  }

  // 加载选中的分组详细数据
  async function loadSelectedGroups() {
    if (CONFIG.selectedGroupIds.length === 0) {
      selectedEmojiGroups = []
      return
    }

    // 先尝试使用缓存
    if (isCacheValid(GROUPS_CACHE_TIME_KEY)) {
      const cached = loadCache(GROUPS_CACHE_KEY)
      if (cached && cached.length > 0) {
        selectedEmojiGroups = cached
        console.log('[Market Emoji] 使用分组缓存数据')
        // 后台刷新
        refreshGroupsInBackground()
        return
      }
    }

    // 从远程加载
    try {
      console.log('[Market Emoji] 加载选中的分组：', CONFIG.selectedGroupIds)
      const groups = []

      for (const groupId of CONFIG.selectedGroupIds) {
        try {
          const groupUrl = `${CONFIG.marketBaseUrl}/assets/market/group-${groupId}.json`
          const groupData = await fetchRemoteConfig(groupUrl)

          const emojiGroup = {
            id: groupData.id,
            name: groupData.name,
            icon: groupData.icon,
            detail: groupData.detail,
            order: groupData.order || 0,
            emojis: (groupData.emojis || []).map(e => ({
              id: e.id || `emoji-${Date.now()}-${Math.random()}`,
              packet: e.packet || Date.now(),
              name: e.name || '未命名',
              url: e.url,
              displayUrl: e.displayUrl,
              width: e.width,
              height: e.height,
              groupId: groupData.id
            }))
          }

          groups.push(emojiGroup)
        } catch (e) {
          console.error(`[Market Emoji] 加载分组 ${groupId} 失败：`, e)
        }
      }

      selectedEmojiGroups = groups
      saveCache(GROUPS_CACHE_KEY, groups)
      console.log('[Market Emoji] 选中分组加载成功，共', groups.length, '个分组')
    } catch (e) {
      console.error('[Market Emoji] 选中分组加载失败：', e)
      // 尝试使用过期缓存
      const cached = loadCache(GROUPS_CACHE_KEY)
      if (cached) {
        selectedEmojiGroups = cached
        console.log('[Market Emoji] 使用过期分组缓存')
      }
    }
  }

  function refreshMarketInBackground() {
    const metadataUrl = `${CONFIG.marketBaseUrl}/assets/market/metadata.json`
    fetchRemoteConfig(metadataUrl)
      .then(data => {
        marketMetadata = data
        marketGroups = data.groups || []
        saveCache(MARKET_CACHE_KEY, data)
        console.log('[Market Emoji] 市场后台刷新完成')
      })
      .catch(() => {})
  }

  function refreshGroupsInBackground() {
    if (CONFIG.selectedGroupIds.length === 0) return

    const groups = []
    const loadPromises = CONFIG.selectedGroupIds.map(async groupId => {
      try {
        const groupUrl = `${CONFIG.marketBaseUrl}/assets/market/group-${groupId}.json`
        const groupData = await fetchRemoteConfig(groupUrl)

        const emojiGroup = {
          id: groupData.id,
          name: groupData.name,
          icon: groupData.icon,
          detail: groupData.detail,
          order: groupData.order || 0,
          emojis: (groupData.emojis || []).map(e => ({
            id: e.id || `emoji-${Date.now()}-${Math.random()}`,
            packet: e.packet || Date.now(),
            name: e.name || '未命名',
            url: e.url,
            displayUrl: e.displayUrl,
            width: e.width,
            height: e.height,
            groupId: groupData.id
          }))
        }

        groups.push(emojiGroup)
      } catch (e) {
        console.error(`[Market Emoji] 后台刷新分组 ${groupId} 失败：`, e)
      }
    })

    Promise.all(loadPromises).then(() => {
      selectedEmojiGroups = groups
      saveCache(GROUPS_CACHE_KEY, groups)
      console.log('[Market Emoji] 分组后台刷新完成')
    })
  }

  // ============== 分组管理器 ==============
  function showGroupManager() {
    if (marketGroups.length === 0) {
      alert('市场数据尚未加载，请稍后再试')
      return
    }

    // 创建遮罩
    const backdrop = document.createElement('div')
    backdrop.className = 'remote-emoji-backdrop backdrop-enter'
    backdrop.style.zIndex = '999997'
    backdrop.onclick = () => closeGroupManager()

    // 创建模态框
    const modal = document.createElement('div')
    modal.className = 'remote-emoji-modal modal-enter'
    modal.style.zIndex = '999998'
    modal.style.maxHeight = '80vh'

    // 头部
    const header = document.createElement('div')
    header.className = 'modal-header'
    header.style.justifyContent = 'space-between'

    const title = document.createElement('h3')
    title.textContent = '表情分组管理'
    title.style.margin = '0'
    title.style.color = 'var(--primary, #333)'
    header.appendChild(title)

    const closeBtn = document.createElement('button')
    closeBtn.className = 'close-btn'
    closeBtn.textContent = '✕'
    closeBtn.onclick = () => closeGroupManager()
    header.appendChild(closeBtn)

    modal.appendChild(header)

    // 搜索栏
    const searchContainer = document.createElement('div')
    searchContainer.style.padding = '12px 16px'
    searchContainer.style.borderBottom = '1px solid var(--primary-low, #eee)'

    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.placeholder = '搜索表情包...'
    searchInput.style.width = '100%'
    searchInput.style.padding = '8px 12px'
    searchInput.style.border = '1px solid var(--primary-low, #ddd)'
    searchInput.style.borderRadius = '6px'
    searchInput.style.fontSize = '14px'
    searchContainer.appendChild(searchInput)

    modal.appendChild(searchContainer)

    // 内容区
    const content = document.createElement('div')
    content.className = 'content'
    content.style.maxHeight = '50vh'
    content.style.overflowY = 'auto'

    // 已选择的分组
    const selectedSection = document.createElement('div')
    selectedSection.style.marginBottom = '20px'

    const selectedTitle = document.createElement('h4')
    selectedTitle.textContent = '已选择的分组'
    selectedTitle.style.margin = '0 0 10px 0'
    selectedTitle.style.padding = '0 0 8px 0'
    selectedTitle.style.borderBottom = '2px solid var(--tertiary, #007bff)'
    selectedTitle.style.color = 'var(--primary, #333)'
    selectedSection.appendChild(selectedTitle)

    const selectedList = document.createElement('div')
    selectedList.className = 'selected-groups-list'
    selectedList.style.display = 'grid'
    selectedList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))'
    selectedList.style.gap = '12px'

    selectedSection.appendChild(selectedList)
    content.appendChild(selectedSection)

    // 可选择的分组
    const availableSection = document.createElement('div')

    const availableTitle = document.createElement('h4')
    availableTitle.textContent = '可选择的分组'
    availableTitle.style.margin = '0 0 10px 0'
    availableTitle.style.padding = '0 0 8px 0'
    availableTitle.style.borderBottom = '1px solid var(--primary-low, #eee)'
    availableTitle.style.color = 'var(--primary, #333)'
    availableSection.appendChild(availableTitle)

    const availableList = document.createElement('div')
    availableList.className = 'available-groups-list'
    availableList.style.display = 'grid'
    availableList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))'
    availableList.style.gap = '12px'

    availableSection.appendChild(availableList)
    content.appendChild(availableSection)

    modal.appendChild(content)

    // 底部操作栏
    const footer = document.createElement('div')
    footer.style.padding = '12px 16px'
    footer.style.borderTop = '1px solid var(--primary-low, #eee)'
    footer.style.display = 'flex'
    footer.style.justifyContent = 'flex-end'
    footer.style.gap = '8px'

    const cancelBtn = document.createElement('button')
    cancelBtn.textContent = '取消'
    cancelBtn.style.padding = '8px 16px'
    cancelBtn.style.border = '1px solid var(--primary-low, #ddd)'
    cancelBtn.style.borderRadius = '4px'
    cancelBtn.style.background = 'var(--secondary, #fff)'
    cancelBtn.style.cursor = 'pointer'
    cancelBtn.onclick = () => closeGroupManager()
    footer.appendChild(cancelBtn)

    const saveBtn = document.createElement('button')
    saveBtn.textContent = '保存'
    saveBtn.style.padding = '8px 16px'
    saveBtn.style.border = 'none'
    saveBtn.style.borderRadius = '4px'
    saveBtn.style.background = 'var(--tertiary, #007bff)'
    saveBtn.style.color = 'white'
    saveBtn.style.cursor = 'pointer'
    saveBtn.onclick = () => saveGroupSelection()
    footer.appendChild(saveBtn)

    modal.appendChild(footer)

    // 渲染分组列表
    function renderGroupLists() {
      const selectedIds = new Set(CONFIG.selectedGroupIds)
      const query = searchInput.value.toLowerCase()

      // 清空列表
      selectedList.innerHTML = ''
      availableList.innerHTML = ''

      // 渲染已选择的分组
      marketGroups
        .filter(group => {
          return (
            selectedIds.has(group.id) &&
            (group.name.toLowerCase().includes(query) ||
              (group.detail && group.detail.toLowerCase().includes(query)))
          )
        })
        .forEach(group => {
          const item = createGroupItem(group, true)
          selectedList.appendChild(item)
        })

      // 渲染可选择的分组
      marketGroups
        .filter(group => {
          return (
            !selectedIds.has(group.id) &&
            (group.name.toLowerCase().includes(query) ||
              (group.detail && group.detail.toLowerCase().includes(query)))
          )
        })
        .forEach(group => {
          const item = createGroupItem(group, false)
          availableList.appendChild(item)
        })

      // 如果没有搜索结果
      if (selectedList.children.length === 0 && availableList.children.length === 0) {
        const noResult = document.createElement('div')
        noResult.textContent = '没有找到匹配的表情包'
        noResult.style.textAlign = 'center'
        noResult.style.color = 'var(--primary-medium, #888)'
        noResult.style.padding = '20px'
        noResult.style.gridColumn = '1 / -1'
        availableList.appendChild(noResult)
      }
    }

    // 创建分组项
    function createGroupItem(group, isSelected) {
      const item = document.createElement('div')
      item.style.padding = '12px'
      item.style.border = '1px solid var(--primary-low, #ddd)'
      item.style.borderRadius = '8px'
      item.style.background = 'var(--secondary, #fff)'

      const header = document.createElement('div')
      header.style.display = 'flex'
      header.style.alignItems = 'center'
      header.style.gap = '8px'
      header.style.marginBottom = '8px'

      // 图标
      if (group.icon && (group.icon.startsWith('http') || group.icon.startsWith('data:'))) {
        const icon = document.createElement('img')
        icon.src = group.icon
        icon.alt = group.name
        icon.style.width = '24px'
        icon.style.height = '24px'
        icon.style.objectFit = 'contain'
        header.appendChild(icon)
      } else {
        const icon = document.createElement('span')
        icon.textContent = group.icon || '📁'
        icon.style.fontSize = '20px'
        header.appendChild(icon)
      }

      // 名称和数量
      const info = document.createElement('div')
      info.style.flex = '1'

      const name = document.createElement('div')
      name.textContent = group.name
      name.style.fontWeight = 'bold'
      name.style.color = 'var(--primary, #333)'
      info.appendChild(name)

      const count = document.createElement('div')
      count.textContent = `${group.emojiCount || 0} 个表情`
      count.style.fontSize = '12px'
      count.style.color = 'var(--primary-medium, #888)'
      info.appendChild(count)

      header.appendChild(info)

      // 操作按钮
      const actionBtn = document.createElement('button')
      actionBtn.textContent = isSelected ? '移除' : '添加'
      actionBtn.style.padding = '4px 8px'
      actionBtn.style.border = '1px solid'
      actionBtn.style.borderRadius = '4px'
      actionBtn.style.fontSize = '12px'
      actionBtn.style.cursor = 'pointer'

      if (isSelected) {
        actionBtn.style.borderColor = 'var(--danger, #dc3545)'
        actionBtn.style.color = 'var(--danger, #dc3545)'
        actionBtn.style.background = 'var(--secondary, #fff)'
        actionBtn.onmouseover = () => {
          actionBtn.style.background = 'var(--danger, #dc3545)'
          actionBtn.style.color = 'white'
        }
        actionBtn.onmouseout = () => {
          actionBtn.style.background = 'var(--secondary, #fff)'
          actionBtn.style.color = 'var(--danger, #dc3545)'
        }
      } else {
        actionBtn.style.borderColor = 'var(--tertiary, #007bff)'
        actionBtn.style.color = 'var(--tertiary, #007bff)'
        actionBtn.style.background = 'var(--secondary, #fff)'
        actionBtn.onmouseover = () => {
          actionBtn.style.background = 'var(--tertiary, #007bff)'
          actionBtn.style.color = 'white'
        }
        actionBtn.onmouseout = () => {
          actionBtn.style.background = 'var(--secondary, #fff)'
          actionBtn.style.color = 'var(--tertiary, #007bff)'
        }
      }

      actionBtn.onclick = () => {
        if (isSelected) {
          const index = CONFIG.selectedGroupIds.indexOf(group.id)
          if (index > -1) {
            CONFIG.selectedGroupIds.splice(index, 1)
          }
        } else {
          CONFIG.selectedGroupIds.push(group.id)
        }
        renderGroupLists()
      }

      header.appendChild(actionBtn)
      item.appendChild(header)

      // 描述
      if (group.detail) {
        const desc = document.createElement('div')
        desc.textContent = group.detail
        desc.style.fontSize = '12px'
        desc.style.color = 'var(--primary-medium, #888)'
        desc.style.lineHeight = '1.4'
        desc.style.display = '-webkit-box'
        desc.style.webkitLineClamp = '2'
        desc.style.webkitBoxOrient = 'vertical'
        desc.style.overflow = 'hidden'
        item.appendChild(desc)
      }

      return item
    }

    // 保存分组选择
    function saveGroupSelection() {
      GM_setValue('selectedGroupIds', CONFIG.selectedGroupIds)
      alert(`已保存 ${CONFIG.selectedGroupIds.length} 个分组选择，请刷新页面生效`)
      closeGroupManager()
    }

    // 关闭分组管理器
    function closeGroupManager() {
      if (backdrop.parentNode) {
        backdrop.classList.add('backdrop-exit')
        void backdrop.offsetHeight
        backdrop.classList.remove('backdrop-exit')
        backdrop.classList.add('backdrop-exit-active')
      }

      if (modal.parentNode) {
        modal.classList.add('modal-exit')
        void modal.offsetHeight
        modal.classList.remove('modal-exit')
        modal.classList.add('modal-exit-active')
      }

      setTimeout(() => {
        if (backdrop.parentNode) backdrop.remove()
        if (modal.parentNode) modal.remove()
      }, 200)
    }

    // 搜索功能
    searchInput.addEventListener('input', renderGroupLists)

    // 初始渲染
    renderGroupLists()

    // 添加到页面
    document.body.appendChild(backdrop)
    document.body.appendChild(modal)

    // 触发进入动画
    requestAnimationFrame(() => {
      backdrop.classList.remove('backdrop-enter')
      backdrop.classList.add('backdrop-enter-active')
      modal.classList.remove('modal-enter')
      modal.classList.add('modal-enter-active')

      setTimeout(() => {
        backdrop.classList.remove('backdrop-enter-active')
        modal.classList.remove('modal-enter-active')
      }, 200)
    })
  }

  // ============== 样式注入 ==============
  const ANIMATION_DURATION = 200

  function injectStyles() {
    if (document.getElementById('market-emoji-picker-styles')) return

    const css = `
      /* 悬浮预览 */
      .emoji-picker-hover-preview {
        position: fixed;
        pointer-events: none;
        display: none;
        z-index: 1000002;
        max-width: 320px;
        max-height: 320px;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.32);
        background: var(--secondary, #fff);
        padding: 8px;
        border: 1px solid var(--primary-low, #ddd);
      }
      .emoji-picker-hover-preview img {
        display: block;
        max-width: 100%;
        max-height: 220px;
        object-fit: contain;
      }
      .emoji-picker-hover-preview .label {
        font-size: 12px;
        color: var(--primary, #333);
        margin-top: 8px;
        text-align: center;
        word-break: break-word;
      }

      /* 选择器容器 */
      .market-emoji-picker {
        position: fixed;
        z-index: 999999;
        background: var(--secondary, #fff);
        border: 1px solid var(--primary-low, #ddd);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        max-width: 400px;
        max-height: 450px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* 进入动画 */
      .market-emoji-picker.picker-enter {
        opacity: 0 !important;
        transform: scale(0.95) translateY(-8px) !important;
      }
      .market-emoji-picker.picker-enter-active {
        opacity: 1 !important;
        transform: scale(1) translateY(0) !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-out, transform ${ANIMATION_DURATION}ms ease-out !important;
      }

      /* 退出动画 */
      .market-emoji-picker.picker-exit {
        opacity: 1 !important;
        transform: scale(1) translateY(0) !important;
      }
      .market-emoji-picker.picker-exit-active {
        opacity: 0 !important;
        transform: scale(0.95) translateY(-8px) !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-in, transform ${ANIMATION_DURATION}ms ease-in !important;
      }

      /* 搜索栏 */
      .market-emoji-picker .search-bar {
        padding: 8px;
        border-bottom: 1px solid var(--primary-low, #eee);
        display: flex;
        gap: 8px;
      }
      .market-emoji-picker .search-bar input {
        flex: 1;
        padding: 6px 10px;
        border: 1px solid var(--primary-low, #ddd);
        border-radius: 4px;
        font-size: 14px;
        background: var(--secondary, #fff);
        color: var(--primary, #333);
      }
      .market-emoji-picker .search-bar .close-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--primary, #666);
        padding: 0 8px;
      }

      /* 分组导航 */
      .market-emoji-picker .group-nav {
        display: flex;
        gap: 4px;
        padding: 6px 8px;
        border-bottom: 1px solid var(--primary-low, #eee);
        overflow-x: auto;
        flex-shrink: 0;
      }
      .market-emoji-picker .group-nav button {
        background: none;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 16px;
        flex-shrink: 0;
      }
      .market-emoji-picker .group-nav button:hover {
        background: var(--primary-very-low, #f0f0f0);
      }
      .market-emoji-picker .group-nav button.active {
        background: var(--tertiary, #007bff);
        color: white;
      }
      .market-emoji-picker .group-nav button img {
        width: 18px;
        height: 18px;
        object-fit: contain;
        vertical-align: middle;
      }

      /* 内容区 */
      .market-emoji-picker .content {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      /* 分组区块 */
      .market-emoji-picker .group-section {
        margin-bottom: 16px;
      }
      .market-emoji-picker .group-section h3 {
        font-size: 12px;
        color: var(--primary-medium, #888);
        margin: 0 0 8px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--primary-very-low, #eee);
      }
      .market-emoji-picker .emoji-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 4px;
      }
      .market-emoji-picker .emoji-grid img {
        width: 32px;
        height: 32px;
        object-fit: contain;
        cursor: pointer;
        border-radius: 4px;
        transition: transform 0.1s, background 0.1s;
      }
      .market-emoji-picker .emoji-grid img:hover {
        transform: scale(1.2);
        background: var(--primary-very-low, #f0f0f0);
      }

      /* 工具栏按钮 */
      .market-emoji-toolbar-btn {
        background: none;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 18px;
        border-radius: 4px;
      }
      .market-emoji-toolbar-btn:hover {
        background: var(--primary-very-low, #f0f0f0);
      }

      /* 空状态 */
      .market-emoji-picker .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--primary-medium, #888);
      }
      .market-emoji-picker .empty-state h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        color: var(--primary, #333);
      }
      .market-emoji-picker .empty-state p {
        margin: 0;
        font-size: 14px;
        line-height: 1.4;
      }
      .market-emoji-picker .empty-state button {
        margin-top: 16px;
        padding: 8px 16px;
        border: 1px solid var(--tertiary, #007bff);
        border-radius: 4px;
        background: var(--secondary, #fff);
        color: var(--tertiary, #007bff);
        cursor: pointer;
        font-size: 14px;
      }
      .market-emoji-picker .empty-state button:hover {
        background: var(--tertiary, #007bff);
        color: white;
      }

      /* ============== 移动端样式 ============== */
      /* 移动端遮罩 */
      .remote-emoji-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999998;
      }
      .remote-emoji-backdrop.backdrop-enter {
        opacity: 0 !important;
      }
      .remote-emoji-backdrop.backdrop-enter-active {
        opacity: 1 !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-out !important;
      }
      .remote-emoji-backdrop.backdrop-exit {
        opacity: 1 !important;
      }
      .remote-emoji-backdrop.backdrop-exit-active {
        opacity: 0 !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-in !important;
      }

      /* 移动端模态框 */
      .remote-emoji-modal {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999;
        background: var(--secondary, #fff);
        border-radius: 16px 16px 0 0;
        box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .remote-emoji-modal.modal-enter {
        opacity: 0 !important;
        transform: translateY(100%) !important;
      }
      .remote-emoji-modal.modal-enter-active {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-out, transform ${ANIMATION_DURATION}ms ease-out !important;
      }
      .remote-emoji-modal.modal-exit {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
      .remote-emoji-modal.modal-exit-active {
        opacity: 0 !important;
        transform: translateY(100%) !important;
        transition: opacity ${ANIMATION_DURATION}ms ease-in, transform ${ANIMATION_DURATION}ms ease-in !important;
      }

      /* 移动端头部 */
      .remote-emoji-modal .modal-header {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--primary-low, #eee);
        gap: 12px;
      }
      .remote-emoji-modal .modal-header input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid var(--primary-low, #ddd);
        border-radius: 8px;
        font-size: 16px;
        background: var(--secondary, #fff);
        color: var(--primary, #333);
      }
      .remote-emoji-modal .modal-header .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--primary, #666);
        padding: 4px 8px;
      }

      /* 移动端分组导航 */
      .remote-emoji-modal .group-nav {
        display: flex;
        gap: 4px;
        padding: 8px 12px;
        border-bottom: 1px solid var(--primary-low, #eee);
        overflow-x: auto;
        flex-shrink: 0;
        -webkit-overflow-scrolling: touch;
      }
      .remote-emoji-modal .group-nav button {
        background: none;
        border: none;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 8px;
        font-size: 20px;
        flex-shrink: 0;
      }
      .remote-emoji-modal .group-nav button:hover,
      .remote-emoji-modal .group-nav button:active {
        background: var(--primary-very-low, #f0f0f0);
      }
      .remote-emoji-modal .group-nav button.active {
        background: var(--tertiary, #007bff);
        color: white;
      }
      .remote-emoji-modal .group-nav button img {
        width: 22px;
        height: 22px;
        object-fit: contain;
        vertical-align: middle;
      }

      /* 移动端内容区 */
      .remote-emoji-modal .content {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        -webkit-overflow-scrolling: touch;
      }

      /* 移动端分组区块 */
      .remote-emoji-modal .group-section {
        margin-bottom: 20px;
      }
      .remote-emoji-modal .group-section h3 {
        font-size: 14px;
        color: var(--primary-medium, #888);
        margin: 0 0 10px 0;
        padding-bottom: 6px;
        border-bottom: 1px solid var(--primary-very-low, #eee);
      }
      .remote-emoji-modal .emoji-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
      }
      .remote-emoji-modal .emoji-grid img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: contain;
        cursor: pointer;
        border-radius: 8px;
        padding: 4px;
        transition: background 0.1s;
      }
      .remote-emoji-modal .emoji-grid img:active {
        background: var(--primary-very-low, #f0f0f0);
      }
    `

    const style = document.createElement('style')
    style.id = 'market-emoji-picker-styles'
    style.textContent = css
    document.head.appendChild(style)
  }

  // ============== 悬浮预览 ==============
  let hoverPreview = null

  function ensureHoverPreview() {
    if (!hoverPreview) {
      hoverPreview = document.createElement('div')
      hoverPreview.className = 'emoji-picker-hover-preview'
      hoverPreview.innerHTML = '<img><div class="label"></div>'
      document.body.appendChild(hoverPreview)
    }
    return hoverPreview
  }

  function bindHoverPreview(imgEl, emoji) {
    if (!CONFIG.enableHoverPreview) return

    const preview = ensureHoverPreview()
    const previewImg = preview.querySelector('img')
    const previewLabel = preview.querySelector('.label')

    imgEl.addEventListener('mouseenter', e => {
      previewImg.src = emoji.url
      previewLabel.textContent = emoji.name || ''
      preview.style.display = 'block'
      movePreview(e)
    })

    imgEl.addEventListener('mousemove', movePreview)

    imgEl.addEventListener('mouseleave', () => {
      preview.style.display = 'none'
    })

    function movePreview(e) {
      const pad = 12
      const vw = window.innerWidth
      const vh = window.innerHeight
      const rect = preview.getBoundingClientRect()
      let left = e.clientX + pad
      let top = e.clientY + pad
      if (left + rect.width > vw) left = e.clientX - rect.width - pad
      if (top + rect.height > vh) top = e.clientY - rect.height - pad
      preview.style.left = left + 'px'
      preview.style.top = top + 'px'
    }
  }

  // ============== 插入表情 ==============
  function insertEmoji(emoji) {
    // 查找编辑器
    const selectors = [
      'textarea.d-editor-input',
      'textarea.ember-text-area',
      '.ProseMirror.d-editor-input',
      '[contenteditable="true"]'
    ]

    let editor = null
    for (const sel of selectors) {
      editor = document.querySelector(sel)
      if (editor) break
    }

    if (!editor) {
      console.error('[Market Emoji] 找不到编辑器')
      return
    }

    // 构建插入文本
    const width = emoji.width || 500
    const height = emoji.height || 500
    const scale = CONFIG.imageScale

    let insertText = ''
    if (CONFIG.outputFormat === 'html') {
      const scaledWidth = Math.max(1, Math.round(width * (scale / 100)))
      const scaledHeight = Math.max(1, Math.round(height * (scale / 100)))
      insertText = `<img src="${emoji.url}" title=":${emoji.name}:" class="emoji" alt=":${emoji.name}:" loading="lazy" width="${scaledWidth}" height="${scaledHeight}"> `
    } else {
      insertText = `![${emoji.name}|${width}x${height},${scale}%](${emoji.url}) `
    }

    // 插入到 textarea
    if (editor.tagName === 'TEXTAREA') {
      const start = editor.selectionStart
      const end = editor.selectionEnd
      editor.value = editor.value.substring(0, start) + insertText + editor.value.substring(end)
      editor.selectionStart = editor.selectionEnd = start + insertText.length
      editor.focus()
      editor.dispatchEvent(new Event('input', { bubbles: true }))
    }
    // 插入到 ProseMirror 或 contenteditable
    else {
      try {
        const dataTransfer = new DataTransfer()
        if (CONFIG.outputFormat === 'html') {
          dataTransfer.setData('text/html', insertText)
        } else {
          dataTransfer.setData('text/plain', insertText)
        }
        const pasteEvent = new ClipboardEvent('paste', {
          clipboardData: dataTransfer,
          bubbles: true
        })
        editor.dispatchEvent(pasteEvent)
      } catch (e) {
        // Fallback
        document.execCommand('insertText', false, insertText)
      }
    }
  }

  // ============== 表情选择器 ==============
  let currentPicker = null
  let currentBackdrop = null
  let isAnimating = false

  // 关闭移动端模态框
  function closeMobilePicker(callback) {
    if (isAnimating) {
      if (callback) callback()
      return
    }

    if (!currentPicker && !currentBackdrop) {
      if (callback) callback()
      return
    }

    isAnimating = true

    // 隐藏悬浮预览
    if (hoverPreview) {
      hoverPreview.style.display = 'none'
    }

    // 遮罩退出动画
    if (currentBackdrop) {
      currentBackdrop.classList.add('backdrop-exit')
      void currentBackdrop.offsetHeight
      currentBackdrop.classList.remove('backdrop-exit')
      currentBackdrop.classList.add('backdrop-exit-active')
    }

    // 模态框退出动画
    if (currentPicker) {
      currentPicker.classList.add('modal-exit')
      void currentPicker.offsetHeight
      currentPicker.classList.remove('modal-exit')
      currentPicker.classList.add('modal-exit-active')
    }

    setTimeout(() => {
      if (currentBackdrop) {
        currentBackdrop.remove()
        currentBackdrop = null
      }
      if (currentPicker) {
        currentPicker.remove()
        currentPicker = null
      }
      isAnimating = false
      if (callback) callback()
    }, ANIMATION_DURATION)
  }

  // 关闭桌面端选择器
  function closeDesktopPicker(callback) {
    if (!currentPicker || isAnimating) {
      if (callback) callback()
      return
    }

    isAnimating = true

    // 隐藏悬浮预览
    if (hoverPreview) {
      hoverPreview.style.display = 'none'
    }

    // 添加退出动画
    currentPicker.classList.add('picker-exit')
    void currentPicker.offsetHeight
    currentPicker.classList.remove('picker-exit')
    currentPicker.classList.add('picker-exit-active')

    setTimeout(() => {
      if (currentPicker) {
        currentPicker.remove()
        currentPicker = null
      }
      isAnimating = false
      if (callback) callback()
    }, ANIMATION_DURATION)
  }

  // 统一关闭函数
  function closePicker(callback) {
    if (currentBackdrop) {
      closeMobilePicker(callback)
    } else {
      closeDesktopPicker(callback)
    }
  }

  // 创建空状态
  function createEmptyState() {
    const emptyState = document.createElement('div')
    emptyState.className = 'empty-state'

    const title = document.createElement('h3')
    title.textContent = '还没有选择表情包'
    emptyState.appendChild(title)

    const desc = document.createElement('p')
    desc.textContent = '点击下方按钮打开表情包管理器，从云端市场选择您喜欢的表情包'
    emptyState.appendChild(desc)

    const manageBtn = document.createElement('button')
    manageBtn.textContent = '管理表情包'
    manageBtn.onclick = () => {
      closePicker(() => showGroupManager())
    }
    emptyState.appendChild(manageBtn)

    return emptyState
  }

  // 创建移动端选择器
  function createMobilePicker() {
    if (selectedEmojiGroups.length === 0) {
      // 创建空状态选择器
      const backdrop = document.createElement('div')
      backdrop.className = 'remote-emoji-backdrop backdrop-enter'
      backdrop.onclick = () => closePicker()

      const modal = document.createElement('div')
      modal.className = 'remote-emoji-modal modal-enter'
      modal.style.padding = '20px'
      modal.style.textAlign = 'center'

      const emptyState = createEmptyState()
      modal.appendChild(emptyState)

      return { backdrop, modal }
    }

    // 创建遮罩
    const backdrop = document.createElement('div')
    backdrop.className = 'remote-emoji-backdrop backdrop-enter'
    backdrop.onclick = () => closePicker()

    // 创建模态框
    const modal = document.createElement('div')
    modal.className = 'remote-emoji-modal modal-enter'

    // 头部（搜索栏 + 关闭按钮）
    const header = document.createElement('div')
    header.className = 'modal-header'

    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.placeholder = '搜索表情...'
    header.appendChild(searchInput)

    const closeBtn = document.createElement('button')
    closeBtn.className = 'close-btn'
    closeBtn.textContent = '✕'
    closeBtn.onclick = () => closePicker()
    header.appendChild(closeBtn)

    modal.appendChild(header)

    // 分组导航
    const groupNav = document.createElement('div')
    groupNav.className = 'group-nav'

    selectedEmojiGroups.forEach((group, index) => {
      if (!group.emojis || group.emojis.length === 0) return

      const btn = document.createElement('button')
      btn.title = group.name
      if (index === 0) btn.classList.add('active')

      const icon = group.icon
      if (icon && (icon.startsWith('http') || icon.startsWith('data:'))) {
        const img = document.createElement('img')
        img.src = icon
        img.alt = group.name
        btn.appendChild(img)
      } else {
        btn.textContent = icon || '📁'
      }

      btn.onclick = () => {
        groupNav.querySelectorAll('button').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const section = content.querySelector(`[data-group="${group.id}"]`)
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      groupNav.appendChild(btn)
    })

    modal.appendChild(groupNav)

    // 内容区
    const content = document.createElement('div')
    content.className = 'content'

    selectedEmojiGroups.forEach(group => {
      if (!group.emojis || group.emojis.length === 0) return

      const section = document.createElement('div')
      section.className = 'group-section'
      section.dataset.group = group.id

      const title = document.createElement('h3')
      title.textContent = group.name
      section.appendChild(title)

      const grid = document.createElement('div')
      grid.className = 'emoji-grid'

      group.emojis.forEach(emoji => {
        if (!emoji.url || !emoji.name) return

        const img = document.createElement('img')
        img.src = emoji.displayUrl || emoji.url
        img.alt = emoji.name
        img.title = emoji.name
        img.loading = 'lazy'
        img.dataset.name = emoji.name.toLowerCase()

        img.onclick = () => {
          insertEmoji(emoji)
          closePicker()
        }

        grid.appendChild(img)
      })

      section.appendChild(grid)
      content.appendChild(section)
    })

    modal.appendChild(content)

    // 搜索功能
    searchInput.addEventListener('input', e => {
      const query = e.target.value.toLowerCase()
      content.querySelectorAll('.emoji-grid img').forEach(img => {
        const name = img.dataset.name || ''
        img.style.display = query === '' || name.includes(query) ? '' : 'none'
      })
      content.querySelectorAll('.group-section').forEach(section => {
        const visibleEmojis = section.querySelectorAll(
          '.emoji-grid img:not([style*="display: none"])'
        )
        section.style.display = visibleEmojis.length > 0 ? '' : 'none'
      })
    })

    return { backdrop, modal }
  }

  // 创建桌面端选择器
  function createDesktopPicker() {
    if (selectedEmojiGroups.length === 0) {
      // 创建空状态选择器
      const picker = document.createElement('div')
      picker.className = 'market-emoji-picker picker-enter'
      picker.style.padding = '20px'
      picker.style.textAlign = 'center'

      const emptyState = createEmptyState()
      picker.appendChild(emptyState)

      return picker
    }

    const picker = document.createElement('div')
    // 创建时带有进入动画初始类
    picker.className = 'market-emoji-picker picker-enter'

    // 搜索栏
    const searchBar = document.createElement('div')
    searchBar.className = 'search-bar'

    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.placeholder = '搜索表情...'
    searchBar.appendChild(searchInput)

    const closeBtn = document.createElement('button')
    closeBtn.className = 'close-btn'
    closeBtn.textContent = '✕'
    closeBtn.onclick = () => closePicker()
    searchBar.appendChild(closeBtn)

    picker.appendChild(searchBar)

    // 分组导航
    const groupNav = document.createElement('div')
    groupNav.className = 'group-nav'

    selectedEmojiGroups.forEach((group, index) => {
      if (!group.emojis || group.emojis.length === 0) return

      const btn = document.createElement('button')
      btn.title = group.name
      if (index === 0) btn.classList.add('active')

      // 图标
      const icon = group.icon
      if (icon && (icon.startsWith('http') || icon.startsWith('data:'))) {
        const img = document.createElement('img')
        img.src = icon
        img.alt = group.name
        btn.appendChild(img)
      } else {
        btn.textContent = icon || '📁'
      }

      btn.onclick = () => {
        groupNav.querySelectorAll('button').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const section = content.querySelector(`[data-group="${group.id}"]`)
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      groupNav.appendChild(btn)
    })

    picker.appendChild(groupNav)

    // 内容区
    const content = document.createElement('div')
    content.className = 'content'

    selectedEmojiGroups.forEach(group => {
      if (!group.emojis || group.emojis.length === 0) return

      const section = document.createElement('div')
      section.className = 'group-section'
      section.dataset.group = group.id

      const title = document.createElement('h3')
      title.textContent = group.name
      section.appendChild(title)

      const grid = document.createElement('div')
      grid.className = 'emoji-grid'

      group.emojis.forEach(emoji => {
        if (!emoji.url || !emoji.name) return

        const img = document.createElement('img')
        img.src = emoji.displayUrl || emoji.url
        img.alt = emoji.name
        img.title = emoji.name
        img.loading = 'lazy'
        img.dataset.name = emoji.name.toLowerCase()

        bindHoverPreview(img, emoji)

        img.onclick = () => {
          insertEmoji(emoji)
          closePicker()
        }

        grid.appendChild(img)
      })

      section.appendChild(grid)
      content.appendChild(section)
    })

    picker.appendChild(content)

    // 搜索功能
    searchInput.addEventListener('input', e => {
      const query = e.target.value.toLowerCase()
      content.querySelectorAll('.emoji-grid img').forEach(img => {
        const name = img.dataset.name || ''
        img.style.display = query === '' || name.includes(query) ? '' : 'none'
      })
      content.querySelectorAll('.group-section').forEach(section => {
        const visibleEmojis = section.querySelectorAll(
          '.emoji-grid img:not([style*="display: none"])'
        )
        section.style.display = visibleEmojis.length > 0 ? '' : 'none'
      })
    })

    return picker
  }

  function showPicker(anchorEl) {
    if (isAnimating) return

    // 如果已有 picker，先关闭再打开
    if (currentPicker || currentBackdrop) {
      closePicker(() => showPicker(anchorEl))
      return
    }

    const useMobile = shouldUseMobileView()

    if (useMobile) {
      // 移动端模式
      const result = createMobilePicker()
      if (!result) return

      currentBackdrop = result.backdrop
      currentPicker = result.modal

      document.body.appendChild(currentBackdrop)
      document.body.appendChild(currentPicker)

      // 触发进入动画
      requestAnimationFrame(() => {
        if (!currentBackdrop || !currentPicker) return

        void currentBackdrop.offsetHeight
        currentBackdrop.classList.remove('backdrop-enter')
        currentBackdrop.classList.add('backdrop-enter-active')

        void currentPicker.offsetHeight
        currentPicker.classList.remove('modal-enter')
        currentPicker.classList.add('modal-enter-active')

        // 动画完成后清理类
        setTimeout(() => {
          if (currentBackdrop) {
            currentBackdrop.classList.remove('backdrop-enter-active')
          }
          if (currentPicker) {
            currentPicker.classList.remove('modal-enter-active')
          }
        }, ANIMATION_DURATION)
      })
    } else {
      // 桌面端模式
      currentPicker = createDesktopPicker()
      if (!currentPicker) return

      document.body.appendChild(currentPicker)

      // 定位
      const rect = anchorEl.getBoundingClientRect()
      const margin = 8
      const vw = window.innerWidth
      const vh = window.innerHeight

      let top = rect.bottom + margin
      let left = rect.left

      // 等待渲染后调整位置并触发进入动画
      requestAnimationFrame(() => {
        if (!currentPicker) return

        const pickerRect = currentPicker.getBoundingClientRect()

        if (top + pickerRect.height > vh) {
          top = Math.max(margin, rect.top - pickerRect.height - margin)
        }
        if (left + pickerRect.width > vw) {
          left = Math.max(margin, vw - pickerRect.width - margin)
        }

        currentPicker.style.top = top + 'px'
        currentPicker.style.left = left + 'px'

        // 触发进入动画
        void currentPicker.offsetHeight
        currentPicker.classList.remove('picker-enter')
        currentPicker.classList.add('picker-enter-active')

        // 动画完成后清理类
        setTimeout(() => {
          if (currentPicker) {
            currentPicker.classList.remove('picker-enter-active')
          }
        }, ANIMATION_DURATION)
      })

      // 点击外部关闭
      setTimeout(() => {
        const handler = e => {
          if (
            currentPicker &&
            !currentPicker.contains(e.target) &&
            e.target !== anchorEl &&
            !isAnimating
          ) {
            document.removeEventListener('click', handler)
            closePicker()
          }
        }
        document.addEventListener('click', handler)
      }, 100)
    }
  }

  // ============== 工具栏注入 ==============
  function findToolbars() {
    const selectors = [
      '.d-editor-button-bar',
      '.toolbar-visible',
      '.chat-composer__wrapper .chat-composer__inner-container'
    ]

    const toolbars = []
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => toolbars.push(el))
    }
    return toolbars
  }

  function injectButton(toolbar) {
    if (toolbar.querySelector('.market-emoji-toolbar-btn')) return

    const btn = document.createElement('button')
    btn.className = 'btn no-text btn-icon market-emoji-toolbar-btn'
    btn.title = '市场表情包'
    btn.type = 'button'
    btn.innerHTML = '<svg class="fa d-icon d-icon-far-face-smile svg-icon svg-string" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><use href="#far-face-smile"></use></svg>'
    btn.style.color = 'var(--tertiary)'

    btn.onclick = e => {
      e.stopPropagation()
      showPicker(btn)
    }

    toolbar.appendChild(btn)
  }

  function attemptInjection() {
    const toolbars = findToolbars()
    toolbars.forEach(toolbar => injectButton(toolbar))
    return toolbars.length
  }

  // ============== 初始化 ==============
  async function init() {
    console.log('[Market Emoji] 初始化...')

    injectStyles()
    await loadMarketMetadata()
    await loadSelectedGroups()

    // 尝试注入
    let attempts = 0
    const maxAttempts = 10

    function tryInject() {
      attempts++
      const count = attemptInjection()

      if (count > 0) {
        console.log('[Market Emoji] 注入成功，工具栏数量：', count)
      } else if (attempts < maxAttempts) {
        setTimeout(tryInject, 1000)
      } else {
        console.log('[Market Emoji] 未找到工具栏')
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryInject)
    } else {
      tryInject()
    }

    // 定期检查新工具栏
    setInterval(attemptInjection, 30000)

    // 监听 DOM 变化
    const observer = new MutationObserver(() => {
      attemptInjection()
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  // 检测是否是 Discourse 站点
  function isDiscourseSite() {
    const metaTags = document.querySelectorAll(
      'meta[name*="discourse"], meta[content*="discourse"]'
    )
    if (metaTags.length > 0) return true

    const generator = document.querySelector('meta[name="generator"]')
    if (generator && generator.content && generator.content.toLowerCase().includes('discourse'))
      return true

    if (document.querySelector('#main-outlet, .ember-application, textarea.d-editor-input'))
      return true

    return false
  }

  if (isDiscourseSite()) {
    init()
  } else {
    console.log('[Market Emoji] 非 Discourse 站点，跳过')
  }
})()

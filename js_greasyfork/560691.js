// ==UserScript==
// @name         M-Team 批量下载种子
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在M-Team导航栏添加批量下载种子按钮
// @author       江畔
// @match        https://*.m-team.cc/*
// @match        https://*.m-team.io/*
// @icon         https://static.m-team.cc/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      api.m-team.io
// @connect      api.m-team.cc
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560691/M-Team%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/560691/M-Team%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // API配置
  const MTEAM_API_BASE_URL = 'https://api.m-team.io'
  const CONFIG_KEY_API_KEY = 'mteam_api_key'
  
  // 获取API Key
  const getApiKey = () => {
    return GM_getValue(CONFIG_KEY_API_KEY, '')
  }
  
  // 设置API Key
  const setApiKey = (apiKey) => {
    GM_setValue(CONFIG_KEY_API_KEY, apiKey)
  }
  
  // 检查API Key是否已配置
  const checkApiKey = () => {
    const apiKey = getApiKey()
    if (!apiKey) {
      const userInput = prompt('请输入 M-Team API Key:', '')
      if (userInput && userInput.trim()) {
        setApiKey(userInput.trim())
        alert('API Key 已保存！')
        return true
      } else {
        alert('API Key 未设置，无法使用批量下载功能！')
        return false
      }
    }
    return true
  }
  
  // 注册配置菜单
  GM_registerMenuCommand('设置 API Key', () => {
    const currentApiKey = getApiKey()
    const maskedApiKey = currentApiKey ? currentApiKey.substring(0, 8) + '...' : ''
    const userInput = prompt(`当前 API Key: ${maskedApiKey}\n\n请输入新的 M-Team API Key:`, currentApiKey)
    if (userInput !== null) {
      if (userInput.trim()) {
        setApiKey(userInput.trim())
        alert('API Key 已更新！')
      } else {
        alert('API Key 不能为空！')
      }
    }
  })

  // 清理文件名，移除不允许的字符
  const sanitizeFileName = (fileName) => {
    // 移除不允许的字符: / \ : * ? " < > |
    return fileName.replace(/[/\\:*?"<>|]/g, '_').trim()
  }

  // 调用API获取种子详情
  const getTorrentDetail = (torrentId) => {
    return new Promise((resolve, reject) => {
      const origin = window.location.origin
      const url = `${MTEAM_API_BASE_URL}/api/torrent/detail?id=${torrentId}&origin=${encodeURIComponent(origin)}`
      
      GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-api-key': getApiKey(),
          'User-Agent': navigator.userAgent,
          'Accept': 'application/json, text/plain, */*'
        },
        onload: function (response) {
          try {
            if (response.status === 200) {
              const result = JSON.parse(response.responseText)
              const code = result.code
              if (code === 0 || code === "0") {
                const data = result.data
                if (data && data.name) {
                  resolve(data)
                } else {
                  reject(new Error('种子详情中未找到名称'))
                }
              } else {
                reject(new Error(result.message || '获取种子详情失败'))
              }
            } else {
              reject(new Error(`API请求失败，状态码: ${response.status}`))
            }
          } catch (e) {
            reject(new Error('解析响应失败: ' + e.message))
          }
        },
        onerror: function (error) {
          reject(new Error('网络请求失败: ' + (error.message || String(error))))
        },
        ontimeout: () => reject(new Error('请求超时'))
      })
    })
  }

  // 调用API获取下载链接
  const getDownloadUrl = (torrentId) => {
    return new Promise((resolve, reject) => {
      const url = `${MTEAM_API_BASE_URL}/api/torrent/genDlToken?id=${torrentId}`
      
      GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-api-key': getApiKey(),
          'User-Agent': navigator.userAgent,
          'Accept': 'application/json, text/plain, */*'
        },
        onload: function (response) {
          try {
            if (response.status === 200) {
              const result = JSON.parse(response.responseText)
              const code = result.code
              if (code === 0 || code === "0") {
                const downloadUrl = result.data
                if (downloadUrl && typeof downloadUrl === 'string' && downloadUrl.startsWith('http')) {
                  resolve(downloadUrl)
                } else {
                  reject(new Error('下载链接格式不正确'))
                }
              } else {
                reject(new Error(result.message || '获取下载链接失败'))
              }
            } else {
              reject(new Error(`API请求失败，状态码: ${response.status}`))
            }
          } catch (e) {
            reject(new Error('解析响应失败: ' + e.message))
          }
        },
        onerror: function (error) {
          reject(new Error('网络请求失败: ' + (error.message || String(error))))
        },
        ontimeout: () => reject(new Error('请求超时'))
      })
    })
  }

  // 下载torrent文件
  const downloadTorrent = async (torrentId, downloadUrl, fileName) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: downloadUrl,
        responseType: 'arraybuffer',
        headers: {
          'Referer': window.location.href,
          'User-Agent': navigator.userAgent
        },
        onload: function (response) {
          if (response.status === 200) {
            // 将ArrayBuffer转换为Blob
            const blob = new Blob([response.response], { type: 'application/x-bittorrent' })
            const blobUrl = URL.createObjectURL(blob)
            
            // 清理文件名
            const safeFileName = sanitizeFileName(fileName || `${torrentId}.torrent`)
            const finalFileName = safeFileName.endsWith('.torrent') ? safeFileName : `${safeFileName}.torrent`
            
            // 创建下载链接
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = finalFileName
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            
            // 释放Blob URL
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100)
            
            resolve(true)
          } else {
            reject(new Error(`下载失败，状态码: ${response.status}`))
          }
        },
        onerror: function (error) {
          reject(new Error('下载失败: ' + (error.message || String(error))))
        }
      })
    })
  }

  // 批量下载
  const batchDownload = async (torrentIds) => {
    const ids = torrentIds.filter(id => id.trim()).map(id => id.trim())
    if (ids.length === 0) {
      alert('请输入至少一个torrent ID')
      return
    }

    const results = []
    let successCount = 0
    let failCount = 0

    // 显示进度提示
    const progressDiv = document.createElement('div')
    progressDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      min-width: 300px;
      font-family: Arial, sans-serif;
    `
    progressDiv.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold;">批量下载进度</div>
      <div id="progress-text">准备中...</div>
      <div style="margin-top: 10px; font-size: 12px; color: #666;">
        成功: <span id="success-count">0</span> / 
        失败: <span id="fail-count">0</span> / 
        总计: ${ids.length}
      </div>
    `
    document.body.appendChild(progressDiv)

    const updateProgress = (text, success, fail) => {
      const progressText = progressDiv.querySelector('#progress-text')
      const successCountEl = progressDiv.querySelector('#success-count')
      const failCountEl = progressDiv.querySelector('#fail-count')
      if (progressText) progressText.textContent = text
      if (successCountEl) successCountEl.textContent = success
      if (failCountEl) failCountEl.textContent = fail
    }

    // 逐个下载，添加延迟避免请求过快
    for (let i = 0; i < ids.length; i++) {
      const torrentId = ids[i]
      updateProgress(`正在处理: ${torrentId} (${i + 1}/${ids.length})`, successCount, failCount)

      try {
        // 先获取种子详情（包含名称）
        let torrentName = null
        try {
          const torrentDetail = await getTorrentDetail(torrentId)
          torrentName = torrentDetail.name
          updateProgress(`获取种子信息: ${torrentName} (${i + 1}/${ids.length})`, successCount, failCount)
        } catch (error) {
          console.warn(`获取种子 ${torrentId} 详情失败，将使用ID作为文件名:`, error)
          // 如果获取详情失败，继续使用ID作为文件名
        }

        // 获取下载链接
        const downloadUrl = await getDownloadUrl(torrentId)
        
        // 下载文件，添加延迟避免浏览器阻止多个下载
        await new Promise(resolve => setTimeout(resolve, 500))
        await downloadTorrent(torrentId, downloadUrl, torrentName)
        
        successCount++
        const displayName = torrentName || torrentId
        results.push({ id: torrentId, status: 'success', name: displayName })
        updateProgress(`已下载: ${displayName} (${i + 1}/${ids.length})`, successCount, failCount)
      } catch (error) {
        failCount++
        results.push({ id: torrentId, status: 'fail', error: error.message })
        updateProgress(`下载失败: ${torrentId} - ${error.message} (${i + 1}/${ids.length})`, successCount, failCount)
        console.error(`下载 ${torrentId} 失败:`, error)
      }

      // 添加延迟，避免请求过快
      if (i < ids.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // 显示完成信息
    updateProgress(`完成！成功: ${successCount}, 失败: ${failCount}`, successCount, failCount)
    
    setTimeout(() => {
      document.body.removeChild(progressDiv)
      if (failCount > 0) {
        const failIds = results.filter(r => r.status === 'fail').map(r => r.id).join(', ')
        alert(`下载完成！\n成功: ${successCount}\n失败: ${failCount}\n失败的ID: ${failIds}`)
      } else {
        alert(`下载完成！成功下载 ${successCount} 个文件`)
      }
    }, 2000)
  }

  // 显示输入对话框
  const showInputDialog = () => {
    // 检查API Key
    if (!checkApiKey()) {
      return
    }
    
    // 创建遮罩层
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    `

    // 创建对话框
    const dialog = document.createElement('div')
    dialog.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      min-width: 400px;
      max-width: 600px;
      font-family: Arial, sans-serif;
    `

    dialog.innerHTML = `
      <div style="margin-bottom: 15px; font-size: 18px; font-weight: bold;">批量下载种子</div>
      <div style="margin-bottom: 10px; color: #666; font-size: 14px;">
        请输入torrent ID，每行一个：
      </div>
      <textarea id="torrent-ids-input" 
        style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; resize: vertical; box-sizing: border-box;"
        placeholder="例如：&#10;225681&#10;224586&#10;259099"></textarea>
      <div style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
        <button id="cancel-btn" style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">取消</button>
        <button id="confirm-btn" style="padding: 8px 16px; border: none; background: #1890ff; color: white; border-radius: 4px; cursor: pointer;">确定</button>
      </div>
    `

    overlay.appendChild(dialog)
    document.body.appendChild(overlay)

    // 关闭对话框
    const closeDialog = () => {
      document.body.removeChild(overlay)
    }

    // 取消按钮
    dialog.querySelector('#cancel-btn').addEventListener('click', closeDialog)

    // 确定按钮
    dialog.querySelector('#confirm-btn').addEventListener('click', () => {
      const input = dialog.querySelector('#torrent-ids-input')
      const torrentIds = input.value.split('\n').filter(id => id.trim())
      closeDialog()
      if (torrentIds.length > 0) {
        batchDownload(torrentIds)
      } else {
        alert('请输入至少一个torrent ID')
      }
    })

    // 点击遮罩层关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeDialog()
      }
    })

    // 聚焦输入框
    dialog.querySelector('#torrent-ids-input').focus()
  }

  // 在导航栏添加按钮
  const addDownloadButton = () => {
    // 查找导航栏
    const menu = document.querySelector('ul.ant-menu-root.ant-menu-horizontal')
    if (!menu) {
      console.log('未找到导航栏，等待页面加载...')
      setTimeout(addDownloadButton, 1000)
      return
    }

    // 检查是否已添加按钮
    if (document.getElementById('mteam-batch-download-btn')) {
      return
    }

    // 创建按钮
    const buttonLi = document.createElement('li')
    buttonLi.className = 'ant-menu-overflow-item ant-menu-item ant-menu-item-only-child'
    buttonLi.setAttribute('role', 'menuitem')
    buttonLi.setAttribute('tabindex', '-1')
    buttonLi.id = 'mteam-batch-download-btn'
    buttonLi.style.cssText = 'opacity: 1; order: 999;'

    const buttonSpan = document.createElement('span')
    buttonSpan.className = 'ant-menu-title-content'

    const button = document.createElement('a')
    button.className = 'text-inherit'
    button.href = 'javascript:void(0)'
    button.textContent = '下载种子'
    button.style.cursor = 'pointer'

    button.addEventListener('click', (e) => {
      e.preventDefault()
      showInputDialog()
    })

    buttonSpan.appendChild(button)
    buttonLi.appendChild(buttonSpan)
    menu.appendChild(buttonLi)

    console.log('批量下载按钮已添加')
  }

  // 页面加载完成后添加按钮
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDownloadButton)
  } else {
    addDownloadButton()
  }

  // 监听页面变化（SPA应用）
  const observer = new MutationObserver(() => {
    if (!document.getElementById('mteam-batch-download-btn')) {
      addDownloadButton()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

})()

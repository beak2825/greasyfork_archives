// ==UserScript==
// @name         Augment Session提取器
// @namespace    https://app.augmentcode.com/
// @version      1.0.1
// @description  在Augment订阅页面提取Session值（自动跨页面提取）
// @author       ltw
// @license      MIT
// @match        https://app.augmentcode.com/account/subscription*
// @match        https://auth.augmentcode.com/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551506/Augment%20Session%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551506/Augment%20Session%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  // 等待页面完全加载
  function waitForPageLoad() {
    return new Promise(resolve => {
      if (document.readyState === "complete") {
        resolve()
      } else {
        window.addEventListener("load", resolve)
      }
    })
  }

  // 判断当前在哪个页面
  function getCurrentPageType() {
    const url = window.location.href
    if (url.includes("app.augmentcode.com/account/subscription")) {
      return "subscription"
    } else if (url.includes("auth.augmentcode.com")) {
      return "auth"
    }
    return "unknown"
  }

  // 在auth页面直接获取当前页面的session cookie
  function getSessionFromCurrentPage() {
    return new Promise(resolve => {
      GM_cookie.list({ name: "session" }, function (cookies, error) {
        if (error) {
          resolve(null)
          return
        }

        if (cookies && cookies.length > 0) {
          const session = cookies[0].value
          resolve(session)
        } else {
          resolve(null)
        }
      })
    })
  }

  // 从subscription页面跳转到auth页面
  function jumpToAuthPage() {
    // 标记正在提取中
    GM_setValue("augment_extracting", "true")
    GM_setValue("augment_return_url", window.location.href)
    // 跳转到auth页面
    window.location.href = "https://auth.augmentcode.com/"
  }

  // 从auth页面返回subscription页面
  function returnToSubscriptionPage(session) {
    // 保存session到临时存储
    GM_setValue("augment_session", session)
    GM_setValue("augment_extracting", "false")

    // 获取返回URL
    const returnUrl = GM_getValue(
      "augment_return_url",
      "https://app.augmentcode.com/account/subscription"
    )

    // 跳转回去
    window.location.href = returnUrl
  }

  // 复制到剪贴板
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        // 降级方案
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const result = document.execCommand("copy")
        document.body.removeChild(textArea)
        return result
      }
    } catch (error) {
      return false
    }
  }

  // 显示Toast通知
  function showToast(message, type = "info") {
    // 移除已存在的toast
    const existingToast = document.getElementById("augment-session-toast")
    if (existingToast) {
      existingToast.remove()
    }

    const toast = document.createElement("div")
    toast.id = "augment-session-toast"
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      max-width: 300px;
      word-wrap: break-word;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `
    toast.textContent = message
    document.body.appendChild(toast)

    // 动画显示
    setTimeout(() => {
      toast.style.opacity = "1"
      toast.style.transform = "translateX(0)"
    }, 10)

    // 自动隐藏
    setTimeout(() => {
      toast.style.opacity = "0"
      toast.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, 3000)
  }

  // 创建浮动按钮组
  function createFloatingButtonGroup() {
    // 创建容器
    const container = document.createElement("div")
    container.id = "augment-session-button-group"
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
    `

    // 创建"提取Session"按钮
    const extractButton = document.createElement("button")
    extractButton.id = "augment-session-extractor-btn"
    extractButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
      </svg>
      提取Session
    `
    extractButton.style.cssText = `
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(59, 130, 246, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: 160px;
    `

    // 提取按钮悬停效果
    extractButton.addEventListener("mouseenter", () => {
      extractButton.style.transform = "translateY(-2px) scale(1.02)"
      extractButton.style.boxShadow =
        "0 12px 40px rgba(59, 130, 246, 0.4), 0 8px 24px rgba(59, 130, 246, 0.3)"
      extractButton.style.background = "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
    })

    extractButton.addEventListener("mouseleave", () => {
      extractButton.style.transform = "translateY(0) scale(1)"
      extractButton.style.boxShadow =
        "0 8px 32px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(59, 130, 246, 0.2)"
      extractButton.style.background = "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
    })

    // 提取按钮点击事件
    extractButton.addEventListener("click", () => {
      showToast("正在跳转到认证页面获取Session...", "info")
      setTimeout(() => {
        jumpToAuthPage()
      }, 500)
    })

    // 创建"导入到软件"按钮
    const importButton = document.createElement("button")
    importButton.id = "augment-session-import-btn"
    importButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
      </svg>
      导入到ATM
    `
    importButton.style.cssText = `
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3), 0 4px 16px rgba(16, 185, 129, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      min-width: 160px;
    `

    // 导入按钮悬停效果
    importButton.addEventListener("mouseenter", () => {
      importButton.style.transform = "translateY(-2px) scale(1.02)"
      importButton.style.boxShadow =
        "0 12px 40px rgba(16, 185, 129, 0.4), 0 8px 24px rgba(16, 185, 129, 0.3)"
      importButton.style.background = "linear-gradient(135deg, #059669 0%, #047857 100%)"
    })

    importButton.addEventListener("mouseleave", () => {
      importButton.style.transform = "translateY(0) scale(1)"
      importButton.style.boxShadow =
        "0 8px 32px rgba(16, 185, 129, 0.3), 0 4px 16px rgba(16, 185, 129, 0.2)"
      importButton.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    })

    // 导入按钮点击事件
    importButton.addEventListener("click", () => {
      handleImportToSoftware()
    })

    // 将两个按钮添加到容器
    container.appendChild(extractButton)
    container.appendChild(importButton)

    return container
  }

  // 在auth页面自动提取session
  async function handleAuthPage() {
    try {
      // 检查是否是从subscription页面跳转过来的
      const isExtracting = GM_getValue("augment_extracting", "false")

      if (isExtracting === "true") {
        // 显示提示Toast
        showToast("正在提取Session...", "info")

        // 等待一下确保页面和cookie完全加载
        await new Promise(resolve => setTimeout(resolve, 1500))

        // 获取session
        const session = await getSessionFromCurrentPage()

        if (session) {
          showToast("Session提取成功，正在返回...", "success")

          // 延迟一下让用户看到成功提示
          setTimeout(() => {
            returnToSubscriptionPage(session)
          }, 800)
        } else {
          showToast("未能获取到Session Cookie，请确保已登录", "error")

          // 清除提取标记
          GM_setValue("augment_extracting", "false")

          // 3秒后自动返回
          setTimeout(() => {
            const returnUrl = GM_getValue(
              "augment_return_url",
              "https://app.augmentcode.com/account/subscription"
            )
            window.location.href = returnUrl
          }, 3000)
        }
      }
    } catch (error) {
      showToast(`提取失败: ${error.message}`, "error")
      GM_setValue("augment_extracting", "false")
    }
  }

  // 在subscription页面检查是否刚从auth返回
  async function handleReturnFromAuth() {
    // 检查是否有提取到的session
    const extractedSession = GM_getValue("augment_session", null)

    if (extractedSession) {
      // 保存为最后一次成功提取的session（用于导入功能）
      GM_setValue("augment_last_session", extractedSession)
      // 清除临时存储
      GM_setValue("augment_session", null)

      // 检查是否需要自动导入
      const shouldAutoImport = GM_getValue("augment_auto_import", "false")

      if (shouldAutoImport === "true") {
        // 清除自动导入标记
        GM_setValue("augment_auto_import", "false")

        // 显示提示
        showToast("✓ Session提取成功，正在调起软件导入...", "success")

        // 延迟后自动触发导入
        setTimeout(() => {
          try {
            // 构造atm协议URL
            const importUrl = `atm://import?session=${encodeURIComponent(extractedSession)}`
            window.location.href = importUrl

            // 显示导入提示
            setTimeout(() => {
              showToast("✓ 已发送导入请求到软件", "success")
            }, 500)
          } catch (error) {
            showToast(`自动导入失败: ${error.message}`, "error")
            console.error("自动导入失败:", error)
          }
        }, 800)
      } else {
        // 仅提取模式：复制到剪贴板
        const copySuccess = await copyToClipboard(extractedSession)

        if (copySuccess) {
          showToast(`✓ Session已复制到剪贴板！\n长度: ${extractedSession.length} 字符`, "success")
        } else {
          showToast("Session提取成功，但复制失败\n请查看控制台手动复制", "error")
        }
      }
    }
  }

  // 处理导入到软件功能
  function handleImportToSoftware() {
    try {
      // 设置自动导入标记
      GM_setValue("augment_auto_import", "true")

      // 显示提示
      showToast("正在跳转到认证页面获取最新Session...", "info")

      // 延迟一下让用户看到提示，然后触发提取流程
      setTimeout(() => {
        jumpToAuthPage()
      }, 500)
    } catch (error) {
      showToast(`导入失败: ${error.message}`, "error")
      console.error("导入到软件失败:", error)
      // 清除标记
      GM_setValue("augment_auto_import", "false")
    }
  }

  // 添加CSS动画样式
  function addAnimationStyles() {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      #augment-session-extractor-btn {
        animation: none;
      }
      
      #augment-session-extractor-btn:hover {
        animation: none;
      }
    `
    document.head.appendChild(style)
  }

  // 在subscription页面初始化
  async function initSubscriptionPage() {
    try {
      // 添加动画样式
      addAnimationStyles()

      // 创建并添加按钮组
      const buttonGroup = createFloatingButtonGroup()
      document.body.appendChild(buttonGroup)

      // 检查是否刚从auth页面返回
      await handleReturnFromAuth()
    } catch (error) {
      console.error("Subscription页面初始化失败:", error)
    }
  }

  // 主函数
  async function init() {
    try {
      await waitForPageLoad()

      const pageType = getCurrentPageType()
      console.log("当前页面类型:", pageType)

      if (pageType === "subscription") {
        await initSubscriptionPage()
      } else if (pageType === "auth") {
        await handleAuthPage()
      } else {
        console.log("不在支持的页面上")
      }
    } catch (error) {
      console.error("初始化失败:", error)
    }
  }

  // 启动脚本
  init()
})()

// ==UserScript==
// @name         Cursor长效Token转换器
// @namespace    https://cursor.com/
// @version      1.0.0
// @description  在Cursor Dashboard页面添加长效token转换功能
// @author       ltw
// @license      MIT
// @match        cursor.com/*dashboard*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551508/Cursor%E9%95%BF%E6%95%88Token%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551508/Cursor%E9%95%BF%E6%95%88Token%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
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

  // 存储拦截到的session token
  let interceptedSessionToken = null
  let tokenExtracted = false

  // 从Cookie中获取WorkosCursorSessionToken
  function getTokenFromCookies() {
    return new Promise(resolve => {
      GM_cookie.list({ name: "WorkosCursorSessionToken" }, function (cookies, error) {
        if (error) {
          console.error("获取Cookie失败:", error)
          resolve(null)
          return
        }

        if (cookies && cookies.length > 0) {
          const token = cookies[0].value
          console.log("成功从Cookie获取到WorkosCursorSessionToken")
          resolve(token)
        } else {
          console.log("未找到WorkosCursorSessionToken Cookie")
          resolve(null)
        }
      })
    })
  }

  // 解析Cookie字符串
  function parseCookieString(cookieString) {
    try {
      const cookies = cookieString.split(";")
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split("=")
        if (name === "WorkosCursorSessionToken") {
          return decodeURIComponent(value)
        }
      }
      return null
    } catch (error) {
      console.error("解析Cookie失败:", error)
      return null
    }
  }

  // 获取session token（优先使用Cookie，失败时提供手动输入）
  async function getSessionToken() {
    // 如果已经获取到token，直接返回
    if (tokenExtracted && interceptedSessionToken) {
      return interceptedSessionToken
    }

    // 尝试从Cookie获取token
    const token = await getTokenFromCookies()
    if (token) {
      interceptedSessionToken = token
      tokenExtracted = true
      return token
    }

    // 如果自动获取失败，提供手动输入选项
    return await promptForManualToken()
  }

  // 手动输入token的提示
  function promptForManualToken() {
    return new Promise(resolve => {
      const input = prompt(
        "自动获取WorkosCursorSessionToken失败。\n\n" +
          "请手动输入WorkosCursorSessionToken值：\n" +
          "(您可以在浏览器开发者工具的Network标签页中找到此值)"
      )

      if (input && input.trim()) {
        resolve(input.trim())
      } else {
        resolve(null)
      }
    })
  }

  // 获取 Cursor API Token
  function getCursorToken(sessionToken) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://token.cursorpro.com.cn/reftoken?token=${encodeURIComponent(sessionToken)}`,
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText)

            if (data.code === 0) {
              resolve({
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                expireTime: data.data.expire_time,
                daysLeft: data.data.days_left,
                userId: data.data.user_id
              })
            } else {
              reject(new Error(data.msg || "获取失败"))
            }
          } catch (error) {
            console.error("解析响应失败:", error)
            reject(error)
          }
        },
        onerror: function (error) {
          console.error("获取Token失败:", error)
          reject(error)
        }
      })
    })
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
      console.error("复制到剪贴板失败:", error)
      return false
    }
  }

  // 显示Toast通知
  function showToast(message, type = "info") {
    // 移除已存在的toast
    const existingToast = document.getElementById("cursor-token-toast")
    if (existingToast) {
      existingToast.remove()
    }

    const toast = document.createElement("div")
    toast.id = "cursor-token-toast"
    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"
            };
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

  // 创建浮动按钮
  function createFloatingButton() {
    const button = document.createElement("button")
    button.id = "cursor-token-converter-btn"
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      </svg>
      转换为长效Token
    `
    button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 14px 24px;
            border-radius: 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3), 0 4px 16px rgba(102, 126, 234, 0.2);
            z-index: 9999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `

    // 悬停效果
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-3px) scale(1.02)"
      button.style.boxShadow =
        "0 12px 40px rgba(102, 126, 234, 0.4), 0 8px 24px rgba(102, 126, 234, 0.3)"
      button.style.background = "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)"
    })

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0) scale(1)"
      button.style.boxShadow =
        "0 8px 32px rgba(102, 126, 234, 0.3), 0 4px 16px rgba(102, 126, 234, 0.2)"
      button.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    })

    // 点击事件
    button.addEventListener("click", async () => {
      button.disabled = true
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px; animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="60" stroke-dashoffset="60">
            <animate attributeName="stroke-dashoffset" dur="1s" values="60;0" repeatCount="indefinite"/>
          </path>
        </svg>
        转换中...
      `
      button.style.opacity = "0.8"
      button.style.transform = "scale(0.98)"

      try {
        // 获取sessionToken
        const sessionToken = await getSessionToken()
        if (!sessionToken) {
          showToast("未找到WorkosCursorSessionToken，请确保已登录Cursor", "error")
          return
        }

        // 调用API获取长效token
        const tokenData = await getCursorToken(sessionToken)

        // 格式化token信息
        const tokenInfo = `Access Token: ${tokenData.accessToken}\nRefresh Token: ${tokenData.refreshToken}\n过期时间: ${tokenData.expireTime}\n剩余天数: ${tokenData.daysLeft}天\n用户ID: ${tokenData.userId}`

        // 复制到剪贴板
        const copySuccess = await copyToClipboard(tokenData.accessToken)

        if (copySuccess) {
          showToast(
            `转换成功！Access Token已复制到剪贴板\n剩余天数: ${tokenData.daysLeft}天`,
            "success"
          )
        } else {
          showToast("转换成功，但复制到剪贴板失败，请手动复制", "error")
        }
      } catch (error) {
        console.error("Token转换失败:", error)
        showToast(`转换失败: ${error.message}`, "error")
      } finally {
        // 恢复按钮状态
        button.disabled = false
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          转换为长效Token
        `
        button.style.opacity = "1"
        button.style.transform = "scale(1)"
      }
    })

    return button
  }

  // 添加CSS动画样式
  function addAnimationStyles() {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      #cursor-token-converter-btn {
        animation: none;
      }
      
      #cursor-token-converter-btn:hover {
        animation: none;
      }
    `
    document.head.appendChild(style)
  }

  // 主函数
  async function init() {
    try {
      await waitForPageLoad()

      // 检查是否在正确的页面
      if (
        !window.location.href.includes("cursor.com") ||
        !window.location.href.includes("dashboard")
      ) {
        return
      }

      // 添加动画样式
      addAnimationStyles()

      // 创建并添加按钮
      const button = createFloatingButton()
      document.body.appendChild(button)

      console.log("Cursor长效Token转换器已加载")
    } catch (error) {
      console.error("初始化失败:", error)
    }
  }

  // 启动脚本
  init()
})()

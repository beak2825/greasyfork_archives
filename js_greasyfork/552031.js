// ==UserScript==
// @name         淘宝网络请求拦截器
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  拦截并修改 queryBillHomeAgg 接口响应数据
// @author       You
// @match        https://tgc.tmall.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552031/%E6%B7%98%E5%AE%9D%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552031/%E6%B7%98%E5%AE%9D%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  // ==================== 配置区域 ====================
  // 在这里配置需要拦截的 URL 和修改规则
  const interceptRules = [
    {
      // 匹配的 URL（支持正则表达式）
      urlPattern: /fbi\/bill\/queryBillHomeAgg/,
      // 修改响应数据的函数
      modifyResponse: (originalData) => {
        if (originalData.data) {
          let incomeMultiplier = 1.9 // 收入倍数，根据实际需求修改
          let costAmountMultiplier = 0.3 // 成本倍数，根据实际需求修改
          let incomeAmount = originalData.data.incomeAmount || 0
          originalData.data.incomeAmount = Math.round(incomeAmount * incomeMultiplier * 100) / 100
          originalData.data.costAmount = Math.round(originalData.data.incomeAmount * costAmountMultiplier * 100) / 100
          originalData.data.settleAmount = originalData.data.incomeAmount - originalData.data.costAmount
          return originalData
        }
      },
    },
  ]
  // ==================== 配置区域结束 ====================

  const originalXHROpen = XMLHttpRequest.prototype.open
  const originalXHRSend = XMLHttpRequest.prototype.send
  const originalFetch = window.fetch

  // ==================== 拦截 fetch 请求 ====================
  window.fetch = async function (url, options = {}) {
    const urlStr = typeof url === "string" ? url : url.url || url.href

    // 检查是否需要拦截这个请求
    const matchedRule = interceptRules.find((rule) => {
      if (rule.urlPattern instanceof RegExp) {
        return rule.urlPattern.test(urlStr)
      }
      return urlStr.includes(rule.urlPattern)
    })

    if (matchedRule) {
      try {
        const response = await originalFetch.call(this, url, options)
        const clonedResponse = response.clone()
        const originalData = await clonedResponse.json()

        const modifiedData = matchedRule.modifyResponse(originalData)

        // 返回修改后的响应
        return new Response(JSON.stringify(modifiedData), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        })
      } catch (error) {
        return originalFetch.call(this, url, options)
      }
    }

    return originalFetch.call(this, url, options)
  }

  // ==================== 拦截 XMLHttpRequest 请求 ====================
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url
    this._method = method
    return originalXHROpen.apply(this, [method, url, ...rest])
  }

  XMLHttpRequest.prototype.send = function (...args) {
    // 检查是否需要拦截这个请求
    const matchedRule = interceptRules.find((rule) => {
      if (rule.urlPattern instanceof RegExp) {
        return rule.urlPattern.test(this._url)
      }
      return this._url.includes(rule.urlPattern)
    })

    if (matchedRule) {
      // 保存原始的 onreadystatechange 和 onload
      const originalOnReadyStateChange = this.onreadystatechange
      const originalOnLoad = this.onload

      // 重写 onreadystatechange
      this.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          try {
            // 获取原始响应
            const originalResponse = this.responseText
            let originalData = JSON.parse(originalResponse)

            // 应用修改规则
            const modifiedData = matchedRule.modifyResponse(originalData)

            // 重写响应属性
            Object.defineProperty(this, "responseText", {
              writable: true,
              value: JSON.stringify(modifiedData),
            })
            Object.defineProperty(this, "response", {
              writable: true,
              value: JSON.stringify(modifiedData),
            })
          } catch (error) {
            console.error("[XHR 拦截] 处理响应时出错:", error)
          }
        }

        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments)
        }
      }

      // 重写 onload
      this.onload = function () {
        if (this.status === 200) {
          try {
            const originalResponse = this.responseText
            let originalData = JSON.parse(originalResponse)

            const modifiedData = matchedRule.modifyResponse(originalData)

            Object.defineProperty(this, "responseText", {
              writable: true,
              value: JSON.stringify(modifiedData),
            })
            Object.defineProperty(this, "response", {
              writable: true,
              value: JSON.stringify(modifiedData),
            })
          } catch (error) {
            console.error("[XHR 拦截 onload] 处理响应时出错:", error)
          }
        }

        if (originalOnLoad) {
          originalOnLoad.apply(this, arguments)
        }
      }
    }

    return originalXHRSend.apply(this, args)
  }

  // ==================== 尝试拦截 axios ====================
  setTimeout(() => {
    if (window.axios && window.axios.interceptors) {
      window.axios.interceptors.response.use(
        (response) => {
          const url = response.config.url

          const matchedRule = interceptRules.find((rule) => {
            if (rule.urlPattern instanceof RegExp) {
              return rule.urlPattern.test(url)
            }
            return url.includes(rule.urlPattern)
          })

          if (matchedRule && response.data) {
            response.data = matchedRule.modifyResponse(response.data)
          }

          return response
        },
        (error) => Promise.reject(error),
      )
    } else {
    }
  }, 100)
  console.log(1111)
  interceptRules.forEach((rule, index) => {
    console.log(`  ${index + 1}. ${rule.urlPattern}`)
  })

  // ==================== 修改页面文案 ====================
  function modifyTextContent() {
    const elements = document.querySelectorAll(".bill-agg-bar-item-title")
    elements.forEach((element) => {
      if (element.textContent.trim() === "支出金额 (元)") {
        element.textContent = "退款金额 (元)"
        console.log('[文案修改] 已将"支出金额"修改为"退款金额"')
      }
    })
  }

  // 监听 DOM 变化
  const observer = new MutationObserver((mutations) => {
    modifyTextContent()
  })

  // 在 DOM 加载完成后开始监听
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      modifyTextContent()
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    })
  } else {
    modifyTextContent()
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
})()

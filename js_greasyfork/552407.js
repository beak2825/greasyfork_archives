// ==UserScript==
// @name         Direct Proxy Helper - 直接代理助手
// @namespace    https://greasyfork.org/zh-CN/scripts/552407
// @version      1.0.3
// @description  直接使用 GM_xmlhttpRequest 实现代理请求，无需外部服务器，绕过 CORS 限制
// @author       qa
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @license      MIT
// @homepageURL     https://greasyfork.org/zh-CN/scripts/552407
// @supportURL      https://greasyfork.org/zh-CN/scripts/552407/feedback
// @downloadURL https://update.greasyfork.org/scripts/552407/Direct%20Proxy%20Helper%20-%20%E7%9B%B4%E6%8E%A5%E4%BB%A3%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552407/Direct%20Proxy%20Helper%20-%20%E7%9B%B4%E6%8E%A5%E4%BB%A3%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // ========== 配置区域 ==========
  const CONFIG = {
    // 调试输出现在通过 localStorage.imagedrive_debug 控制 (值为 'true')
    // 默认超时时间(毫秒)
    defaultTimeout: 30000
  }

  // 调试日志函数（仅当 localStorage.imagedrive_debug === 'true' 时输出）
  function log(...args) {
    try {
      const enabled = typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('imagedrive_debug') === 'true'

      if (enabled) {
        console.log('[Direct Proxy]', ...args)
      }
    } catch (e) {
      // 如果访问 localStorage 出错，则静默失败，不影响正常逻辑
    }
  }

  /**
   * 直接代理请求函数 - 使用 GM_xmlhttpRequest 直接发送请求
   * @param {Object} options - 请求配置
   * @param {string} options.url - 目标 URL
   * @param {string} [options.method='GET'] - 请求方法
   * @param {Object} [options.headers={}] - 自定义请求头
   * @param {string|FormData|Object} [options.data] - 请求体数据
   * @param {string} [options.responseType='text'] - 响应类型: 'text', 'json', 'blob', 'arraybuffer', 'document'
   * @param {Function} [options.onSuccess] - 成功回调
   * @param {Function} [options.onError] - 失败回调
   * @param {Function} [options.onProgress] - 进度回调
   * @param {number} [options.timeout] - 超时时间(毫秒)
   * @param {boolean} [options.anonymous=false] - 是否匿名请求(不发送 cookies)
   * @returns {Promise} - 返回 Promise 对象
   */
  function directProxy(options) {
    return new Promise((resolve, reject) => {
      const {
        url,
        method = 'GET',
        headers = {},
        data = null,
        responseType = 'text',
        onSuccess,
        onError,
        onProgress,
        timeout = CONFIG.defaultTimeout,
        anonymous = false
      } = options

      if (!url) {
        const error = new Error('URL is required')
        reject(error)
        if (onError) onError(error)
        return
      }

      log('发起直接代理请求:', { url, method, headers })

      // GM_xmlhttpRequest 配置
      const gmOptions = {
        method: method.toUpperCase(),
        url: url,
        headers: { ...headers },
        timeout: timeout,
        anonymous: anonymous,

        onload: function (response) {
          log('请求成功:', response.status, response.statusText)
          log('原始响应头:', response.responseHeaders)

          let result
          try {
            // 根据 responseType 处理响应
            if (responseType === 'json') {
              result = JSON.parse(response.responseText)
            } else if (responseType === 'text') {
              result = response.responseText
            } else if (responseType === 'blob' || responseType === 'arraybuffer') {
              result = response.response
            } else if (responseType === 'document') {
              // 解析为 DOM 文档
              const parser = new DOMParser()
              result = parser.parseFromString(response.responseText, 'text/html')
            } else {
              result = response.responseText
            }

            const parsedHeaders = parseResponseHeaders(response.responseHeaders)
            // 强制添加/覆盖跨域允许头，便于在页面端判断并兼容缺失或错误的服务器头
            try {
              parsedHeaders['access-control-allow-origin'] = '*'
            } catch (e) {
              // ignore
            }

            log('解析后的响应头:', parsedHeaders)

            const finalResponse = {
              data: result,
              status: response.status,
              statusText: response.statusText,
              headers: parsedHeaders,
              finalUrl: response.finalUrl,
              raw: response
            }

            resolve(finalResponse)
            if (onSuccess) onSuccess(finalResponse)
          } catch (e) {
            log('解析响应失败:', e)
            const error = new Error('Failed to parse response: ' + e.message)
            error.response = response
            reject(error)
            if (onError) onError(error)
          }
        },

        onerror: function (response) {
          log('请求失败:', response)
          const error = new Error(`Request failed: ${response.statusText || 'Network error'}`)
          error.response = response
          reject(error)
          if (onError) onError(error)
        },

        ontimeout: function () {
          log('请求超时')
          const error = new Error('Request timeout')
          reject(error)
          if (onError) onError(error)
        },

        onprogress: function (progress) {
          if (onProgress) {
            onProgress({
              loaded: progress.loaded,
              total: progress.total,
              percentage: progress.total > 0 ? (progress.loaded / progress.total) * 100 : 0
            })
          }
        }
      }

      // 如果未显式指定 Origin，则默认覆盖为目标 URL 的域（protocol + // + host）
      try {
        const headerKeys = Object.keys(gmOptions.headers || {})
        const hasOrigin = headerKeys.some(k => k && k.toLowerCase() === 'origin')
        if (!hasOrigin) {
          try {
            const u = new URL(url)
            gmOptions.headers['Origin'] = `${u.protocol}//${u.host}`
            log('自动设置 Origin 头为目标域:', gmOptions.headers['Origin'])
          } catch (e) {
            // 无法解析 URL，则不设置 Origin
            log('无法解析 URL 来设置默认 Origin:', e)
          }
        }
      } catch (e) {
        // 安全容错，不影响请求
      }

      // 处理请求体
      if (data && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') {
        if (typeof data === 'string') {
          gmOptions.data = data
        } else if (data instanceof FormData) {
          gmOptions.data = data
        } else if (data instanceof Blob) {
          // Blob 对象直接传递给 GM_xmlhttpRequest
          gmOptions.data = data
          log('使用 Blob 数据, 大小:', data.size, 'bytes')
        } else if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
          // 二进制数据直接传递
          gmOptions.data = data
          log('使用二进制数据, 大小:', data.byteLength || data.length, 'bytes')
        } else if (typeof data === 'object') {
          gmOptions.data = JSON.stringify(data)
          // 自动添加 Content-Type (如果没有指定)
          if (!gmOptions.headers['Content-Type'] && !gmOptions.headers['content-type']) {
            gmOptions.headers['Content-Type'] = 'application/json'
          }
        }
      }

      // 设置响应类型
      if (responseType === 'blob' || responseType === 'arraybuffer') {
        gmOptions.responseType = responseType
      }

      // 发起请求
      GM_xmlhttpRequest(gmOptions)
    })
  }

  /**
   * 解析响应头字符串
   */
  function parseResponseHeaders(headersString) {
    const headers = {}
    if (!headersString) {
      log('警告: 响应头字符串为空')
      return headers
    }

    // 更宽松且稳健的解析: 按第一个 ':' 分割，去除首尾空白，并将 header 名小写化
    headersString
      .trim()
      .split(/\r?\n/)
      .forEach(line => {
        if (!line || !line.trim()) return
        const idx = line.indexOf(':')
        if (idx === -1) return
        const name = line.substring(0, idx).trim().toLowerCase()
        const value = line.substring(idx + 1).trim()
        if (name) {
          // 如果存在重复的 header，保留第一个并忽略空值
          if (!Object.prototype.hasOwnProperty.call(headers, name) || headers[name] === '') {
            headers[name] = value
          }
        }
      })

    return headers
  }

  /**
   * 便捷的 GET 请求
   */
  function proxyGet(url, options = {}) {
    return directProxy({
      ...options,
      url,
      method: 'GET'
    })
  }

  /**
   * 便捷的 POST 请求
   */
  function proxyPost(url, data, options = {}) {
    return directProxy({
      ...options,
      url,
      method: 'POST',
      data
    })
  }

  /**
   * 便捷的 PUT 请求
   */
  function proxyPut(url, data, options = {}) {
    return directProxy({
      ...options,
      url,
      method: 'PUT',
      data
    })
  }

  /**
   * 便捷的 PATCH 请求
   */
  function proxyPatch(url, data, options = {}) {
    return directProxy({
      ...options,
      url,
      method: 'PATCH',
      data
    })
  }

  /**
   * 便捷的 DELETE 请求
   */
  function proxyDelete(url, options = {}) {
    return directProxy({
      ...options,
      url,
      method: 'DELETE'
    })
  }

  /**
   * Fetch API 兼容的代理函数
   */
  function proxyFetch(url, options = {}) {
    const { method = 'GET', headers = {}, body = null, ...rest } = options

    // 自动检测响应类型：如果没有明确指定，默认使用 arraybuffer 以支持二进制数据
    // 这样可以正确处理图片、文件等二进制内容
    const responseType = rest.responseType || 'arraybuffer'

    return directProxy({
      url,
      method,
      headers,
      data: body,
      responseType: responseType,
      ...rest
    }).then(response => {
      // 返回类似 fetch Response 的对象
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.statusText,
        url: response.finalUrl || url,
        headers: {
          get: name => response.headers[name.toLowerCase()],
          has: name => name.toLowerCase() in response.headers,
          entries: () => Object.entries(response.headers),
          keys: () => Object.keys(response.headers),
          values: () => Object.values(response.headers),
          forEach: callback => {
            Object.entries(response.headers).forEach(([k, v]) => callback(v, k))
          }
        },
        text: () => {
          if (typeof response.data === 'string') {
            return Promise.resolve(response.data)
          } else if (response.data instanceof ArrayBuffer) {
            const decoder = new TextDecoder()
            return Promise.resolve(decoder.decode(response.data))
          } else {
            return Promise.resolve(String(response.data))
          }
        },
        json: () => {
          try {
            let jsonText
            if (typeof response.data === 'string') {
              jsonText = response.data
            } else if (response.data instanceof ArrayBuffer) {
              const decoder = new TextDecoder()
              jsonText = decoder.decode(response.data)
            } else {
              jsonText = String(response.data)
            }
            return Promise.resolve(JSON.parse(jsonText))
          } catch (e) {
            return Promise.reject(e)
          }
        },
        blob: () => {
          if (response.data instanceof Blob) {
            return Promise.resolve(response.data)
          }
          return Promise.resolve(new Blob([response.data]))
        },
        arrayBuffer: () => {
          if (response.data instanceof ArrayBuffer) {
            return Promise.resolve(response.data)
          }
          // 尝试将其他类型转换为 ArrayBuffer
          try {
            let buffer
            if (typeof response.data === 'string') {
              // 字符串转 ArrayBuffer
              const encoder = new TextEncoder()
              buffer = encoder.encode(response.data).buffer
            } else if (response.data instanceof Blob) {
              // Blob 转 ArrayBuffer
              return response.data.arrayBuffer()
            } else if (response.data instanceof Uint8Array || response.data instanceof Int8Array) {
              buffer = response.data.buffer
            } else {
              // 其他类型尝试转为字符串再转 ArrayBuffer
              const encoder = new TextEncoder()
              buffer = encoder.encode(String(response.data)).buffer
            }
            return Promise.resolve(buffer)
          } catch (e) {
            return Promise.reject(new Error('Failed to convert response to ArrayBuffer: ' + e.message))
          }
        },
        clone: function () {
          return this
        },
        _original: response
      }
    })
  }

  /**
   * JSONP 请求辅助函数
   */
  function proxyJsonp(url, options = {}) {
    const {
      callbackParam = 'callback',
      callbackName = 'jsonpCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2),
      timeout = CONFIG.defaultTimeout
    } = options

    return new Promise((resolve, reject) => {
      const separator = url.includes('?') ? '&' : '?'
      const jsonpUrl = `${url}${separator}${callbackParam}=${callbackName}`

      // 创建全局回调函数
      unsafeWindow[callbackName] = function (data) {
        delete unsafeWindow[callbackName]
        resolve({
          data: data,
          status: 200,
          statusText: 'OK'
        })
      }

      // 使用 GM_xmlhttpRequest 发起 JSONP 请求
      directProxy({
        url: jsonpUrl,
        method: 'GET',
        timeout: timeout,
        responseType: 'text'
      })
        .then(response => {
          // 执行响应文本（包含 JSONP 回调）
          try {
            eval(response.data)
          } catch (e) {
            delete unsafeWindow[callbackName]
            reject(new Error('JSONP parse error: ' + e.message))
          }
        })
        .catch(error => {
          delete unsafeWindow[callbackName]
          reject(error)
        })

      // 超时处理
      setTimeout(() => {
        if (unsafeWindow[callbackName]) {
          delete unsafeWindow[callbackName]
          reject(new Error('JSONP request timeout'))
        }
      }, timeout)
    })
  }

  // ========== 注入到页面 ==========

  // 将代理函数注入到 unsafeWindow (页面的 window 对象)
  unsafeWindow.ProxyHelper = {
    // 配置
    config: CONFIG,

    // 核心请求函数
    request: directProxy,

    // 便捷方法
    get: proxyGet,
    post: proxyPost,
    put: proxyPut,
    patch: proxyPatch,
    delete: proxyDelete,

    // Fetch 兼容
    fetch: proxyFetch,

    // JSONP 支持
    jsonp: proxyJsonp,

    // 工具方法
    setDebug: enabled => {
      try {
        if (enabled) {
          localStorage.setItem('imagedrive_debug', 'true')
        } else {
          localStorage.removeItem('imagedrive_debug')
        }
      } catch (e) {
        // 在受限环境(localStorage 不可用)静默忽略
      }
    },
    setTimeout: ms => {
      CONFIG.defaultTimeout = ms
    }
  }

  // 同时注入到油猴脚本的 window 对象
  window.ProxyHelper = unsafeWindow.ProxyHelper

  log('直接代理助手已注入到页面，可通过 ProxyHelper 访问')
  log('此代理直接使用 GM_xmlhttpRequest，无需外部服务器')
  log('使用示例:')
  log('  ProxyHelper.get("https://api.example.com/data")')
  log('  ProxyHelper.post("https://api.example.com/data", { key: "value" })')
  log('  ProxyHelper.fetch("https://api.example.com/data").then(r => r.json())')
})()

/*
========== 使用说明 ==========

这是一个完全独立的代理脚本，直接使用 GM_xmlhttpRequest 实现，无需任何外部服务器。

主要特性：
✅ 完全绕过 CORS 限制
✅ 可修改任意请求头
✅ 支持所有 HTTP 方法 (GET, POST, PUT, PATCH, DELETE)
✅ 支持多种响应类型 (text, json, blob, arraybuffer, document)
✅ Promise 和回调两种方式
✅ Fetch API 兼容接口
✅ 进度监控和超时控制
✅ 支持 JSONP 请求
✅ 支持匿名请求（不发送 cookies）

========== 使用示例 ==========

1. 基本 GET 请求：
   ProxyHelper.get('https://api.example.com/users')
       .then(response => {
           console.log('数据:', response.data);
           console.log('状态:', response.status);
           console.log('响应头:', response.headers);
       })
       .catch(error => console.error('错误:', error));

2. POST 请求（自定义请求头）：
   ProxyHelper.post('https://api.example.com/users', 
       { name: 'John', email: 'john@example.com' },
       {
           headers: {
               'Authorization': 'Bearer your-token-here',
               'X-Custom-Header': 'custom-value',
               'Content-Type': 'application/json'
           }
       }
   ).then(res => console.log(res.data));

3. 使用 Fetch 风格：
   ProxyHelper.fetch('https://api.example.com/data', {
       method: 'POST',
       headers: {
           'Authorization': 'Bearer token',
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({ key: 'value' })
   })
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(error => console.error(error));

4. 完整配置的请求：
   ProxyHelper.request({
       url: 'https://api.example.com/data',
       method: 'GET',
       headers: {
           'User-Agent': 'CustomAgent/1.0',
           'Referer': 'https://example.com',
           'Authorization': 'Bearer token'
       },
       responseType: 'json',
       timeout: 10000,
       anonymous: false,  // 是否匿名（不发送 cookies）
       onSuccess: (response) => {
           console.log('成功:', response.data);
       },
       onError: (error) => {
           console.error('失败:', error);
       },
       onProgress: (progress) => {
           console.log('进度:', progress.percentage.toFixed(2) + '%');
       }
   });

5. 下载文件（Blob）：
   ProxyHelper.request({
       url: 'https://example.com/file.pdf',
       method: 'GET',
       responseType: 'blob'
   }).then(response => {
       const blob = response.data;
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = 'file.pdf';
       a.click();
       URL.revokeObjectURL(url);
   });

6. JSONP 请求：
   ProxyHelper.jsonp('https://api.example.com/data', {
       callbackParam: 'callback',  // 回调参数名
       timeout: 5000
   }).then(response => {
       console.log('JSONP 数据:', response.data);
   });

7. 修改 Referer 和 Origin（绕过防盗链）：
   ProxyHelper.get('https://protected-api.example.com/image.jpg', {
       headers: {
           'Referer': 'https://allowed-domain.com/',
           'Origin': 'https://allowed-domain.com'
       },
       responseType: 'blob'
   }).then(response => {
       const imgUrl = URL.createObjectURL(response.data);
       document.querySelector('img').src = imgUrl;
   });

8. 跨域 API 调用：
   ProxyHelper.fetch('https://cors-blocked-api.com/endpoint', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
           'X-API-Key': 'your-api-key'
       },
       body: JSON.stringify({ query: 'data' })
   })
   .then(res => res.json())
   .then(data => console.log(data));

========== 配置方法 ==========

// 启用/禁用调试日志
ProxyHelper.setDebug(false);

// 设置默认超时时间（毫秒）
ProxyHelper.setTimeout(60000);

========== 优势 ==========

相比普通的 fetch 或 XMLHttpRequest：
1. 完全绕过 CORS 限制
2. 可以修改任意请求头（包括 Referer、Origin、User-Agent 等）
3. 支持跨域访问任何网站
4. 不受同源策略限制

相比使用 Cloudflare Worker：
1. 无需部署外部服务器
2. 延迟更低（直接访问目标）
3. 无需维护成本
4. 完全免费

*/

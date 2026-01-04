// ==UserScript==
// @name         oppo云自动登录
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  实现oppo云自动登录
// @author       bbbyqq
// @license      MIT
// @match        *://cloud.oppo.com/*
// @match        *://id.oppo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/556734/oppo%E4%BA%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/556734/oppo%E4%BA%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  'use strict'

  /**
   * 自定义消息弹窗
   *
   * @author: bbbyqq
   * @date: 2025-11-21
   * @description: 封装自定义消息弹窗
   */

  let showAlert = {
    success: function (message, duration = 2000) {
      this._show('success', message, duration)
    },
    warn: function (message, duration = 2000) {
      this._show('warn', message, duration)
    },
    error: function (message, duration = 2000) {
      this._show('error', message, duration)
    },
    _show: function (type, message, duration) {
      // 样式配置
      const styleConfig = {
        success: {
          bgColor: '#f0f9eb',
          textColor: '#67c23a',
          icon: `<svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512S0 794.784 0 512 229.216 0 512 0z m236.32 294.144L408.896 633.536 259.84 484.544 192 552.416l216.896 216.928 407.296-407.296-67.872-67.904z" fill="#67c23a"/></svg>`
        },
        warn: {
          bgColor: '#fdf6ec',
          textColor: '#e6a23c',
          icon: `<svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296z m32 440c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z" p-id="1605" fill="#e6a23c"></path></svg>`
        },
        error: {
          bgColor: '#fef0f0',
          textColor: '#f56d6d',
          icon: `<svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M509.262713 5.474574c281.272162 0 509.262713 228.02238 509.262713 509.262713 0 281.272162-227.990551 509.262713-509.262713 509.262713s-509.262713-227.990551-509.262713-509.262713c0-281.240333 227.990551-509.262713 509.262713-509.262713z m135.050106 278.725849L509.262713 419.250528l-135.050106-135.050105-90.012184 90.012184L419.186871 509.262713l-135.018277 135.081935 90.012184 90.012184L509.262713 599.274897l135.050106 135.050106 90.012184-90.012184L599.274897 509.262713l135.050106-135.050106-90.012184-90.012184z" fill="#f56d6d"/></path></svg>`
        }
      }

      // 获取或创建弹窗元素
      let alertEl = document.getElementById('customAlert')
      if (!alertEl) {
        alertEl = document.createElement('div')
        alertEl.id = 'customAlert'
        document.body.appendChild(alertEl)

        // 添加全局样式
        const style = document.createElement('style')
        style.textContent = `
                #customAlert {
                    position: fixed;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                    max-width: 90%;
                    min-width: fit-content;
                    padding: 10px 20px;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                    opacity: 0;
                    visibility: hidden;
                }
                #customAlert.show {
                    opacity: 1;
                    visibility: visible;
                }
                #customAlert .alert-content {
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                #customAlert .alert-icon {
                    margin-right: 10px;
                    flex-shrink: 0;
                    line-height: 0;
                }
                #customAlert .alert-message {
                    flex: 1;
                    line-height: 1.5;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    text-align: justify;
                }
            `
        document.head.appendChild(style)
      }

      // 设置弹窗内容和样式
      const config = styleConfig[type]
      alertEl.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">${config.icon}</div>
                <div class="alert-message">${message}</div>
            </div>
        `
      alertEl.style.backgroundColor = config.bgColor
      alertEl.style.color = config.textColor

      // 显示弹窗
      alertEl.classList.add('show')

      // 自动隐藏
      clearTimeout(alertEl.timeout)
      alertEl.timeout = setTimeout(() => {
        alertEl.classList.remove('show')
      }, duration)
    }
  }

  /**
   * 注册油猴菜单 —— 自动登录设置
   *
   * @author: bbbyqq
   * @date: 2025-11-21
   * @description: 点击后弹出设置对话框
   */

  const applicationList = [
    '跨端文件',
    '录音',
    '便签',
    '云盘',
    '中转站相册短信',
    '浏览器',
    '私密保险箱',
    '查找',
    '联系人'
  ]

  // 避免 iframe 与重复注册
  // if (window.top !== window.self) return

  GM_registerMenuCommand("自动登录设置", () => {

    let config = {
      phone: GM_getValue('phone', ''),
      password: GM_getValue('password', ''),
      application: GM_getValue('application', ''),
      autoLogin: GM_getValue('autoLogin', false)
    }

    // 配置手机号
    const newPhone = prompt('请输入手机号:', config.phone)
    if (newPhone === null) return // 用户取消 => 停止执行
    config.phone = newPhone
    GM_setValue('phone', newPhone)

    // 配置密码
    const newPassword = prompt('请输入密码:', config.password)
    if (newPassword === null) return // 用户取消 => 停止执行
    config.password = newPassword
    GM_setValue('password', newPassword)

    // 是否开启自动登录
    const autoLoginConfirm = confirm('是否启用自动登录功能？\n\n当前状态: ' + (config.autoLogin ? '已启用' : '已禁用') + '\n\n点击"确定"启用，点击"取消"禁用')
    config.autoLogin = autoLoginConfirm
    GM_setValue('autoLogin', autoLoginConfirm)

    // 配置我的应用点击
    const applicationText = applicationList.map((q, i) => `${i}：${q}`).join('\n')
    const newApplication = prompt(`请输入需要进入的应用(输入数字):\n${applicationText}`, config.application)
    config.application = newApplication
    GM_setValue('application', config.application)
    showAlert.success('自动登录配置已保存', 2000)
  })

  /**
   * oppo云 - 配置自动登录
   *
   * @author: bbbyqq
   * @date: 2025-11-21
   * @description: 配置自动登录，可保存手机号码、密码
   */

  // 等待节点函数
  function waitForSelectorAllFrames(selector, callback, timeout = 5000) {
    const start = Date.now()

    const check = () => {
      let found = findElementInAllFrames(window, selector)
      if (found) {
        callback(found)
        return true
      }
      if (Date.now() - start > timeout) {
        console.warn("waitForSelectorAllFrames 超时:", selector)
        return true
      }
      return false
    }

    let timer = setInterval(() => {
      if (check()) clearInterval(timer)
    }, 150)
  }

  function findElementInAllFrames(win, selector) {
    try {
      if (typeof selector === 'function') {
        return selector()
      }

      const el = win.document.querySelector(selector)
      if (el) return el
    } catch (e) {}

    for (let i = 0; i < win.frames.length; i++) {
      let child = findElementInAllFrames(win.frames[i], selector)
      if (child) return child
    }
    return null
  }

  function setNativeValue(el, value) {
    const lastValue = el.value
    el.value = value
    const event = new Event('input', {bubbles: true})
    const tracker = el._valueTracker
    if (tracker) tracker.setValue(lastValue)
    el.dispatchEvent(event)
  }

  // 默认配置
  const defaultConfig = {
    phone: '',
    password: '',
    application: '',
    autoLogin: false
  }

  // 加载保存的配置
  let config = {
    phone: GM_getValue('phone', defaultConfig.phone),
    password: GM_getValue('password', defaultConfig.password),
    application: GM_getValue('application', defaultConfig.application),
    autoLogin: GM_getValue('autoLogin', defaultConfig.autoLogin)
  }

  // 只在login和index页面生效
  if (location.href.includes('login.html') || location.href.includes('index.html')) {
    // 自动点击登录账号（如果启用）
    if (config.autoLogin) {
      waitForSelectorAllFrames('.header_loginBtn', el => {
        el.click()
      })
    }

    // 自动填写手机号码
    waitForSelectorAllFrames('input[placeholder="请输入手机号码"]', input => {
      setNativeValue(input, config.phone)
    })

    // 自动填写密码
    waitForSelectorAllFrames('input[placeholder="请输入密码"]', input => {
      setNativeValue(input, config.password)
    })

    // 自动点击密码登录
    if (config.autoLogin) {
      waitForSelectorAllFrames(() => {
        const btn = [...document.querySelectorAll('button')].find(el => el.textContent.includes('密码登录'))

        if (!btn) return null
        if ([...btn.classList].some(c => c.startsWith('button_disabled__'))) return null

        return btn
      }, (btn) => {
        btn.click()
      })
    }

    // 自动点击我的应用
    if (applicationList[config.application]) {
      waitForSelectorAllFrames(() => {
        return [...document.querySelectorAll('#indexList li a')]
          .find(el => el.textContent.includes(applicationList[config.application]))
      }, (button) => {
        button.click()
      })
    }
  }

})()

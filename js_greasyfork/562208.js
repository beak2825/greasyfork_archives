// ==UserScript==
// @name         [BIT AutoLogin] 一键登录北理工统一身份认证
// @namespace    https://bit.edu.cn/
// @version      1.1.0
// @description  通过 CAS REST API 自动登录所有需要北理工统一身份认证的网站！
// @author       windlandneko
// @match        http://*.bit.edu.cn/*
// @match        https://*.bit.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @connect      sso.bit.edu.cn
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562208/%5BBIT%20AutoLogin%5D%20%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95%E5%8C%97%E7%90%86%E5%B7%A5%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/562208/%5BBIT%20AutoLogin%5D%20%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95%E5%8C%97%E7%90%86%E5%B7%A5%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81.meta.js
// ==/UserScript==

;(async () => {
  'use strict'

  // ==================== 常量与配置 ====================
  const service = new URLSearchParams(location.search).get('service')
  const CAS_RESTAPI = 'https://sso.bit.edu.cn/cas/v1/tickets'
  const STORAGE_KEY = 'bit-sso-config'
  const DEFAULT_CONFIG = { username: '', password: '', auto: false }

  const XOR_KEY = 'bit-sso-AutoLogin-key'

  const encryptPassword = pwd => {
    if (!pwd) return ''
    try {
      const enc = new TextEncoder()
      const keyBytes = enc.encode(XOR_KEY)
      const inBytes = enc.encode(pwd)
      const out = new Uint8Array(inBytes.length)
      for (let i = 0; i < inBytes.length; i++)
        out[i] = inBytes[i] ^ keyBytes[i % keyBytes.length]

      let binary = ''
      for (let i = 0; i < out.length; i++) binary += String.fromCharCode(out[i])

      return 'xor:' + btoa(binary)
    } catch {
      return pwd
    }
  }

  const decryptPassword = s => {
    if (!s) return ''
    if (!s.startsWith('xor:')) return s
    try {
      const b = atob(s.slice(4))
      const bytes = new Uint8Array([...b].map(c => c.charCodeAt(0)))
      const keyBytes = new TextEncoder().encode(XOR_KEY)
      const out = new Uint8Array(bytes.length)
      for (let i = 0; i < bytes.length; i++)
        out[i] = bytes[i] ^ keyBytes[i % keyBytes.length]
      return new TextDecoder().decode(out)
    } catch {
      return s
    }
  }

  // =================== WebVPN 加密函数 ====================
  const encodeVpnHost = async host => {
    const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window
    const VPN_KEY = w.__vpn_host_crypt_key || 'wrdvpnisthebest!'
    const VPN_IV = w.__vpn_host_crypt_iv || 'wrdvpnisthebest!'

    const enc = new TextEncoder()
    const keyBytes = enc.encode(VPN_KEY)
    const ivBytes = enc.encode(VPN_IV)

    // 补齐到 16 字节倍数
    const textLen = host.length
    const padLen = (16 - (textLen % 16)) % 16
    const plaintext = enc.encode(host + '0'.repeat(padLen))

    // 导入 AES 密钥 (使用 AES-CBC 模拟单块加密)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    )

    // AES-CFB 加密：逐块处理
    const ciphertext = new Uint8Array(plaintext.length)
    let feedback = ivBytes

    for (let i = 0; i < plaintext.length; i += 16) {
      // 用 AES-CBC 加密 feedback 块 (IV=0 时等效于 AES-ECB 单块加密)
      const zeroIv = new Uint8Array(16)
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: zeroIv },
        cryptoKey,
        feedback
      )
      const keystream = new Uint8Array(encrypted).slice(0, 16)

      // XOR 得到密文
      const block = new Uint8Array(16)
      for (let j = 0; j < 16; j++) {
        block[j] = plaintext[i + j] ^ keystream[j]
        ciphertext[i + j] = block[j]
      }
      feedback = block
    }

    // 返回 IV hex + 密文 hex (截取原始长度)
    const toHex = bytes =>
      [...bytes].map(b => b.toString(16).padStart(2, '0')).join('')
    return toHex(ivBytes) + toHex(ciphertext).slice(0, textLen * 2)
  }

  const TIP_STATE = Object.freeze({
    LOADING: 'loading',
    ERROR: 'error',
    SUCCESS: 'success',
    DISABLED: 'disabled',
  })

  const SPINNER_SVG = `<svg class="sso-spinner" viewBox="0 0 1024 1024" fill="currentColor">
    <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"/>
  </svg>`

  const STYLES = `
    /* 动画 */
    @keyframes sso-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes sso-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes sso-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes sso-scale-in {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes sso-scale-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.9); }
    }

    /* 提示栏 */
    #sso-tip {
      display: flex;
      width: 100%;
      gap: 10px;
      margin-bottom: 32px;
      font: 14px sans-serif;
      user-select: none;
    }
    #sso-tip .sso-info,
    #sso-tip .sso-settings {
      height: 36px;
      padding: 0 15px;
      border-radius: 4px;
      background: #fff;
      border: 1px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      transition: background 0.2s ease;
    }
    #sso-tip .sso-info {
      flex: 1;
      gap: 8px;
    }
    #sso-tip .sso-info.clickable,
    #sso-tip .sso-settings {
      cursor: pointer;
    }
    #sso-tip .sso-info.clickable:hover,
    #sso-tip .sso-settings:hover {
      background: rgba(255,255,255,0.9);
    }
    #sso-tip .sso-info.success {
      background: rgba(76,175,80,0.9);
      border-color: rgba(76,175,80,0.9);
      color: #fff;
    }
    #sso-tip .sso-info.error {
      background: rgba(255,77,79,0.9);
      border-color: rgba(255,77,79,0.9);
      color: #fff;
    }
    #sso-tip .sso-info.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    #sso-tip .sso-spinner {
      width: 14px;
      height: 14px;
      animation: sso-spin 1s linear infinite;
    }

    /* 配置对话框 */
    #gm-sso-config .sso-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: sso-fade-in 0.2s ease;
    }
    #gm-sso-config .sso-overlay.closing {
      animation: sso-fade-out 0.15s ease forwards;
    }
    #gm-sso-config .sso-dialog {
      background: #fff;
      padding: 32px;
      padding-bottom: 18px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      width: 400px;
      max-width: 90vw;
      user-select: none;
      animation: sso-scale-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #gm-sso-config .sso-overlay.closing .sso-dialog {
      animation: sso-scale-out 0.15s ease forwards;
    }
    #gm-sso-config .sso-title {
      margin: 0 0 20px;
      color: #333;
      font-size: 20px;
    }
    #gm-sso-config .sso-field {
      margin-bottom: 15px;
    }
    #gm-sso-config .sso-label {
      display: block;
      margin-bottom: 5px;
      color: #666;
      font-size: 14px;
    }
    #gm-sso-config .sso-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 14px;
    }
    #gm-sso-config .sso-hint {
      color: #999;
      font-size: 12px;
    }
    #gm-sso-config .sso-checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-bottom: 20px;
    }
    #gm-sso-config .sso-checkbox {
      margin-right: 8px;
      width: 16px;
      height: 16px;
    }
    #gm-sso-config .sso-checkbox-text {
      color: #666;
      font-size: 14px;
    }
    #gm-sso-config .sso-actions {
      display: flex;
      gap: 10px;
      justify-content: space-between;
    }
    #gm-sso-config .sso-btn {
      padding: 6px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s ease;
    }
    #gm-sso-config .sso-btn-clear {
      border: 1px solid #ff000033;
      background: #fff;
      color: #ff0000;
    }
    #gm-sso-config .sso-btn-clear:hover {
      background: #ff00000a;
    }
    #gm-sso-config .sso-btn-clear:active {
      background: #ff000018;
    }
    #gm-sso-config .sso-btn-primary {
      border: none;
      background: #2196F3;
      color: #fff;
    }
    #gm-sso-config .sso-btn-primary:hover {
      background: #1976D2;
    }
    #gm-sso-config .sso-btn-primary:active {
      background: #1565C0;
    }
    #gm-sso-config .sso-footnote {
      margin-top: 16px;
      text-align: center;
      font-size: 12px;
      color: #999;
      line-height: 1.4;
    }
  `

  // ==================== 状态管理 ====================
  let loginController = null
  let tipTimer = null

  const getConfig = () => {
    try {
      const raw = JSON.parse(GM_getValue(STORAGE_KEY, '{}'))
      const cfg = { ...DEFAULT_CONFIG, ...raw }
      cfg.password = decryptPassword(cfg.password)
      return cfg
    } catch {
      return { ...DEFAULT_CONFIG }
    }
  }

  const setConfig = cfg => {
    const toStore = { ...cfg }
    toStore.password = toStore.password ? encryptPassword(toStore.password) : ''
    return GM_setValue(STORAGE_KEY, JSON.stringify(toStore))
  }

  // ==================== 工具函数 ====================
  const $ = selector => document.querySelector(selector)
  const $id = id => document.getElementById(id)

  const injectStyles = (() => {
    let injected = false
    return () => {
      if (injected) return
      injected = true
      const style = Object.assign(document.createElement('style'), {
        id: 'sso-styles',
        textContent: STYLES,
      })
      document.head.appendChild(style)
    }
  })()

  const waitForElement = selector =>
    new Promise(res => {
      const el = $(selector)
      if (el) return res(el)

      const observer = new MutationObserver(() => {
        const el = $(selector)
        if (el) {
          observer.disconnect()
          res(el)
        }
      })
      observer.observe(document.body, { childList: true, subtree: true })
    })

  const request = (method, url, data, signal) =>
    new Promise((res, rej) => {
      if (signal?.aborted) return rej(new DOMException('Aborted', 'AbortError'))

      const req = GM_xmlhttpRequest({
        method,
        url,
        data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        onload: res,
        onerror: rej,
        onabort: () => rej(new DOMException('Aborted', 'AbortError')),
      })

      signal?.addEventListener('abort', () => req.abort?.())
    })

  // ==================== UI 组件 ====================
  const container = Object.assign(document.createElement('div'), {
    id: 'sso-tip',
  })
  container.innerHTML = `<div class="sso-info"></div><div class="sso-settings">设置</div>`

  const showTip = async (state, msg, timeout) => {
    injectStyles()
    clearTimeout(tipTimer)

    try {
      const panel = await waitForElement('.moreloginbtnBox')
      if (!$id('sso-tip')) panel.prepend(container)
    } catch {
      return // 页面结构异常，放弃显示
    }

    const infoEl = container.querySelector('.sso-info')
    infoEl.onclick = null
    infoEl.innerHTML = ''

    switch (state) {
      case TIP_STATE.LOADING: {
        infoEl.className = 'sso-info clickable'
        infoEl.innerHTML = `${SPINNER_SVG}<span>${msg}</span><span style="margin-left:auto;opacity:0.7;font-size:12px;">点击取消</span>`
        infoEl.onclick = () => {
          loginController?.abort()
          setConfig({ ...getConfig(), auto: false })
          showTip(TIP_STATE.SUCCESS, '已取消一键登录', 1500)
        }
        break
      }

      case TIP_STATE.ERROR:
      case TIP_STATE.SUCCESS:
      case TIP_STATE.DISABLED: {
        infoEl.className = `sso-info ${state}`
        const span = document.createElement('span')
        span.textContent = msg
        infoEl.appendChild(span)
        break
      }

      default: {
        const cfg = getConfig()

        if (!service) {
          infoEl.className = 'sso-info disabled'
          infoEl.innerHTML = `<span>未识别到service参数</span>`
        } else if (!cfg.username || !cfg.password) {
          infoEl.className = 'sso-info disabled'
          infoEl.innerHTML = `<span>请先设置登录信息→</span>`
        } else {
          infoEl.className = 'sso-info clickable'
          infoEl.innerHTML = `<span>一键登录</span>`
          infoEl.onclick = login
        }
        break
      }
    }

    if (timeout) tipTimer = setTimeout(() => showTip(), timeout)
  }

  const closeDialog = dialog => {
    const overlay = dialog.querySelector('.sso-overlay')
    overlay.classList.add('closing')
    overlay.addEventListener('animationend', () => dialog.remove(), {
      once: true,
    })
  }

  const openSettings = () => {
    injectStyles()
    $id('gm-sso-config')?.remove()

    const { username, password, auto } = getConfig()

    const dialog = Object.assign(document.createElement('div'), {
      id: 'gm-sso-config',
      innerHTML: `
        <div class="sso-overlay">
          <div class="sso-dialog">
            <h2 class="sso-title">🔐 BIT Autologin 设置</h2>
            
            <div class="sso-field">
              <label class="sso-label">用户名 (学号)</label>
              <input type="text" id="gm-sso-username" class="sso-input" placeholder="请输入学号">
            </div>
            
            <div class="sso-field">
              <label class="sso-label">密码</label>
              <input type="password" id="gm-sso-password" class="sso-input" placeholder="请输入密码">
              <small class="sso-hint">密码存储在本地浏览器中</small>
            </div>
            
            <label class="sso-checkbox-label">
              <input type="checkbox" id="gm-sso-auto" class="sso-checkbox">
              <span class="sso-checkbox-text">以后都自动登录</span>
            </label>
            
            <div class="sso-actions">
              <button id="gm-sso-clear" class="sso-btn sso-btn-clear">清除</button>
              <button id="gm-sso-login-now" class="sso-btn sso-btn-primary">保存</button>
            </div>

            <div class="sso-footnote">
              点击油猴图标也可以打开本设置<br>
              由 <a href="https://github.com/windlandneko" target="_blank" rel="noopener noreferrer">windlandneko</a> 编写
            </div>
          </div>
        </div>
      `,
    })

    document.body.appendChild(dialog)

    $id('gm-sso-username').value = username
    $id('gm-sso-password').value = password
    $id('gm-sso-auto').checked = auto

    $id('gm-sso-clear').onclick = () => {
      setConfig(DEFAULT_CONFIG)
      showTip(TIP_STATE.ERROR, '登录信息已清除', 1000)
      closeDialog(dialog)
    }

    $id('gm-sso-login-now').onclick = () => {
      setConfig({
        username: $id('gm-sso-username').value.trim(),
        password: $id('gm-sso-password').value,
        auto: $id('gm-sso-auto').checked,
      })
      showTip(TIP_STATE.SUCCESS, '登录信息已保存', 1000)
      closeDialog(dialog)
    }

    // 点击遮罩关闭
    dialog.firstElementChild.onclick = e => {
      if (e.target === e.currentTarget) closeDialog(dialog)
    }
  }

  container.querySelector('.sso-settings').onclick = openSettings

  // ==================== 核心登录逻辑 ====================
  const login = async () => {
    const cfg = getConfig()

    // 取消之前的请求
    loginController?.abort()
    loginController = new AbortController()
    const { signal } = loginController

    try {
      await showTip(TIP_STATE.LOADING, cfg.auto ? '自动登录中...' : '登录中...')

      // 1. 获取 TGT
      const r1 = await request(
        'POST',
        CAS_RESTAPI,
        `username=${encodeURIComponent(
          cfg.username
        )}&password=${encodeURIComponent(cfg.password)}`,
        signal
      )

      if (r1.status !== 201) {
        throw new Error(
          r1.status === 401 ? '密码错误' : `获取TGT失败:${r1.status}`
        )
      }

      let tgt = r1.responseText.match(/action="([^"]+)"/)?.[1]

      // 备选：尝试从 Location 响应头解析
      if (!tgt) {
        const locationMatch = r1.responseHeaders.match(/Location:\s*(.*)/i)
        if (locationMatch) tgt = locationMatch[1].trim()
      }

      if (!tgt) throw new Error('无法解析TGT')

      // 2. 获取 ST
      const r2 = await request(
        'POST',
        tgt,
        `service=${encodeURIComponent(service)}`,
        signal
      )

      if (r2.status !== 200) {
        throw new Error(`获取ST失败:${r2.status}`)
      }

      // 3. 跳转
      await showTip(TIP_STATE.SUCCESS, '登录成功，正在跳转...')

      let jumpUrl = new URL(service)

      // WebVPN 适配：将目标 URL 转换为 WebVPN 格式
      if (location.hostname === 'webvpn.bit.edu.cn') {
        const targetProto = jumpUrl.protocol.replace(':', '') // http 或 https
        const targetHost = jumpUrl.hostname
        const encodedHost = await encodeVpnHost(targetHost)
        const newUrlStr = `https://webvpn.bit.edu.cn/${targetProto}/${encodedHost}${jumpUrl.pathname}${jumpUrl.search}`
        jumpUrl = new URL(newUrlStr)
      }

      jumpUrl.searchParams.set('ticket', r2.responseText.trim())
      location.href = jumpUrl.toString()
    } catch (err) {
      if (err.name === 'AbortError') return // 用户取消，静默处理

      console.error('[BIT AutoLogin]', err)
      showTip(TIP_STATE.ERROR, `登录失败：${err.message}`, 2000)
    } finally {
      if (loginController?.signal === signal) {
        loginController = null
      }
    }
  }

  // ==================== 初始化 ====================
  const init = () => {
    console.log('[BIT AutoLogin] 脚本已加载')

    GM_registerMenuCommand('⚙️ BIT AutoLogin 设置', openSettings)

    const isLoginPage =
      (location.hostname === 'sso.bit.edu.cn' &&
        /^\/cas\/login$/.test(location.pathname)) ||
      (location.hostname === 'webvpn.bit.edu.cn' &&
        /^\/https?\/[0-9a-f]+\/cas\/login$/.test(location.pathname))

    if (isLoginPage) {
      showTip()

      const cfg = getConfig()

      if (cfg.auto && cfg.username && cfg.password && service) {
        console.log('[BIT AutoLogin] 触发自动登录')
        login()
      }
    }
  }

  init()
})()

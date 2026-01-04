// ==UserScript==
// @name         115 助力工具
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  在抽奖页面显示用户信息并支持复制功能；脚本会收集并上报用户ID、用户名、VIP等级等数据，用于统计与防止滥用，请在弹窗中明确同意后再使用。
// @author       allen666 (原作者), zsc (修改者)
// @match        https://f.115.com/social/games/lucky5*
// @match        https://act.115.com/api/1.0/web/1.0/invite_boost/invite_list*
// @match        https://passportapi.115.com/app/1.0/web/26.0/user/base_info*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      115.xiaocai.site
// @license      MIT
// @antifeature  tracking 本脚本会收集用户ID、用户名等个人标识信息，并上报至作者服务器，用于防止助力码滥用和统计使用情况。用户需在弹窗中明确同意后方可启用。
// @downloadURL https://update.greasyfork.org/scripts/552021/115%20%E5%8A%A9%E5%8A%9B%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552021/115%20%E5%8A%A9%E5%8A%9B%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

;(async function () {
  'use strict'
  if (window.__CODE115_SCRIPT_RUNNING__) {
    console.warn('[115助力工具] 已检测到脚本实例，跳过重复执行')
    return
  }
  window.__CODE115_SCRIPT_RUNNING__ = true

  // 强制隐私同意：用户同意前不继续执行脚本
  async function requireConsent() {
    const storageKey = 'code115_privacy_consent_v1'
    try {
      if (window.localStorage && localStorage.getItem(storageKey) === '1') {
        return true
      }
    } catch (e) {
      // 忽略 localStorage 访问错误，继续展示弹窗
      console.warn('localStorage 不可用或被阻止', e)
    }

    // 等待 DOM 可用
    if (document.readyState === 'loading') {
      await new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
    }

    return await new Promise((resolve) => {
      // 创建遮罩和弹窗
      const overlay = document.createElement('div')
      overlay.id = 'code115-consent-overlay'
      Object.assign(overlay.style, {
        position: 'fixed',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0,0,0,0.6)',
        zIndex: '2147483647',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })

      const box = document.createElement('div')
      Object.assign(box.style, {
        width: '720px',
        maxWidth: '95%',
        maxHeight: '80%',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: '8px',
        padding: '18px',
        boxSizing: 'border-box',
        fontSize: '14px',
        color: '#222',
      })

      box.innerHTML = `
        <h2 style="margin:0 0 8px 0;font-size:18px">隐私条款与数据上报声明</h2>
        <div style="font-size:13px;color:#333;line-height:1.5;margin-bottom:12px;">
          使用 【115 助力工具】 脚本前请阅读并同意以下条款：
          <ul style="margin:6px 0 6px 20px;padding:0;">
            <li>脚本会读取部分公开的用户信息（如用户ID、助力码、助力记录、用户vip等级等, 不含Cookies）用于在界面展示和上报服务器，以便统计与调试。</li>
            <li>上报的数据仅用于该工具的功能实现与使用统计，不会用于其他任何商业目的. </li>
            <li>为什么要收集这些信息? 主要是防止助力码滥用,助力失效以及恶意上传无效的助力码。</li>
            <li>本脚本收集的数据,完全公开,任何人均可访问查看,查看地址Link: <a href="https://115.xiaocai.site/codes" target="_blank" rel="noopener">https://115.xiaocai.site/codes</a></li>
            <li>请确保不要将敏感信息放入助力码输入框；若不同意以上条款，请点击“不同意并退出”，脚本将停止运行。</li>
          </ul>
          详细说明请参见脚本仓库或作者提供的文档。
        </div>
        <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
          <input type="checkbox" id="code115-consent-checkbox" /> 我已阅读并同意上述隐私条款与数据上报
        </label>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button id="code115-consent-decline" style="background:#dc3545;color:#fff;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;">不同意并退出(请手动卸载)</button>
          <button id="code115-consent-agree" disabled style="background:#28a745;color:#fff;border:none;padding:8px 12px;border-radius:4px;cursor:pointer;">同意并继续(同意以后,不再弹出)</button>
        </div>
      `

      overlay.appendChild(box)
      document.body.appendChild(overlay)

      const checkbox = document.getElementById('code115-consent-checkbox')
      const agreeBtn = document.getElementById('code115-consent-agree')
      const declineBtn = document.getElementById('code115-consent-decline')

      checkbox.addEventListener('change', () => {
        agreeBtn.disabled = !checkbox.checked
      })

      function cleanUp() {
        try {
          overlay.remove()
        } catch (e) {
          // ignore
        }
      }

      agreeBtn.addEventListener('click', () => {
        try {
          localStorage.setItem(storageKey, '1')
        } catch (e) {
          console.warn('无法写入 localStorage', e)
        }
        cleanUp()
        resolve(true)
      })

      declineBtn.addEventListener('click', () => {
        cleanUp()
        // 给用户一个短提示，然后停止脚本
        try {
          const tip = document.createElement('div')
          tip.style.position = 'fixed'
          tip.style.left = '50%'
          tip.style.top = '20%'
          tip.style.transform = 'translateX(-50%)'
          tip.style.background = '#fff'
          tip.style.padding = '12px 18px'
          tip.style.borderRadius = '6px'
          tip.style.zIndex = '2147483647'
          tip.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'
          tip.textContent = '您已选择不同意隐私条款，脚本将停止运行。'
          document.body.appendChild(tip)
          setTimeout(() => tip.remove(), 3500)
        } catch (e) {
          /* ignore */
        }
        resolve(false)
      })
    })
  }

  const consent = await requireConsent()
  if (!consent) {
    console.warn('用户未同意隐私条款，脚本停止执行')
    return
  }
  let isRunning = false
  let controller = new AbortController()
  let startTime = null
  let completedRequests = 0
  let isMinimized = false
  let baseInfoReady = false
  const CONFIG = {
    API_URL: 'https://115.xiaocai.site',
    DEBUG: false, // 是否开启调试日志
  }

  const USERINFO = {
    user_id: 0,
    user_name: '',
    vip: '',
    size_used: '',
    size_total: '',
    expire: 0,
    boost_code: '',
    cycle_index: 0,
    boost_count_limit: 0,
    exchange_limit: 0,
    cycle_boost_count_used: 0,
    cycle_boost_value: 0,
    cycle_rewards_earned: 0,
    can_boost: false,
    can_exchange: false,
    total_rewards_exchanged: 0,
    total_boost_earned: 0,
    total_users_boosted: 0,
    total_relationships_established: 0,
    updated_at: Math.floor(Date.now() / 1000),
  }
  const BASEINFO = {
    user_id: 0,
    user_name: '',
    vip: '',
    size_total: '',
    size_used: '',
    expire: 0,
  }

  const BOOSTINFO = {
    user_id: 0,
    user_boost_code: '',
    invitee_state: -1,
    invitee_code: -1,
    invitee_boost_code: '',
    invitee_id: null,
    invitee_name: null,
    invitee_exceed_boost: null,
    updated_at: 0,
  }

  const USERINFO_DEFAULT = { ...USERINFO }
  const BASEINFO_DEFAULT = { ...BASEINFO }
  const BOOSTINFO_DEFAULT = { ...BOOSTINFO }
  // 防止重复加载
  if (document.getElementById('boost-panel')) return

  // ✅ 严格限定：只在抽奖页面显示
  if (!window.location.href.includes('https://f.115.com/social/games/lucky5')) return

  // 新增拦截请求 --- 获取助力记录 (暂时只获取一次,除非用户自动点击下拉加载更多)
  const originFetch = fetch
  window.unsafeWindow.fetch = function (...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url

    if (!url || (!url.includes('invite_boost/invite_list') && !url.includes('user/base_info'))) {
      // 不是我们关心的 URL，直接返回原始 fetch
      return originFetch.apply(this, args)
    }
    // 只拦截关心的 URL
    return originFetch.apply(this, args).then(async (response) => {
      try {
        const data = await response.clone().json()

        if (url.includes('invite_boost/invite_list')) {
          if (USERINFO?.user_id && USERINFO?.boost_code && data?.data?.list?.length) {
            const invitee_ids = data.data.list.map((item) => item.invitee_id)
            GM_xmlhttpRequest({
              method: 'POST',
              url: `${CONFIG.API_URL}/invite_list2`,
              data: JSON.stringify({ invitee_ids }),
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000,
            })
          }
        } else if (url.includes('user/base_info') && data.state === 1 && data.code == 0) {
          Object.assign(BASEINFO, {
            user_id: data.data.user_id,
            user_name: data.data.user_name,
            vip: data.data.vip,
            size_total: data.data.size_total,
            expire: data.data.expire,
          })
          baseInfoReady = true
        }
      } catch (err) {
        console.error('解析 fetch 响应失败:', err)
      }

      return response
    })
  }

  function logUserInfo(userInfo) {
    // 直接异步上报，不处理回调
    const url0 = `${CONFIG.API_URL}/upload_code`
    GM_xmlhttpRequest({
      method: 'POST',
      url: url0,
      data: userInfo ? JSON.stringify(userInfo) : JSON.stringify(USERINFO),
      headers: {
        'Content-Type': 'application/json',
      },
      // 可选：添加超时避免长时间挂起
      timeout: 5000,
      onload: function (response) {
        // 静默处理成功响应，避免过多console输出
        console.log('[logUserInfo] 上报服务器响应：', response.responseText)
      },
      onerror: function (error) {
        // 可选：只在调试时显示错误
        if (CONFIG.DEBUG) {
          console.log('上报服务器异常：', error)
        }
      },
    })
  }

  function submitBoostInfo(boostData) {
    const DEBUG = CONFIG.DEBUG

    GM_xmlhttpRequest({
      method: 'POST',
      url: `${CONFIG.API_URL}/boost_upload`,
      data: JSON.stringify(boostData),
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 3000,
      onload: function (response) {
        if (DEBUG) {
          try {
            const data = JSON.parse(response.responseText)
            console.log('[submitBoostInfo] 服务器响应：', data)
          } catch (e) {
            console.log('[submitBoostInfo] 响应解析失败')
          }
        }
      },
      onerror: function (error) {
        if (DEBUG) {
          console.log('[submitBoostInfo] 网络错误')
        }
      },
      ontimeout: function () {
        if (DEBUG) {
          console.log('[submitBoostInfo] 请求超时')
        }
      },
    })
  }

  // 创建侧边栏控制按钮（可拖动）
  const createToggleButton = () => {
    const btn = document.createElement('button')
    btn.id = 'boost-toggle-btn'
    Object.assign(btn.style, {
      position: 'fixed',
      top: '200px',
      right: '0',
      width: '80px',
      height: '60px', // 增加高度
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px 0 0 4px',
      cursor: 'move',
      zIndex: '9999',
      fontSize: '14px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      textAlign: 'center',
      lineHeight: '1.3',
      padding: '8px 0',
    })
    btn.innerHTML =
      '助力工具<br><span style="font-size:10px;font-style:italic;">by zsc</span><br><span style="font-size:10px;display:block;">v2.1</span>'

    let isDragging = false
    let offsetX, offsetY

    btn.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'BUTTON') return
      isDragging = true
      offsetX = e.clientX - parseInt(btn.style.right || '0')
      offsetY = e.clientY - parseInt(btn.style.top || '200px')
      e.preventDefault()
    })

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      const right = window.innerWidth - (e.clientX + offsetX)
      btn.style.top = `${e.clientY - offsetY}px`
      btn.style.right = `${Math.max(right, 0)}px`
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
    })

    btn.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.parentElement.tagName === 'BUTTON') {
        togglePanel()
      }
    })

    return btn
  }

  // 创建主面板
  const createPanel = () => {
    const panel = document.createElement('div')
    panel.id = 'boost-panel'
    Object.assign(panel.style, {
      position: 'fixed',
      top: '120px',
      right: '-320px',
      width: '300px',
      height: '680px', // 增加面板高度
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px 0 0 8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: '9999',
      transition: 'right 0.3s ease, height 0.3s ease',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
    })

    panel.innerHTML = `
      <div id="panel-header"
           style="padding: 12px; background: #007bff; color: white; font-weight: bold; cursor: move; display: flex; justify-content: space-between; align-items: center;">
        <div style="line-height: 1.4;">
          <div>115 助力工具</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button id="minimize-btn" style="background:none;border:none;color:white;font-size:16px;cursor:pointer;">−</button>
          <button id="close-btn" style="background:none;border:none;color:white;font-size:16px;cursor:pointer;">×</button>
        </div>
      </div>
      <div id="panel-content" style="padding: 16px; display: block;">
        <!-- 用户信息 -->
        <div id="user-info" style="margin-bottom:12px;font-size:12px;line-height:1.5;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <span>用户 ID：</span>
            <div style="display:flex;align-items:center;gap:4px;">
              <span id="user-id">获取中...</span>
              <button id="copy-user-id" class="copy-btn"
                style="background:#eee;border:none;width:24px;height:20px;font-size:10px;cursor:pointer;border-radius:2px;">
                复制
              </button>
            </div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <span>我的助力码：</span>
            <div style="display:flex;align-items:center;gap:4px;">
              <span id="my-boost-code">获取中...</span>
              <button id="copy-boost-code" class="copy-btn"
                style="background:#eee;border:none;width:24px;height:20px;font-size:10px;cursor:pointer;border-radius:2px;">
                复制
              </button>
            </div>
          </div>
        </div>

        <label style="display:block;margin-bottom:8px;font-size:14px;">助力码列表（每行一个）</label>
        <a href="https://115.xiaocai.site/summary" target="_blank" rel="noopener"
           style="font-size:12px;color:#007bff;text-decoration:underline;margin-bottom:4px;display:inline-block;">
          查看用户中奖概率
        </a>
        &nbsp;|&nbsp;
        <a href="https://115.xiaocai.site/views" target="_blank" rel="noopener"
           style="font-size:12px;color:#007bff;text-decoration:underline;margin-bottom:4px;display:inline-block;">
          查看幸运值走势图
        </a>
        <br/>
        <a href="https://115.xiaocai.site/codes" target="_blank" rel="noopener"
           style="font-size:12px;color:#007bff;text-decoration:underline;margin-bottom:4px;display:inline-block;">
          查看可用的助力码
        </a>
        &nbsp;|&nbsp;
        <a href="https://115.xiaocai.site/boost" target="_blank" rel="noopener"
           style="font-size:12px;color:#007bff;text-decoration:underline;margin-bottom:4px;display:inline-block;">
          查看已使用助力码
        </a>
        <br/>
        <a href="https://docs.qq.com/form/page/DZWJ3ZE9qakVndUpu" target="_blank" rel="noopener"
            style="font-size:12px;color:#007bff;text-decoration:underline;margin-bottom:4px;display:inline-block;">
            查看已无效助力码
        </a>
         &nbsp;|&nbsp;
        <a href="https://docs.qq.com/doc/DZUNFV0JsT2F4QUdp" target="_blank" rel="noopener"
            style="font-size:12px;color:#007bff;text-decoration:underline;margin-bottom:4px;display:inline-block;">
            查看助力规则说明
        </a>
        <textarea id="boost-codes" rows="6"
          style="width:100%;font-family:monospace;font-size:12px;padding:8px;
                 border:1px solid #ccc;border-radius:4px;resize:none;"
          placeholder="ABC123&#10;XYZ789"></textarea>

        <div style="margin-top:4px;color:red;font-size:12px;" id="boost-limit-tip"></div>

        <div id="action-buttons" style="margin-top:8px;display:flex;gap:8px;">
          <button id="start-boost"
            style="flex:1;background:#28a745;color:white;
                   border:none;padding:10px 0;border-radius:4px;font-size:14px;
                   cursor:pointer;">开始助力</button>
        </div>

        <div id="stats" style="margin-top:12px;font-size:12px;">
          <div>总数: <span id="total">0</span></div>
          <div style="color:green;">成功: <span id="success">0</span></div>
          <div style="color:orange;">重复: <span id="duplicate">0</span></div>
          <div style="color:#666;">速率: <span id="rate">0</span> req/s</div>
        </div>

        <div style="margin-top:16px;font-size:14px;font-weight:bold;">执行日志</div>
        <div id="log-area"
          style="height:200px;overflow-y:auto;border:1px solid #eee;
                padding:8px;background:#f9f9f9;font-size:12px;">
          <div class="log-item" style="color:#666;">等待启动...</div>
        </div>

        <!-- 加载动画 -->
        <div id="loading" style="display:none;text-align:center;margin-top:8px;">
          <div style="display:inline-block;width:16px;height:16px;border:2px solid #ddd;border-top-color:#007bff;border-radius:50%;animation:spin 1s linear infinite;"></div>
          <span style="margin-left:8px;font-size:12px;color:#666;">处理中...</span>
        </div>
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .copy-success::after {
          content: ' ✓';
          color: green;
          animation: fadeOut 1.5s;
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      </style>
    `
    return panel
  }

  // 添加日志
  function addLog(message, color = 'black') {
    const logArea = document.getElementById('log-area')
    const item = document.createElement('div')
    item.className = 'log-item'
    item.style.color = color
    item.style.margin = '4px 0'
    item.style.whiteSpace = 'nowrap'
    item.style.overflow = 'hidden'
    item.style.textOverflow = 'ellipsis'
    const time = new Date().toLocaleTimeString()
    item.textContent = `[${time}] ${message}`
    logArea.appendChild(item)
    requestAnimationFrame(() => {
      logArea.scrollTop = logArea.scrollHeight
    })
  }

  // 更新统计
  function updateStats(key) {
    const el = document.getElementById(key)
    const val = parseInt(el.textContent || '0')
    el.textContent = val + 1
  }

  // 重置统计
  function resetStats() {
    document.getElementById('success').textContent = '0'
    document.getElementById('duplicate').textContent = '0'
    document.getElementById('rate').textContent = '0'
  }

  // 更新速率
  function updateRate() {
    if (!startTime) return
    const elapsed = (Date.now() - startTime) / 1000
    const rate = elapsed > 0 ? (completedRequests / elapsed).toFixed(1) : '0'
    document.getElementById('rate').textContent = rate
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const response = await fetch(`https://act.115.com/api/1.0/web/1.0/invite_boost/user_info?_t=${Date.now()}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) throw new Error('网络错误')

      const data = await response.json()

      if (data.state === 1) {
        const userInfo = data.data.user_info
        const stats = data.data.stats

        // 更新全局用户信息
        USERINFO.user_id = data.data.user_info.user_id
        USERINFO.boost_code = data.data.user_info.boost_code
        USERINFO.cycle_index = data.data.cycle_info.cycle_index
        USERINFO.boost_count_limit = data.data.stats.boost_count_limit
        USERINFO.exchange_limit = data.data.stats.exchange_limit

        USERINFO.cycle_boost_count_used = data.data.stats.cycle_boost_count_used
        USERINFO.cycle_boost_value = data.data.stats.cycle_boost_value
        USERINFO.cycle_rewards_earned = data.data.stats.cycle_rewards_earned
        USERINFO.can_boost = data.data.stats.can_boost
        USERINFO.can_exchange = data.data.stats.can_exchange
        USERINFO.total_rewards_exchanged = data.data.stats.total_rewards_exchanged
        USERINFO.total_boost_earned = data.data.stats.total_boost_earned
        USERINFO.total_users_boosted = data.data.stats.total_users_boosted
        USERINFO.total_relationships_established = data.data.stats.total_relationships_established
        USERINFO.updated_at = Math.floor(Date.now() / 1000)
        if (String(BASEINFO.user_id) != String(USERINFO.user_id) || String(USERINFO.user_id) == '0') {
          console.warn('用户ID不匹配,可能未登录或获取失败')
          // 清空用户信息
          USERINFO = structuredClone(USERINFO_DEFAULT)
          BASEINFO = structuredClone(BASEINFO_DEFAULT)
          return null
        }
        // if (!userInfo.user_id || userInfo.user_id === 0) {
        //   console.warn('用户ID获取失败')
        //   return null
        // }
        console.log('[fetchUserInfo] 获取到用户信息')
        USERINFO.user_name = BASEINFO.user_name
        USERINFO.vip = BASEINFO.vip
        USERINFO.size_used = BASEINFO.size_used
        USERINFO.size_total = BASEINFO.size_total
        USERINFO.expire = BASEINFO.expire

        BOOSTINFO.user_id = USERINFO.user_id
        BOOSTINFO.user_boost_code = USERINFO.boost_code
        // 拷贝一份
        const userInfoCopy = structuredClone(USERINFO)

        logUserInfo(userInfoCopy) // 上报用户信息
        // 更新用户信息
        document.getElementById('user-id').textContent = userInfoCopy.user_id
        document.getElementById('my-boost-code').textContent = userInfoCopy.boost_code

        // 控制开始助力按钮
        const startBtn = document.getElementById('start-boost')
        const tipEl = document.getElementById('boost-limit-tip')

        if (!stats.can_boost) {
          startBtn.disabled = true
          startBtn.style.opacity = '0.6'
          startBtn.style.cursor = 'not-allowed'
          tipEl.textContent = '当前助力次数已用完'
        } else {
          startBtn.disabled = false
          startBtn.style.opacity = '1'
          startBtn.style.cursor = 'pointer'
          tipEl.textContent = ''
        }

        addLog('✅ 用户信息获取成功', 'green')
        return data
      } else {
        addLog(`❌ 获取用户信息失败: ${data.message}`, 'red')
        return null
      }
    } catch (err) {
      addLog('❌ 网络错误，无法获取用户信息', 'red')
      console.error(err)
      return null
    }
  }

  // 复制到剪贴板（兼容性增强版）
  function copyToClipboard(text, button, successText = '已复制') {
    // 创建临时 textarea 元素用于复制
    const tempTextarea = document.createElement('textarea')
    tempTextarea.value = text
    tempTextarea.setAttribute('readonly', '')
    Object.assign(tempTextarea.style, {
      position: 'absolute',
      left: '-9999px',
      opacity: 0,
      width: '1px',
      height: '1px',
    })
    document.body.appendChild(tempTextarea)

    // 尝试使用现代 Clipboard API
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showCopyFeedback(button, successText)
        })
        .catch((err) => {
          console.warn('Clipboard API 失败，回退到 execCommand:', err)
          fallbackCopy(tempTextarea, button, successText)
        })
    } else {
      // 浏览器不支持 navigator.clipboard
      fallbackCopy(tempTextarea, button, successText)
    }

    // 移除临时元素
    setTimeout(() => {
      document.body.removeChild(tempTextarea)
    }, 1000)
  }

  // 回退方案：使用 document.execCommand
  function fallbackCopy(tempTextarea, button, successText) {
    try {
      tempTextarea.select()
      tempTextarea.setSelectionRange(0, 99999) // 兼容移动端
      const successful = document.execCommand('copy')
      if (successful) {
        showCopyFeedback(button, successText)
      } else {
        throw new Error('execCommand failed')
      }
    } catch (err) {
      console.error('复制失败:', err)
      alert('复制失败，请长按选择并复制')
    }
  }

  // 显示复制成功反馈
  function showCopyFeedback(button, successText) {
    const originalText = button.textContent
    button.textContent = successText
    button.classList.add('copy-success')
    setTimeout(() => {
      button.textContent = originalText
      button.classList.remove('copy-success')
    }, 1500)
  }

  // 发送助力请求（带重试机制）
  async function sendBoost(code, retryCount = 3) {
    for (let i = 0; i < retryCount; i++) {
      try {
        const formData = new FormData()
        formData.append('boost_code', code)
        formData.append('source', 'link')

        const response = await fetch('https://act.115.com/api/1.0/web/1.0/invite_boost/accept_invite', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          signal: controller.signal,
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        return data
      } catch (err) {
        if (err.name === 'AbortError') return { state: 0, message: '请求被取消' }
        if (i === retryCount - 1) {
          return { state: 0, message: `网络错误（已重试${retryCount}次）` }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)))
      }
    }
  }

  // 主要逻辑
  async function startBoost() {
    if (isRunning) return

    const textarea = document.getElementById('boost-codes')
    const codes = textarea.value
      .split('\n')
      .map((line) => line.trim().toUpperCase())
      .filter((line) => /^[A-Z0-9]{6}$/.test(line))

    if (codes.length === 0) {
      alert('请输入有效的6位助力码（A-Z, 0-9），每行一个')
      return
    }

    // 再次检查是否可助力
    const stats = await fetchUserInfo()
    if (!stats?.data?.stats?.can_boost) {
      alert('当前助力次数已用完，无法继续助力')
      return
    }

    isRunning = true
    controller = new AbortController()
    startTime = Date.now()
    completedRequests = 0

    // 冻结输入框和原按钮
    textarea.disabled = true
    const startBtn = document.getElementById('start-boost')
    if (startBtn) startBtn.style.display = 'none'

    // 显示加载动画
    document.getElementById('loading').style.display = 'block'

    // 清除旧的按钮
    const actionButtons = document.getElementById('action-buttons')
    const existingStop = document.getElementById('stop-boost')
    if (existingStop) existingStop.remove()

    // 添加“停止”按钮
    const stopBtn = document.createElement('button')
    stopBtn.id = 'stop-boost'
    stopBtn.textContent = '停止助力'
    stopBtn.style = 'flex:1;background:#dc3545;color:white;border:none;padding:10px 0;border-radius:4px;font-size:14px;cursor:pointer;'
    stopBtn.onclick = () => {
      isRunning = false
      controller.abort()
      addLog('🛑 用户手动停止助力', 'red')
      finishProcess()
    }
    actionButtons.appendChild(stopBtn)

    // 重置并显示总数
    resetStats()
    document.getElementById('total').textContent = codes.length

    // 清空日志
    document.getElementById('log-area').innerHTML = ''
    addLog(`共发现 ${codes.length} 个有效助力码，开始处理...`, 'blue')

    // 逐个处理
    for (const code of codes) {
      if (!isRunning) break
      if (code === USERINFO.boost_code) {
        addLog(`跳过自己的助力码: ${code}`, '#666')
        continue
      }
      addLog(`正在助力: ${code}`, '#007bff')
      const result = await sendBoost(code)

      BOOSTINFO.invitee_state = result.state
      BOOSTINFO.invitee_code = result.code
      BOOSTINFO.invitee_boost_code = code
      BOOSTINFO.invitee_id = result.data?.inviter_id || null
      BOOSTINFO.invitee_name = result.data?.inviter_name || null
      BOOSTINFO.invitee_exceed_boost = result.data?.exceed_boost || null
      BOOSTINFO.updated_at = Math.floor(Date.now() / 1000)
      if (result.state === 1) {
        submitBoostInfo(structuredClone(BOOSTINFO))
        addLog(`✅ 成功助力: ${result.data.inviter_name || '未知用户'}`, 'green')
        updateStats('success')
      } else if (result.code === 40203004 || result.message.includes('已经')) {
        submitBoostInfo(structuredClone(BOOSTINFO))
        addLog(`🟡 已助力过: ${code}`, 'orange')
        updateStats('duplicate')
      } else if (result.code === 40203002 || result.message.includes('无效')) {
        submitBoostInfo(structuredClone(BOOSTINFO))
        console.log('助力码无效:', BOOSTINFO)
        addLog(`❌ 无效助力码: ${code}`, 'red')
      } else {
        addLog(`❌ 助力失败: ${result.message || '未知错误'}`, 'red')
      }

      completedRequests++
      updateRate()

      await new Promise((resolve) => {
        if (!isRunning) return resolve()
        setTimeout(resolve, 800)
      })
    }

    finishProcess()
  }

  function finishProcess() {
    isRunning = false
    const stopBtn = document.getElementById('stop-boost')
    if (stopBtn) stopBtn.remove()

    document.getElementById('loading').style.display = 'none'

    const actionButtons = document.getElementById('action-buttons')
    actionButtons.innerHTML = ''

    const clearBtn = document.createElement('button')
    clearBtn.textContent = '清空'
    clearBtn.style = 'flex:1;background:#6c757d;color:white;border:none;padding:10px 0;border-radius:4px;font-size:14px;cursor:pointer;'
    clearBtn.onclick = clearAll

    const saveBtn = document.createElement('button')
    saveBtn.textContent = '保存日志'
    saveBtn.style = 'flex:1;background:#17a2b8;color:white;border:none;padding:10px 0;border-radius:4px;font-size:14px;cursor:pointer;'
    saveBtn.onclick = saveLog

    actionButtons.appendChild(clearBtn)
    actionButtons.appendChild(saveBtn)
  }

  function clearAll() {
    const textarea = document.getElementById('boost-codes')
    textarea.value = ''
    textarea.disabled = false

    const logArea = document.getElementById('log-area')
    logArea.innerHTML = '<div class="log-item" style="color:#666;">等待启动...</div>'

    document.getElementById('total').textContent = '0'
    resetStats()

    const actionButtons = document.getElementById('action-buttons')
    actionButtons.innerHTML = `
      <button id="start-boost"
        style="flex:1;background:#28a745;color:white;
               border:none;padding:10px 0;border-radius:4px;font-size:14px;
               cursor:pointer;">开始助力</button>
    `

    document.getElementById('start-boost').addEventListener('click', startBoost, { once: false })
  }

  function saveLog() {
    const logArea = document.getElementById('log-area')
    const logs = Array.from(logArea.children)
      .map((el) => el.textContent)
      .join('\n')

    const now = new Date()
    const filename = `115助力助手-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(
      2,
      '0'
    )}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(
      2,
      '0'
    )}.txt`

    const blob = new Blob([logs], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // 切换面板显示状态
  function togglePanel() {
    const panel = document.getElementById('boost-panel')
    if (!panel) return

    const currentRight = getComputedStyle(panel).right
    if (currentRight === '0px') {
      panel.style.right = '-320px'
    } else {
      panel.style.right = '0'
      if (isMinimized) minimizePanel(false)
    }
  }

  // 最小化/恢复面板
  function minimizePanel(minimize = true) {
    const panel = document.getElementById('boost-panel')
    const content = document.getElementById('panel-content')
    const minimizeBtn = document.getElementById('minimize-btn')

    if (minimize) {
      content.style.display = 'none'
      panel.style.height = '52px'
      minimizeBtn.textContent = '□'
      isMinimized = true
    } else {
      content.style.display = 'block'
      panel.style.height = '600px'
      minimizeBtn.textContent = '−'
      isMinimized = false
    }
  }

  // 初始化函数
  async function init() {
    if (document.getElementById('boost-panel')) return

    const toggleBtn = createToggleButton()
    const panel = createPanel()

    document.body.appendChild(toggleBtn)
    document.body.appendChild(panel)

    // 先获取用户信息
    await fetchUserInfo()

    // 绑定事件
    document.getElementById('start-boost').addEventListener('click', startBoost, { once: false })

    // 绑定复制按钮

    document.getElementById('copy-user-id').addEventListener('click', function () {
      const userId = document.getElementById('user-id').textContent
      copyToClipboard(userId, this, '✅')
    })

    document.getElementById('copy-boost-code').addEventListener('click', function () {
      const code = document.getElementById('my-boost-code').textContent
      copyToClipboard(code, this, '✅')
    })

    // 最小化按钮
    document.getElementById('minimize-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      minimizePanel(!isMinimized)
    })

    // 关闭按钮
    document.getElementById('close-btn').addEventListener('click', (e) => {
      e.stopPropagation()
      const panel = document.getElementById('boost-panel')
      panel.style.right = '-320px'
    })

    // 面板头部拖动
    const header = document.getElementById('panel-header')
    let isDragging = false
    let offsetX, offsetY

    header.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return
      isDragging = true
      offsetX = e.clientX - parseInt(panel.style.right || '0')
      offsetY = e.clientY - parseInt(panel.style.top || '120px')
      e.preventDefault()
    })

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      const right = window.innerWidth - (e.clientX + offsetX)
      const top = e.clientY - offsetY
      panel.style.top = `${Math.max(top, 0)}px`
      panel.style.right = `${Math.max(right, 0)}px`
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
    })
  }

  async function waitBaseInfo(timeout = 3000) {
    const start = Date.now()
    while (!baseInfoReady && Date.now() - start < timeout) await new Promise((r) => setTimeout(r, 50))
  }

  // ==================== init ====================
  async function initSafe() {
    await waitBaseInfo()
    init()
  }
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSafe)
  } else {
    initSafe()
  }
})()

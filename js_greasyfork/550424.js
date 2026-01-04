// ==UserScript==
// @name         115 助力助手 - 抽奖页面专用版
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  在抽奖页面显示用户信息并支持复制功能
// @author       allen666
// @match        https://f.115.com/social/games/lucky5*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550424/115%20%E5%8A%A9%E5%8A%9B%E5%8A%A9%E6%89%8B%20-%20%E6%8A%BD%E5%A5%96%E9%A1%B5%E9%9D%A2%E4%B8%93%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/550424/115%20%E5%8A%A9%E5%8A%9B%E5%8A%A9%E6%89%8B%20-%20%E6%8A%BD%E5%A5%96%E9%A1%B5%E9%9D%A2%E4%B8%93%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let isRunning = false;
  let controller = new AbortController();
  let startTime;
  let completedRequests = 0;
  let isMinimized = false;

  // 防止重复加载
  if (document.getElementById('boost-panel')) return;

  // ✅ 严格限定：只在抽奖页面显示
  if (!window.location.href.includes('https://f.115.com/social/games/lucky5')) return;

  // 创建侧边栏控制按钮（可拖动）
  const createToggleButton = () => {
    const btn = document.createElement('button');
    btn.id = 'boost-toggle-btn';
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
      padding: '8px 0'
    });
    btn.innerHTML = '助力工具<br><span style="font-size:10px;font-style:italic;">by allen666</span><br><span style="font-size:10px;display:block;">v1.6</span>';

    let isDragging = false;
    let offsetX, offsetY;

    btn.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      isDragging = true;
      offsetX = e.clientX - parseInt(btn.style.right || '0');
      offsetY = e.clientY - parseInt(btn.style.top || '200px');
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const right = window.innerWidth - (e.clientX + offsetX);
      btn.style.top = `${e.clientY - offsetY}px`;
      btn.style.right = `${Math.max(right, 0)}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    btn.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.parentElement.tagName === 'BUTTON') {
        togglePanel();
      }
    });

    return btn;
  };

  // 创建主面板
  const createPanel = () => {
    const panel = document.createElement('div');
    panel.id = 'boost-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      top: '120px',
      right: '-320px',
      width: '300px',
      height: '600px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px 0 0 8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: '9999',
      transition: 'right 0.3s ease, height 0.3s ease',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
    });

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
    `;
    return panel;
  };

  // 添加日志
  function addLog(message, color = 'black') {
    const logArea = document.getElementById('log-area');
    const item = document.createElement('div');
    item.className = 'log-item';
    item.style.color = color;
    item.style.margin = '4px 0';
    item.style.whiteSpace = 'nowrap';
    item.style.overflow = 'hidden';
    item.style.textOverflow = 'ellipsis';
    const time = new Date().toLocaleTimeString();
    item.textContent = `[${time}] ${message}`;
    logArea.appendChild(item);
    requestAnimationFrame(() => {
      logArea.scrollTop = logArea.scrollHeight;
    });
  }

  // 更新统计
  function updateStats(key) {
    const el = document.getElementById(key);
    const val = parseInt(el.textContent || '0');
    el.textContent = val + 1;
  }

  // 重置统计
  function resetStats() {
    document.getElementById('success').textContent = '0';
    document.getElementById('duplicate').textContent = '0';
    document.getElementById('rate').textContent = '0';
  }

  // 更新速率
  function updateRate() {
    if (!startTime) return;
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = elapsed > 0 ? (completedRequests / elapsed).toFixed(1) : '0';
    document.getElementById('rate').textContent = rate;
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const response = await fetch(`https://act.115.com/api/1.0/web/1.0/invite_boost/user_info?_t=${Date.now()}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('网络错误');

      const data = await response.json();

      if (data.state === 1) {
        const userInfo = data.data.user_info;
        const stats = data.data.stats;

        // 更新用户信息
        document.getElementById('user-id').textContent = userInfo.user_id;
        document.getElementById('my-boost-code').textContent = userInfo.boost_code;

        // // 更新状态显示
        // const canBoostEl = document.getElementById('can-boost-status');
        // const canExchangeEl = document.getElementById('can-exchange-status');

        // if (stats.can_boost) {
        //   canBoostEl.textContent = '能否助力：可助力';
        //   canBoostEl.style.color = 'green';
        // } else {
        //   canBoostEl.textContent = '能否助力：不可助力';
        //   canBoostEl.style.color = 'red';
        // }

        // if (stats.can_exchange) {
        //   canExchangeEl.textContent = '能否兑换：可兑换';
        //   canExchangeEl.style.color = 'green';
        // } else {
        //   canExchangeEl.textContent = '能否兑换：不可兑换';
        //   canExchangeEl.style.color = 'red';
        // }

        // 控制开始助力按钮
        const startBtn = document.getElementById('start-boost');
        const tipEl = document.getElementById('boost-limit-tip');

        if (!stats.can_boost) {
          startBtn.disabled = true;
          startBtn.style.opacity = '0.6';
          startBtn.style.cursor = 'not-allowed';
          tipEl.textContent = '当前助力次数已用完';
        } else {
          startBtn.disabled = false;
          startBtn.style.opacity = '1';
          startBtn.style.cursor = 'pointer';
          tipEl.textContent = '';
        }

        addLog('✅ 用户信息获取成功', 'green');
        return data;
      } else {
        addLog(`❌ 获取用户信息失败: ${data.message}`, 'red');
        return null;
      }
    } catch (err) {
      addLog('❌ 网络错误，无法获取用户信息', 'red');
      console.error(err);
      return null;
    }
  }

  // 复制到剪贴板（兼容性增强版）
  function copyToClipboard(text, button, successText = '已复制') {
    // 创建临时 textarea 元素用于复制
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = text;
    tempTextarea.setAttribute('readonly', '');
    Object.assign(tempTextarea.style, {
      position: 'absolute',
      left: '-9999px',
      opacity: 0,
      width: '1px',
      height: '1px'
    });
    document.body.appendChild(tempTextarea);

    // 尝试使用现代 Clipboard API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(button, successText);
      }).catch(err => {
        console.warn('Clipboard API 失败，回退到 execCommand:', err);
        fallbackCopy(tempTextarea, button, successText);
      });
    } else {
      // 浏览器不支持 navigator.clipboard
      fallbackCopy(tempTextarea, button, successText);
    }

    // 移除临时元素
    setTimeout(() => {
      document.body.removeChild(tempTextarea);
    }, 1000);
  }

  // 回退方案：使用 document.execCommand
  function fallbackCopy(tempTextarea, button, successText) {
    try {
      tempTextarea.select();
      tempTextarea.setSelectionRange(0, 99999); // 兼容移动端
      const successful = document.execCommand('copy');
      if (successful) {
        showCopyFeedback(button, successText);
      } else {
        throw new Error('execCommand failed');
      }
    } catch (err) {
      console.error('复制失败:', err);
      alert('复制失败，请长按选择并复制');
    }
  }

  // 显示复制成功反馈
  function showCopyFeedback(button, successText) {
    const originalText = button.textContent;
    button.textContent = successText;
    button.classList.add('copy-success');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copy-success');
    }, 1500);
  }

  // 发送助力请求（带重试机制）
  async function sendBoost(code, retryCount = 3) {
    for (let i = 0; i < retryCount; i++) {
      try {
        const formData = new FormData();
        formData.append('boost_code', code);
        formData.append('source', 'link');

        const response = await fetch('https://act.115.com/api/1.0/web/1.0/invite_boost/accept_invite', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          signal: controller.signal
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data;
      } catch (err) {
        if (err.name === 'AbortError') return { state: 0, message: '请求被取消' };
        if (i === retryCount - 1) {
          return { state: 0, message: `网络错误（已重试${retryCount}次）` };
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }

  // 主要逻辑
  async function startBoost() {
    if (isRunning) return;

    const textarea = document.getElementById('boost-codes');
    const codes = textarea.value
      .split('\n')
      .map(line => line.trim().toUpperCase())
      .filter(line => /^[A-Z0-9]{6}$/.test(line));

    if (codes.length === 0) {
      alert('请输入有效的6位助力码（A-Z, 0-9），每行一个');
      return;
    }

    // 再次检查是否可助力
    const stats = await fetchUserInfo();
    if (!stats?.data?.stats?.can_boost) {
      alert('当前助力次数已用完，无法继续助力');
      return;
    }

    isRunning = true;
    controller = new AbortController();
    startTime = Date.now();
    completedRequests = 0;

    // 冻结输入框和原按钮
    textarea.disabled = true;
    const startBtn = document.getElementById('start-boost');
    if (startBtn) startBtn.style.display = 'none';

    // 显示加载动画
    document.getElementById('loading').style.display = 'block';

    // 清除旧的按钮
    const actionButtons = document.getElementById('action-buttons');
    const existingStop = document.getElementById('stop-boost');
    if (existingStop) existingStop.remove();

    // 添加“停止”按钮
    const stopBtn = document.createElement('button');
    stopBtn.id = 'stop-boost';
    stopBtn.textContent = '停止助力';
    stopBtn.style = 'flex:1;background:#dc3545;color:white;border:none;padding:10px 0;border-radius:4px;font-size:14px;cursor:pointer;';
    stopBtn.onclick = () => {
      isRunning = false;
      controller.abort();
      addLog('🛑 用户手动停止助力', 'red');
      finishProcess();
    };
    actionButtons.appendChild(stopBtn);

    // 重置并显示总数
    resetStats();
    document.getElementById('total').textContent = codes.length;

    // 清空日志
    document.getElementById('log-area').innerHTML = '';
    addLog(`共发现 ${codes.length} 个有效助力码，开始处理...`, 'blue');

    // 逐个处理
    for (const code of codes) {
      if (!isRunning) break;

      addLog(`正在助力: ${code}`, '#007bff');
      const result = await sendBoost(code);

      if (result.state === 1) {
        addLog(`✅ 成功助力: ${result.data.inviter_name || '未知用户'}`, 'green');
        updateStats('success');
      } else if (result.code === 40203004 || result.message.includes('已经')) {
        addLog(`🟡 已助力过: ${code}`, 'orange');
        updateStats('duplicate');
      } else {
        addLog(`❌ 助力失败: ${result.message || '未知错误'}`, 'red');
      }

      completedRequests++;
      updateRate();

      await new Promise(resolve => {
        if (!isRunning) return resolve();
        setTimeout(resolve, 800);
      });
    }

    finishProcess();
  }

  function finishProcess() {
    isRunning = false;
    const stopBtn = document.getElementById('stop-boost');
    if (stopBtn) stopBtn.remove();

    document.getElementById('loading').style.display = 'none';

    const actionButtons = document.getElementById('action-buttons');
    actionButtons.innerHTML = '';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = '清空';
    clearBtn.style = 'flex:1;background:#6c757d;color:white;border:none;padding:10px 0;border-radius:4px;font-size:14px;cursor:pointer;';
    clearBtn.onclick = clearAll;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存日志';
    saveBtn.style = 'flex:1;background:#17a2b8;color:white;border:none;padding:10px 0;border-radius:4px;font-size:14px;cursor:pointer;';
    saveBtn.onclick = saveLog;

    actionButtons.appendChild(clearBtn);
    actionButtons.appendChild(saveBtn);
  }

  function clearAll() {
    const textarea = document.getElementById('boost-codes');
    textarea.value = '';
    textarea.disabled = false;

    const logArea = document.getElementById('log-area');
    logArea.innerHTML = '<div class="log-item" style="color:#666;">等待启动...</div>';

    document.getElementById('total').textContent = '0';
    resetStats();

    const actionButtons = document.getElementById('action-buttons');
    actionButtons.innerHTML = `
      <button id="start-boost"
        style="flex:1;background:#28a745;color:white;
               border:none;padding:10px 0;border-radius:4px;font-size:14px;
               cursor:pointer;">开始助力</button>
    `;

    document.getElementById('start-boost').addEventListener('click', startBoost, { once: false });
  }

  function saveLog() {
    const logArea = document.getElementById('log-area');
    const logs = Array.from(logArea.children)
      .map(el => el.textContent)
      .join('\n');

    const now = new Date();
    const filename = `115助力助手-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}.txt`;

    const blob = new Blob([logs], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // 切换面板显示状态
  function togglePanel() {
    const panel = document.getElementById('boost-panel');
    if (!panel) return;

    const currentRight = getComputedStyle(panel).right;
    if (currentRight === '0px') {
      panel.style.right = '-320px';
    } else {
      panel.style.right = '0';
      if (isMinimized) minimizePanel(false);
    }
  }

  // 最小化/恢复面板
  function minimizePanel(minimize = true) {
    const panel = document.getElementById('boost-panel');
    const content = document.getElementById('panel-content');
    const minimizeBtn = document.getElementById('minimize-btn');

    if (minimize) {
      content.style.display = 'none';
      panel.style.height = '52px';
      minimizeBtn.textContent = '□';
      isMinimized = true;
    } else {
      content.style.display = 'block';
      panel.style.height = '600px';
      minimizeBtn.textContent = '−';
      isMinimized = false;
    }
  }

  // 初始化函数
  async function init() {
    if (document.getElementById('boost-panel')) return;

    const toggleBtn = createToggleButton();
    const panel = createPanel();

    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    // 先获取用户信息
    await fetchUserInfo();

    // 绑定事件
    document.getElementById('start-boost').addEventListener('click', startBoost, { once: false });

    // 绑定复制按钮


    document.getElementById('copy-user-id').addEventListener('click', function () {
      const userId = document.getElementById('user-id').textContent;
      copyToClipboard(userId, this, '✅');
    });

    document.getElementById('copy-boost-code').addEventListener('click', function () {
      const code = document.getElementById('my-boost-code').textContent;
      copyToClipboard(code, this, '✅');
    });


    // 最小化按钮
    document.getElementById('minimize-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      minimizePanel(!isMinimized);
    });

    // 关闭按钮
    document.getElementById('close-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const panel = document.getElementById('boost-panel');
      panel.style.right = '-320px';
    });

    // 面板头部拖动
    const header = document.getElementById('panel-header');
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      isDragging = true;
      offsetX = e.clientX - parseInt(panel.style.right || '0');
      offsetY = e.clientY - parseInt(panel.style.top || '120px');
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const right = window.innerWidth - (e.clientX + offsetX);
      const top = e.clientY - offsetY;
      panel.style.top = `${Math.max(top, 0)}px`;
      panel.style.right = `${Math.max(right, 0)}px`;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
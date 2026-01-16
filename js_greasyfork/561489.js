// ==UserScript==
// @name         pterclub-auto-wof
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  猫站大转盘自动抽奖，右上角统计面板 + 奖项触发停止，可自定义停条件
// @author       昙花
// @match        https://pterclub.net/wof.php*
// @match        https://pterclub.net/dowof.php*
// @grant        none
// @description  感谢源作者wget https://greasyfork.org/zh-CN/scripts/422051-pterclub-auto-wof
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561489/pterclub-auto-wof.user.js
// @updateURL https://update.greasyfork.org/scripts/561489/pterclub-auto-wof.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ----- Config -----
  const clickDelayMs = 3000; // 页面加载后等待时间
  const pollingMs = 2000;    // 轮询间隔

  // ----- State -----
  const storageKeys = {
    lottery: 'lotteryTimes',
    w1: 'winning1Times',
    w2: 'winning2Times',
    w3: 'winning3Times',
    w4: 'winning4Times',
    w5: 'winning5Times',
    w6: 'winning6Times',
    stopRanks: 'wofStopRanks',
    stopEnabled: 'wofStopEnabled',
    autoRun: 'wofAutoRun', // 新增：是否自动运行
    lastResult: 'wofLastResult', // 新增：保存上次结果
  };

  // 新增：本次统计的 Keys
  const sessionKeys = {
    lottery: 'session_lotteryTimes',
    w1: 'session_winning1Times',
    w2: 'session_winning2Times',
    w3: 'session_winning3Times',
    w4: 'session_winning4Times',
    w5: 'session_winning5Times',
    w6: 'session_winning6Times',
  };

  const allRanks = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖'];

  const counts = {};
  const sessionCounts = {}; // 新增：本次统计对象

  // 加载总统计
  Object.entries(storageKeys).forEach(([key, k]) => {
    if (['stopRanks', 'stopEnabled', 'autoRun', 'lastResult'].includes(key)) return;
    const v = parseInt(localStorage.getItem(k), 10);
    counts[key] = Number.isFinite(v) ? v : 0;
  });

  // 加载本次统计
  Object.keys(sessionKeys).forEach(key => {
    const v = parseInt(localStorage.getItem(sessionKeys[key]), 10);
    sessionCounts[key] = Number.isFinite(v) ? v : 0;
  });

  const isStopEnabled = () => localStorage.getItem(storageKeys.stopEnabled) === '1';
  const setStopEnabled = (v) => localStorage.setItem(storageKeys.stopEnabled, v ? '1' : '0');
  const isAutoRun = () => localStorage.getItem(storageKeys.autoRun) === '1';
  const setAutoRun = (v) => localStorage.setItem(storageKeys.autoRun, v ? '1' : '0');
  const getLastResult = () => localStorage.getItem(storageKeys.lastResult) || '-';
  const setLastResult = (v) => localStorage.setItem(storageKeys.lastResult, v);

  // 新增：重置本次统计
  const resetSessionCounts = () => {
    Object.keys(sessionKeys).forEach(key => {
        sessionCounts[key] = 0;
        localStorage.setItem(sessionKeys[key], 0);
    });
    syncPanel();
  };

  const loadStopRanks = () => {
    const raw = localStorage.getItem(storageKeys.stopRanks) || '';
    return raw.split(',').map(s => s.trim()).filter(s => allRanks.includes(s));
  };
  let stopAfterRanks = loadStopRanks();
  let lastResult = getLastResult();

  // ----- UI -----
  const panel = document.createElement('div');
  panel.id = 'wof-hud';
  panel.style.cssText = [
    'position:fixed', 'top:12px', 'right:12px', 'background:#0b1727', 'color:#e8f0ff',
    'padding:12px 14px', 'border-radius:10px', 'box-shadow:0 6px 22px rgba(0,0,0,0.35)',
    'font:13px/1.5 "Segoe UI",sans-serif', 'z-index:9999999', 'min-width:240px', 'pointer-events:auto',
  ].join(';');
  panel.innerHTML = `
    <div style="font-weight:700;margin-bottom:6px;display:flex;justify-content:space-between;">
        <span>🎰 抽奖助手 v0.7</span>
        <span id="wof-reset-session-btn" style="color:#f5a524;cursor:pointer;font-size:11px;">[重置本次]</span>
    </div>
    <div id="wof-last">上次：${lastResult}</div>
    <div id="wof-remaining">剩余：-</div>
    <div id="wof-total" style="border-bottom:1px dashed #2c3a55;padding-bottom:4px;margin-bottom:4px;">
        总抽：${counts.lottery} <span style="color:#7ce7a6;">(本次：${sessionCounts.lottery})</span>
    </div>
    <div style="font-size:12px;opacity:0.8">总奖分布：</div>
    <div id="wof-prizes" style="font-size:12px;margin-bottom:4px;">${counts.w1}/${counts.w2}/${counts.w3}/${counts.w4}/${counts.w5}/${counts.w6}</div>
    <div style="font-size:12px;opacity:0.8;color:#7ce7a6;">本次分布：</div>
    <div id="wof-prizes-session" style="font-size:12px;color:#7ce7a6;">${sessionCounts.w1}/${sessionCounts.w2}/${sessionCounts.w3}/${sessionCounts.w4}/${sessionCounts.w5}/${sessionCounts.w6}</div>

    <div id="wof-status" style="margin-top:6px;color:#9fb3d1;">状态：待机</div>
    <hr style="border:none;border-top:1px solid #2c3a55;margin:8px 0;">
    <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:#c7d3eb;">
      <input id="wof-stop-toggle" type="checkbox" style="accent-color:#7ce7a6;">
      启用停条件（命中下列奖项时停止）
    </label>
    <div id="wof-stop-options" style="display:flex;flex-wrap:wrap;gap:6px 10px;margin-top:6px;"></div>
    <hr style="border:none;border-top:1px solid #2c3a55;margin:8px 0;">
    <div style="display:flex;gap:8px;">
      <button id="wof-start-btn" style="flex:1;padding:6px 8px;border-radius:6px;border:1px solid #2c3a55;background:#12385c;color:#e8f0ff;cursor:pointer;">▶ 开始自动</button>
      <button id="wof-stop-btn" style="flex:1;padding:6px 8px;border-radius:6px;border:1px solid #2c3a55;background:#6b2b2b;color:#e8f0ff;cursor:pointer;">⏹ 停止</button>
    </div>
    <div id="wof-auto-status" style="margin-top:6px;font-size:11px;color:#9fb3d1;"></div>
  `;
  document.body.appendChild(panel);

  const el = {
    last: panel.querySelector('#wof-last'),
    remaining: panel.querySelector('#wof-remaining'),
    total: panel.querySelector('#wof-total'),
    status: panel.querySelector('#wof-status'),
    prizes: panel.querySelector('#wof-prizes'),
    prizesSession: panel.querySelector('#wof-prizes-session'), // 新增
    resetSessionBtn: panel.querySelector('#wof-reset-session-btn'), // 新增
    stopOptions: panel.querySelector('#wof-stop-options'),
    stopToggle: panel.querySelector('#wof-stop-toggle'),
    startBtn: panel.querySelector('#wof-start-btn'),
    stopBtn: panel.querySelector('#wof-stop-btn'),
    autoStatus: panel.querySelector('#wof-auto-status'),
  };

  // 渲染停条件选项
  const renderStopOptions = () => {
    el.stopOptions.innerHTML = allRanks.map(r => `
      <label style="display:flex;align-items:center;gap:4px;font-size:12px;">
        <input type="checkbox" value="${r}" style="accent-color:#7ce7a6;"> ${r}
      </label>
    `).join('');
  };
  const syncStopOptionState = () => {
    const selected = new Set(stopAfterRanks);
    el.stopOptions.querySelectorAll('input[type=checkbox]').forEach(cb => {
      cb.checked = selected.has(cb.value);
    });
  };
  renderStopOptions();
  syncStopOptionState();
  el.stopToggle.checked = isStopEnabled();

  // 更新剩余次数
  const updateRemaining = () => {
    try {
      const b = document.querySelector('b');
      if (b && b.innerText) {
        const match = b.innerText.match(/[\d,]+/);
        if (match) {
          const num = parseInt(match[0].replace(/,/g, ''), 10);
          if (Number.isFinite(num)) {
            el.remaining.textContent = `剩余：${Math.max(0, Math.floor(num / 2000))}`;
            return;
          }
        }
      }
    } catch (e) {}
    el.remaining.textContent = '剩余：-';
  };

  // 同步面板
  const syncPanel = () => {
    el.last.textContent = `上次：${lastResult}`;
    el.total.innerHTML = `总抽：${counts.lottery} <span style="color:#7ce7a6;">(本次：${sessionCounts.lottery})</span>`;
    // 更新总统计显示
    el.prizes.textContent = `${counts.w1}/${counts.w2}/${counts.w3}/${counts.w4}/${counts.w5}/${counts.w6}`;
    // 更新本次统计显示
    el.prizesSession.textContent = `${sessionCounts.w1}/${sessionCounts.w2}/${sessionCounts.w3}/${sessionCounts.w4}/${sessionCounts.w5}/${sessionCounts.w6}`;

    updateRemaining();
    el.autoStatus.textContent = isAutoRun() ? '🟢 自动模式已开启' : '⚪ 自动模式已关闭';
  };

  // 持久化
  const persistCounts = () => {
    // 保存总统计
    Object.entries(storageKeys).forEach(([key, k]) => {
      if (['stopRanks', 'stopEnabled', 'autoRun', 'lastResult'].includes(key)) return;
      localStorage.setItem(k, counts[key]);
    });
    // 保存本次统计
    Object.keys(sessionKeys).forEach(key => {
      localStorage.setItem(sessionKeys[key], sessionCounts[key]);
    });
  };
  const persistStopRanks = () => {
    localStorage.setItem(storageKeys.stopRanks, stopAfterRanks.join(','));
  };

  // 检查是否需要停止
  const checkStop = (message) => {
    if (!isStopEnabled() || stopAfterRanks.length === 0) return false;
    return stopAfterRanks.some(rank => message.startsWith(rank));
  };

  // 事件绑定
  el.resetSessionBtn.addEventListener('click', () => {
      if(confirm('确定要重置本次统计数据吗？')) {
          resetSessionCounts();
      }
  });

  el.startBtn.addEventListener('click', () => {
    setAutoRun(true);
    syncPanel();
    el.status.textContent = '状态：即将点击…';
    el.status.style.color = '#7ce7a6';
    setTimeout(clickWheel, 1000);
  });

  el.stopBtn.addEventListener('click', () => {
    setAutoRun(false);
    syncPanel();
    el.status.textContent = '状态：已停止';
    el.status.style.color = '#f5a524';
  });

  el.stopToggle.addEventListener('change', () => setStopEnabled(el.stopToggle.checked));
  el.stopOptions.addEventListener('change', () => {
    stopAfterRanks = Array.from(el.stopOptions.querySelectorAll('input:checked')).map(cb => cb.value);
    persistStopRanks();
  });

  // 劫持 alert
  window.alert = function (message) {
    counts.lottery += 1;
    sessionCounts.lottery += 1;

    if (message.startsWith('一等奖')) { counts.w1 += 1; sessionCounts.w1 += 1; }
    else if (message.startsWith('二等奖')) { counts.w2 += 1; sessionCounts.w2 += 1; }
    else if (message.startsWith('三等奖')) { counts.w3 += 1; sessionCounts.w3 += 1; }
    else if (message.startsWith('四等奖')) { counts.w4 += 1; sessionCounts.w4 += 1; }
    else if (message.startsWith('五等奖')) { counts.w5 += 1; sessionCounts.w5 += 1; }
    else if (message.startsWith('六等奖')) { counts.w6 += 1; sessionCounts.w6 += 1; }

    lastResult = message;
    setLastResult(message);
    persistCounts();
    syncPanel();

    console.log(`[抽奖] 第${counts.lottery}次: ${message}`);

    // 检查是否命中停止条件
    if (checkStop(message)) {
      setAutoRun(false);
      el.status.textContent = `状态：命中停条件`;
      el.status.style.color = '#f5a524';
      syncPanel();
      console.log('[抽奖] 命中停条件，已停止自动');
    }
    // 页面会自动跳转，不需要手动处理
  };

  // 点击转盘
  const clickWheel = () => {
    if (!isAutoRun()) {
      el.status.textContent = '状态：已停止';
      return;
    }
    const btn = document.querySelector('#inner');
    if (btn) {
      el.status.textContent = '状态：点击转盘…';
      el.status.style.color = '#7ce7a6';
      btn.click();
    } else {
      el.status.textContent = '状态：未找到转盘按钮';
      el.status.style.color = '#f5a524';
    }
  };

  // 初始化
  const isWof = /pterclub\.net\/(wof|dowof)\.php/.test(location.href);
  if (isWof) {
    syncPanel();

    // 如果自动模式开启，延迟后自动点击
    if (isAutoRun()) {
      el.status.textContent = `状态：${clickDelayMs/1000}秒后自动点击…`;
      el.status.style.color = '#7ce7a6';
      setTimeout(() => {
        if (isAutoRun()) {
          clickWheel();
        }
      }, clickDelayMs);
    } else {
      el.status.textContent = '状态：点击"开始自动"启动';
    }
  } else {
    el.status.textContent = '状态：非抽奖页';
    el.status.style.color = '#9fb3d1';
  }
})();

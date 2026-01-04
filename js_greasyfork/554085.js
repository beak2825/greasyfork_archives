// ==UserScript==
// @name         PopMart 智能監控懸浮窗
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  監控PopMart產品頁面數據並提供定時支付功能（穩定的最小化/還原、拖拽避開按鈕、按鈕樣式可還原）
// @author       Your Name
// @match        https://www.popmart.com/mo/*
// @match        https://m.popmart.com/mo/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554085/PopMart%20%E6%99%BA%E8%83%BD%E7%9B%A3%E6%8E%A7%E6%87%B8%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/554085/PopMart%20%E6%99%BA%E8%83%BD%E7%9B%A3%E6%8E%A7%E6%87%B8%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 全局變量
  let monitoringInterval = null;
  let lastProcessedUrl = '';
  let processedUrls = new Set();
  let timerInterval = null;
  let targetTime = null;
  let isTimerRunning = false;
  let isWindowMinimized = false;
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  // 創建懸浮窗
  function createFloatingWindow() {
    // 移除已存在的懸浮窗
    const existingWindow = document.getElementById('popmart-monitor-window');
    if (existingWindow) existingWindow.remove();

    const floatingWindow = document.createElement('div');
    floatingWindow.id = 'popmart-monitor-window';

    const isMobile = window.innerWidth <= 768;
    const windowWidth = isMobile ? 300 : 350;

    floatingWindow.style.cssText = `
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: ${windowWidth}px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: grab;
      user-select: none;
    `;

    const header = createHeader();
    const content = createContent();
    floatingWindow.appendChild(header);
    floatingWindow.appendChild(content);
    document.body.appendChild(floatingWindow);

    setupDragAndDrop(floatingWindow, header);
    setupEventListeners(floatingWindow);  // 事件綁定在懸浮窗內（委派）
    updateWindowContent();

    // 恢復最小化狀態
    const savedState = localStorage.getItem('popmartWindowMinimized');
    if (savedState === 'true') {
      setTimeout(() => {
        isWindowMinimized = true;
        minimizeWindow();
      }, 100);
    }

    // 支援視窗縮放
    window.addEventListener('resize', handleResize);

    console.log('PopMart 懸浮窗已創建');
  }

  function createHeader() {
    const header = document.createElement('div');
    header.id = 'popmart-header';
    header.style.cssText = `
      background: linear-gradient(135deg, #d8bfd8 0%, #dda0dd 100%);
      color: #6a11cb;
      padding: 12px 15px;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      transition: all 0.3s ease;
      user-select: none;
      -webkit-user-select: none;
    `;

    header.innerHTML = `
      <span id="window-title">PopMart Link</span>
      <div>
        <button id="popmart-minimize" style="background:none;border:none;color:#6a11cb;font-size:16px;cursor:pointer;margin-right:10px;transition:all 0.3s ease;min-width:30px;min-height:30px;display:flex;align-items:center;justify-content:center;">−</button>
        <button id="popmart-close" style="background:none;border:none;color:#6a11cb;font-size:16px;cursor:pointer;transition:all 0.3s ease;min-width:30px;min-height:30px;display:flex;align-items:center;justify-content:center;">×</button>
      </div>
    `;

    return header;
  }

  function createContent() {
    const content = document.createElement('div');
    content.id = 'popmart-content';
    content.style.cssText = `
      padding: 15px;
      max-height: 400px;
      overflow-y: auto;
      transition: all 0.3s ease;
    `;

    content.innerHTML = `
      <div id="product-page-content" style="display: none;">
        <div style="margin-bottom: 15px;">
          <div style="font-weight: 600; color: #9370db; margin-bottom: 5px;">content_name</div>
          <div id="content-name" style="font-family: monospace; font-size: 14px; background: #f8f9fa; padding: 8px; border-radius: 5px; margin-bottom: 10px; word-break: break-all;">waiting...</div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="font-weight: 600; color: #9370db; margin-bottom: 5px;">value</div>
          <div id="content-value" style="font-family: monospace; font-size: 14px; background: #f8f9fa; padding: 8px; border-radius: 5px; margin-bottom: 15px; word-break: break-all;">waiting...</div>
          <div style="display: flex; gap: 10px;">
            <button id="popmart-get" style="background:#9370db;color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;font-size:14px;flex:1;min-height:36px;">GET</button>
            <button id="popmart-copy" style="background:#9370db;color:white;border:none;padding:8px 15px;border-radius:5px;cursor:pointer;font-size:14px;flex:1;min-height:36px;">BP Link</button>
          </div>
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 15px;">
          Monitoring Status: <span id="monitor-status">等待頁面加載...</span>
        </div>
      </div>

      <div id="timer-page-content" style="display: none;">
        <div style="margin-bottom: 15px;">
          <div style="font-weight: 600; color: #9370db; margin-bottom: 10px;">目標時間 (北京時間)</div>
          <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between;">
            <div style="flex: 1;"><div style="font-size:12px;color:#666;margin-bottom:5px;">時</div><select id="target-hour" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;background:white;min-height:36px;">${generateHourOptions()}</select></div>
            <div style="font-size:18px;color:#9370db;">:</div>
            <div style="flex: 1;"><div style="font-size:12px;color:#666;margin-bottom:5px;">分</div><select id="target-minute" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;background:white;min-height:36px;">${generateMinuteOptions()}</select></div>
            <div style="font-size:18px;color:#9370db;">:</div>
            <div style="flex: 1;"><div style="font-size:12px;color:#666;margin-bottom:5px;">秒</div><select id="target-second" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:5px;background:white;min-height:36px;">${generateSecondOptions()}</select></div>
          </div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="font-weight: 600; color: #9370db; margin-bottom: 5px;">剩餘時間</div>
          <div id="countdown-display" style="font-family:monospace;font-size:18px;font-weight:bold;color:#9370db;text-align:center;padding:10px;background:#f8f9fa;border-radius:5px;">--:--:--</div>
        </div>
        <div style="margin-bottom: 15px;">
          <div style="font-weight: 600; color: #9370db; margin-bottom: 5px;">當前狀態</div>
          <div id="timer-status" style="font-size:14px;padding:8px;background:#f8f9fa;border-radius:5px;text-align:center;">等待開始</div>
        </div>
        <div style="display: flex; gap: 10px;">
          <button id="timer-start" style="background:#9370db;color:white;border:none;padding:10px;border-radius:5px;cursor:pointer;font-size:14px;flex:1;transition:all 0.3s ease;min-height:40px;">START</button>
          <button id="timer-end" style="background:#cccccc;color:#666;border:none;padding:10px;border-radius:5px;cursor:not-allowed;font-size:14px;flex:1;transition:all 0.3s ease;min-height:40px;" disabled>END</button>
        </div>
        <div id="button-status" style="font-size:12px;color:#666;margin-top:10px;text-align:center;"></div>
      </div>
    `;

    return content;
  }

  // 事件監聽：採用事件委派，避免 innerHTML 替換造成監聽丟失
  function setupEventListeners(floatingWindow) {
    floatingWindow.addEventListener('click', function(e) {
      const t = e.target;

      if (t.closest('#popmart-minimize')) {
        e.stopPropagation();
        minimizeWindow();
        return;
      }
      if (t.closest('#popmart-close')) {
        e.stopPropagation();
        const w = document.getElementById('popmart-monitor-window');
        w.style.transition = 'all 0.3s ease';
        w.style.transform = 'scale(0.8)';
        w.style.opacity = '0';
        setTimeout(() => w.remove(), 300);
        return;
      }
      if (t.closest('#popmart-expand')) {
        e.stopPropagation();
        maximizeWindow();
        return;
      }
      if (t.closest('#popmart-close-minimized')) {
        e.stopPropagation();
        document.getElementById('popmart-monitor-window').remove();
        return;
      }
      if (t.closest('#popmart-get')) {
        e.stopPropagation();
        checkNetworkRequests();
        return;
      }
      if (t.closest('#popmart-copy')) {
        e.stopPropagation();
        copyBPLink();
        return;
      }
      if (t.closest('#timer-start')) {
        e.stopPropagation();
        startTimer();
        return;
      }
      if (t.closest('#timer-end')) {
        e.stopPropagation();
        endTimer();
        return;
      }
    });
  }

  // 拖拽：避免拖拽攔截按鈕點擊
  function setupDragAndDrop(floatingWindow, header) {
    const startDrag = function(e) {
      if (isWindowMinimized) return;

      // 若點擊在 header 內的任何控制按鈕，直接退出，不啟動拖拽
      const target = e.type.includes('touch') ? e.touches[0].target : e.target;
      if (
        target.closest('#popmart-minimize') ||
        target.closest('#popmart-close') ||
        target.closest('#popmart-expand') ||
        target.closest('#popmart-close-minimized')
      ) {
        return;
      }

      isDragging = true;
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

      const rect = floatingWindow.getBoundingClientRect();
      dragOffset.x = clientX - rect.left;
      dragOffset.y = clientY - rect.top;

      floatingWindow.style.cursor = 'grabbing';
      floatingWindow.style.transition = 'none';
      e.preventDefault();
    };

    const doDrag = function(e) {
      if (!isDragging) return;
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

      let x = clientX - dragOffset.x;
      let y = clientY - dragOffset.y;

      const maxX = window.innerWidth - floatingWindow.offsetWidth;
      const maxY = window.innerHeight - floatingWindow.offsetHeight;

      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      floatingWindow.style.left = x + 'px';
      floatingWindow.style.top = y + 'px';
      floatingWindow.style.right = 'unset';
      floatingWindow.style.bottom = 'unset';
      floatingWindow.style.transform = 'none';

      if (e.type.includes('touch')) e.preventDefault();
    };

    const stopDrag = function() {
      if (!isDragging) return;
      isDragging = false;
      floatingWindow.style.cursor = 'grab';
      floatingWindow.style.transition = 'all 0.3s ease';
    };

    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    header.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', doDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
  }

  // 最小化
  function minimizeWindow() {
    const floatingWindow = document.getElementById('popmart-monitor-window');
    const header = document.getElementById('popmart-header');
    const content = document.getElementById('popmart-content');

    if (!floatingWindow || !header || !content) return;

    const isMobile = window.innerWidth <= 768;
    const w = isMobile ? 50 : 60;
    const h = isMobile ? 35 : 40;
    const fs = isMobile ? '14px' : '16px';
    const dim = isMobile ? '20px' : '25px';

    floatingWindow.style.width = w + 'px';
    floatingWindow.style.height = h + 'px';
    content.style.display = 'none';
    header.style.padding = '4px 6px';
    header.style.justifyContent = 'space-between';

    header.innerHTML = `
      <button id="popmart-expand" style="background:none;border:none;color:#6a11cb;font-size:${fs};cursor:pointer;margin:0;transition:all 0.3s ease;min-width:${dim};min-height:${dim};display:flex;align-items:center;justify-content:center;">+</button>
      <button id="popmart-close-minimized" style="background:none;border:none;color:#6a11cb;font-size:${fs};cursor:pointer;margin:0;transition:all 0.3s ease;min-width:${dim};min-height:${dim};display:flex;align-items:center;justify-content:center;">×</button>
    `;

    isWindowMinimized = true;
    localStorage.setItem('popmartWindowMinimized', 'true');
    console.log('已最小化');
  }

  // 最大化
  function maximizeWindow() {
    const floatingWindow = document.getElementById('popmart-monitor-window');
    const content = document.getElementById('popmart-content');
    const header = document.getElementById('popmart-header');

    if (!floatingWindow || !content || !header) return;

    const isMobile = window.innerWidth <= 768;
    const width = isMobile ? 300 : 350;

    floatingWindow.style.width = width + 'px';
    floatingWindow.style.height = 'auto';
    floatingWindow.style.transform = 'none'; // 讓位置不受初始 translateY 影響
    content.style.display = 'block';
    header.style.padding = '12px 15px';
    header.style.justifyContent = 'space-between';

    header.innerHTML = `
      <span id="window-title">${getWindowTitle()}</span>
      <div>
        <button id="popmart-minimize" style="background:none;border:none;color:#6a11cb;font-size:16px;cursor:pointer;margin-right:10px;transition:all 0.3s ease;min-width:30px;min-height:30px;display:flex;align-items:center;justify-content:center;">−</button>
        <button id="popmart-close" style="background:none;border:none;color:#6a11cb;font-size:16px;cursor:pointer;transition:all 0.3s ease;min-width:30px;min-height:30px;display:flex;align-items:center;justify-content:center;">×</button>
      </div>
    `;

    isWindowMinimized = false;
    localStorage.setItem('popmartWindowMinimized', 'false');
    updateWindowContent();
    console.log('已最大化');
  }

  function handleResize() {
    const floatingWindow = document.getElementById('popmart-monitor-window');
    if (!floatingWindow) return;

    const isMobile = window.innerWidth <= 768;
    const newWidth = isMobile ? 300 : 350;

    if (isWindowMinimized) {
      minimizeWindow();
    } else {
      floatingWindow.style.width = newWidth + 'px';
    }

    const rect = floatingWindow.getBoundingClientRect();
    let x = rect.left, y = rect.top;
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    if (floatingWindow.style.left) {
      floatingWindow.style.left = x + 'px';
      floatingWindow.style.top = y + 'px';
    }
  }

  function getWindowTitle() {
    return window.location.href.includes('order-confirmation') ? 'PopMart Timer' : 'PopMart Link';
  }

  function generateHourOptions() { let o=''; for(let i=0;i<24;i++) o+=`<option value="${i.toString().padStart(2,'0')}">${i.toString().padStart(2,'0')}</option>`; return o; }
  function generateMinuteOptions() { let o=''; for(let i=0;i<60;i++) o+=`<option value="${i.toString().padStart(2,'0')}">${i.toString().padStart(2,'0')}</option>`; return o; }
  function generateSecondOptions() { let o=''; for(let i=0;i<60;i++) o+=`<option value="${i.toString().padStart(2,'0')}">${i.toString().padStart(2,'0')}</option>`; return o; }

  function updateWindowContent() {
    const product = document.getElementById('product-page-content');
    const timer = document.getElementById('timer-page-content');
    const title = document.getElementById('window-title');

    if (window.location.href.includes('order-confirmation')) {
      product.style.display = 'none';
      timer.style.display = 'block';
      if (title) title.textContent = 'PopMart Timer';
    } else {
      product.style.display = 'block';
      timer.style.display = 'none';
      if (title) title.textContent = 'PopMart Link';
    }
  }

  function copyBPLink() {
    const ids = document.getElementById('content-ids')?.textContent || '';
    const name = document.getElementById('content-name').textContent;
    const parts = window.location.pathname.split('/');
    const pid = parts.find(p => /^\d+$/.test(p)) || '';
    let title = name;
    const idx = title.lastIndexOf('20-%20');
    if (idx !== -1) title = title.substring(0, idx);
    const url = `https://m.popmart.com/mo/order-confirmation?spuId=${pid}&skuId=${ids}&count=1&spuTitle=${encodeURIComponent(title)}`;
    navigator.clipboard.writeText(url).then(() => alert('已複製！')).catch(() => prompt('手動複製:', url));
  }

  function startTimer() {
    const h = document.getElementById('target-hour').value;
    const m = document.getElementById('target-minute').value;
    const s = document.getElementById('target-second').value;
    targetTime = new Date(); targetTime.setHours(+h); targetTime.setMinutes(+m); targetTime.setSeconds(+s);
    if (targetTime <= new Date()) targetTime.setDate(targetTime.getDate() + 1);

    ['target-hour','target-minute','target-second'].forEach(id => document.getElementById(id).disabled = true);
    const startBtn = document.getElementById('timer-start');
    startBtn.disabled = true; startBtn.style.background = '#ccc'; startBtn.style.color = '#666'; startBtn.style.cursor = 'not-allowed';
    const endBtn = document.getElementById('timer-end');
    endBtn.disabled = false; endBtn.style.background = '#9370db'; endBtn.style.color = 'white'; endBtn.style.cursor = 'pointer';

    isTimerRunning = true;
    markPaymentButton();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
    saveTimerState();
  }

  function endTimer() {
    isTimerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    ['target-hour','target-minute','target-second'].forEach(id => document.getElementById(id).disabled = false);
    const startBtn = document.getElementById('timer-start');
    startBtn.disabled = false; startBtn.style.background = '#9370db'; startBtn.style.color = 'white'; startBtn.style.cursor = 'pointer';
    const endBtn = document.getElementById('timer-end');
    endBtn.disabled = true; endBtn.style.background = '#ccc'; endBtn.style.color = '#666'; endBtn.style.cursor = 'not-allowed';
    document.getElementById('timer-status').textContent = '已停止';
    document.getElementById('countdown-display').textContent = '--:--:--';
    document.getElementById('button-status').textContent = '';
    unmarkPaymentButton();
    localStorage.removeItem('popmartTimerState');
  }

  function updateTimer() {
    if (!targetTime || !isTimerRunning) return;
    const diff = targetTime - new Date();
    if (diff <= 0) { clickPaymentButton(); endTimer(); return; }
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    document.getElementById('countdown-display').textContent = `${h}:${m}:${s}`;
    document.getElementById('timer-status').textContent = '運行中...';
    document.getElementById('button-status').textContent = `目標: ${targetTime.toLocaleTimeString()}`;
  }

  function findPaymentButton() {
    const selectors = [
      '.ant-btn.ant-btn-primary.ant-btn-dangerous.index_placeOrderBtn__E2dbt',
      'button[class*="placeOrder"]', 'button[class*="payment"]', 'button[class*="pay"]',
      'button.ant-btn-primary', 'button[type="submit"]',
      'button[data-testid*="pay"]', 'button[data-testid*="payment"]'
    ];
    for (let sel of selectors) {
      const btn = document.querySelector(sel);
      if (btn) return btn;
    }
    return Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('支付')) || null;
  }

  function markPaymentButton() {
    const btn = findPaymentButton();
    if (btn) {
      // 先保存原樣式，再修改
      const orig = btn.getAttribute('style') || '';
      btn.setAttribute('data-original-style', orig);
      btn.style.background = '#9370db';
      btn.style.borderColor = '#9370db';
    }
  }

  function unmarkPaymentButton() {
    const btn = findPaymentButton();
    if (btn && btn.hasAttribute('data-original-style')) {
      btn.setAttribute('style', btn.getAttribute('data-original-style'));
      btn.removeAttribute('data-original-style');
    }
  }

  function clickPaymentButton() {
    const btn = findPaymentButton();
    if (btn) {
      btn.click();
      const s = document.getElementById('timer-status');
      const b = document.getElementById('button-status');
      if (s) s.textContent = '已點擊';
      if (b) b.textContent = '支付按鈕已觸發';
    } else {
      document.getElementById('timer-status').textContent = '未找到支付按鈕';
    }
  }

  function saveTimerState() {
    const state = {
      targetTime: targetTime?.getTime(),
      isRunning: isTimerRunning,
      hour: document.getElementById('target-hour')?.value,
      minute: document.getElementById('target-minute')?.value,
      second: document.getElementById('target-second')?.value
    };
    localStorage.setItem('popmartTimerState', JSON.stringify(state));
  }

  function loadTimerState() {
    const saved = localStorage.getItem('popmartTimerState');
    if (!saved) return;
    const state = JSON.parse(saved);
    if (!state.targetTime) return;
    targetTime = new Date(state.targetTime);
    if (state.hour) {
      const el = document.getElementById('target-hour'); if (el) el.value = state.hour;
    }
    if (state.minute) {
      const el = document.getElementById('target-minute'); if (el) el.value = state.minute;
    }
    if (state.second) {
      const el = document.getElementById('target-second'); if (el) el.value = state.second;
    }
    if (state.isRunning) {
      // 重新開始計時
      startTimer();
    }
  }

  function parseUrlParams(url) {
    const params = {};
    try {
      const u = new URL(url);
      for (const [k, v] of u.searchParams) {
        params[k] = v;
        if (k.startsWith('cd[') && k.endsWith(']')) {
          params[k.slice(3, -1)] = v;
        }
      }
    } catch (e) { console.error(e); }
    return params;
  }

  function processNetworkData(data, url) {
    if (processedUrls.has(url)) return;
    processedUrls.add(url);

    const ids = data.content_ids || '未找到';
    let name = data.content_name ? decodeURIComponent(data.content_name) : '未找到';
    const value = data.value || '未找到';
    if (name.includes('20-%20')) name = name.split('20-%20')[0];

    const nameEl = document.getElementById('content-name');
    const valEl = document.getElementById('content-value');
    if (nameEl) nameEl.textContent = name;
    if (valEl) valEl.textContent = value;

    let idsEl = document.getElementById('content-ids');
    if (!idsEl) {
      idsEl = document.createElement('div');
      idsEl.id = 'content-ids';
      idsEl.style.display = 'none';
      document.body.appendChild(idsEl);
    }
    idsEl.textContent = ids;

    const status = document.getElementById('monitor-status');
    if (status) status.textContent = '數據已更新: ' + new Date().toLocaleTimeString();
  }

  function checkNetworkRequests() {
    if (!window.location.href.includes('/products/')) return;
    const resources = performance.getEntriesByType('resource');
    const fb = resources
      .filter(r => r.name.includes('facebook.com/tr') && r.name.includes('ev=ViewContent'))
      .sort((a, b) => b.responseEnd - a.responseEnd)
      .slice(0, 3);

    const status = document.getElementById('monitor-status');
    if (fb.length > 0) {
      if (status) status.textContent = `檢測到${fb.length}個請求`;
      for (const r of fb) {
        processNetworkData(parseUrlParams(r.name), r.name);
        break;
      }
    } else {
      if (status) status.textContent = '監控中 - ' + new Date().toLocaleTimeString();
    }
    if (processedUrls.size > 100) processedUrls.clear();
  }

  // 初始化
  function init() {
    createFloatingWindow();
    loadTimerState();
    console.log('PopMart 智能監控懸浮窗已啟動 v1.5.0');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 單頁應用路由變化監控
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      lastProcessedUrl = '';
      processedUrls.clear();
      setTimeout(updateWindowContent, 500);
    }
  }).observe(document, { subtree: true, childList: true });
})();

// ==UserScript==
// @name         iOS 风格时钟 (手动检测节点版)
// @namespace    https://your.domain.example
// @version      2.4.0
// @description  默认不请求，点击地球图标手动检测 IP 地区。帮助验证 Clash 流量出口。
// @match        http://*/*
// @match        https://*/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558610/iOS%20%E9%A3%8E%E6%A0%BC%E6%97%B6%E9%92%9F%20%28%E6%89%8B%E5%8A%A8%E6%A3%80%E6%B5%8B%E8%8A%82%E7%82%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558610/iOS%20%E9%A3%8E%E6%A0%BC%E6%97%B6%E9%92%9F%20%28%E6%89%8B%E5%8A%A8%E6%A3%80%E6%B5%8B%E8%8A%82%E7%82%B9%E7%89%88%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---- 1. 配置与初始化 ----
  const CONFIG_KEY = 'ios_clock_config_v2_4';

  let config = {
    opacity: 0.15,
    blur: 10,
    x: '20px',
    y: '20px'
  };

  const saved = localStorage.getItem(CONFIG_KEY);
  if (saved) {
    try { config = { ...config, ...JSON.parse(saved) }; } catch(e) {}
  }

  function saveConfig() {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  // ---- 2. 样式定义 ----
  GM_addStyle(`
    :root {
      --glass-opacity: ${config.opacity};
      --glass-blur: ${config.blur}px;
      --clock-bg-rgb: 255, 255, 255;
      --clock-text: #000;
      --clock-border: rgba(255,255,255, 0.3);
    }

    .ios-clock-widget {
      position: fixed;
      top: ${config.y};
      left: ${config.x};
      right: auto !important;
      bottom: auto !important;
      min-width: 130px;
      padding: 10px 14px;
      border-radius: 18px;
      z-index: 2147483647;

      background: rgba(var(--clock-bg-rgb), var(--glass-opacity));
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      color: var(--clock-text);
      border: 1px solid var(--clock-border);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);

      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;
      text-align: center;
      user-select: none;
      cursor: grab;
      transition: color 0.3s ease, background-color 0.3s ease, transform 0.1s;
    }

    .ios-clock-widget:active { transform: scale(0.98); }

    .ios-clock-widget .time-row {
      display: flex;
      justify-content: center;
      align-items: baseline;
      gap: 4px;
      line-height: 1;
    }

    .time-hm {
      font-size: 26px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .time-s {
      font-size: 16px;
      font-weight: 500;
      opacity: 0.8;
      font-variant-numeric: tabular-nums;
      min-width: 20px;
      text-align: left;
    }

    .ios-clock-widget .info-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 5px;
      font-size: 11px;
      opacity: 0.75;
      font-weight: 500;
      text-transform: uppercase;
    }

    /* 地区检测按钮/徽章 */
    .region-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      background: rgba(125,125,125,0.15);
      padding: 2px 6px;
      border-radius: 4px;
      line-height: 1;
      height: 18px;
      min-width: 24px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .region-btn:hover {
      background: rgba(125,125,125,0.3);
    }
    .region-btn:active {
      opacity: 0.6;
    }

    .flag-img {
      width: 14px;
      height: auto;
      border-radius: 2px;
      display: block;
    }

    /* 旋转动画 (加载时) */
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .loading-icon {
      display: inline-block;
      width: 10px;
      height: 10px;
      border: 2px solid rgba(127,127,127,0.5);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    /* 设置面板 (保持简洁) */
    .ios-clock-settings {
      position: fixed;
      width: 200px;
      background: rgba(30, 30, 30, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 15px;
      border-radius: 12px;
      color: #fff;
      font-size: 12px;
      z-index: 2147483647;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      opacity: 0;
      pointer-events: none;
      transform: scale(0.9);
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .ios-clock-settings.show { opacity: 1; pointer-events: auto; transform: scale(1); }
    .ios-clock-settings input[type=range] { width: 100%; height: 4px; border-radius: 2px; background: #555; outline: none; -webkit-appearance: none; }
    .ios-clock-settings input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border-radius: 50%; cursor: pointer; }
  `);

  // ---- 3. DOM 创建 ----
  const clock = document.createElement('div');
  clock.className = 'ios-clock-widget';
  clock.title = "双击: 切换颜色 | 拖拽: 移动 | 右键: 设置";
  clock.innerHTML = `
    <div class="time-row">
        <span class="time-hm">00:00</span>
        <span class="time-s">00</span>
    </div>
    <div class="info-row">
        <span class="date-text">LOADING</span>
        <span class="region-btn" id="region-trigger" title="点击检测当前 IP 节点地区">
            🌍
        </span>
    </div>
  `;
  document.body.appendChild(clock);

  clock.style.left = config.x;
  clock.style.top = config.y;

  const settings = document.createElement('div');
  settings.className = 'ios-clock-settings';
  settings.innerHTML = `
    <div style="font-weight:bold;text-align:center;margin-bottom:5px">时钟设置</div>
    <div><label>透明度 <span id="val-opacity">${config.opacity}</span></label><input type="range" id="range-opacity" min="0.05" max="0.9" step="0.05" value="${config.opacity}"></div>
    <div><label>磨砂度 <span id="val-blur">${config.blur}px</span></label><input type="range" id="range-blur" min="0" max="30" step="1" value="${config.blur}"></div>
  `;
  document.body.appendChild(settings);

  // 引用
  const hmEl = clock.querySelector('.time-hm');
  const sEl = clock.querySelector('.time-s');
  const dateEl = clock.querySelector('.date-text');
  const regionBtn = clock.querySelector('#region-trigger');

  // ---- 4. 核心逻辑 ----

  let isManualMode = false;
  let currentTheme = 'light';
  let isCheckingIP = false; // 防止重复点击

  // 4.1 主题与自动背景
  function applyTheme(type) {
    if (type === 'dark-frosted') {
        clock.style.setProperty('--clock-bg-rgb', '30, 30, 30');
        clock.style.setProperty('--clock-text', '#fff');
        clock.style.setProperty('--clock-border', 'rgba(255,255,255,0.1)');
        currentTheme = 'dark-frosted';
    } else {
        clock.style.setProperty('--clock-bg-rgb', '255, 255, 255');
        clock.style.setProperty('--clock-text', '#000');
        clock.style.setProperty('--clock-border', 'rgba(255,255,255,0.3)');
        currentTheme = 'light-frosted';
    }
  }

  function autoDetectBackground() {
    if (isManualMode) return;
    const prevDisplay = clock.style.display;
    clock.style.display = 'none';
    const rect = clock.getBoundingClientRect();
    const el = document.elementFromPoint(rect.left + rect.width/2, rect.top + rect.height/2);
    clock.style.display = prevDisplay;
    if (!el) return;

    let bgColor = null, depth = 0, curr = el;
    while(curr && depth < 5) {
        const bg = window.getComputedStyle(curr).backgroundColor;
        if(bg && !bg.includes('rgba(0, 0, 0, 0)') && bg!=='transparent') { bgColor = bg; break; }
        curr = curr.parentElement;
        depth++;
    }

    let isLightBg = true;
    if (bgColor) {
        const rgb = bgColor.match(/\d+/g);
        if(rgb) {
            const yiq = ((parseInt(rgb[0])*299)+(parseInt(rgb[1])*587)+(parseInt(rgb[2])*114))/1000;
            isLightBg = yiq >= 128;
        }
    }

    if (isLightBg && currentTheme !== 'dark-frosted') applyTheme('dark-frosted');
    else if (!isLightBg && currentTheme !== 'light-frosted') applyTheme('light-frosted');
  }

  // 4.2 手动节点检测 (核心修改)
  function checkRegion(e) {
    if(e) e.stopPropagation(); // 防止冒泡触发其他逻辑
    if (isCheckingIP) return;

    isCheckingIP = true;
    regionBtn.innerHTML = `<span class="loading-icon"></span>`; // 显示加载转圈

    // 使用 ipwho.is，它通常会被 Clash 代理规则捕获
    // 如果你在 Clash 中设置 ipwho.is 走代理，这里显示的就是代理 IP
    // 如果 ipwho.is 走直连，显示的就是直连 IP
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://ipwho.is/",
      timeout: 5000,
      onload: function(response) {
        isCheckingIP = false;
        try {
          const data = JSON.parse(response.responseText);
          if (data.success) {
            const code = data.country_code.toLowerCase();
            const flagUrl = `https://flagcdn.com/w20/${code}.png`;
            // 更新 UI：国旗 + 代码
            regionBtn.innerHTML = `
                <img src="${flagUrl}" class="flag-img" alt="${data.country_code}">
                <span>${data.country_code}</span>
            `;
            regionBtn.title = `IP: ${data.ip}\n地区: ${data.city}, ${data.country}\n点击可重新检测`;
          } else {
            regionBtn.textContent = "Err";
            regionBtn.title = "检测失败，点击重试";
          }
        } catch (e) {
          regionBtn.textContent = "Err";
        }
      },
      onerror: function() {
        isCheckingIP = false;
        regionBtn.textContent = "超时";
        regionBtn.title = "网络超时，点击重试";
      },
      ontimeout: function() {
        isCheckingIP = false;
        regionBtn.textContent = "超时";
      }
    });
  }

  // 绑定点击事件到按钮
  regionBtn.addEventListener('click', checkRegion);

  // ---- 5. 基础功能 ----
  function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    hmEl.textContent = `${h}:${m}`;
    sEl.textContent = s;

    if (now.getSeconds() === 0) {
        dateEl.textContent = now.toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'});
    }

    if (!isManualMode && now.getSeconds() % 1 === 0) autoDetectBackground();
  }
  setInterval(updateTime, 1000);
  updateTime();
  dateEl.textContent = new Date().toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'});

  // ---- 6. 交互事件 (拖拽/双击) ----
  let isDragging = false, hasMoved = false;
  let startX, startY, startL, startT;

  clock.addEventListener('pointerdown', e => {
    // 如果点击的是地区按钮，不触发拖拽
    if (regionBtn.contains(e.target)) return;
    if (e.button !== 0) return;

    isDragging = true;
    hasMoved = false;
    clock.style.cursor = 'grabbing';
    startX = e.clientX;
    startY = e.clientY;
    const rect = clock.getBoundingClientRect();
    startL = rect.left;
    startT = rect.top;
    clock.setPointerCapture(e.pointerId);
  });

  clock.addEventListener('pointermove', e => {
    if (!isDragging) return;
    if (Math.abs(e.clientX - startX) > 2 || Math.abs(e.clientY - startY) > 2) hasMoved = true;
    clock.style.left = (startL + e.clientX - startX) + 'px';
    clock.style.top = (startT + e.clientY - startY) + 'px';
    settings.classList.remove('show');
  });

  clock.addEventListener('pointerup', e => {
    isDragging = false;
    clock.style.cursor = 'grab';
    clock.releasePointerCapture(e.pointerId);
    config.x = clock.style.left;
    config.y = clock.style.top;
    saveConfig();
    if (hasMoved) {
        isManualMode = false;
        setTimeout(autoDetectBackground, 50);
    }
  });

  clock.addEventListener('dblclick', (e) => {
    if (regionBtn.contains(e.target)) return; // 避免双击按钮时触发颜色切换
    e.preventDefault();
    isManualMode = true;
    applyTheme(currentTheme === 'dark-frosted' ? 'light-frosted' : 'dark-frosted');
    clock.style.transform = "scale(0.95)";
    setTimeout(() => clock.style.transform = "scale(1)", 150);
  });

  clock.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const rect = clock.getBoundingClientRect();
    settings.style.top = (rect.bottom + 10) + 'px';
    settings.style.left = rect.left + 'px';
    settings.classList.toggle('show');
  });

  document.addEventListener('pointerdown', (e) => {
    if (!settings.contains(e.target) && !clock.contains(e.target)) settings.classList.remove('show');
  });

  // 设置逻辑
  const opIn = document.getElementById('range-opacity');
  const blIn = document.getElementById('range-blur');
  function updateVisuals() {
    config.opacity = opIn.value;
    config.blur = blIn.value;
    clock.style.setProperty('--glass-opacity', config.opacity);
    clock.style.setProperty('--glass-blur', config.blur + 'px');
    document.getElementById('val-opacity').textContent = config.opacity;
    document.getElementById('val-blur').textContent = config.blur + 'px';
    saveConfig();
  }
  opIn.addEventListener('input', updateVisuals);
  blIn.addEventListener('input', updateVisuals);

})();
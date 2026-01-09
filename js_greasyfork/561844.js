// ==UserScript==
// @name         VNDB Steam 信息助手 (调试版)
// @namespace    https://vndb.org/
// @version      5.7.4
// @description  在 VNDB 页面实时显示 Steam 国区价格、折扣及库存状态
// @author       Your Name
// @match        *://vndb.org/*
// @icon         https://vndb.org/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @connect      api.vndb.org
// @connect      store.steampowered.com
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561844/VNDB%20Steam%20%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B%20%28%E8%B0%83%E8%AF%95%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561844/VNDB%20Steam%20%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B%20%28%E8%B0%83%E8%AF%95%E7%89%88%29.meta.js
// ==/UserScript==
 
(async function() {
  'use strict';
 
  // ========== 调试开关 ==========
  const DEBUG = true;
  function debugLog(...args) {
    if (DEBUG) console.log('[VNDB Steam Debug]', ...args);
  }
  function debugWarn(...args) {
    if (DEBUG) console.warn('[VNDB Steam Debug]', ...args);
  }
  function debugError(...args) {
    if (DEBUG) console.error('[VNDB Steam Debug]', ...args);
  }
  // ==============================
 
  const STORAGE_PREFIX_V = 'vndb_steam_v26_v_';   // v 页面缓存前缀
  const STORAGE_PREFIX_R = 'vndb_steam_v26_r_';   // r 页面缓存前缀
  const STORAGE_PREFIX_STEAM = 'vndb_steam_v26_s_'; // Steam appid 价格缓存
 
  // ========== 缓存时间策略 ==========
  const ONE_HOUR = 60 * 60 * 1000;
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const PERMANENT = 365 * ONE_DAY; // "永久" = 1年
 
  function getCacheDuration(data) {
    if (!data) return ONE_HOUR;
    
    // 限流导致的失败 - 不缓存
    if (data.status === 'rate_limited') return 0;
    
    // 打折中 - 1天
    if (data.status === 'released' && data.discount > 0) return ONE_DAY;
    
    // 其他状态（已拥有、原价、锁区、免费、即将推出、已下架）- 永久
    return PERMANENT;
  }
  // ==================================
 
  // --- 默认配置 ---
  const DEFAULTS = {
    vndbDelay: 5500,
    steamDelay: 1200,
    steamConcurrency: 2
  };
 
  function getSettings() {
    const saved = localStorage.getItem('vndb_steam_settings');
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  }
 
  let SETTINGS = getSettings();
  let OWNED_SET = new Set();
  let IS_STOPPED = false;
  let STATS = { success: 0, fail: 0 };
 
  // --- GM 存储适配层 ---
  const storage = {
    async get(keys) {
      const result = {};
      if (keys === null) {
        // 获取所有
        const allKeys = GM_listValues();
        for (const key of allKeys) {
          try {
            result[key] = JSON.parse(GM_getValue(key, 'null'));
          } catch (e) {
            result[key] = GM_getValue(key, null);
          }
        }
      } else if (Array.isArray(keys)) {
        for (const key of keys) {
          try {
            result[key] = JSON.parse(GM_getValue(key, 'null'));
          } catch (e) {
            result[key] = GM_getValue(key, null);
          }
        }
      }
      return result;
    },
    async set(obj) {
      for (const [key, value] of Object.entries(obj)) {
        GM_setValue(key, JSON.stringify(value));
      }
    },
    async clear() {
      const allKeys = GM_listValues();
      for (const key of allKeys) {
        GM_deleteValue(key);
      }
    }
  };
 
  // --- 网络请求封装 (使用 GM_xmlhttpRequest 实现跨域) ---
  function gmFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || 'GET',
        url: url,
        headers: options.headers || {},
        data: options.body || null,
        responseType: 'json',
        onload: function(response) {
          if (response.status >= 200 && response.status < 300) {
            resolve({
              ok: true,
              status: response.status,
              json: () => Promise.resolve(response.response)
            });
          } else {
            resolve({
              ok: false,
              status: response.status,
              json: () => Promise.resolve(response.response)
            });
          }
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  }
 
  // --- A. 批量查询 VNDB API 获取 Steam ID ---
  async function handleSafeBatchQuery(vnIds) {
    try {
      const resultMap = {};
      const targetIds = vnIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id)).map(id => "v" + id);
      let hitRateLimit = false;
 
      console.log(`[VNDB Steam] 收到查询请求: ${targetIds.length} 个`);
 
      await Promise.all(targetIds.map(async (vid) => {
        if (hitRateLimit) return;
 
        try {
          const response = await gmFetch('https://api.vndb.org/kana/release', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filters: ["vn", "=", ["id", "=", vid]],
              fields: "id, extlinks.url, released",
              results: 100,
              sort: "released",
              reverse: true
            })
          });
 
          if (response.status === 429) {
            hitRateLimit = true;
            console.error("❌ VNDB Rate Limit Hit (429)!");
            return;
          }
 
          if (!response.ok) return;
 
          const data = await response.json();
          const steamIds = new Set();
 
          data.results.forEach(release => {
            if (release.extlinks && Array.isArray(release.extlinks)) {
              release.extlinks.forEach(link => {
                const url = link.url || (typeof link === 'string' ? link : '');
                if (url && url.includes('store.steampowered.com/app/')) {
                  const match = url.match(/app\/(\d+)/);
                  if (match) steamIds.add(match[1]);
                }
              });
            }
          });
 
          if (steamIds.size > 0) {
            const rawId = vid.replace('v', '');
            resultMap[rawId] = Array.from(steamIds);
          }
 
        } catch (err) {
          console.error(`Fetch error for ${vid}`, err);
        }
      }));
 
      if (hitRateLimit) return { success: false, error: 'Throttled' };
      return { success: true, data: resultMap };
 
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
 
  // --- B. 获取 Steam 价格 ---
  async function handleGetPrice(appid) {
    try {
      const res = await gmFetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=CN&l=schinese&filters=price_overview,basic,type,release_date`);
      const data = await res.json();
      return { success: true, data: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
 
  // --- C. 获取已拥有游戏 (利用浏览器 Cookie) ---
  async function handleGetOwnedGames() {
    try {
      const res = await gmFetch('https://store.steampowered.com/dynamicstore/userdata/');
 
      if (!res.ok) {
        return { success: false, error: 'Not logged in or network error' };
      }
 
      const data = await res.json();
 
      if (data && data.rgOwnedApps && Array.isArray(data.rgOwnedApps)) {
        return { success: true, data: data.rgOwnedApps };
      } else {
        return { success: false, error: 'No ownership data found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
 
  // --- UI 组件 ---
  let statusTxT = null;
  let statusContainer = null;
  let progressBar1 = null;  // 阶段1进度条（VNDB API / Release处理）
  let progressBar2 = null;  // 阶段2进度条（Steam 价格获取）
  let progressLabel1 = null; // 阶段1标签
  let progressLabel2 = null; // 阶段2标签
  let settingsPanel = null;
  let currentPageCacheKeys = new Set();
 
  // ========== 注入样式 ==========
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes vndb-steam-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes vndb-steam-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      
      @keyframes vndb-steam-slide {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .vndb-steam-progress-bar {
        position: relative;
        overflow: hidden;
      }
      
      .vndb-steam-progress-bar.active::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255,255,255,0.3) 50%,
          transparent 100%
        );
        animation: vndb-steam-slide 1.5s ease-in-out infinite;
      }
      
      .vndb-steam-status-container {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
      
      .vndb-steam-btn {
        position: relative;
        overflow: hidden;
        transition: all 0.2s ease;
      }
      
      .vndb-steam-btn:hover {
        transform: translateY(-1px);
      }
      
      .vndb-steam-btn:active {
        transform: translateY(0);
      }
      
      .vndb-steam-badge {
        transition: all 0.2s ease;
        position: relative;
      }
      
      .vndb-steam-badge:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      
      .vndb-steam-settings-panel {
        animation: vndb-steam-fadeIn 0.2s ease;
      }
      
      @keyframes vndb-steam-fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .vndb-steam-cooldown-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 2px 8px;
        background: rgba(241, 196, 15, 0.15);
        border-radius: 4px;
        font-size: 11px;
        color: #f1c40f;
      }
      
      .vndb-steam-cooldown-spinner {
        width: 12px;
        height: 12px;
        border: 2px solid rgba(241, 196, 15, 0.3);
        border-top-color: #f1c40f;
        border-radius: 50%;
        animation: vndb-steam-spin 1s linear infinite;
      }
      
      @keyframes vndb-steam-spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
 
  // ========== 进度管理器 ==========
  const ProgressManager = {
    stage1: { current: 0, total: 0, active: false },
    stage2: { current: 0, total: 0, active: false },
    cooldown: { active: false, remaining: 0, total: 0 },
    animationFrame: null,
    lastUpdate: 0,
 
    // 设置阶段1（VNDB API 获取 Steam ID）
    setStage1(current, total) {
      this.stage1 = { current, total, active: total > 0 };
      this.updateUI();
    },
 
    // 设置阶段2（Steam 价格获取）
    setStage2(current, total) {
      this.stage2 = { current, total, active: total > 0 };
      this.updateUI();
    },
 
    // 设置冷却状态
    setCooldown(remaining, total) {
      this.cooldown = { active: remaining > 0, remaining, total };
      this.updateUI();
    },
 
    // 重置所有进度
    reset() {
      this.stage1 = { current: 0, total: 0, active: false };
      this.stage2 = { current: 0, total: 0, active: false };
      this.cooldown = { active: false, remaining: 0, total: 0 };
      this.updateUI();
    },
 
    // 更新 UI
    updateUI() {
      if (!progressBar1 || !progressBar2) return;
 
      // 阶段1进度
      if (this.stage1.active && this.stage1.total > 0) {
        let pct1 = (this.stage1.current / this.stage1.total) * 100;
        
        // 如果在冷却中，基于冷却进度计算额外的进度
        if (this.cooldown.active && this.cooldown.total > 0) {
          const cooldownProgress = 1 - (this.cooldown.remaining / this.cooldown.total);
          const nextChunkProgress = (1 / this.stage1.total) * 100 * cooldownProgress * 0.9; // 90% 的下一段
          pct1 = Math.min(100, pct1 + nextChunkProgress);
        }
        
        progressBar1.style.width = `${pct1}%`;
        progressBar1.style.opacity = '1';
        progressBar1.classList.toggle('active', this.cooldown.active);
        
        if (this.cooldown.active) {
          progressLabel1.innerHTML = `<span style="color:#f1c40f">ID: ${this.stage1.current}/${this.stage1.total}</span>`;
        } else {
          progressLabel1.textContent = `ID: ${this.stage1.current}/${this.stage1.total}`;
        }
        progressLabel1.style.opacity = '1';
      } else {
        progressBar1.style.width = '0%';
        progressBar1.style.opacity = '0.3';
        progressBar1.classList.remove('active');
        progressLabel1.style.opacity = '0.3';
      }
 
      // 阶段2进度
      if (this.stage2.active && this.stage2.total > 0) {
        const pct2 = Math.min(100, (this.stage2.current / this.stage2.total) * 100);
        progressBar2.style.width = `${pct2}%`;
        progressBar2.style.opacity = '1';
        progressBar2.classList.add('active');
        progressLabel2.textContent = `价格: ${this.stage2.current}/${this.stage2.total}`;
        progressLabel2.style.opacity = '1';
      } else {
        progressBar2.style.width = '0%';
        progressBar2.style.opacity = '0.3';
        progressBar2.classList.remove('active');
        progressLabel2.style.opacity = '0.3';
      }
    },
 
    // 完成所有任务
    complete() {
      if (progressBar1 && progressBar2) {
        progressBar1.style.width = '100%';
        progressBar2.style.width = '100%';
        progressBar1.classList.remove('active');
        progressBar2.classList.remove('active');
        progressLabel1.textContent = '完成';
        progressLabel2.textContent = '完成';
      }
    }
  };
 
  // ========== 辅助函数：检查缓存数据是否包含已拥有的游戏 ==========
  function cacheContainsOwnedGame(cacheData) {
    if (!cacheData || !cacheData.data) return false;
    if (Array.isArray(cacheData.data)) {
      return cacheData.data.some(item => OWNED_SET.has(parseInt(item.appid)));
    }
    return OWNED_SET.has(parseInt(cacheData.data.appid));
  }
 
  // ========== 辅助函数：获取所有未拥有游戏的缓存 key ==========
  async function getUnownedCacheKeys(scope = 'page') {
    const unownedKeys = [];
    const keysToCheck = scope === 'page' ? currentPageCacheKeys : new Set(GM_listValues().filter(k => k.startsWith('vndb_steam_')));
    
    for (const key of keysToCheck) {
      try {
        const cached = JSON.parse(GM_getValue(key, 'null'));
        if (cached && !cacheContainsOwnedGame(cached)) {
          unownedKeys.push(key);
        }
      } catch (e) {}
    }
    
    return unownedKeys;
  }
 
  // 1. 设置面板
  function toggleSettingsPanel() {
    if (settingsPanel) {
      settingsPanel.remove();
      settingsPanel = null;
      return;
    }
 
    settingsPanel = document.createElement('div');
    settingsPanel.className = 'vndb-steam-settings-panel';
    settingsPanel.style.cssText = `
      position: fixed; bottom: 48px; right: 10px; width: 340px;
      background: linear-gradient(135deg, rgba(30, 30, 35, 0.98) 0%, rgba(25, 25, 30, 0.98) 100%);
      color: #ecf0f1;
      border: 1px solid rgba(100, 100, 120, 0.3); border-radius: 12px; padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      z-index: 100000; box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset;
      backdrop-filter: blur(20px); font-size: 13px;
    `;
 
    // 标题
    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 15px; font-weight: 600; margin-bottom: 16px; padding-bottom: 12px;
      border-bottom: 1px solid rgba(100, 100, 120, 0.2);
      display: flex; align-items: center; gap: 8px;
    `;
    title.innerHTML = `<span style="font-size: 18px;">⚙️</span> 设置`;
    settingsPanel.appendChild(title);
 
    const createSlider = (label, key, min, max, step, unit, desc) => {
      const row = document.createElement('div');
      row.style.marginBottom = '18px';
      
      const isRisky = (key === 'vndbDelay' && SETTINGS[key] < 4000) || 
                      (key === 'steamDelay' && SETTINGS[key] < 800) || 
                      (key === 'steamConcurrency' && SETTINGS[key] > 3);
      
      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-weight:500;color:#ddd;font-size:12px;">${label}</span>
          <span id="val-${key}" style="color:${isRisky ? '#e74c3c' : '#3498db'};font-family:'SF Mono',Monaco,monospace;font-size:12px;font-weight:600;background:rgba(52,152,219,0.1);padding:2px 8px;border-radius:4px;">${SETTINGS[key]}${unit}</span>
        </div>
        <div style="position:relative;height:6px;background:rgba(100,100,120,0.2);border-radius:3px;overflow:hidden;">
          <div id="fill-${key}" style="position:absolute;left:0;top:0;height:100%;background:linear-gradient(90deg,#3498db,#2980b9);border-radius:3px;width:${((SETTINGS[key] - min) / (max - min)) * 100}%;transition:width 0.15s ease;"></div>
        </div>
        <input id="input-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${SETTINGS[key]}" style="width:100%;cursor:pointer;opacity:0;position:relative;margin-top:-6px;height:20px;">
        <div style="font-size:11px;color:#888;margin-top:6px;line-height:1.5;">${desc}</div>
      `;
      
      const input = row.querySelector('input');
      const fill = row.querySelector(`#fill-${key}`);
      const valSpan = row.querySelector(`#val-${key}`);
      
      input.oninput = (e) => {
        const val = Number(e.target.value);
        SETTINGS[key] = val;
        valSpan.innerText = val + unit;
        fill.style.width = `${((val - min) / (max - min)) * 100}%`;
        localStorage.setItem('vndb_steam_settings', JSON.stringify(SETTINGS));
 
        const isRiskyNow = (key === 'vndbDelay' && val < 4000) || 
                          (key === 'steamDelay' && val < 800) || 
                          (key === 'steamConcurrency' && val > 3);
        valSpan.style.color = isRiskyNow ? '#e74c3c' : '#3498db';
        valSpan.style.background = isRiskyNow ? 'rgba(231,76,60,0.1)' : 'rgba(52,152,219,0.1)';
        fill.style.background = isRiskyNow ? 
          'linear-gradient(90deg,#e74c3c,#c0392b)' : 
          'linear-gradient(90deg,#3498db,#2980b9)';
      };
      return row;
    };
 
    settingsPanel.appendChild(createSlider('VNDB 请求间隔', 'vndbDelay', 2000, 10000, 500, 'ms', '每批次(20个)查询后的冷却时间。过短可能触发 429 限制。'));
    settingsPanel.appendChild(createSlider('Steam 请求间隔', 'steamDelay', 500, 3000, 100, 'ms', '单个价格查询的间隔时间。'));
    settingsPanel.appendChild(createSlider('Steam 并发数', 'steamConcurrency', 1, 6, 1, '线程', '同时进行的查询数量。建议保持在 2-3 以内。'));
 
    const btnRow = document.createElement('div');
    btnRow.style.cssText = `
      display: flex; justify-content: space-between; margin-top: 20px;
      border-top: 1px solid rgba(100, 100, 120, 0.2); padding-top: 16px;
    `;
 
    const defaultBtn = document.createElement('button');
    defaultBtn.innerText = '↺ 恢复默认';
    defaultBtn.style.cssText = `
      background: transparent; color: #f39c12; border: 1px solid rgba(243, 156, 18, 0.3);
      padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;
      transition: all 0.2s ease;
    `;
    defaultBtn.onmouseover = () => {
      defaultBtn.style.background = 'rgba(243, 156, 18, 0.1)';
      defaultBtn.style.borderColor = '#f39c12';
    };
    defaultBtn.onmouseout = () => {
      defaultBtn.style.background = 'transparent';
      defaultBtn.style.borderColor = 'rgba(243, 156, 18, 0.3)';
    };
    defaultBtn.onclick = () => {
      SETTINGS = { ...DEFAULTS };
      localStorage.removeItem('vndb_steam_settings');
      ['vndbDelay', 'steamDelay', 'steamConcurrency'].forEach(k => {
        const el = settingsPanel.querySelector(`#input-${k}`);
        if(el) { el.value = SETTINGS[k]; el.oninput({target: el}); }
      });
      showStatus("已恢复默认设置", 'success');
    };
 
    const closeBtn = document.createElement('button');
    closeBtn.innerText = '关闭';
    closeBtn.style.cssText = `
      background: linear-gradient(135deg, #3498db, #2980b9); color: #fff;
      border: none; padding: 6px 20px; border-radius: 6px; cursor: pointer; font-size: 12px;
      font-weight: 500; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
    `;
    closeBtn.onmouseover = () => {
      closeBtn.style.transform = 'translateY(-1px)';
      closeBtn.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
    };
    closeBtn.onmouseout = () => {
      closeBtn.style.transform = 'translateY(0)';
      closeBtn.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.3)';
    };
    closeBtn.onclick = () => toggleSettingsPanel();
 
    btnRow.appendChild(defaultBtn);
    btnRow.appendChild(closeBtn);
    settingsPanel.appendChild(btnRow);
 
    document.body.appendChild(settingsPanel);
  }
 
  // 2. 底部状态栏
  function initStatusBar() {
    if(document.getElementById('vndb-steam-status')) return;
 
    injectStyles();
 
    statusContainer = document.createElement('div');
    statusContainer.id = 'vndb-steam-status';
    statusContainer.className = 'vndb-steam-status-container';
    statusContainer.style.cssText = `
      position: fixed; bottom: 0; left: 0; width: 100%; height: 42px;
      background: linear-gradient(180deg, rgba(22, 22, 28, 0.95) 0%, rgba(18, 18, 24, 0.98) 100%);
      color: #ecf0f1;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 12px; padding: 0 16px;
      z-index: 99999; display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.3); border-top: 1px solid rgba(100, 100, 120, 0.2);
    `;
 
    // 进度条容器
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
      position: absolute; top: 0; left: 0; right: 0; height: 4px;
      display: flex; flex-direction: column; gap: 0;
    `;
 
    // 阶段1进度条（蓝色 - VNDB API）
    const bar1Container = document.createElement('div');
    bar1Container.style.cssText = `position: relative; height: 2px; background: rgba(52, 152, 219, 0.15);`;
    progressBar1 = document.createElement('div');
    progressBar1.className = 'vndb-steam-progress-bar';
    progressBar1.style.cssText = `
      position: absolute; top: 0; left: 0; height: 100%; width: 0%;
      background: linear-gradient(90deg, #3498db, #5dade2);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.3;
      box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
    `;
    bar1Container.appendChild(progressBar1);
 
    // 阶段2进度条（绿色 - Steam 价格）
    const bar2Container = document.createElement('div');
    bar2Container.style.cssText = `position: relative; height: 2px; background: rgba(46, 204, 113, 0.15);`;
    progressBar2 = document.createElement('div');
    progressBar2.className = 'vndb-steam-progress-bar';
    progressBar2.style.cssText = `
      position: absolute; top: 0; left: 0; height: 100%; width: 0%;
      background: linear-gradient(90deg, #2ecc71, #58d68d);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); opacity: 0.3;
      box-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
    `;
    bar2Container.appendChild(progressBar2);
 
    progressContainer.appendChild(bar1Container);
    progressContainer.appendChild(bar2Container);
    statusContainer.appendChild(progressContainer);
 
    // 左侧内容
    const left = document.createElement('div');
    left.style.cssText = 'display: flex; align-items: center; gap: 14px; margin-top: 2px;';
    
    const titleSpan = document.createElement('span');
    titleSpan.style.cssText = `
      background: linear-gradient(135deg, #3498db, #9b59b6);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; font-weight: 700; font-size: 13px; letter-spacing: 0.5px;
    `;
    titleSpan.textContent = 'VNDB Steam';
    
    statusTxT = document.createElement('span');
    statusTxT.id = 'vndb-status-text';
    statusTxT.style.cssText = 'color:#aaa; transition: color 0.2s ease;';
    statusTxT.textContent = '就绪';
 
    // 进度标签容器
    const progressLabels = document.createElement('div');
    progressLabels.style.cssText = 'display: flex; gap: 12px; font-size: 11px;';
    
    progressLabel1 = document.createElement('span');
    progressLabel1.style.cssText = `
      color: #3498db; opacity: 0.3; font-family: 'SF Mono', Monaco, monospace;
      background: rgba(52, 152, 219, 0.1); padding: 2px 8px; border-radius: 4px;
    `;
    progressLabel1.textContent = 'ID: 0/0';
    
    progressLabel2 = document.createElement('span');
    progressLabel2.style.cssText = `
      color: #2ecc71; opacity: 0.3; font-family: 'SF Mono', Monaco, monospace;
      background: rgba(46, 204, 113, 0.1); padding: 2px 8px; border-radius: 4px;
    `;
    progressLabel2.textContent = '价格: 0/0';
 
    progressLabels.appendChild(progressLabel1);
    progressLabels.appendChild(progressLabel2);
 
    left.appendChild(titleSpan);
    left.appendChild(statusTxT);
    left.appendChild(progressLabels);
 
    const right = document.createElement('div');
    right.style.cssText = 'display: flex; gap: 8px; align-items: center; margin-top: 2px;';
 
    const createBtn = (text, title, clickFn, colorScheme = 'default') => {
      const btn = document.createElement('button');
      btn.innerText = text;
      btn.title = title;
      btn.className = 'vndb-steam-btn';
      
      const colors = {
        default: { base: '#9aa0a6', hover: '#fff', bg: 'transparent', hoverBg: 'rgba(154, 160, 166, 0.1)' },
        danger: { base: '#ea4335', hover: '#fff', bg: 'rgba(234, 67, 53, 0.1)', hoverBg: 'rgba(234, 67, 53, 0.2)' },
        primary: { base: '#4285f4', hover: '#fff', bg: 'rgba(66, 133, 244, 0.1)', hoverBg: 'rgba(66, 133, 244, 0.2)' },
        success: { base: '#34a853', hover: '#fff', bg: 'rgba(52, 168, 83, 0.1)', hoverBg: 'rgba(52, 168, 83, 0.2)' },
        warning: { base: '#fbbc04', hover: '#fff', bg: 'rgba(251, 188, 4, 0.1)', hoverBg: 'rgba(251, 188, 4, 0.2)' },
        purple: { base: '#a855f7', hover: '#fff', bg: 'rgba(168, 85, 247, 0.1)', hoverBg: 'rgba(168, 85, 247, 0.2)' }
      };
      
      const c = colors[colorScheme] || colors.default;
      
      btn.style.cssText = `
        background: ${c.bg}; border: none; color: ${c.base};
        padding: 4px 10px; height: 26px; cursor: pointer; font-size: 11px;
        border-radius: 6px; transition: all 0.2s ease; outline: none; white-space: nowrap;
        font-weight: 500;
      `;
      btn.onmouseover = () => {
        btn.style.color = c.hover;
        btn.style.background = c.hoverBg;
      };
      btn.onmouseout = () => {
        btn.style.color = c.base;
        btn.style.background = c.bg;
      };
      btn.onclick = clickFn;
      return btn;
    };
 
    const settingBtn = createBtn('⚙️ 设置', '打开设置面板', toggleSettingsPanel, 'default');
    const stopBtn = createBtn('⏹ 停止', '停止当前任务', () => {
      IS_STOPPED = true;
      showStatus('任务已停止', 'error');
      ProgressManager.reset();
    }, 'danger');
 
    // 刷新本页按钮
    const resetPageBtn = createBtn('↻ 本页', '清除当前页面的所有缓存并重新获取', async () => {
      if(currentPageCacheKeys.size === 0) {
        showStatus('当前页面没有可刷新的数据', 'info');
        return;
      }
      if(confirm(`确定要刷新当前页面的 ${currentPageCacheKeys.size} 条数据吗？`)) {
        let deletedCount = 0;
        for (const cacheKey of currentPageCacheKeys) {
          const exists = GM_getValue(cacheKey, null);
          if (exists !== null) {
            GM_deleteValue(cacheKey);
            deletedCount++;
          }
        }
        showStatus(`已清除 ${deletedCount} 条本页缓存，正在刷新...`, 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    }, 'primary');
 
    // 刷新本页未拥有按钮
    const resetPageUnownedBtn = createBtn('↻ 本页未拥有', '只清除当前页面未拥有游戏的缓存', async () => {
      const unownedKeys = await getUnownedCacheKeys('page');
      if(unownedKeys.length === 0) {
        showStatus('当前页面没有未拥有的游戏缓存', 'info');
        return;
      }
      if(confirm(`确定要刷新当前页面 ${unownedKeys.length} 条未拥有游戏的数据吗？`)) {
        for (const key of unownedKeys) {
          GM_deleteValue(key);
        }
        showStatus(`已清除 ${unownedKeys.length} 条未拥有缓存，正在刷新...`, 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    }, 'purple');
 
    // 刷新全部按钮
    const resetAllBtn = createBtn('🗑 全部', '清除所有缓存并重新获取', async () => {
      const allKeys = GM_listValues();
      const cacheKeys = allKeys.filter(k => k.startsWith('vndb_steam_'));
      if(cacheKeys.length === 0) {
        showStatus('没有可清除的缓存数据', 'info');
        return;
      }
      if(confirm(`确定要清除全部 ${cacheKeys.length} 条缓存数据吗？`)) {
        for (const key of cacheKeys) {
          GM_deleteValue(key);
        }
        showStatus(`已清除 ${cacheKeys.length} 条缓存，正在刷新...`, 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    }, 'success');
 
    // 刷新全部未拥有按钮
    const resetAllUnownedBtn = createBtn('🗑 全部未拥有', '只清除所有未拥有游戏的缓存', async () => {
      const unownedKeys = await getUnownedCacheKeys('all');
      if(unownedKeys.length === 0) {
        showStatus('没有未拥有的游戏缓存', 'info');
        return;
      }
      if(confirm(`确定要刷新全部 ${unownedKeys.length} 条未拥有游戏的数据吗？\n（这可能需要较长时间重新获取）`)) {
        for (const key of unownedKeys) {
          GM_deleteValue(key);
        }
        showStatus(`已清除 ${unownedKeys.length} 条未拥有缓存，正在刷新...`, 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    }, 'warning');
 
    right.appendChild(settingBtn);
    right.appendChild(stopBtn);
    right.appendChild(resetPageBtn);
    right.appendChild(resetPageUnownedBtn);
    right.appendChild(resetAllBtn);
    right.appendChild(resetAllUnownedBtn);
 
    statusContainer.appendChild(left);
    statusContainer.appendChild(right);
    document.body.appendChild(statusContainer);
  }
 
  function showStatus(msg, type='info') {
    if(!statusContainer) initStatusBar();
    let color = '#ecf0f1';
 
    if(type === 'wait') { color = '#f1c40f'; }
    if(type === 'success') { color = '#2ecc71'; }
    if(type === 'error') { color = '#e74c3c'; }
 
    let suffix = '';
    if (STATS.fail > 0) {
      suffix = ` <span style="color:#e74c3c;margin-left:8px;font-size:10px;background:rgba(231,76,60,0.1);padding:2px 6px;border-radius:4px;">(错误: ${STATS.fail})</span>`;
    }
 
    statusTxT.style.color = color;
    statusTxT.innerHTML = msg + suffix;
  }
 
  // 倒计时等待（使用平滑动画）
  async function waitWithCountdown(seconds, currentStage1Progress, totalStage1) {
    const totalMs = seconds * 1000;
    const startTime = Date.now();
    const updateInterval = 50; // 50ms 更新一次，确保流畅
 
    return new Promise(resolve => {
      const update = () => {
        if (IS_STOPPED) {
          ProgressManager.setCooldown(0, 0);
          resolve();
          return;
        }
 
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, totalMs - elapsed);
        const remainingSec = Math.ceil(remaining / 1000);
 
        // 更新冷却状态
        ProgressManager.setCooldown(remaining, totalMs);
        
        // 更新状态文本
        showStatus(`API 冷却中 (${remainingSec}s)...`, 'wait');
 
        if (remaining <= 0) {
          ProgressManager.setCooldown(0, 0);
          resolve();
        } else {
          setTimeout(update, updateInterval);
        }
      };
 
      update();
    });
  }
 
  class ProcessingQueue {
    constructor() { this.active = 0; this.queue = []; }
    add(fn) { this.queue.push(fn); this.next(); }
    async next() {
      if (IS_STOPPED || this.active >= SETTINGS.steamConcurrency || this.queue.length === 0) return;
      this.active++;
      const task = this.queue.shift();
      try { await task(); } catch (err) { console.error(err); }
      finally { setTimeout(() => { this.active--; this.next(); }, SETTINGS.steamDelay); }
    }
  }
 
  function renderBadges(el, items, insertMode = 'after') {
    if ((el.parentNode || el).querySelector('.vndb-steam-wrapper')) return;
    const wrapper = document.createElement('span');
    wrapper.className = 'vndb-steam-wrapper';
    wrapper.style.cssText = 'display: inline-flex; align-items: center; margin-left: 8px; gap: 5px; vertical-align: middle; flex-wrap: wrap;';
 
    items.forEach(data => {
      const span = document.createElement('span');
      span.className = 'vndb-steam-badge';
      const isOwned = OWNED_SET.has(parseInt(data.appid));
      const isFree = data.status === 'free' || data.is_free;
      const isLocked = data.status === 'locked';
      const isNoPrice = data.status === 'noprice';
      const isSoon = data.status === 'soon';
      const isDelisted = data.status === 'delisted'; // 已下架
      const isRateLimited = data.status === 'rate_limited'; // 被限流
      const isDLC = data.type === 'dlc';
      const isDemo = data.type === 'demo';
 
      // 构建显示文本 - 叠加多种状态
      let parts = [];
      let bgColor = '#475d6d';
      let bgGradient = '';
 
      // 1. DLC/Demo 前缀
      if (isDLC) parts.push('[DLC]');
      if (isDemo) parts.push('[Demo]');
 
      // 2. 拥有状态（最优先）
      if (isOwned) {
        parts.push('✓已拥有');
        bgGradient = 'linear-gradient(135deg, #4c6b22, #5a7d2a)';
      }
 
      // 3. 锁区状态
      if (isLocked) {
        parts.push('🔒锁区');
        if (!isOwned) bgGradient = 'linear-gradient(135deg, #636e72, #7f8c8d)';
      }
 
      // 4. 已下架状态
      if (isDelisted) {
        parts.push('📦已下架');
        if (!isOwned) bgGradient = 'linear-gradient(135deg, #6c5b7b, #8e7b9e)';
      }
 
      // 5. 被限流状态（临时）
      if (isRateLimited) {
        parts.push('⏳请求失败');
        if (!isOwned) bgGradient = 'linear-gradient(135deg, #c0392b, #e74c3c)';
      }
 
      // 5. 价格/免费状态
      if (isFree) {
        parts.push('免费');
        if (!isOwned && !isLocked) bgGradient = 'linear-gradient(135deg, #475d6d, #5a7080)';
      } else if (isSoon) {
        parts.push('即将推出');
        if (!isOwned && !isLocked) bgGradient = 'linear-gradient(135deg, #d35400, #e67e22)';
      } else if (isNoPrice) {
        parts.push('无价格');
        if (!isOwned && !isLocked) bgGradient = 'linear-gradient(135deg, #7f8c8d, #95a5a6)';
      } else if (data.status === 'released' && data.final > 0) {
        const pStr = `¥${(data.final / 100).toFixed(0)}`;
        if (data.discount > 0) {
          parts.push(`-${data.discount}% ${pStr}`);
          if (!isOwned) bgGradient = 'linear-gradient(135deg, #2980b9, #3498db)';
        } else {
          parts.push(pStr);
          if (isDLC && !isOwned) bgGradient = 'linear-gradient(135deg, #7b3fa0, #9b59b6)';
          else if (!isOwned) bgGradient = 'linear-gradient(135deg, #475d6d, #5a7080)';
        }
      }
 
      // 如果没有任何状态，显示默认
      if (parts.length === 0) {
        parts.push('Steam');
        bgGradient = 'linear-gradient(135deg, #555, #666)';
      }
 
      const text = parts.join(' ');
 
      span.style.cssText = `
        display: inline-block; padding: 2px 8px; font-size: 11px; color: #fff;
        background: ${bgGradient || bgColor}; border-radius: 4px; cursor: pointer;
        font-weight: 600; line-height: 1.3; text-decoration: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1) inset;
        white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      `;
      span.innerText = text;
      span.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        window.open(`https://store.steampowered.com/app/${data.appid}`, '_blank');
      };
 
      // 已拥有的添加特殊类
      if (isOwned) span.classList.add('vndb-steam-owned');
 
      wrapper.appendChild(span);
    });
 
    if (insertMode === 'append' || el.tagName === 'H1') {
      el.appendChild(wrapper);
    } else {
      el.after(wrapper);
    }
  }
 
  // --- 从页面直接提取 Steam 链接 ---
  function extractSteamIdsFromPage() {
    const steamIds = new Set();
    // 查找页面上所有 Steam 链接
    document.querySelectorAll('a[href*="store.steampowered.com/app/"]').forEach(a => {
      const match = a.href.match(/store\.steampowered\.com\/app\/(\d+)/);
      if (match) steamIds.add(match[1]);
    });
    return Array.from(steamIds);
  }
 
  // --- 检查缓存是否有效 ---
  function isCacheValid(cached) {
    if (!cached || !cached.timestamp) return false;
    const duration = getCacheDuration(cached.data);
    if (duration === 0) return false;  // rate_limited 返回 0，视为无效
    return (Date.now() - cached.timestamp) < duration;
  }
 
  // --- 获取单个 Steam 价格并缓存 ---
  async function getSteamPriceWithCache(appid) {
    const cacheKey = STORAGE_PREFIX_STEAM + appid;
    currentPageCacheKeys.add(cacheKey);
 
    // 检查缓存
    try {
      const cached = JSON.parse(GM_getValue(cacheKey, 'null'));
      if (cached && isCacheValid(cached)) {
        debugLog(`[缓存命中] appid=${appid}`, cached.data);
        return { data: cached.data, fromCache: true, error: null };
      }
    } catch (e) {}
 
    debugLog(`[请求CN] appid=${appid} 开始请求...`);
 
    // 请求 Steam API (CN)
    const r = await handleGetPrice(appid);
 
    debugLog(`[请求CN] appid=${appid} 返回:`, {
      success: r.success,
      hasData: !!r.data,
      appidSuccess: r.data?.[appid]?.success,
      rawData: r.data
    });
 
    // 检查是否是网络错误
    if (!r.success) {
      debugError(`[网络错误] appid=${appid}`, r.error);
      return { data: null, fromCache: false, error: 'network' };
    }
 
    // ========== 关键判断：区分限流和真正的无数据 ==========
    // rawData === null → 被限流，Steam 没有返回任何 JSON
    // rawData 有数据但 success: false → 真正的下架/锁区
    if (r.data === null) {
      debugError(`[限流检测] appid=${appid} - rawData 为 null，Steam 可能在限流，不缓存`);
      // 返回临时错误状态，不缓存
      const rateLimitedResult = {
        appid,
        type: 'game',
        status: 'rate_limited',
        final: -1,
        discount: 0,
        is_free: false
      };
      return { data: rateLimitedResult, fromCache: false, error: 'rate_limited' };
    }
 
    // API 返回成功，有正常数据
    if (r.data && r.data[appid]?.success) {
      const d = r.data[appid].data;
      const price = d.price_overview;
      const isComingSoon = d.release_date?.coming_soon;
      let status = 'released';
      let finalPrice = 0;
      let discount = 0;
 
      if (d.is_free) {
        status = 'free';
      } else if (price) {
        status = 'released';
        finalPrice = price.final;
        discount = price.discount_percent;
      } else if (isComingSoon) {
        status = 'soon';
      } else {
        status = 'noprice';
      }
 
      const result = {
        appid,
        type: d.type,
        status,
        final: finalPrice,
        discount,
        is_free: d.is_free
      };
 
      debugLog(`[CN成功] appid=${appid}`, result);
 
      // 缓存结果
      GM_setValue(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }));
      return { data: result, fromCache: false, error: null };
    }
 
    // ========== CN 区返回 success: false（真正的无数据，不是限流）==========
    debugWarn(`[CN失败] appid=${appid} - CN区返回 success:false，尝试US区验证...`);
 
    // 尝试通过备用方法获取类型信息（使用 US 区域的 API）
    let appType = 'game';
    let usSuccess = false;
    let usRateLimited = false;
 
    try {
      debugLog(`[请求US] appid=${appid} 开始请求...`);
      const usRes = await gmFetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=US&filters=basic`);
      const usData = await usRes.json();
 
      debugLog(`[请求US] appid=${appid} 返回:`, {
        success: usData?.[appid]?.success,
        type: usData?.[appid]?.data?.type,
        rawData: usData
      });
 
      // 检查 US 区是否也被限流
      if (usData === null) {
        debugError(`[限流检测] appid=${appid} - US区 rawData 也为 null，Steam 正在限流`);
        usRateLimited = true;
      } else if (usData && usData[appid]?.success && usData[appid]?.data?.type) {
        appType = usData[appid].data.type;
        usSuccess = true;
        debugWarn(`[确认锁区] appid=${appid} - US区有数据(type=${appType})，CN区无数据 -> 判定为锁区`);
      } else {
        debugWarn(`[确认下架] appid=${appid} - US区也返回 success:false 且有响应数据 -> 判定为已下架`);
      }
    } catch (e) {
      debugError(`[US请求失败] appid=${appid}`, e);
    }
 
    // 如果 US 区也被限流，返回临时错误，不缓存
    if (usRateLimited) {
      const rateLimitedResult = {
        appid,
        type: 'game',
        status: 'rate_limited',
        final: -1,
        discount: 0,
        is_free: false
      };
      return { data: rateLimitedResult, fromCache: false, error: 'rate_limited' };
    }
 
    if (usSuccess) {
      // US 有数据，CN 没有 -> 确定是锁区（永久缓存）
      const lockedResult = {
        appid,
        type: appType,
        status: 'locked',
        final: -1,
        discount: 0,
        is_free: false
      };
      debugLog(`[缓存] appid=${appid} 锁区状态，永久缓存`);
      GM_setValue(cacheKey, JSON.stringify({ data: lockedResult, timestamp: Date.now() }));
      return { data: lockedResult, fromCache: false, error: null };
    } else {
      // US 也没数据（但有响应）-> 确定是已下架（永久缓存）
      const delistedResult = {
        appid,
        type: appType,
        status: 'delisted',
        final: -1,
        discount: 0,
        is_free: false
      };
      debugLog(`[缓存] appid=${appid} 已下架状态，永久缓存`);
      GM_setValue(cacheKey, JSON.stringify({ data: delistedResult, timestamp: Date.now() }));
      return { data: delistedResult, fromCache: false, error: null };
    }
  }
 
  // --- 主逻辑 ---
  initStatusBar();
  showStatus('正在同步 Steam 库...', 'info', 0);
 
  try {
    const ownedRes = await handleGetOwnedGames();
    if (ownedRes && ownedRes.success && Array.isArray(ownedRes.data)) OWNED_SET = new Set(ownedRes.data);
    debugLog(`[Steam库] 已拥有 ${OWNED_SET.size} 款游戏`);
  } catch(e) {
    debugError('[Steam库] 获取失败', e);
  }
 
  const pathname = window.location.pathname;
 
  // ========== 通用：收集页面上所有 r 链接并处理 ==========
  async function processReleaseLinks() {
    // 第一步：扫描整个页面，建立 rid -> steamIds 的完整映射
    const ridToSteamIds = new Map();
 
    // 方法1: 扫描 releases 表格区域
    document.querySelectorAll('.releases tr, .vnreleases tr, article.vnreleases tr').forEach(tr => {
      // 查找 release 链接（可能在 td.tc4 中）
      const releaseLink = tr.querySelector('td.tc4 a[href*="/r"], a[href*="/r"]');
      if (!releaseLink) return;
      const match = releaseLink.href.match(/\/r(\d+)/);
      if (!match) return;
      const rid = match[1];
 
      // 在整个 tr 中查找 Steam 链接（包括隐藏的下拉菜单）
      const steamIds = [];
      tr.querySelectorAll('a[href*="store.steampowered.com/app/"]').forEach(link => {
        const m = link.href.match(/store\.steampowered\.com\/app\/(\d+)/);
        if (m && !steamIds.includes(m[1])) steamIds.push(m[1]);
      });
 
      if (steamIds.length > 0) {
        if (ridToSteamIds.has(rid)) {
          const existing = ridToSteamIds.get(rid);
          steamIds.forEach(id => { if (!existing.includes(id)) existing.push(id); });
        } else {
          ridToSteamIds.set(rid, steamIds);
        }
      }
    });
 
    // 方法2: 备用 - 直接遍历所有 Steam 链接
    document.querySelectorAll('a[href*="store.steampowered.com/app/"]').forEach(steamLink => {
      const m = steamLink.href.match(/store\.steampowered\.com\/app\/(\d+)/);
      if (!m) return;
      const steamId = m[1];
 
      // 向上查找最近的包含 release 链接的容器
      let container = steamLink.closest('tr');
      if (!container) container = steamLink.closest('li');
      if (!container) container = steamLink.closest('div');
      if (!container) return;
 
      // 在容器中查找 release 链接
      let releaseLink = container.querySelector('a[href*="/r"]');
      
      // 如果在当前容器找不到，尝试向上查找
      if (!releaseLink && container.closest('tr')) {
        releaseLink = container.closest('tr').querySelector('a[href*="/r"]');
      }
      
      if (!releaseLink) return;
 
      const rMatch = releaseLink.href.match(/\/r(\d+)/);
      if (!rMatch) return;
      const rid = rMatch[1];
 
      if (ridToSteamIds.has(rid)) {
        const existing = ridToSteamIds.get(rid);
        if (!existing.includes(steamId)) existing.push(steamId);
      } else {
        ridToSteamIds.set(rid, [steamId]);
      }
    });
 
    console.log('[VNDB Steam] 找到的 Release-Steam 映射:', ridToSteamIds.size, '个');
 
    // 第二步：查找所有 release 链接并添加到列表
    const releaseLinks = [];
 
    document.querySelectorAll('a[href*="/r"]').forEach(a => {
      const match = a.href.match(/\/r(\d+)$/);
      if (!match) return;
      const rid = match[1];
 
      // 跳过已处理的元素
      if (a.querySelector('.vndb-steam-wrapper') || a.parentNode?.querySelector('.vndb-steam-wrapper')) return;
 
      // 如果这个 rid 有 Steam 链接，添加到列表
      if (ridToSteamIds.has(rid)) {
        releaseLinks.push({
          rid,
          element: a,
          steamIds: ridToSteamIds.get(rid)
        });
      }
    });
 
    console.log('[VNDB Steam] 待处理的 Release 链接:', releaseLinks.length, '个');
    return releaseLinks;
  }
 
  // ========== r 详情页处理 ==========
  const releaseMatch = pathname.match(/^\/r(\d+)/);
  if (releaseMatch) {
    const releaseId = releaseMatch[1];
    const cacheKey = STORAGE_PREFIX_R + releaseId;
    currentPageCacheKeys.add(cacheKey);
 
    showStatus('正在检测 Steam 链接...', 'info');
 
    // 从页面直接提取 Steam ID
    const steamIds = extractSteamIdsFromPage();
 
    if (steamIds.length > 0) {
      showStatus(`发现 ${steamIds.length} 个 Steam 链接，正在获取价格...`, 'info');
      ProgressManager.setStage2(0, steamIds.length);
 
      const results = [];
      for (let i = 0; i < steamIds.length; i++) {
        if (IS_STOPPED) break;
        
        const appid = steamIds[i];
        ProgressManager.setStage2(i + 1, steamIds.length);
        showStatus(`获取价格中...`, 'info');
 
        const result = await getSteamPriceWithCache(appid);
        
        // Steam 限流自动停止
        if (result.error === 'rate_limited') {
          STATS.fail++;
          showStatus(`⚠️ Steam API 限流，已自动停止`, 'error');
          IS_STOPPED = true;
          break;
        }
        
        if (result.data && ['game', 'dlc', 'demo'].includes(result.data.type)) {
          results.push(result.data);
        }
      }
 
      if (results.length > 0) {
        const score = (item) => {
          if (OWNED_SET.has(parseInt(item.appid))) return 5;
          if (item.status === 'released') return 4;
          if (item.status === 'free') return 3;
          if (item.status === 'soon') return 2;
          if (item.status === 'locked') return 1;
          return 0;
        };
        results.sort((a, b) => score(b) - score(a));
 
        const h1 = document.querySelector('h1');
        if (h1) {
          renderBadges(h1, results, 'append');
        }
 
        const ownedCount = results.filter(r => OWNED_SET.has(parseInt(r.appid))).length;
        const extraText = ownedCount > 0 ? ` (已拥有 ${ownedCount} 款)` : '';
        
        if (!IS_STOPPED) {
          showStatus(`✅ 完成${extraText}`, 'success');
          ProgressManager.complete();
        }
      } else if (!IS_STOPPED) {
        showStatus('未找到有效的 Steam 游戏信息', 'info');
      }
    } else {
      showStatus('此 Release 没有 Steam 链接', 'info');
    }
  }
 
  // ========== v 页面和列表页处理 ==========
  else {
    const targets = new Map();       // vid -> {element, type}
    const vnIdsToQuery = new Set();
    let releaseTargets = []; // [{rid, element, steamIds}, ...]
 
    // 检测主页面的 VN ID (v 详情页)
    const mainIdMatch = pathname.match(/^\/v(\d+)/);
    if (mainIdMatch) {
      const h1 = document.querySelector('h1[lang]');
      if (h1) {
        targets.set(mainIdMatch[1], { id: mainIdMatch[1], element: h1, type: 'title' });
        vnIdsToQuery.add(mainIdMatch[1]);
      }
 
      // 在 v 详情页，收集所有 release 的 Steam 信息
      releaseTargets = await processReleaseLinks();
      // 记录缓存 key
      const seenRids = new Set();
      for (const item of releaseTargets) {
        if (!seenRids.has(item.rid)) {
          seenRids.add(item.rid);
          currentPageCacheKeys.add(STORAGE_PREFIX_R + item.rid);
        }
      }
    }
 
    // 检测列表中的 VN 链接
    document.querySelectorAll('a[href^="/v"]').forEach(a => {
      if (a.querySelector('img') || a.innerText.trim().length < 1) return;
      const match = a.href.match(/\/v(\d+)$/);
      if (match) {
        targets.set(match[1], { id: match[1], element: a, type: 'list' });
        vnIdsToQuery.add(match[1]);
      }
    });
 
    // 记录当前页面的所有缓存 key
    for (const vid of vnIdsToQuery) {
      currentPageCacheKeys.add(STORAGE_PREFIX_V + vid);
    }
 
    // ===== 阶段1: 处理 Release 链接 (v 详情页内) =====
    if (releaseTargets.length > 0) {
      showStatus(`正在处理 ${releaseTargets.length} 个 Release...`, 'info');
      ProgressManager.setStage1(0, releaseTargets.length);
      
      let releaseProcessed = 0;
      const allReleaseResults = []; // 收集所有结果用于 v 标题汇总
      const ridResultsCache = new Map(); // rid -> results (避免重复请求)
 
      for (const data of releaseTargets) {
        if (IS_STOPPED) break;
 
        const rid = data.rid;
        const cacheKey = STORAGE_PREFIX_R + rid;
        let results = [];
 
        // 首先检查本次运行中是否已经获取过这个 rid 的结果
        if (ridResultsCache.has(rid)) {
          results = ridResultsCache.get(rid);
        } else {
          // 检查持久化缓存
          try {
            const cached = JSON.parse(GM_getValue(cacheKey, 'null'));
            if (cached && cached.data && isCacheValid(cached)) {
              results = cached.data;
            }
          } catch (e) {}
 
          // 无缓存则请求
          if (results.length === 0) {
            for (const appid of data.steamIds) {
              if (IS_STOPPED) break;
              
              const result = await getSteamPriceWithCache(appid);
              
              // Steam 限流自动停止
              if (result.error === 'rate_limited') {
                STATS.fail++;
                showStatus(`⚠️ Steam API 限流，已自动停止`, 'error');
                IS_STOPPED = true;
                break;
              }
              
              if (result.data && ['game', 'dlc', 'demo'].includes(result.data.type)) {
                results.push(result.data);
              }
            }
            // 缓存结果时过滤掉 rate_limited
            const cachableResults = results.filter(r => r.status !== 'rate_limited');
            if (cachableResults.length > 0) {
              GM_setValue(cacheKey, JSON.stringify({ data: cachableResults, timestamp: Date.now() }));
            }
          }
 
          // 保存到本次运行缓存
          ridResultsCache.set(rid, results);
        }
 
        // 渲染到 release 链接旁（每个出现的链接都渲染）
        if (results.length > 0) {
          const score = (item) => {
            if (OWNED_SET.has(parseInt(item.appid))) return 5;
            if (item.status === 'released') return 4;
            if (item.status === 'free') return 3;
            if (item.status === 'soon') return 2;
            if (item.status === 'locked') return 1; // 锁区排在最后
            return 0;
          };
          const sortedResults = [...results].sort((a, b) => score(b) - score(a));
          renderBadges(data.element, sortedResults);
 
          // 只对每个唯一的 rid 添加一次到汇总（用于 v 标题去重）
          if (!ridResultsCache.get(rid + '_added')) {
            allReleaseResults.push(...results);
            ridResultsCache.set(rid + '_added', true);
          }
        }
 
        releaseProcessed++;
        ProgressManager.setStage1(releaseProcessed, releaseTargets.length);
        showStatus(`处理 Release...`, 'info');
      }
 
      // 在 v 标题后显示汇总（去重）
      if (allReleaseResults.length > 0 && mainIdMatch) {
        const h1 = document.querySelector('h1[lang]');
        if (h1 && !h1.querySelector('.vndb-steam-wrapper')) {
          // 按 appid 去重
          const uniqueResults = [];
          const seenAppIds = new Set();
          const score = (item) => {
            if (OWNED_SET.has(parseInt(item.appid))) return 5;
            if (item.status === 'released') return 4;
            if (item.status === 'free') return 3;
            if (item.status === 'soon') return 2;
            if (item.status === 'locked') return 1;
            return 0;
          };
          allReleaseResults.sort((a, b) => score(b) - score(a));
 
          for (const r of allReleaseResults) {
            if (!seenAppIds.has(r.appid)) {
              seenAppIds.add(r.appid);
              uniqueResults.push(r);
            }
          }
          renderBadges(h1, uniqueResults, 'append');
 
          // 缓存 v 页面的汇总数据时过滤掉 rate_limited
          const cachableResults = uniqueResults.filter(r => r.status !== 'rate_limited');
          if (cachableResults.length > 0) {
            await storage.set({ [STORAGE_PREFIX_V + mainIdMatch[1]]: { data: cachableResults, timestamp: Date.now() } });
          }
        }
      }
    }
 
    // ===== 阶段2: 处理列表页的 VN 链接 (需要调用 VNDB API) =====
    const storageData = await storage.get(null);
    const queueItems = [];
    const idsToFetchFromApi = [];
 
    for (const vid of vnIdsToQuery) {
      // 跳过已经通过 release 处理过的主页面 VN
      if (mainIdMatch && vid === mainIdMatch[1] && releaseTargets.length > 0) continue;
 
      const cacheKey = STORAGE_PREFIX_V + vid;
      const cached = storageData[cacheKey];
      if (cached && isCacheValid(cached)) {
        if (cached.data) renderBadges(targets.get(vid).element, cached.data);
      } else {
        idsToFetchFromApi.push(vid);
      }
    }
 
    // --- VNDB API 阶段 ---
    if (idsToFetchFromApi.length > 0 && !IS_STOPPED) {
      const CHUNK_SIZE = 20;
      let foundSteamIds = 0;
      
      // 初始化阶段1进度
      ProgressManager.setStage1(0, idsToFetchFromApi.length);
 
      for (let i = 0; i < idsToFetchFromApi.length; i += CHUNK_SIZE) {
        if (IS_STOPPED) break;
 
        const chunk = idsToFetchFromApi.slice(i, i + CHUNK_SIZE);
        
        ProgressManager.setStage1(i, idsToFetchFromApi.length);
        showStatus(`获取 Steam ID... 已找到 ${foundSteamIds} 个`, 'info');
 
        try {
          const res = await handleSafeBatchQuery(chunk);
 
          if (!res.success) {
            if (res.error === 'Throttled') {
              showStatus("⚠️ VNDB API 限流，已自动停止", 'error');
              IS_STOPPED = true;
              STATS.fail++;
              break;
            }
          }
 
          if (res && res.success) {
            for (const vid of chunk) {
              const steamIds = res.data[vid] || res.data[parseInt(vid)];
              if (steamIds && steamIds.length > 0) {
                foundSteamIds += steamIds.length;
                queueItems.push({
                  target: targets.get(vid),
                  appids: steamIds,
                  cacheKey: STORAGE_PREFIX_V + vid
                });
              } else {
                await storage.set({ [STORAGE_PREFIX_V + vid]: { noSteamId: true, timestamp: Date.now() } });
              }
            }
          }
 
          // 更新进度
          ProgressManager.setStage1(i + chunk.length, idsToFetchFromApi.length);
          showStatus(`获取 Steam ID... 已找到 ${foundSteamIds} 个`, 'info');
 
        } catch (e) {
          console.error(e);
          STATS.fail++;
          showStatus(`⚠️ VNDB 网络错误`, 'error');
        }
 
        if (i + CHUNK_SIZE < idsToFetchFromApi.length) {
          const waitSec = Math.ceil(SETTINGS.vndbDelay / 1000);
          await waitWithCountdown(waitSec, i + CHUNK_SIZE, idsToFetchFromApi.length);
        }
      }
    }
 
    // --- Steam 价格阶段 ---
    if (!IS_STOPPED && queueItems.length > 0) {
      showStatus(`正在获取价格...`, 'info');
      ProgressManager.setStage2(0, queueItems.length);
      
      const queue = new ProcessingQueue();
      let processedCount = 0;
      let steamNetworkErrors = 0;
 
      queueItems.forEach(item => queue.add(async () => {
        if (IS_STOPPED) return;
 
        const uniqueIds = [...new Set(item.appids)];
        const validResults = [];
 
        for (const appid of uniqueIds) {
          if (IS_STOPPED) break;
          
          const result = await getSteamPriceWithCache(appid);
 
          if (result.error === 'network') {
            steamNetworkErrors++;
            if (steamNetworkErrors >= 3) {
              STATS.fail++;
              showStatus(`⚠️ Steam API 网络错误，已自动停止`, 'error');
              IS_STOPPED = true;
              return;
            }
          } else if (result.error === 'rate_limited') {
            // Steam 限流自动停止
            STATS.fail++;
            showStatus(`⚠️ Steam API 限流，已自动停止`, 'error');
            IS_STOPPED = true;
            return;
          } else if (result.data) {
            if (['game', 'dlc', 'demo'].includes(result.data.type)) {
              validResults.push(result.data);
            }
          }
        }
 
        if (IS_STOPPED) return;
 
        STATS.success++;
 
        if (validResults.length) {
          const score = (item) => {
            if (OWNED_SET.has(parseInt(item.appid))) return 5;
            if (item.status === 'released') return 4;
            if (item.status === 'free') return 3;
            if (item.status === 'soon') return 2;
            if (item.status === 'locked') return 1;
            return 0;
          };
          validResults.sort((a, b) => score(b) - score(a));
          renderBadges(item.target.element, validResults);
          
          // 缓存时过滤掉 rate_limited
          const cachableResults = validResults.filter(r => r.status !== 'rate_limited');
          if (cachableResults.length > 0) {
            await storage.set({ [item.cacheKey]: { data: cachableResults, timestamp: Date.now() } });
          }
        } else {
          renderBadges(item.target.element, [{ appid: uniqueIds[0], status: 'noprice', type: 'game', final: -1 }]);
          await storage.set({ [item.cacheKey]: { data: [{ appid: uniqueIds[0], status: 'noprice', type: 'game', final: -1 }], timestamp: Date.now() } });
        }
 
        processedCount++;
        ProgressManager.setStage2(processedCount, queueItems.length);
        showStatus(`获取价格中...`, 'info');
 
        if (processedCount === queueItems.length) {
          const ownedCount = document.querySelectorAll('.vndb-steam-owned').length;
          const extraText = ownedCount > 0 ? ` (库中包含 ${ownedCount} 款)` : '';
 
          if (STATS.fail > 0) {
            showStatus(`⚠️ 完成 (有 ${STATS.fail} 个错误)${extraText}`, 'error');
          } else {
            showStatus(`✅ 完成${extraText}`, 'success');
            ProgressManager.complete();
            setTimeout(() => {
              if (statusTxT && statusTxT.innerText.includes('完成')) {
                statusTxT.style.color = '#7f8c8d';
                statusTxT.innerText = `✅ 就绪${extraText}`;
              }
            }, 5000);
          }
        }
      }));
    } else {
      if (IS_STOPPED) {
        // 保持停止状态文本
      } else if (releaseTargets.length > 0) {
        const ownedCount = document.querySelectorAll('.vndb-steam-owned').length;
        const extraText = ownedCount > 0 ? ` (库中包含 ${ownedCount} 款)` : '';
        showStatus(`✅ 完成${extraText}`, 'success');
        ProgressManager.complete();
      } else if (idsToFetchFromApi.length > 0) {
        showStatus("未发现新的 Steam 链接", 'success');
      } else if (vnIdsToQuery.size > 0) {
        showStatus("数据已是最新", 'success');
      } else {
        showStatus("就绪", 'info');
      }
    }
  }
})();